import { defineSignal, proxyActivities, sleep, setHandler } from '@temporalio/workflow';
import type * as activities from '../activities/order-activities.js';

const { checkStock, generateInvoice, updateOrderStatus } = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
});

// Signals
export const updateAddressSignal = defineSignal<[string]>('updateAddress');
export const adminOverrideSignal = defineSignal<[string]>('adminOverride');

export async function orderWorkflow(orderId: string, initialAddress: string, items: any[]): Promise<any> {
    let address = initialAddress;
    let status = 'PENDING';
    let overrideStatus: string | null = null;

    // Signal handlers
    setHandler(updateAddressSignal, (newAddress) => {
        address = newAddress;
        console.log(`Address updated to: ${address}`);
    });

    setHandler(adminOverrideSignal, (newStatus) => {
        overrideStatus = newStatus;
        console.log(`Admin override received: ${newStatus}`);
    });

    // 1. Grace Period (5 minutes)
    // For demo purposes, we can make it shorter or keep it 5 minutes as requested.
    // Let's use 5 minutes for "realism".
    console.log(`Starting 5-minute grace period for order ${orderId}`);

    // We check for overrideStatus periodically or use a Race
    const gracePeriod = sleep('5 minutes');

    // Wait for timer to finish OR an admin override to happen
    // Note: Temporal sleep can be canceled or we can just check the status after
    await gracePeriod;

    if (overrideStatus === 'CANCELLED') {
        await updateOrderStatus(orderId, 'CANCELLED');
        return { status: 'CANCELLED', orderId };
    }

    // 2. Activities
    status = 'PROCESSING';
    await updateOrderStatus(orderId, status);

    const stockAvailable = await checkStock(items);
    if (!stockAvailable) {
        status = 'OUT_OF_STOCK';
        await updateOrderStatus(orderId, status);
        return { status, orderId };
    }

    await generateInvoice(orderId, items);

    status = overrideStatus || 'SHIPPED';
    await updateOrderStatus(orderId, status);

    return {
        orderId,
        finalAddress: address,
        status,
    };
}
