import { defineSignal, proxyActivities, sleep, setHandler } from '@temporalio/workflow';
import type * as activities from '../activities/order-activities.js';

const {
    checkStock,
    generateInvoice,
    updateOrderStatus,
    confirmReservation,
    releaseReservation,
} = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
});

// Signals
export const updateAddressSignal = defineSignal<[string]>('updateAddress');
export const adminOverrideSignal = defineSignal<[string]>('adminOverride');

export async function orderWorkflow(orderId: string, initialAddress: string, items: any[]): Promise<any> {
    let address = initialAddress;
    let status = 'PENDING';
    let overrideStatus: string | null = null;
    const workflowId = `order-${orderId}`;

    // Signal handlers
    setHandler(updateAddressSignal, (newAddress) => {
        address = newAddress;
        console.log(`Address updated to: ${address}`);
    });

    setHandler(adminOverrideSignal, (newStatus) => {
        overrideStatus = newStatus;
        console.log(`Admin override received: ${newStatus}`);
    });

    // 1. Grace Period (5 minutes for address changes)
    console.log(`Starting 5-minute grace period for order ${orderId}`);
    await sleep('5 minutes');

    // Check for admin cancellation during grace period
    if (overrideStatus === 'CANCELLED') {
        await releaseReservation(orderId);
        await updateOrderStatus(workflowId, 'CANCELLED');
        return { status: 'CANCELLED', orderId };
    }

    // 2. Processing — stock was already reserved at checkout
    status = 'PROCESSING';
    await updateOrderStatus(workflowId, status);

    // Double-check stock as a safety measure
    const stockAvailable = await checkStock(items);
    if (!stockAvailable) {
        await releaseReservation(orderId);
        status = 'OUT_OF_STOCK';
        await updateOrderStatus(workflowId, status);
        return { status, orderId };
    }

    // 3. Generate invoice
    await generateInvoice(orderId, items);

    // 4. Confirm the reservation (stock is permanently deducted)
    await confirmReservation(orderId);

    // 5. Final status
    status = overrideStatus || 'SHIPPED';
    await updateOrderStatus(workflowId, status);

    return {
        orderId,
        finalAddress: address,
        status,
    };
}
