import express from 'express';
import cors from 'cors';
import { Connection, Client } from '@temporalio/client';
import { TASK_QUEUE } from '../../shared/interfaces';
import { subscriptionWorkflow, pauseSignal, resumeSignal, cancelSignal, getStatusQuery } from '../../worker/src/workflows/subscription';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

async function getClient() {
    const connection = await Connection.connect({ address: 'localhost:7233' });
    return new Client({ connection });
}

app.post('/subscribe', async (req, res) => {
    try {
        const client = await getClient();
        const handle = await client.workflow.start(subscriptionWorkflow, {
            taskQueue: TASK_QUEUE,
            args: [req.body],
            workflowId: `sub-${Date.now()}`,
        });
        res.json({ workflowId: handle.workflowId });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/signal/:id/:signal', async (req, res) => {
    try {
        const client = await getClient();
        const handle = client.workflow.getHandle(req.params.id);
        const signal = req.params.signal;

        if (signal === 'pause') await handle.signal(pauseSignal);
        else if (signal === 'resume') await handle.signal(resumeSignal);
        else if (signal === 'cancel') await handle.signal(cancelSignal);

        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/status/:id', async (req, res) => {
    try {
        const client = await getClient();
        const handle = client.workflow.getHandle(req.params.id);
        const status = await handle.query(getStatusQuery);
        res.json(status);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/history/:id', async (req, res) => {
    try {
        const client = await getClient();
        const handle = client.workflow.getHandle(req.params.id);
        const history = [];
        const historyIterator = handle.fetchHistory();
        for await (const event of historyIterator) {
            history.push(event);
        }
        res.json(history);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`[API] Server running on http://localhost:${PORT}`);
});
