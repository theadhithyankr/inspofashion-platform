import React from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { Search, Filter, Mail, Phone, MoreHorizontal } from 'lucide-react';

export default function CustomersPage() {
    const customers = [
        { id: 1, name: 'Aswin Kumar', email: 'aswin@example.com', phone: '+91 98765 43210', orders: 12, total: '₹15,499', status: 'Active' },
        { id: 2, name: 'Sarah Jones', email: 'sarah@example.com', phone: '+91 98765 12345', orders: 5, total: '₹4,200', status: 'Active' },
        { id: 3, name: 'Mike Ross', email: 'mike@example.com', phone: '+91 99887 76655', orders: 1, total: '₹5,200', status: 'Inactive' },
        { id: 4, name: 'Rachel Zane', email: 'rachel@example.com', phone: '+91 88776 65544', orders: 8, total: '₹8,900', status: 'Active' },
        { id: 5, name: 'Harvey Specter', email: 'harvey@example.com', phone: '+91 77665 54433', orders: 24, total: '₹45,000', status: 'VIP' },
    ];

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
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{customer.name}</div>
                                                <div className="text-xs text-gray-400">ID: {customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Mail size={12} /> {customer.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={12} /> {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">{customer.orders}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{customer.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${customer.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                customer.status === 'VIP' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
