import { proxyActivities, sleep, defineSignal, setHandler, condition } from '@temporalio/workflow';
import type * as activities from './activities';
import { SubscriptionInput, SubscriptionState } from './types';

const { chargeCustomer, sendEmail } = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
    retry: {
        initialInterval: '1s',
        backoffCoefficient: 2,
        maximumInterval: '30s',
    }
});

export const cancelSubscription = defineSignal('cancelSubscription');

export async function subscriptionWorkflow(input: SubscriptionInput): Promise<void> {
    let isActive = true;
    let billingCycleCount = 0;

    setHandler(cancelSubscription, () => {
        isActive = false;
    });

    // Welcome Email
    await sendEmail({
        email: input.email,
        subject: 'Welcome to our service!',
        body: 'Thanks for subscribing.',
    });

    // Trial Period
    if (input.trialPeriod) {
        await sleep(input.trialPeriod as any); // Use human readable duration string like '30 days' or '10s'
    }

    while (isActive) {
        billingCycleCount++;

        // Charge Customer
        await chargeCustomer({
            customerId: input.email, // using email as ID for simplicity
            amount: 100, // Fixed amount for demo
        });

        // Send Invoice Email
        await sendEmail({
            email: input.email,
            subject: `Invoice for billing cycle ${billingCycleCount}`,
            body: 'You have been charged $100.',
        });

        // Wait for next billing cycle or cancellation
        // await sleep(input.billingPeriod);
        // Using condition to wait for cancellation or timeout
        // Wait for input.billingPeriod unless cancelled
        const cancelled = await condition(() => !isActive, input.billingPeriod as any);
        if (cancelled) {
            break;
        }
    }

    // Cancellation Email
    await sendEmail({
        email: input.email,
        subject: 'Subscription Cancelled',
        body: 'We are sorry to see you go.',
    });
}
