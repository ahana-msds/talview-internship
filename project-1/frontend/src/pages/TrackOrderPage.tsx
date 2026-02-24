import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';
import { CheckCircle, Clock, Package, Truck, Home, ArrowLeft } from 'lucide-react';

const ORDER_STATUS_SUBSCRIPTION = gql`
  subscription WatchOrderStatus($orderId: String!) {
    orders_by_pk(id: $orderId) {
      id
      status
      address
    }
  }
`;

interface OrderSubscriptionData {
    orders_by_pk: {
        id: string;
        status: string;
        address: string;
    } | null;
}

const steps = [
    { id: 'PENDING', label: 'Ordered', icon: Clock },
    { id: 'PROCESSING', label: 'Processing', icon: Package },
    { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
    { id: 'SHIPPED', label: 'Shipped', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', icon: Home },
];

export const TrackOrderPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const { data, loading, error } = useSubscription<OrderSubscriptionData>(ORDER_STATUS_SUBSCRIPTION, {
        variables: { orderId: orderId?.startsWith('workflow-') ? orderId : `workflow-${orderId}` },
    });

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
            <div className="text-red-500">Error loading tracking data: {error.message}</div>
        </div>
    );

    const order = data?.orders_by_pk;
    const currentStatus = order?.status || 'PENDING';

    const getStepStatus = (stepId: string) => {
        const currentIndex = steps.findIndex(s => s.id === currentStatus);
        const stepIndex = steps.findIndex(s => s.id === stepId);

        if (currentStatus === 'CANCELLED') return 'cancelled';
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'active';
        return 'upcoming';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <button
                onClick={() => navigate('/orders')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft size={20} /> Back to Orders
            </button>

            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        Track Your Order
                    </h1>
                    <p className="text-gray-400">Order ID: <span className="text-primary font-mono">{orderId}</span></p>
                </header>

                {currentStatus === 'CANCELLED' ? (
                    <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center mb-12">
                        <h2 className="text-2xl font-bold text-red-500 mb-2">Order Cancelled</h2>
                        <p className="text-gray-400">This order has been cancelled and will not be processed further.</p>
                    </div>
                ) : (
                    <div className="relative mb-20">
                        {/* Connection Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0 hidden md:block" />

                        <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8">
                            {steps.map((step) => {
                                const status = getStepStatus(step.id);
                                const Icon = step.icon;

                                return (
                                    <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-4 flex-1">
                                        <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500
                      ${status === 'completed' ? 'bg-primary text-black scale-110' :
                                                status === 'active' ? 'bg-white text-black ring-4 ring-primary/30 scale-125' :
                                                    'bg-gray-900 text-gray-600 border border-white/5'}
                    `}>
                                            <Icon size={28} />
                                        </div>
                                        <div className="text-left md:text-center">
                                            <p className={`font-bold transition-colors ${status === 'upcoming' ? 'text-gray-600' : 'text-white'}`}>
                                                {step.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
                                                {status === 'completed' ? 'DONE' : status === 'active' ? 'IN PROGRESS' : 'WAITING'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Truck className="text-primary" /> Delivery Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 text-sm uppercase tracking-wider">Shipping Address</p>
                                <p className="text-lg mt-1">{order?.address || 'Calculating...'}</p>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-gray-500 text-sm uppercase tracking-wider">Estimated Delivery</p>
                                <p className="text-lg mt-1">2-4 Business Days</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Clock className="text-primary" /> Order Timeline
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                <div>
                                    <p className="font-bold">Workflow Synchronized</p>
                                    <p className="text-sm text-gray-500">Temporal heartbeat active</p>
                                </div>
                            </div>
                            <div className="flex gap-4 opacity-50">
                                <div className="w-2 h-2 rounded-full bg-gray-600 mt-2" />
                                <div>
                                    <p className="font-bold">Real-time Hook</p>
                                    <p className="text-sm text-gray-500">Hasura Subscription listening...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
