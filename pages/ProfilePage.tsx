import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, User as UserIcon, MapPin, ChevronRight, ShoppingBag, LayoutDashboard } from 'lucide-react';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Force stop loading after 2 seconds max
        const loadingTimeout = setTimeout(() => {
            console.log('Loading timeout - checking status');
            if (mounted) {
                setLoading(false);
                // If we still don't have a user after 2s, THEN redirect
                supabase.auth.getSession().then(({ data }) => {
                    if (!data.session?.user) {
                        console.log('Timeout reached and no session - redirecting');
                        navigate('/login');
                    }
                });
            }
        }, 2000);

        // Check for existing session (don't redirect on fail, just wait)
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('Initial session check:', session?.user?.email || 'No session yet');

            if (!mounted) return;

            if (session?.user) {
                clearTimeout(loadingTimeout);
                setUser(session.user);
                setLoading(false);
                fetchProfileData(session.user.id);
            }
            // If no session, wait for timeout to redirect to login
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state changed:', _event);

            if (!mounted) return;

            if (session?.user) {
                clearTimeout(loadingTimeout);
                setUser(session.user);
                setLoading(false);
                fetchProfileData(session.user.id);
            } else if (_event === 'SIGNED_OUT') {
                navigate('/login');
            }
        });

        return () => {
            mounted = false;
            clearTimeout(loadingTimeout);
            subscription.unsubscribe();
        };
    }, [navigate]);

    async function fetchProfileData(userId: string) {
        try {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) console.error('Profile error:', profileError);
            setProfile(profileData);

            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (ordersError) console.error('Orders error:', ordersError);
            setOrders(ordersData || []);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    const handleSignOut = async () => {
        const clearLocalSession = () => {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') || key.includes('supabase')) {
                    localStorage.removeItem(key);
                }
            });
        };

        const timeoutId = setTimeout(() => {
            clearLocalSession();
            window.location.href = '/';
        }, 2000);

        try {
            await supabase.auth.signOut();
            clearTimeout(timeoutId);
            clearLocalSession();
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    // If no user object, we shouldn't show "Guest", we should be redirecting or showing nothing
    if (!user && !loading) {
        // This failsafe should rarely be hit if useEffects work right
        return null;
    }

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
    const displayEmail = profile?.email || user?.email;
    const displayAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-black text-white py-4 px-8 flex justify-between items-center sticky top-0 z-50">
                <div className="font-display font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
                    INSPO<span className="font-light">FASHIONS</span>
                </div>
                <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-bold hover:text-gray-300 transition-colors">
                    <LogOut size={16} />
                    Sign Out
                </button>
            </nav>

            <main className="max-w-6xl mx-auto p-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                                {displayAvatar ? (
                                    <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={40} />
                                )}
                            </div>
                            <h2 className="font-display font-bold text-xl">{displayName}</h2>
                            <p className="text-gray-400 text-sm mb-6">{displayEmail}</p>

                            <div className="flex flex-col gap-2">
                                {profile?.role === 'admin' && (
                                    <button
                                        onClick={() => window.location.href = '/admin'}
                                        className="w-full py-3 px-4 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors mb-2 flex items-center justify-center gap-2"
                                    >
                                        <LayoutDashboard size={16} />
                                        Admin Dashboard
                                    </button>
                                )}

                                <button className="w-full py-3 px-4 bg-white border border-gray-200 text-black rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Account</h3>
                            <div className="space-y-1">
                                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 font-medium">
                                    <span className="flex items-center gap-3">
                                        <Package size={18} />
                                        My Orders
                                    </span>
                                    <ChevronRight size={16} className="text-gray-400" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                                    <span className="flex items-center gap-3">
                                        <MapPin size={18} />
                                        Addresses
                                    </span>
                                    <ChevronRight size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100">
                                <h2 className="font-display font-bold text-2xl">Order History</h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {orders.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500">
                                        <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium text-black">No orders yet</p>
                                        <p className="mb-6">Looks like you haven't made your first purchase.</p>
                                        <button onClick={() => navigate('/')} className="px-6 py-3 bg-black text-white rounded-full font-bold">
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.id} className="p-6 lg:p-8 hover:bg-gray-50 transition-colors group cursor-pointer">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-mono text-gray-500 text-sm">#{order.order_number || order.id.slice(0, 8)}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                    ${order.order_status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {order.order_status}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        Placed on {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="font-bold text-lg">
                                                    ₹{order.total}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-500">
                                                    {order.order_items?.length || 0} items
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View Details <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
