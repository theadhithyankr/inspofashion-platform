import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export default function DashboardPage() {
    const [metrics, setMetrics] = useState({
        revenue: 0,
        ordersCount: 0,
        customersCount: 0,
        avgOrderValue: 0
    });
    const [recentOrders, setRecentOrders] = useState<(Order & { profiles: { full_name: string } | null })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setLoading(true);

                // Fetch Orders
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*, profiles(full_name)')
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (ordersError) throw ordersError;

                // Fetch all orders for aggregation
                const { data: allOrders, error: allOrdersError } = await supabase
                    .from('orders')
                    .select('total');

                if (allOrdersError) throw allOrdersError;

                // Fetch Customer Count
                const { count: customerCount, error: customerError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'customer');

                if (customerError) throw customerError;

                // Calculate Metrics
                const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
                const totalOrders = allOrders?.length || 0;
                const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

                setMetrics({
                    revenue: totalRevenue,
                    ordersCount: totalOrders,
                    customersCount: customerCount || 0,
                    avgOrderValue: avgOrderValue
                });

                // @ts-ignore - Supabase types join fix
                setRecentOrders(orders || []);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const metricCards = [
        { label: 'Total Revenue', value: `₹${metrics.revenue.toLocaleString()}`, change: '+12%', icon: DollarSign, color: 'bg-green-500' },
        { label: 'Total Orders', value: metrics.ordersCount.toString(), change: '+8%', icon: ShoppingBag, color: 'bg-blue-500' },
        { label: 'Total Customers', value: metrics.customersCount.toString(), change: '+24%', icon: Users, color: 'bg-purple-500' },
        { label: 'Avg Order Value', value: `₹${Math.round(metrics.avgOrderValue).toLocaleString()}`, change: '+2%', icon: TrendingUp, color: 'bg-yellow-500' },
    ];

    return (
        <div className="min-h-screen pb-10">
            <AdminHeader title="Dashboard" />

            <main className="p-8 max-w-7xl mx-auto space-y-8">

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metricCards.map((metric) => (
                        <div key={metric.label} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${metric.color} bg-opacity-10 p-3 rounded-2xl`}>
                                    <metric.icon size={24} className={metric.color.replace('bg-', 'text-')} />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{metric.label}</p>
                                <h3 className="text-2xl font-display font-bold">
                                    {loading ? '...' : metric.value}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display font-bold text-lg uppercase tracking-wide">Recent Orders</h3>
                            <button className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black">View All</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                        <th className="pb-3 pl-2">Order ID</th>
                                        <th className="pb-3">Customer</th>
                                        <th className="pb-3">Total</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr><td colSpan={5} className="py-4 text-center text-gray-400">Loading orders...</td></tr>
                                    ) : recentOrders.length === 0 ? (
                                        <tr><td colSpan={5} className="py-4 text-center text-gray-400">No orders yet</td></tr>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 pl-2 font-mono text-gray-500">#{order.id.slice(0, 8)}</td>
                                                <td className="py-4 font-bold">{order.profiles?.full_name || 'Guest'}</td>
                                                <td className="py-4">₹{order.total_amount}</td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-gray-100 text-gray-700'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display font-bold text-lg uppercase tracking-wide">Top Products</h3>
                        </div>
                        <div className="space-y-6">
                            <p className="text-sm text-gray-400 italic">Coming soon with more data...</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
