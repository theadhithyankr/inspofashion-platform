import React from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { BarChart2, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen pb-10">
            <AdminHeader title="Analytics" />
            <main className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BarChart2 className="text-blue-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Detailed Reports Coming Soon</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        We're building powerful analytics tools to help you track your store's performance. 
                        Stay tuned for updates!
                    </p>
                </div>
            </main>
        </div>
    );
}