import React, { useEffect, useMemo, useState } from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { BarChart2, TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'];

function monthLabel(date: Date) {
    return date.toLocaleString('en-IN', { month: 'short' });
}

export default function AnalyticsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customerCount, setCustomerCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                setLoading(true);
                const [{ data: ordersData, error: ordersError }, { count, error: countError }] = await Promise.all([
                    supabase.from('orders').select('*').order('created_at', { ascending: false }),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer')
                ]);
                if (ordersError) throw ordersError;
                if (countError) throw countError;
                setOrders(ordersData || []);
                setCustomerCount(count || 0);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalytics();
    }, []);

    const summary = useMemo(() => {
        const revenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const ordersCount = orders.length;
        const avgOrder = ordersCount > 0 ? revenue / ordersCount : 0;
        const paidOrders = orders.filter((order) => order.payment_status === 'paid').length;
        const conversion = ordersCount > 0 ? (paidOrders / ordersCount) * 100 : 0;
        return { revenue, ordersCount, avgOrder, conversion };
    }, [orders]);

    const monthlyRevenue = useMemo(() => {
        const now = new Date();
        const labels: { label: string; key: string }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            labels.push({ label: monthLabel(d), key: `${d.getFullYear()}-${d.getMonth()}` });
        }

        const totals: Record<string, number> = {};
        labels.forEach((l) => { totals[l.key] = 0; });

        orders.forEach((order) => {
            const d = new Date(order.created_at);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            if (totals[key] !== undefined) totals[key] += Number(order.total_amount || 0);
        });

        const max = Math.max(...Object.values(totals), 1);
        return labels.map((l) => ({
            ...l,
            amount: totals[l.key],
            height: Math.max(8, Math.round((totals[l.key] / max) * 100))
        }));
    }, [orders]);

    return (
        <div className="min-h-screen pb-10">
            <AdminHeader title="Analytics" />
            <main className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold uppercase tracking-wider text-gray-500">Revenue</span><DollarSign size={18} className="text-green-500" /></div>
                        <p className="text-2xl font-display font-bold">{loading ? '...' : `₹${Math.round(summary.revenue).toLocaleString()}`}</p>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold uppercase tracking-wider text-gray-500">Orders</span><ShoppingBag size={18} className="text-blue-500" /></div>
                        <p className="text-2xl font-display font-bold">{loading ? '...' : summary.ordersCount}</p>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold uppercase tracking-wider text-gray-500">Customers</span><Users size={18} className="text-purple-500" /></div>
                        <p className="text-2xl font-display font-bold">{loading ? '...' : customerCount}</p>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold uppercase tracking-wider text-gray-500">Paid Rate</span><TrendingUp size={18} className="text-yellow-500" /></div>
                        <p className="text-2xl font-display font-bold">{loading ? '...' : `${summary.conversion.toFixed(1)}%`}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart2 size={18} />
                        <h3 className="font-bold uppercase tracking-wide text-sm">Revenue (Last 6 Months)</h3>
                    </div>
                    <div className="grid grid-cols-6 gap-4 items-end h-56">
                        {monthlyRevenue.map((month) => (
                            <div key={month.key} className="text-center">
                                <div className="text-[10px] text-gray-400 mb-2">₹{Math.round(month.amount).toLocaleString()}</div>
                                <div className="mx-auto w-full max-w-[42px] bg-black/90 rounded-t-xl" style={{ height: `${month.height}%` }} />
                                <div className="text-xs font-bold mt-2 text-gray-500">{month.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold uppercase tracking-wide text-sm mb-4">Order Value Snapshot</h3>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Average Order Value</span>
                        <span className="font-bold">₹{Math.round(summary.avgOrder).toLocaleString()}</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
