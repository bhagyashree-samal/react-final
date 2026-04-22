import React from 'react';

const ProfileModal = ({ isOpen, onClose, profileData }) => {
    if (!isOpen) return null;

    const infoItems = [
        { label: 'Name', value: profileData.name },
        { label: 'Phone No.', value: profileData.phone },
        { label: 'Email ID', value: profileData.email },
        { label: 'Address', value: profileData.address },
        { label: 'State', value: profileData.state },
        { label: 'User ID', value: profileData.userId },
        { label: 'Pan ID', value: profileData.panId },
        { label: 'User Type', value: profileData.userType },
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#374151', margin: 0 }}>User Profile</h2>
                <p style={{ color: '#6b7280', fontSize: '18px', margin: '8px 0 24px 0' }}>View personal information</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    {infoItems.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <span style={{ width: '120px', color: '#4b5563', fontSize: '18px', fontWeight: '500' }}>{item.label}</span>
                            <span style={{ color: '#111827', fontSize: '18px', fontWeight: '500' }}>{item.value}</span>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#8C0B14',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ProfileModal;
