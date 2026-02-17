import { Worker, NativeConnection } from '@temporalio/worker';
import * as activities from './activities/order-activities.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function run() {
    const connection = await NativeConnection.connect({
        address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    });

    const worker = await Worker.create({
        connection,
        workflowsPath: resolve(__dirname, './workflows/order.ts'),
        activities,
        taskQueue: 'order-tasks',
    });

    console.log('Worker started and waiting for tasks...');
    await worker.run();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
