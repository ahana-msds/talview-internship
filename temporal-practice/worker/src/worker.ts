import { Worker } from '@temporalio/worker';
import * as activities from './activities';
import { TASK_QUEUE } from '../../shared/interfaces';

async function run() {
    const worker = await Worker.create({
        workflowsPath: require.resolve('./workflows'),
        activities,
        taskQueue: TASK_QUEUE,
    });

    console.log('[Worker] Worker started and listening on task queue:', TASK_QUEUE);
    await worker.run();
}

run().catch((err) => {
    console.error('[Worker] Fatal error starting worker:', err);
    process.exit(1);
});
