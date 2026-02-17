import { proxyActivities, patched, workflowInfo } from '@temporalio/workflow';
import { OrderDetails } from '../../../shared/interfaces.js';
import type * as activities from '../activities.js';

const { shipOrder } = proxyActivities<typeof activities>({
    startToCloseTimeout: '5 minutes',
    heartbeatTimeout: '30s',
});

export async function orderWorkflow(details: OrderDetails): Promise<OrderDetails> {
    console.log(`[Child Workflow] Processing order ${details.orderId}`);

    // Demonstrate Workflow Versioning
    // Let's say we want to change shipping logic without breaking running workflows
    if (patched('new-shipping-logic')) {
        console.log('[Child Workflow] Using NEW shipping logic (Express)');
        details.status = 'Shipping (Express)';
    } else {
        console.log('[Child Workflow] Using OLD shipping logic (Standard)');
        details.status = 'Shipping (Standard)';
    }

    // Demonstrate workflowInfo().unsafe.isReplaying (for logging or other side effects that shouldn't happen during replay)
    if (!workflowInfo().unsafe.isReplaying) {
        console.log('[Child Workflow] This is a new execution, not a replay.');
    }

    // Execute Shipping Activity (Handles heartbeats internally)
    await shipOrder(details);

    details.status = 'Delivered';
    details.timestamp = Date.now();

    return details;
}
