import { getTemporalClient } from './temporal-client.js';

async function cancelWorkflow(workflowId: string) {
    try {
        const client = await getTemporalClient();
        const handle = client.workflow.getHandle(workflowId);

        console.log(`Cancelling workflow ${workflowId}...`);
        await handle.cancel();
        console.log(`Workflow ${workflowId} cancelled successfully.`);
    } catch (err: any) {
        if (err.message.includes('Workflow execution not found')) {
            console.error(`Workflow ${workflowId} not found or already completed.`);
        } else {
            console.error('Error cancelling workflow:', err);
        }
        process.exit(1);
    }
}

const id = process.argv[2];
if (!id) {
    console.error('Usage: ts-node src/cancel-workflow.ts <workflowId>');
    process.exit(1);
}

cancelWorkflow(id);
