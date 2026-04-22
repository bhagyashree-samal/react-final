import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { requestPlain, ENV } from '../../services/api';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('form'); // 'form' | 'otp' | 'success'
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [otp, setOtp] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const username = localStorage.getItem('username') || 'OPSMISU';

    if (!isOpen) return null;

    const toggleVis = (field) => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));

    const handleSendOtp = async () => {
        if (!passwords.old || !passwords.new || !passwords.confirm) {
            setError('Please fill all password fields.');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setError('New password and confirm password do not match.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await requestPlain(`${ENV.authBase}/user-mgmt/send-first-login-otp`, {
                userName: username,
                mobileNumber: mobileNumber || undefined,
            });
            setStep('otp');
        } catch (err) {
            // OTP request might succeed server-side even if response seems like error
            setError(`OTP request failed: ${err?.response?.data?.message || err.message}. Try entering the OTP you receive anyway.`);
            setStep('otp');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!otp) { setError('Please enter the OTP.'); return; }
        setIsLoading(true);
        setError('');
        try {
            await requestPlain(
                `${ENV.authBase}/user-mgmt/change-password-on-first-login-with-otp`,
                {
                    userName: username,
                    otp: otp,
                    password: passwords.new,
                    confirmPassword: passwords.confirm,
                },
                { method: 'PUT' }
            );
            setStep('success');
        } catch (err) {
            setError(`Password change failed: ${err?.response?.data?.message || err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep('form');
        setPasswords({ old: '', new: '', confirm: '' });
        setOtp('');
        setError('');
        onClose();
    };

    const inputStyle = {
        width: '100%', padding: '14px', border: '1px solid #d1d5db',
        borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box',
    };

    const PasswordField = ({ label, field }) => (
        <div style={{ position: 'relative' }}>
            <input
                type={showPasswords[field] ? 'text' : 'password'}
                placeholder={label}
                value={passwords[field]}
                onChange={e => setPasswords({ ...passwords, [field]: e.target.value })}
                style={inputStyle}
            />
            <button type="button" onClick={() => toggleVis(field)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                {showPasswords[field] ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>

                {step === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h2 style={{ color: '#16a34a', marginBottom: '8px' }}>Password Changed!</h2>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your password has been updated successfully.</p>
                        <button onClick={handleClose} style={{ padding: '12px 32px', backgroundColor: '#8C0B14', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Close
                        </button>
                    </div>
                ) : step === 'otp' ? (
                    <>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#374151', textAlign: 'center', marginBottom: '8px' }}>Enter OTP</h2>
                        <p style={{ color: '#4b5563', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
                            An OTP has been sent to your registered mobile/email.
                        </p>
                        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px', backgroundColor: '#fef2f2', padding: '8px', borderRadius: '6px' }}>{error}</p>}
                        <input
                            type="text"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            maxLength={6}
                            style={{ ...inputStyle, textAlign: 'center', letterSpacing: '8px', marginBottom: '20px' }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => { setStep('form'); setError(''); }} style={{ flex: 1, padding: '14px', backgroundColor: 'white', color: '#8C0B14', border: '1px solid #8C0B14', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Back</button>
                            <button onClick={handleChangePassword} disabled={isLoading} style={{ flex: 1, padding: '14px', backgroundColor: '#8C0B14', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                                {isLoading ? 'Updating...' : 'Change Password'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#374151', textAlign: 'center', margin: 0 }}>Change Password</h2>
                        <p style={{ color: '#4b5563', textAlign: 'center', margin: '12px 0 24px 0', fontSize: '15px' }}>Enter your old and new password</p>

                        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px', backgroundColor: '#fef2f2', padding: '8px', borderRadius: '6px' }}>{error}</p>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                            <PasswordField label="Old Password*" field="old" />
                            <PasswordField label="New Password*" field="new" />
                            <PasswordField label="Confirm Password*" field="confirm" />
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Registered Mobile (optional)"
                                    value={mobileNumber}
                                    onChange={e => setMobileNumber(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleClose} style={{ flex: 1, padding: '14px', backgroundColor: 'white', color: '#8C0B14', border: '1px solid #8C0B14', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSendOtp} disabled={isLoading} style={{ flex: 1, padding: '14px', backgroundColor: '#8C0B14', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordModal;
