import React, { useState } from 'react';
import { Bell, ChevronDown, User, Key, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileModal from '../modals/ProfileModal';
import LogoutModal from '../modals/LogoutModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';

const Header = ({ title }) => {
    const { user, logout, dummyProfile } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'profile', 'password', 'logout'

    const handleLogout = () => {
        logout();
        setActiveModal(null);
    };

    return (
        <header style={{ 
            display: 'flex', 
            height: '60px', 
            backgroundColor: '#8C0B14', 
            color: 'white',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: '500' }}>
                {title || 'Dashboard'}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Bell size={20} style={{ cursor: 'pointer' }} />
                
                {/* Profile Trigger */}
                <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', position: 'relative' }} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div style={{ 
                        width: '35px', 
                        height: '35px', 
                        borderRadius: '50%', 
                        overflow: 'hidden',
                        border: '2px solid white'
                    }}>
                        <img 
                            src="https://bankpratinidhiuat.nsdlbank.co.in/pictures/assets/propic.svg" 
                            alt="avatar" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{user?.username || 'OPSMISU'}</span>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8C0B14'
                    }}>
                        <ChevronDown size={14} />
                    </div>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <>
                            <div 
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
                                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '45px',
                                right: 0,
                                backgroundColor: 'white',
                                color: '#374151',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                width: '220px',
                                zIndex: 100,
                                overflow: 'hidden',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div 
                                    onClick={() => { setActiveModal('profile'); setIsMenuOpen(false); }}
                                    style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <User size={18} />
                                    <span>Profile</span>
                                </div>
                                <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />
                                <div 
                                    onClick={() => { setActiveModal('password'); setIsMenuOpen(false); }}
                                    style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <Key size={18} />
                                    <span>Change Password</span>
                                </div>
                                <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />
                                <div 
                                    onClick={() => { setActiveModal('logout'); setIsMenuOpen(false); }}
                                    style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s', color: '#dc2626' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ProfileModal 
                isOpen={activeModal === 'profile'} 
                onClose={() => setActiveModal(null)} 
                profileData={dummyProfile}
            />
            <ChangePasswordModal 
                isOpen={activeModal === 'password'} 
                onClose={() => setActiveModal(null)} 
            />
            <LogoutModal 
                isOpen={activeModal === 'logout'} 
                onClose={() => setActiveModal(null)} 
                onConfirm={handleLogout}
            />
        </header>
    );
};

export default Header;
