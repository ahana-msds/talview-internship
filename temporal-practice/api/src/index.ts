import express from 'express';
import cors from 'cors';
import { Connection, Client } from '@temporalio/client';
import { TASK_QUEUE } from '../../shared/interfaces.js';
import { subscriptionWorkflow, pauseSignal, resumeSignal, cancelSignal, getStatusQuery } from '../../worker/src/workflows/subscription.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

let client: Client;

async function getClient() {
    if (!client) {
        const connection = await Connection.connect({ address: 'localhost:7233' });
        client = new Client({ connection });
    }
    return client;
}

// Helper to safely serialize items for JSON (handle BigInt/Long)
function safeData(data: any): any {
    try {
        return JSON.parse(JSON.stringify(data, (key, value) => {
            if (typeof value === 'bigint') return value.toString();
            if (value && typeof value === 'object' && value.type === 'Buffer') return '[Buffer]';
            return value;
        }));
    } catch (e) {
        return { error: 'Serialization failed', message: String(e) };
    }
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
    console.log(`[API] Fetching history for ${req.params.id}`);
    try {
        const client = await getClient();

        // Use the lower-level service client for maximum compatibility
        const response = await client.workflowService.getWorkflowExecutionHistory({
            namespace: 'default',
            execution: {
                workflowId: req.params.id,
            }
        });

        if (!response.history || !response.history.events) {
            return res.json([]);
        }

        const history = response.history.events.map((event: any) => ({
            eventId: event.eventId?.toString(),
            eventType: event.eventType,
            timestamp: event.eventTime ? new Date(Number(event.eventTime.seconds) * 1000).toISOString() : null,
            attributes: safeData(
                event.workflowExecutionStartedEventAttributes ||
                event.activityTaskScheduledEventAttributes ||
                event.timerStartedEventAttributes ||
                event.workflowExecutionCompletedEventAttributes ||
                event.activityTaskCompletedEventAttributes ||
                event.childWorkflowExecutionStartedEventAttributes ||
                event.childWorkflowExecutionCompletedEventAttributes ||
                event.markerRecordedEventAttributes ||
                {}
            )
        }));

        console.log(`[API] Sending ${history.length} history events`);
        res.json(history);
    } catch (err: any) {
        console.error(`[API] Error fetching history for ${req.params.id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// Start server
const clientPromise = getClient();

app.listen(PORT, async () => {
    try {
        await clientPromise;
        console.log(`[API] Server running on http://localhost:${PORT}`);
    } catch (err) {
        console.error('[API] Failed to connect to Temporal:', err);
        process.exit(1);
    }
});
