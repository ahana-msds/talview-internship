import {
    proxyActivities,
    defineSignal,
    defineQuery,
    setHandler,
    sleep,
    executeChild,
    continueAsNew,
    workflowInfo,
} from '@temporalio/workflow';
import { SubscriptionStatus, SubscriptionState, StartSubscriptionParams } from '../../../shared/interfaces';
import type * as activities from '../activities';

const { processPayment, sendEmail } = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
    retry: {
        initialInterval: '1s',
        backoffCoefficient: 2,
        maximumInterval: '10s',
        maximumAttempts: 5,
    },
});

// Signals
export const pauseSignal = defineSignal('pause');
export const resumeSignal = defineSignal('resume');
export const cancelSignal = defineSignal('cancel');

// Queries
export const getStatusQuery = defineQuery<SubscriptionState>('getStatus');

export async function subscriptionWorkflow(params: StartSubscriptionParams): Promise<string> {
    const info = workflowInfo();
    let status = SubscriptionStatus.ACTIVE;
    let iteration = 1;
    const orders: any[] = [];

    // Initialize state handlers
    setHandler(pauseSignal, () => {
        if (status === SubscriptionStatus.ACTIVE) {
            status = SubscriptionStatus.PAUSED;
        }
    });

    setHandler(resumeSignal, () => {
        if (status === SubscriptionStatus.PAUSED) {
            status = SubscriptionStatus.ACTIVE;
        }
    });

    setHandler(cancelSignal, () => {
        status = SubscriptionStatus.CANCELLED;
    });

    setHandler(getStatusQuery, () => ({
        subscriptionId: info.workflowId,
        email: params.email,
        status,
        iteration,
        orders,
    }));

    console.log(`[Workflow] Subscription started for ${params.email}`);
    await sendEmail(params.email, 'Welcome to your Coffee Subscription!');

    // Main Loop
    while (iteration <= params.maxIterations) {
        if (status === SubscriptionStatus.CANCELLED) {
            break;
        }

        if (status === SubscriptionStatus.PAUSED) {
            console.log('[Workflow] Subscription paused, waiting...');
            await sleep('5 seconds'); // Small poll or wait for signal
            continue;
        }

        console.log(`[Workflow] Processing iteration ${iteration}`);

        // Simulate Payment Activity
        const paymentId = await processPayment(params.amount, `${info.workflowId}-${iteration}`);

        // Execute Child Workflow for Order Fulfillment
        const orderDetails = await executeChild('orderWorkflow', {
            args: [{
                orderId: paymentId,
                product: params.product,
                amount: params.amount,
                status: 'Processing',
                timestamp: Date.now()
            }],
            workflowId: `order-${paymentId}`,
        });

        orders.push(orderDetails);

        iteration++;

        // Demonstrate Continue-As-New
        // If the workflow history gets too long (many iterations), continue as new
        if (iteration > 5 && iteration <= params.maxIterations) {
            console.log('[Workflow] Continuing as new to keep history size manageable');
            await continueAsNew<typeof subscriptionWorkflow>(params);
        }

        await sleep(params.intervalMs);
    }

    if (status === SubscriptionStatus.CANCELLED) {
        await sendEmail(params.email, 'Your subscription has been cancelled.');
        return 'Cancelled';
    }

    await sendEmail(params.email, 'Your subscription has completed its term.');
    return 'Completed';
}
