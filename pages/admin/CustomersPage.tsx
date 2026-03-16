import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { Search, Filter, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Customer = {
    id: string;
    full_name: string | null;
    email: string | null;
    role: string;
    order_count?: number;
    total_spent?: number;
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        try {
            setLoading(true);
            
            // 1. Fetch profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'customer');

            if (profilesError) throw profilesError;

            // 2. Fetch all orders (to aggregate)
            // Note: In a real large app, you'd do this via a Postgres function or view
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('user_id, total_amount');
            
            if (ordersError) throw ordersError;

            // 3. Aggregate data
            const customersWithStats = profiles.map(profile => {
                const userOrders = orders?.filter(o => o.user_id === profile.id) || [];
                const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
                
                return {
                    ...profile,
                    order_count: userOrders.length,
                    total_spent: totalSpent
                };
            });

            setCustomers(customersWithStats);

        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredCustomers = customers.filter(c => 
        (c.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-10">
            <AdminHeader title="Customers" />

            <main className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                        <Filter size={20} />
                        <span>Filter</span>
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Spent</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading customers...</td></tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr><td colSpan={6} className="py-8 text-center text-gray-400">No customers found.</td></tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 uppercase">
                                                    {(customer.full_name || customer.email || '?').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{customer.full_name || 'Guest User'}</div>
                                                    <div className="text-xs text-gray-400 font-mono text-[10px]">{customer.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={12} /> {customer.email}
                                                </div>
                                                {/* Phone is not in profile yet based on schema */}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">{customer.order_count}</td>
                                        <td className="px-6 py-4 text-sm font-medium">₹{customer.total_spent?.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700">
                                                {customer.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
