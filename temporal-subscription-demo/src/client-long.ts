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
            trialPeriod: '10s',      // longer trial
            billingPeriod: '15s'     // longer billing cycles
        }],
        workflowId: workflowId,
    });

    console.log(`started workflow ${handle.workflowId}`);
    console.log('workflow will run for ~60 seconds before cancellation');
    console.log('you can kill the worker now and restart it to see resilience');

    // wait longer before cancelling
    console.log('waiting 60 seconds before cancelling...');
    await new Promise(resolve => setTimeout(resolve, 60000));

    // cancel subscription
    console.log('cancelling subscription...');
    await handle.signal(cancelSubscription);

    console.log('waiting for workflow to complete...');
    await handle.result();
    console.log('workflow completed');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
