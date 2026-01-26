import React, { useEffect, useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { getUserProfile } from '../../../lib/auth';

export default function AdminHeader({ title }: { title: string }) {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        getUserProfile().then(setProfile);
    }, []);

    return (
        <header className="bg-white border-b border-gray-100 h-20 px-8 flex items-center justify-between sticky top-0 z-40">
            <h2 className="text-2xl font-display font-bold uppercase tracking-wide">{title}</h2>

            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/5 w-64"
                    />
                </div>

                {/* Notifications */}
                <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold">{profile?.full_name || 'Admin User'}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{profile?.role || 'Admin'}</p>
                    </div>
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
}
