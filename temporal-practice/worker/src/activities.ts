import { Context } from '@temporalio/activity';
import { OrderDetails } from '../../shared/interfaces';

export async function processPayment(amount: number, idempotencyToken: string): Promise<string> {
    console.log(`[Activity] Processing payment of $${amount} with token ${idempotencyToken}`);

    // Simulate Activity Failure for Retry Demonstration
    // In a real app, this would be a network error or a transient 500
    if (Math.random() < 0.3) {
        throw new Error('Payment gateway timeout - retrying automatically...');
    }

    // Simulate Idempotency
    // In a real app, you'd check the token against a DB
    console.log(`[Activity] Payment successful for token ${idempotencyToken}`);
    return `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export async function shipOrder(orderDetails: OrderDetails): Promise<void> {
    const { heartbeat } = Context.current();
    console.log(`[Activity] Shipping order ${orderDetails.orderId} for ${orderDetails.product}`);

    // Demonstrate Heartbeats for long-running activities
    for (let progress = 0; progress <= 100; progress += 20) {
        console.log(`[Activity] Shipping progress for ${orderDetails.orderId}: ${progress}%`);
        heartbeat(progress);

        // Check for cancellation
        if (Context.current().cancelled) {
            console.log(`[Activity] Shipping for ${orderDetails.orderId} was cancelled!`);
            throw new Error('Activity cancelled');
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`[Activity] Order ${orderDetails.orderId} delivered!`);
}

export async function sendEmail(email: string, message: string): Promise<void> {
    console.log(`[Activity] Sending email to ${email}: ${message}`);
}
