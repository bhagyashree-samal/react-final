import React, { useState } from 'react';
import NsdlLoader from '../common/NsdlLoader';

/* ── Logout Modal ── */
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    // step: 'confirm' | 'loading' | 'success'
    const [step, setStep] = useState('confirm');
    const [showToast, setShowToast] = useState(false);

    if (!isOpen) return null;

    const handleYes = () => {
        setStep('loading');
        setTimeout(() => {
            setStep('success');
            setShowToast(true);
        }, 1400);
    };

    const handleSuccessOk = () => {
        setShowToast(false);
        setStep('confirm');
        onConfirm();
    };

    const handleSuccessNo = () => {
        setShowToast(false);
        setStep('confirm');
        onClose();
    };

    return (
        <>
            {/* Top Right Toast Notification */}
            {showToast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    zIndex: 4000
                }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </span>
                    <span style={{ fontWeight: '500', fontSize: '15px' }}>Logout Successful!!</span>
                    <button
                        onClick={() => setShowToast(false)}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: '#374151',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }}
                    >
                        Close
                    </button>
                </div>
            )}

            {/* Loader overlay */}
            {step === 'loading' && <NsdlLoader />}

            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '450px',
                    textAlign: 'center',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                }}>

                    {/* ── Confirm step ── */}
                    {(step === 'confirm' || step === 'loading') && (
                        <>
                            <h2 style={{ fontSize: '24px', color: '#374151', marginBottom: '32px' }}>
                                Are you sure want to Logout?
                            </h2>
                            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                <button
                                    onClick={handleYes}
                                    disabled={step === 'loading'}
                                    style={{
                                        padding: '12px 40px',
                                        backgroundColor: '#8C0B14',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        cursor: step === 'loading' ? 'not-allowed' : 'pointer',
                                        minWidth: '120px'
                                    }}
                                >
                                    YES
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={step === 'loading'}
                                    style={{
                                        padding: '12px 40px',
                                        backgroundColor: 'white',
                                        color: '#8C0B14',
                                        border: '1px solid #8C0B14',
                                        borderRadius: '8px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        cursor: step === 'loading' ? 'not-allowed' : 'pointer',
                                        minWidth: '120px'
                                    }}
                                >
                                    NO
                                </button>
                            </div>
                        </>
                    )}

                    {/* ── Success step ── */}
                    {step === 'success' && (
                        <>
                            <p style={{
                                fontSize: '20px', fontWeight: '500',
                                marginBottom: '24px', color: '#374151'
                            }}>
                                Congratulations!!! Logout Successfully
                            </p>
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                <button
                                    onClick={handleSuccessOk}
                                    style={{
                                        padding: '10px 32px',
                                        backgroundColor: '#8C0B14',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    OK
                                </button>
                                <button
                                    onClick={handleSuccessNo}
                                    style={{
                                        padding: '10px 32px',
                                        backgroundColor: 'white',
                                        color: '#8C0B14',
                                        border: '1px solid #8C0B14',
                                        borderRadius: '6px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    NO
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </>
    );
};

export default LogoutModal;
