import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useGetOrdersQuery } from '../features/admin/adminApi';
import { useNavigate } from 'react-router-dom';
import { MapPin, Box, MoveRight, ChevronLeft, ChevronRight } from 'lucide-react';

const LIMIT = 5;

export const OrdersPage = () => {
    const navigate = useNavigate();
    const [offset, setOffset] = useState(0);
    const { data: orders, isLoading, error } = useGetOrdersQuery({ limit: LIMIT, offset });

    const handleNext = () => setOffset(prev => prev + LIMIT);
    const handlePrev = () => setOffset(prev => Math.max(0, prev - LIMIT));

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <Navbar />
                <div className="container mx-auto p-12 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-400">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <Navbar />
                <div className="container mx-auto p-12 text-center text-red-500">
                    <h3 className="text-2xl font-bold">Error loading orders</h3>
                    <p className="opacity-70">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />
            <div className="container mx-auto p-6 md:p-12">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ChevronLeft size={20} /> Back to Dashboard
                </button>

                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                            My Orders
                        </h1>
                        <p className="text-gray-500 mt-2">Manage and track your recent purchases</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={offset === 0}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={orders?.length && orders.length < LIMIT ? true : false}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl disabled:opacity-30 hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                {!orders || orders.length === 0 ? (
                    <div className="bg-white/5 border border-white/5 border-dashed rounded-3xl p-20 text-center">
                        <p className="text-2xl text-gray-500 mb-6">No orders found.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-primary text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {orders.map((order) => (
                            <div key={order.id} className="group bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/[0.07] transition-all">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Box size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-mono font-bold">#{order.id}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.createdAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-gray-300">
                                                    <span>{item.title} <span className="text-gray-600 text-sm">x{item.quantity}</span></span>
                                                    <span className="font-mono">${item.price}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-start gap-2 p-4 bg-black/40 rounded-2xl border border-white/5">
                                            <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                                            <p className="text-sm text-gray-400 leading-relaxed">{order.address}</p>
                                        </div>
                                    </div>

                                    <div className="md:w-64 flex flex-col justify-between items-start md:items-end gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Order Status</p>
                                            <span className={`
                                            px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest
                                            ${order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-500' :
                                                    order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500' :
                                                        'bg-primary/20 text-primary'}
                                          `}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/track-order/${order.id}`)}
                                            className="w-full bg-white text-black py-3 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-primary transition-colors"
                                        >
                                            Track Order <MoveRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
