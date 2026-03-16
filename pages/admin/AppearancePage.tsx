import React from 'react';
import AdminHeader from '../../components/admin/layout/AdminHeader';
import { Palette, Layout, Type, Image } from 'lucide-react';

export default function AppearancePage() {
    return (
        <div className="min-h-screen pb-10">
            <AdminHeader title="Appearance" />
            <main className="p-8 max-w-7xl mx-auto space-y-8">
                 <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Palette className="text-purple-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Store Customization</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Customize your store's theme, colors, and layout directly from here.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
                        <div className="p-6 border border-gray-200 rounded-2xl hover:border-black transition-colors cursor-pointer group">
                            <Layout className="mb-4 text-gray-400 group-hover:text-black" />
                            <h3 className="font-bold mb-1">Layout</h3>
                            <p className="text-sm text-gray-500">Manage homepage sections</p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-2xl hover:border-black transition-colors cursor-pointer group">
                             <Type className="mb-4 text-gray-400 group-hover:text-black" />
                            <h3 className="font-bold mb-1">Typography</h3>
                            <p className="text-sm text-gray-500">Edit fonts and styles</p>
                        </div>
                        <div className="p-6 border border-gray-200 rounded-2xl hover:border-black transition-colors cursor-pointer group">
                             <Image className="mb-4 text-gray-400 group-hover:text-black" />
                            <h3 className="font-bold mb-1">Assets</h3>
                            <p className="text-sm text-gray-500">Manage logo and banners</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}