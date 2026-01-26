import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Users,
    BarChart2,
    Settings,
    LogOut,
    Palette,
    Globe
} from 'lucide-react';
import { signOut } from '../../../lib/auth';

export default function AdminSidebar() {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Customers', path: '/admin/customers' },
        { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
        { icon: Palette, label: 'Appearance', path: '/admin/appearance' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <aside className="w-64 bg-black text-white h-screen fixed left-0 top-0 overflow-y-auto z-50 flex flex-col">
            {/* Logo */}
            <div className="p-8">
                <h1 className="text-2xl font-display font-bold tracking-tighter">
                    INSPO<span className="text-gray-400">ADMIN</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'} // Only exact match for dashboard
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-white text-black font-bold'
                                : 'text-gray-400 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="uppercase tracking-wider text-xs font-bold">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 mt-auto space-y-2">
                <a
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                >
                    <Globe size={20} />
                    <span className="uppercase tracking-wider text-xs font-bold">View Store</span>
                </a>

                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-left"
                >
                    <LogOut size={20} />
                    <span className="uppercase tracking-wider text-xs font-bold">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
