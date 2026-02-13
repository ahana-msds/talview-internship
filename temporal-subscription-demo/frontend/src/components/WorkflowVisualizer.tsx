import { useMemo } from 'react';

interface ActivityEvent {
    workflowId: string;
    timestamp: string;
    type: 'email' | 'charge' | 'workflow' | 'timer';
    action: string;
    details: any;
}

interface Props {
    events: ActivityEvent[];
}

export default function WorkflowVisualizer({ events }: Props) {
    const workflowState = useMemo(() => {
        const state = {
            status: 'idle',
            billingCycles: 0,
            inTrial: false,
            cancelled: false
        };

        for (const event of events) {
            if (event.action === 'Workflow Started') {
                state.status = 'trial';
                state.inTrial = true;
            }

            if (event.action === 'Customer Charged') {
                state.billingCycles++;
                state.inTrial = false;
                state.status = 'billing';
            }

            if (event.action === 'Cancellation Signal Sent') {
                state.cancelled = true;
                state.status = 'cancelling';
            }

            if (event.action.includes('Cancellation') && event.type === 'email') {
                state.status = 'completed';
            }
        }

        return state;
    }, [events]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'idle':
                return 'bg-gray-200 text-gray-700';
            case 'trial':
                return 'bg-blue-500 text-white';
            case 'billing':
                return 'bg-green-500 text-white';
            case 'cancelling':
                return 'bg-yellow-500 text-white';
            case 'completed':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                workflow state
            </h3>

            {/* Status Badge */}
            <div className="mb-6">
                <div className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(workflowState.status)}`}>
                    {workflowState.status}
                </div>
            </div>

            {/* Workflow Stages */}
            <div className="space-y-4">
                {/* Trial Period */}
                <div className={`p-3 rounded-lg border-2 ${workflowState.inTrial
                        ? 'border-blue-500 bg-blue-50'
                        : workflowState.billingCycles > 0
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300 bg-gray-50'
                    }`}>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">trial period</span>
                        {workflowState.inTrial && (
                            <span className="text-xs text-blue-600 animate-pulse">active</span>
                        )}
                        {workflowState.billingCycles > 0 && (
                            <span className="text-xs text-green-600">✓ completed</span>
                        )}
                    </div>
                </div>

                {/* Billing Cycles */}
                <div className={`p-3 rounded-lg border-2 ${workflowState.status === 'billing'
                        ? 'border-green-500 bg-green-50'
                        : workflowState.billingCycles > 0
                            ? 'border-gray-300 bg-gray-50'
                            : 'border-gray-200 bg-gray-50'
                    }`}>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">billing cycles</span>
                        <span className="text-lg font-bold text-gray-700">
                            {workflowState.billingCycles}
                        </span>
                    </div>
                    {workflowState.status === 'billing' && (
                        <p className="text-xs text-green-600 mt-1 animate-pulse">
                            charging customer...
                        </p>
                    )}
                </div>

                {/* Cancellation */}
                {workflowState.cancelled && (
                    <div className={`p-3 rounded-lg border-2 ${workflowState.status === 'completed'
                            ? 'border-red-500 bg-red-50'
                            : 'border-yellow-500 bg-yellow-50'
                        }`}>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">cancellation</span>
                            {workflowState.status === 'completed' ? (
                                <span className="text-xs text-red-600">✓ completed</span>
                            ) : (
                                <span className="text-xs text-yellow-600 animate-pulse">processing...</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                    {events.length} total events
                </p>
            </div>
        </div>
    );
}
