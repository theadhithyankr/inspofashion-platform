import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { Palette, Layout, Type, Image } from 'lucide-react';

type AppearanceSettings = {
    theme: 'light' | 'dark';
    accentColor: string;
    heroStyle: 'minimal' | 'bold';
};

const STORAGE_KEY = 'inspofashions_admin_appearance';

export default function AppearancePage() {
    const [settings, setSettings] = useState<AppearanceSettings>({
        theme: 'light',
        accentColor: '#000000',
        heroStyle: 'bold'
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (error) {
                console.error('Invalid appearance settings:', error);
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
            <AdminHeader title="Appearance" />
            <main className="p-8 max-w-7xl mx-auto space-y-8">
                 <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                            <Palette className="text-purple-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Store Customization</h2>
                            <p className="text-gray-500 text-sm">Manage appearance preferences for the storefront.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="p-6 border border-gray-200 rounded-2xl">
                            <Layout className="mb-4 text-gray-500" />
                            <h3 className="font-bold mb-3">Theme</h3>
                            <select
                                value={settings.theme}
                                onChange={(e) => setSettings((prev) => ({ ...prev, theme: e.target.value as AppearanceSettings['theme'] }))}
                                className="w-full border border-gray-200 rounded-xl p-2 text-sm"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-2xl">
                             <Type className="mb-4 text-gray-500" />
                            <h3 className="font-bold mb-3">Hero Style</h3>
                            <select
                                value={settings.heroStyle}
                                onChange={(e) => setSettings((prev) => ({ ...prev, heroStyle: e.target.value as AppearanceSettings['heroStyle'] }))}
                                className="w-full border border-gray-200 rounded-xl p-2 text-sm"
                            >
                                <option value="bold">Bold</option>
                                <option value="minimal">Minimal</option>
                            </select>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-2xl">
                             <Image className="mb-4 text-gray-500" />
                            <h3 className="font-bold mb-3">Accent Color</h3>
                            <input
                                type="color"
                                value={settings.accentColor}
                                onChange={(e) => setSettings((prev) => ({ ...prev, accentColor: e.target.value }))}
                                className="w-full h-10 border border-gray-200 rounded-xl p-1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{saved ? 'Saved successfully.' : 'Changes are stored locally for now.'}</p>
                        <button
                            onClick={handleSave}
                            className="bg-black text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                        >
                            Save Appearance
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
