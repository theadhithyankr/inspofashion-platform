import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { getUserRole } from './lib/auth';
import LoginPage from './pages/LoginPage';

import ProfilePage from './pages/ProfilePage';
import ShopPage from './pages/shop/ShopPage';
import AdminLayout from './components/admin/layout/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import CustomersPage from './pages/admin/CustomersPage';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getUserRole().then(setRole);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const userRole = await getUserRole();
          setRole(userRole);
        } else {
          setRole(null);
        }
        // Ensure loading is false after auth check completes
        setLoading(false);
      }
    );

    // Safety timeout: stop loading after 5 seconds if nothing else does
    const timer = setTimeout(() => setLoading(false), 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Show Setup Screen if config is missing
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        {/* ... (existing setup screen) ... */}
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
          {/* truncated for brevity, identical to existing */}
          <h1 className="text-2xl font-bold mb-4 font-display uppercase tracking-widest">Supabase Setup Required</h1>
          <p className="text-gray-600 mb-6">Please configure your .env file.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-4">
            INSPOFASHIONS
          </h1>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        {/* Shop route (Home) */}
        <Route path="/" element={<ShopPage user={user} />} />

        {/* Profile Route */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Login & Signup Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />

        {/* Admin routes */}
        {/* {role === 'admin' && ( */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
        </Route>
        {/* )} */}

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}