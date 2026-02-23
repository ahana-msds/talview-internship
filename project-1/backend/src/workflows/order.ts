import { defineSignal, proxyActivities, sleep, setHandler, condition } from '@temporalio/workflow';
import type * as activities from '../activities/order-activities.js';

const {
    checkStock,
    generateInvoice,
    updateOrderStatus,
    confirmReservation,
    releaseReservation,
} = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
    retry: {
        initialInterval: '1s',
        backoffCoefficient: 2,
        maximumInterval: '1m',
        maximumAttempts: 3,
    },
});

// Signals
export const updateAddressSignal = defineSignal<[string]>('updateAddress');
export const adminOverrideSignal = defineSignal<[string]>('adminOverride');
export const shipmentConfirmSignal = defineSignal('shipment-confirm');
export const shippedSignal = defineSignal('shipped');
export const deliveredSignal = defineSignal('delivered');
export const cancelOrderSignal = defineSignal('cancelOrder');

export async function orderWorkflow(orderId: string, initialAddress: string, items: any[]): Promise<any> {
    let address = initialAddress;
    let status = 'PENDING';
    let overrideStatus: string | null = null;
    let isReservationReleased = false;
    const workflowId = `order-${orderId}`;

    // Signal handlers
    setHandler(updateAddressSignal, (newAddress) => {
        address = newAddress;
    });

    setHandler(adminOverrideSignal, (newStatus) => {
        overrideStatus = newStatus;
    });

    setHandler(cancelOrderSignal, () => {
        overrideStatus = 'CANCELLED';
    });

    try {
        // 1. Grace Period (5 minutes for address changes)
        await sleep('5 minutes');

        // Check for admin cancellation during grace period
        if (overrideStatus === 'CANCELLED') {
            await releaseReservation(orderId);
            isReservationReleased = true;
            await updateOrderStatus(workflowId, 'CANCELLED');
            return { status: 'CANCELLED', orderId };
        }

        // 2. Processing
        status = 'PROCESSING';
        await updateOrderStatus(workflowId, status);

        // Double-check stock (Safety measure)
        const stockAvailable = await checkStock(items);
        if (!stockAvailable) {
            await releaseReservation(orderId);
            isReservationReleased = true;
            status = 'OUT_OF_STOCK';
            await updateOrderStatus(workflowId, status);
            return { status, orderId };
        }

        // 3. Generate invoice
        await generateInvoice(orderId, items);

        // 4. Wait for Shipment Confirmation Signal
        await condition(() => overrideStatus === 'CONFIRMED' || overrideStatus === 'CANCELLED');

        if (overrideStatus === 'CANCELLED') {
            await releaseReservation(orderId);
            isReservationReleased = true;
            await updateOrderStatus(workflowId, 'CANCELLED');
            return { status: 'CANCELLED', orderId };
        }

        // 5. Confirm the reservation (stock is permanently deducted)
        await confirmReservation(orderId);
        status = 'CONFIRMED';
        await updateOrderStatus(workflowId, status);

        // 6. Wait for Shipped Signal
        await condition(() => overrideStatus === 'SHIPPED');
        status = 'SHIPPED';
        await updateOrderStatus(workflowId, status);

        // 7. Wait for Delivered Signal
        await condition(() => overrideStatus === 'DELIVERED');
        status = 'DELIVERED';
        await updateOrderStatus(workflowId, status);

        return {
            orderId,
            finalAddress: address,
            status,
        };

    } catch (err) {
        // Critical: Ensure stock is released if workflow crashes or is terminated unexpectedly
        if (!isReservationReleased) {
            await releaseReservation(orderId);
        }
        await updateOrderStatus(workflowId, 'FAILED');
        throw err;
    }
}

