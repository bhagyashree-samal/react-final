import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
    const location = useLocation();
    
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard';
        if (path === '/wallet-adjustment') return 'Wallet Adjustment';
        if (path === '/user-management/create-cbc') return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#fff', opacity: 0.8 }}>User Management /</span>
                <span style={{ fontWeight: '600' }}>Create CBC User</span>
            </div>
        );
        if (path === '/user-management/user-request') return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#fff', opacity: 0.8 }}>User Management /</span>
                <span style={{ fontWeight: '600' }}>User Request</span>
            </div>
        );
        return 'NSDL Portal';
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', margin: 0, padding: 0, backgroundColor: '#f5f6f8' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Header title={getPageTitle()} />
                <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
