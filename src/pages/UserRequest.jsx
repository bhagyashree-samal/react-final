import React, { useState } from 'react';
import apiClient from '../services/api';
import NsdlLoader from '../components/common/NsdlLoader';

const UserRequest = () => {
    const [searchType, setSearchType] = useState('date'); // 'date' or 'username'
    const [formData, setFormData] = useState({
        fromDate: '2026-04-21',
        toDate: '2026-04-21',
        userType: 'CBC',
        status: 'ALL'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            // Simulated network activity
            await apiClient.get('https://jsonplaceholder.typicode.com/posts/1');
            alert('Search successful (Network checked)');
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        {isLoading && <NsdlLoader />}
        <div style={{ padding: '24px' }}>
            <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                padding: '32px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', gap: '40px', marginBottom: '32px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '18px', color: '#374151' }}>
                        <input 
                            type="radio" 
                            name="searchType" 
                            checked={searchType === 'date'} 
                            onChange={() => setSearchType('date')}
                            style={{ width: '20px', height: '20px', accentColor: '#8C0B14' }}
                        />
                        Search by Date Range
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '18px', color: '#374151' }}>
                        <input 
                            type="radio" 
                            name="searchType" 
                            checked={searchType === 'username'} 
                            onChange={() => setSearchType('username')}
                            style={{ width: '20px', height: '20px', accentColor: '#8C0B14' }}
                        />
                        Search by User Name
                    </label>
                </div>

                <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '24px', alignItems: 'flex-end' }}>
                    {searchType === 'date' ? (
                        <>
                            <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
                                <label style={{ 
                                    position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', 
                                    padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 
                                }}>From Date*</label>
                                <input type="date" value={formData.fromDate} onChange={(e) => setFormData({...formData, fromDate: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                            </div>

                            <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
                                <label style={{ 
                                    position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', 
                                    padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 
                                }}>To Date*</label>
                                <input type="date" value={formData.toDate} onChange={(e) => setFormData({...formData, toDate: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                            </div>

                            <div style={{ position: 'relative', flex: '1', minWidth: '150px' }}>
                                <label style={{ 
                                    position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', 
                                    padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 
                                }}>User Type</label>
                                <select value={formData.userType} onChange={(e) => setFormData({...formData, userType: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', appearance: 'none', backgroundColor: 'white' }}>
                                    <option value="CBC">CBC</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div style={{ position: 'relative', flex: '1', minWidth: '150px' }}>
                                <label style={{ 
                                    position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', 
                                    padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 
                                }}>Status</label>
                                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', appearance: 'none', backgroundColor: 'white' }}>
                                    <option value="ALL">ALL</option>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <div style={{ position: 'relative', flex: '1' }}>
                            <label style={{ 
                                position: 'absolute', top: '-10px', left: '12px', backgroundColor: 'white', 
                                padding: '0 4px', fontSize: '14px', color: '#6b7280', zIndex: 1 
                            }}>Username*</label>
                            <input 
                                type="text" 
                                placeholder="Enter Username"
                                value={formData.username || ''} 
                                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} 
                            />
                        </div>
                    )}

                    <button onClick={handleSearch} disabled={isLoading} style={{
                        padding: '14px 48px', backgroundColor: '#8C0B14', color: 'white', border: 'none',
                        borderRadius: '8px', fontSize: '18px', fontWeight: '600',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        opacity: isLoading ? 0.7 : 1
                    }}>
                        {isLoading ? 'Searching...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default UserRequest;
