import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 ml-64">
                {/* Header will be rendered by individual pages to set title dynamically, 
            or we can lift state up. For simplicity, let's include it here 
            but maybe make title dynamic later. 
            Actually, better design: Layout handles sidebar, Page handles header if needed 
            or Layout provides a context. 
            Let's keep it simple: Page renders Header. 
        */}
                <Outlet />
            </div>
        </div>
    );
}
