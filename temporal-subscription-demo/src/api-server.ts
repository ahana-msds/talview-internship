import express from 'express';
import cors from 'cors';
import { Connection, Client } from '@temporalio/client';
import { subscriptionWorkflow, cancelSubscription } from './workflows';
import { nanoid } from 'nanoid';
import { eventStore } from './event-store';
import { getEtherealInfo } from './email-config';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

let temporalClient: Client | null = null;
let isReady = false;

// Initialize Temporal client
async function initTemporalClient() {
    try {
        console.log('Connecting to Temporal server...');
        const connection = await Connection.connect({ address: 'localhost:7233' });
        temporalClient = new Client({ connection });
        isReady = true;
        console.log('Connected to Temporal server');
    } catch (error) {
        console.error('Failed to connect to Temporal:', error);
        throw error;
    }
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        ready: isReady,
        temporalConnected: temporalClient !== null
    });
});

// Start a new subscription workflow
app.post('/api/workflows/start', async (req, res) => {
    try {
        if (!temporalClient) {
            return res.status(503).json({
                success: false,
                error: 'Temporal client not initialized'
            });
        }

        const { email, planId, trialPeriod, billingPeriod } = req.body;

        const workflowId = 'subscription-' + nanoid();

        eventStore.addEvent({
            workflowId,
            timestamp: new Date().toISOString(),
            type: 'workflow',
            action: 'Workflow Started',
            details: { email, planId, trialPeriod, billingPeriod }
        });

        const handle = await temporalClient.workflow.start(subscriptionWorkflow, {
            taskQueue: 'subscription-queue',
            args: [{
                email: email || 'user@example.com',
                planId: planId || 'premium',
                trialPeriod: trialPeriod || '10s',
                billingPeriod: billingPeriod || '15s'
            }],
            workflowId,
        });

        res.json({
            success: true,
            workflowId: handle.workflowId,
            message: 'Subscription workflow started'
        });
    } catch (error: any) {
        console.error('Error starting workflow:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Cancel a subscription
app.post('/api/workflows/:workflowId/cancel', async (req, res) => {
    try {
        if (!temporalClient) {
            return res.status(503).json({
                success: false,
                error: 'Temporal client not initialized'
            });
        }

        const { workflowId } = req.params;

        const handle = temporalClient.workflow.getHandle(workflowId);
        await handle.signal(cancelSubscription);

        eventStore.addEvent({
            workflowId,
            timestamp: new Date().toISOString(),
            type: 'workflow',
            action: 'Cancellation Signal Sent',
            details: {}
        });

        res.json({
            success: true,
            message: 'Cancellation signal sent'
        });
    } catch (error: any) {
        console.error('Error cancelling workflow:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get workflow events
app.get('/api/workflows/:workflowId/events', (req, res) => {
    const { workflowId } = req.params;
    const events = eventStore.getEvents(workflowId);

    res.json({
        success: true,
        events
    });
});

// Get all workflows
app.get('/api/workflows', (req, res) => {
    const workflows = eventStore.getAllWorkflows();

    res.json({
        success: true,
        workflows
    });
});

// Get Ethereal email info
app.get('/api/email-info', (req, res) => {
    const info = getEtherealInfo();

    res.json({
        success: true,
        etherealInfo: info
    });
});

// Server-Sent Events for real-time updates
app.get('/api/workflows/:workflowId/stream', (req, res) => {
    const { workflowId } = req.params;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send existing events
    const existingEvents = eventStore.getEvents(workflowId);
    existingEvents.forEach(event => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    // Listen for new events
    const eventHandler = (event: any) => {
        if (event.workflowId === workflowId) {
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        }
    };

    eventStore.on('activity', eventHandler);

    req.on('close', () => {
        eventStore.off('activity', eventHandler);
    });
});

async function startServer() {
    try {
        // Start server first
        app.listen(PORT, () => {
            console.log(`🚀 API Server running on http://localhost:${PORT}`);
            console.log(`   Endpoints:`);
            console.log(`   - GET  /api/health`);
            console.log(`   - POST /api/workflows/start`);
            console.log(`   - POST /api/workflows/:id/cancel`);
            console.log(`   - GET  /api/workflows/:id/events`);
            console.log(`   - GET  /api/workflows/:id/stream`);
            console.log(`   - GET  /api/email-info`);
        });

        // Then initialize Temporal client
        await initTemporalClient();
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer().catch(console.error);

