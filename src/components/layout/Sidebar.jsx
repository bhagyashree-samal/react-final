import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, FileText, History, Wallet, ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = () => {
    const [userMgmtOpen, setUserMgmtOpen] = useState(true);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { 
            name: 'User Management', 
            path: '#', 
            icon: <Users size={18} />, 
            isHeader: true,
            isOpen: userMgmtOpen,
            toggle: () => setUserMgmtOpen(!userMgmtOpen),
            children: [
                { name: 'Create CBC User', path: '/user-management/create-cbc', icon: <UserPlus size={16} /> },
                { name: 'User Request', path: '/user-management/user-request', icon: <FileText size={16} /> }
            ]
        },
        { name: 'Audit Trail', path: '/audit', icon: <History size={18} /> },
        { name: 'Wallet Adjustment', path: '/wallet-adjustment', icon: <Wallet size={18} /> }
    ];

    return (
        <aside style={{
            width: '250px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e0e0e0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10
        }}>
            {/* Logo Section */}
            <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
                <div
  style={{
    color: '#8C0B14',
    fontWeight: 'bold',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }}
>
  <img
    src="https://bankpratinidhiuat.nsdlbank.co.in/pictures/assets/nsdl_icon_logo.png"
    alt="NSDL Logo"
    style={{ width: '25px', height: '25px', objectFit: 'contain' }}
  />
  NSDL Payments Bank
</div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '10px 0' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {navItems.map((item, index) => (
                        <li key={index}>
                            {item.isHeader ? (
                                <>
                                    <div 
                                        onClick={item.toggle}
                                        style={{ 
                                            padding: '15px 20px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            color: '#8C0B14', 
                                            fontWeight: 'bold' 
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </div>
                                        {item.isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                    {item.isOpen && item.children && (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, backgroundColor: '#f9f9f9' }}>
                                            {item.children.map((child, cIdx) => (
                                                <li key={cIdx}>
                                                    <NavLink 
                                                        to={child.path}
                                                        style={({isActive}) => ({
                                                            padding: '12px 20px 12px 40px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '15px',
                                                            textDecoration: 'none',
                                                            color: isActive ? '#fff' : '#555',
                                                            backgroundColor: isActive ? '#8C0B14' : 'transparent',
                                                            fontWeight: isActive ? '500' : 'normal',
                                                            borderBottom: '1px solid #eee'
                                                        })}
                                                    >
                                                        {child.icon}
                                                        <span>{child.name}</span>
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <NavLink 
                                    to={item.path}
                                    style={({isActive}) => ({
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        textDecoration: 'none',
                                        color: isActive ? '#000' : '#555',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        borderLeft: isActive ? '4px solid #8C0B14' : '4px solid transparent',
                                        backgroundColor: isActive ? '#fff1f2' : 'transparent'
                                    })}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
