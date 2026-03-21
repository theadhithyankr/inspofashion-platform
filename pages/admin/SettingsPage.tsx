import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { Settings, User, CreditCard, Bell, Shield } from 'lucide-react';

type StoreSettings = {
    storeName: string;
    supportEmail: string;
    location: string;
    currency: 'INR' | 'USD';
    emailNotifications: boolean;
    twoFactorAuth: boolean;
};

const STORAGE_KEY = 'inspofashions_admin_settings';

export default function SettingsPage() {
    const [settings, setSettings] = useState<StoreSettings>({
        storeName: 'INSPOFASHIONS',
        supportEmail: 'support@inspofashions.com',
        location: 'Mumbai',
        currency: 'INR',
        emailNotifications: true,
        twoFactorAuth: false
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const persisted = localStorage.getItem(STORAGE_KEY);
        if (persisted) {
            try {
                setSettings(JSON.parse(persisted));
            } catch (error) {
                console.error('Invalid stored settings:', error);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="min-h-screen pb-10">
            <AdminHeader title="Settings" />
            <main className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        <div className="p-6 flex items-start gap-4 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <User size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">General Settings</h3>
                                <p className="text-sm text-gray-500">Store name, email, and location</p>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input value={settings.storeName} onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Store name" />
                                    <input value={settings.supportEmail} onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Support email" />
                                    <input value={settings.location} onChange={(e) => setSettings((prev) => ({ ...prev, location: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Location" />
                                </div>
                            </div>
                        </div>
                         <div className="p-6 flex items-start gap-4 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <CreditCard size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">Payments</h3>
                                <p className="text-sm text-gray-500">Manage payment gateways and currency</p>
                                <select
                                    value={settings.currency}
                                    onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value as StoreSettings['currency'] }))}
                                    className="mt-4 border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>
                         <div className="p-6 flex items-start gap-4 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <Bell size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">Notifications</h3>
                                <p className="text-sm text-gray-500">Email alerts and customer messages</p>
                                <label className="mt-4 flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailNotifications}
                                        onChange={(e) => setSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
                                    />
                                    Enable email notifications
                                </label>
                            </div>
                        </div>
                         <div className="p-6 flex items-start gap-4 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <Shield size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">Security</h3>
                                <p className="text-sm text-gray-500">Password and team permissions</p>
                                <label className="mt-4 flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={settings.twoFactorAuth}
                                        onChange={(e) => setSettings((prev) => ({ ...prev, twoFactorAuth: e.target.checked }))}
                                    />
                                    Enforce two-factor auth for admin logins
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <p className="text-sm text-gray-500">{saved ? 'Saved successfully.' : 'Changes are currently stored locally.'}</p>
                    <button
                        onClick={handleSave}
                        className="bg-black text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            </main>
        </div>
    );
}
