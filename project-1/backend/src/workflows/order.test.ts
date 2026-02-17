import { TestWorkflowEnvironment } from '@temporalio/testing';
import { Worker } from '@temporalio/worker';
import { beforeAll, afterAll, it, expect, describe } from 'vitest';
import { orderWorkflow, updateAddressSignal } from './order.js';
import * as activities from '../activities/order-activities.js';

describe('Order Workflow', () => {
    let testEnv: TestWorkflowEnvironment;

    beforeAll(async () => {
        testEnv = await TestWorkflowEnvironment.createLocal();
    });

    afterAll(async () => {
        await testEnv.teardown();
    });

    it('should update address when signal is received', async () => {
        const worker = await Worker.create({
            connection: testEnv.nativeConnection,
            taskQueue: 'test',
            workflowsPath: new URL('./order.js', import.meta.url).pathname,
            activities,
        });

        const result = await worker.runUntil(async () => {
            const handle = await testEnv.client.workflow.start(orderWorkflow, {
                args: ['order-1', 'Old Address', []],
                taskQueue: 'test',
                workflowId: 'test-order-1',
            });

            // Fast forward time if needed, or just send signal
            await handle.signal(updateAddressSignal, 'New Corrected Address');

            // In the test environment, we can sleep shorter or mock sleep
            // For now let's just wait for the result (we might need to skip the 5m sleep in tests)
            return await handle.result();
        });

        expect(result.finalAddress).toBe('New Corrected Address');
        expect(result.status).toBe('SHIPPED');
    });
});
