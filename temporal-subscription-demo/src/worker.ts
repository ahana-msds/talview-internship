import { Worker, NativeConnection } from '@temporalio/worker';
import * as activities from './activities';

async function run() {
    const connection = await NativeConnection.connect({
        address: 'localhost:7233'
    });

    const worker = await Worker.create({
        workflowsPath: require.resolve('./workflows'),
        activities: { ...activities },
        taskQueue: 'subscription-queue',
        connection
    });

    console.log('Worker started. Listening on subscription-queue');
    await worker.run();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
