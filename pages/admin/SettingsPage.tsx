import React from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { Settings, User, CreditCard, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen pb-10">
            <AdminHeader title="Settings" />
            <main className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        <div className="p-6 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <User size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">General Settings</h3>
                                <p className="text-sm text-gray-500">Store name, email, and location</p>
                            </div>
                        </div>
                         <div className="p-6 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <CreditCard size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">Payments</h3>
                                <p className="text-sm text-gray-500">Manage payment gateways and currency</p>
                            </div>
                        </div>
                         <div className="p-6 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <Bell size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">Notifications</h3>
                                <p className="text-sm text-gray-500">Email alerts and customer messages</p>
                            </div>
                        </div>
                         <div className="p-6 flex items-center gap-4 hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <Shield size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">Security</h3>
                                <p className="text-sm text-gray-500">Password and team permissions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}