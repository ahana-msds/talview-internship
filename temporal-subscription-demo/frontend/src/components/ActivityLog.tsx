interface ActivityEvent {
    workflowId: string;
    timestamp: string;
    type: 'email' | 'charge' | 'workflow' | 'timer';
    action: string;
    details: any;
    emailPreviewUrl?: string;
}

interface Props {
    events: ActivityEvent[];
}

export default function ActivityLog({ events }: Props) {
    const getEventIcon = (type: string) => {
        switch (type) {
            case 'email':
                return '📧';
            case 'charge':
                return '💳';
            case 'workflow':
                return '⚙️';
            case 'timer':
                return '⏱️';
            default:
                return '📝';
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'email':
                return 'bg-blue-100 border-blue-300 text-blue-800';
            case 'charge':
                return 'bg-green-100 border-green-300 text-green-800';
            case 'workflow':
                return 'bg-purple-100 border-purple-300 text-purple-800';
            case 'timer':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                activity log
            </h2>

            {events.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">no activities yet</p>
                    <p className="text-sm mt-2">start a subscription to see events appear here in real-time</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className={`border-l-4 p-4 rounded-r-lg ${getEventColor(event.type)}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <span className="text-2xl">{getEventIcon(event.type)}</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">
                                            {event.action}
                                        </p>
                                        <p className="text-xs mt-1 opacity-75">
                                            {formatTime(event.timestamp)}
                                        </p>

                                        {/* Event Details */}
                                        <div className="mt-2 text-xs space-y-1">
                                            {event.type === 'email' && (
                                                <>
                                                    <p>to: {event.details.to}</p>
                                                    <p>subject: {event.details.subject}</p>
                                                    {event.emailPreviewUrl && (
                                                        <a
                                                            href={event.emailPreviewUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-block mt-2 px-3 py-1 bg-white rounded border border-current hover:bg-opacity-80 transition-colors"
                                                        >
                                                            view email
                                                        </a>
                                                    )}
                                                </>
                                            )}

                                            {event.type === 'charge' && (
                                                <>
                                                    <p>customer: {event.details.customerId}</p>
                                                    <p>amount: ${event.details.amount} {event.details.currency}</p>
                                                </>
                                            )}

                                            {event.type === 'workflow' && event.details.email && (
                                                <>
                                                    <p>email: {event.details.email}</p>
                                                    <p>plan: {event.details.planId}</p>
                                                    <p>trial: {event.details.trialPeriod}</p>
                                                    <p>billing: {event.details.billingPeriod}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
