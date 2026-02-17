import { Worker } from '@temporalio/worker';
import * as activities from './activities.js';
import { TASK_QUEUE } from '../../shared/interfaces.js';

async function run() {
    const worker = await Worker.create({
        workflowsPath: new URL('./workflows/index.ts', import.meta.url).pathname,
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
