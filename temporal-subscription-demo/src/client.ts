import { Connection, Client } from '@temporalio/client';
import { subscriptionWorkflow, cancelSubscription } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
    const connection = await Connection.connect({ address: 'localhost:7233' });
    const client = new Client({ connection });

    const workflowId = 'subscription-' + nanoid();
    const handle = await client.workflow.start(subscriptionWorkflow, {
        taskQueue: 'subscription-queue',
        args: [{
            email: 'user@example.com',
            planId: 'premium',
            trialPeriod: '5s',
            billingPeriod: '10s'
        }],
        workflowId: workflowId,
    });

    console.log(`Started workflow ${handle.workflowId}`);

    // Query status example (not implemented in workflow yet, but good practice)
    // const status = await handle.query(getStatus);

    // Wait for a bit (simulating user interaction)
    console.log('Waiting 25 seconds before cancelling...');
    await new Promise(resolve => setTimeout(resolve, 25000));

    // Cancel subscription
    console.log('Cancelling subscription...');
    await handle.signal(cancelSubscription);

    console.log('Waiting for workflow to complete...');
    await handle.result();
    console.log('Workflow completed');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
