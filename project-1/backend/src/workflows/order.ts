import { defineSignal, defineQuery, proxyActivities, sleep, setHandler, condition, log } from '@temporalio/workflow';
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

// Queries
export const getStatusQuery = defineQuery<string>('getStatus');
export const getAddressQuery = defineQuery<string>('getAddress');
export const getItemsQuery = defineQuery<any[]>('getItems');

export async function orderWorkflow(orderId: string, initialAddress: string, items: any[]): Promise<any> {
    let address = initialAddress;
    let status = 'PENDING';
    let overrideStatus: string | null = null;
    let isReservationReleased = false;
    const workflowId = `order-${orderId}`;

    // Signal handlers
    setHandler(updateAddressSignal, (newAddress) => {
        log.info(`Address updated for order ${orderId}: ${newAddress}`);
        address = newAddress;
    });

    setHandler(adminOverrideSignal, (newStatus) => {
        log.info(`Admin override signal received for order ${orderId}: ${newStatus}`);
        overrideStatus = newStatus;
    });

    setHandler(cancelOrderSignal, () => {
        log.info(`Cancellation signal received for order ${orderId}`);
        overrideStatus = 'CANCELLED';
    });

    // Query handlers
    setHandler(getStatusQuery, () => status);
    setHandler(getAddressQuery, () => address);
    setHandler(getItemsQuery, () => items);

    try {
        log.info(`Workflow started for order: ${orderId}`);

        // 1. Grace Period (5 minutes for address changes)
        log.info('Entering 5-minute grace period for address updates or cancellation');
        await sleep('5 minutes');

        // Check for admin cancellation during grace period
        if (overrideStatus === 'CANCELLED') {
            log.info(`Order ${orderId} cancelled during grace period`);
            await releaseReservation(orderId);
            isReservationReleased = true;
            await updateOrderStatus(workflowId, 'CANCELLED');
            return { status: 'CANCELLED', orderId };
        }

        // 2. Processing
        status = 'PROCESSING';
        log.info(`Order ${orderId} moving to PROCESSING`);
        await updateOrderStatus(workflowId, status);

        // Double-check stock (Safety measure)
        log.info(`Checking stock for order ${orderId}`);
        const stockAvailable = await checkStock(items);
        if (!stockAvailable) {
            log.warn(`Stock unavailable for order ${orderId}, cancelling.`);
            await releaseReservation(orderId);
            isReservationReleased = true;
            status = 'OUT_OF_STOCK';
            await updateOrderStatus(workflowId, status);
            return { status, orderId };
        }

        // 3. Generate invoice
        log.info(`Generating invoice for order ${orderId}`);
        await generateInvoice(orderId, items);

        // 4. Wait for Shipment Confirmation Signal
        log.info(`Waiting for confirmation/cancellation for order ${orderId}`);
        await condition(() => overrideStatus === 'CONFIRMED' || overrideStatus === 'CANCELLED');

        if (overrideStatus === 'CANCELLED') {
            log.info(`Order ${orderId} cancelled after processing`);
            await releaseReservation(orderId);
            isReservationReleased = true;
            await updateOrderStatus(workflowId, 'CANCELLED');
            return { status: 'CANCELLED', orderId };
        }

        // 5. Confirm the reservation (stock is permanently deducted)
        log.info(`Confirming stock reservation for order ${orderId}`);
        await confirmReservation(orderId);
        status = 'CONFIRMED';
        await updateOrderStatus(workflowId, status);

        // 6. Wait for Shipped Signal
        log.info(`Waiting for SHIPPED signal for order ${orderId}`);
        await condition(() => overrideStatus === 'SHIPPED');
        status = 'SHIPPED';
        await updateOrderStatus(workflowId, status);

        // 7. Wait for Delivered Signal
        log.info(`Waiting for DELIVERED signal for order ${orderId}`);
        await condition(() => overrideStatus === 'DELIVERED');
        status = 'DELIVERED';
        await updateOrderStatus(workflowId, status);

        log.info(`Workflow completed successfully for order ${orderId}`);
        return {
            orderId,
            finalAddress: address,
            status,
        };

    } catch (err) {
        log.error(`Workflow failed for order ${orderId}: ${err}`);
        // Critical: Ensure stock is released if workflow crashes or is terminated unexpectedly
        if (!isReservationReleased) {
            await releaseReservation(orderId);
        }
        await updateOrderStatus(workflowId, 'FAILED');
        throw err;
    }
}

