import { useState, useEffect } from 'react';
import ActivityLog from './ActivityLog';
import WorkflowVisualizer from './WorkflowVisualizer';

const API_BASE = 'http://localhost:3002/api';

interface ActivityEvent {
    workflowId: string;
    timestamp: string;
    type: 'email' | 'charge' | 'workflow' | 'timer';
    action: string;
    details: any;
    emailPreviewUrl?: string;
}

export default function WorkflowDashboard() {
    const [workflowId, setWorkflowId] = useState<string | null>(null);
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('user@example.com');
    const [trialPeriod, setTrialPeriod] = useState('10s');
    const [billingPeriod, setBillingPeriod] = useState('15s');

    useEffect(() => {
        if (!workflowId) return;

        // Server-Sent Events for real-time updates
        const eventSource = new EventSource(`${API_BASE}/workflows/${workflowId}/stream`);

        eventSource.onmessage = (event) => {
            const newEvent: ActivityEvent = JSON.parse(event.data);
            setEvents(prev => {
                // Avoid duplicates
                if (prev.some(e => e.timestamp === newEvent.timestamp && e.action === newEvent.action)) {
                    return prev;
                }
                return [...prev, newEvent];
            });
        };

        eventSource.onerror = () => {
            console.error('SSE connection error');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [workflowId]);

    const startWorkflow = async () => {
        setIsLoading(true);
        setEvents([]);

        try {
            const response = await fetch(`${API_BASE}/workflows/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    planId: 'premium',
                    trialPeriod,
                    billingPeriod
                })
            });

            const data = await response.json();
            if (data.success) {
                setWorkflowId(data.workflowId);
            }
        } catch (error) {
            console.error('Failed to start workflow:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelWorkflow = async () => {
        if (!workflowId) return;

        try {
            await fetch(`${API_BASE}/workflows/${workflowId}/cancel`, {
                method: 'POST'
            });
        } catch (error) {
            console.error('Failed to cancel workflow:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        control panel
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={!!workflowId}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                trial period
                            </label>
                            <input
                                type="text"
                                value={trialPeriod}
                                onChange={(e) => setTrialPeriod(e.target.value)}
                                placeholder="e.g., 10s, 1m, 1h"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={!!workflowId}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                billing period
                            </label>
                            <input
                                type="text"
                                value={billingPeriod}
                                onChange={(e) => setBillingPeriod(e.target.value)}
                                placeholder="e.g., 15s, 1m, 1h"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={!!workflowId}
                            />
                        </div>

                        {!workflowId ? (
                            <button
                                onClick={startWorkflow}
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'starting...' : 'start subscription'}
                            </button>
                        ) : (
                            <button
                                onClick={cancelWorkflow}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                cancel subscription
                            </button>
                        )}

                        {workflowId && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-md">
                                <p className="text-xs font-mono text-gray-600 break-all">
                                    workflow id: {workflowId}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Workflow Visualizer */}
                <div className="mt-6">
                    <WorkflowVisualizer events={events} />
                </div>
            </div>

            {/* Activity Log */}
            <div className="lg:col-span-2">
                <ActivityLog events={events} />
            </div>
        </div>
    );
}
