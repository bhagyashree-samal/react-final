import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { requestPlain, ENV } from '../services/api';
import NsdlLoader from '../components/common/NsdlLoader';

const Login = () => {
    const [username, setUsername] = useState('OPSMISU');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [view, setView] = useState('login'); // 'login' or 'forgot' or 'otp'
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // loginStep: 'idle' | 'confirm' | 'confirmLoading' | 'success'
    const [loginStep, setLoginStep] = useState('idle');
    const [showToast, setShowToast] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();
    const isAuthenticatingRef = React.useRef(false);

    useEffect(() => {
        if (user && !isAuthenticatingRef.current) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        isAuthenticatingRef.current = true;

        const result = await login(username, password);
        setIsLoading(false);

        if (result.success) {
            setLoginStep('confirm');
            setShowToast(true);
        } else {
            isAuthenticatingRef.current = false;
            setError(result.error || 'Password not match. Check credentials.');
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await requestPlain(`${ENV.authBase}/utility/send-forgot-password-otp?userName=${username}`, {});
            setView('otp');
        } catch (err) {
            setError('Failed to send OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const payload = { userName: username, otp: otp };
            await requestPlain(`${ENV.authBase}/verify-otp-send-temporary-password`, payload);
            alert('Temporary password sent to your registered mobile/email.');
            setView('login');
        } catch (err) {
            setError('Invalid OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderLoginForm = () => (
        <>
            {/* Logo for mobile view */}
            <div className="mobile-logo" style={{ marginBottom: '40px', textAlign: 'center', display: 'none' }}>
                <img 
                    src="https://bankpratinidhiuat.nsdlbank.co.in/pictures/assets/nsdl_icon_logo.png" 
                    alt="NSDL Logo" 
                    style={{ height: '50px' }}
                />
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome Back!</h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>Please enter your details</p>

            {error && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <label style={{
                        position: 'absolute',
                        top: '-14px',
                        left: '12px',
                        backgroundColor: 'white',
                        padding: '0 4px',
                        fontSize: '12px',
                        color: '#6b7280'
                    }}>Username*</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            boxSizing: 'border-box',
                            backgroundColor: '#eff6ff'
                        }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <label style={{
                        position: 'absolute',
                        top: '-13px',
                        left: '12px',
                        backgroundColor: 'white',
                        padding: '0 4px',
                        fontSize: '12px',
                        color: '#6b7280'
                    }}>Password*</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                backgroundColor: '#eff6ff'
                            }}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#6b7280'
                            }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ marginRight: '8px' }} />
                        Remember me
                    </label>
                    <button
                        type="button"
                        onClick={() => setView('forgot')}
                        style={{ background: 'none', border: 'none', fontSize: '14px', color: '#111827', fontWeight: '500', cursor: 'pointer' }}
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#8C0B14',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Processing...' : 'Login'}
                </button>
                {isLoading && <NsdlLoader />}
            </form>
        </>
    );

    const renderForgotView = () => (
        <>
            <div className="mobile-logo" style={{ marginBottom: '40px', textAlign: 'center', display: 'none' }}>
                <img 
                    src="https://bankpratinidhiuat.nsdlbank.co.in/pictures/assets/nsdl_icon_logo.png" 
                    alt="NSDL Logo" 
                    style={{ height: '50px' }}
                />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Forgot Password</h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>Enter your username to receive an OTP</p>
            {error && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
            <form onSubmit={handleSendOTP}>
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                    <label style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '12px',
                        backgroundColor: 'white',
                        padding: '0 4px',
                        fontSize: '12px',
                        color: '#6b7280'
                    }}>Username*</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#8C0B14',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        marginBottom: '16px'
                    }}
                >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
                <button
                    type="button"
                    onClick={() => setView('login')}
                    style={{ width: '100%', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                >
                    Back to Login
                </button>
            </form>
        </>
    );

    const renderOtpView = () => (
        <>
            <div className="mobile-logo" style={{ marginBottom: '40px', textAlign: 'center', display: 'none' }}>
                <img 
                    src="https://bankpratinidhiuat.nsdlbank.co.in/pictures/assets/nsdl_icon_logo.png" 
                    alt="NSDL Logo" 
                    style={{ height: '50px' }}
                />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Verify OTP</h1>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>Enter the 6-digit OTP sent to you</p>
            {error && <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
            <form onSubmit={handleVerifyOTP}>
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                    <label style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '12px',
                        backgroundColor: 'white',
                        padding: '0 4px',
                        fontSize: '12px',
                        color: '#6b7280'
                    }}>OTP*</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            boxSizing: 'border-box',
                            textAlign: 'center',
                            letterSpacing: '8px'
                        }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#8C0B14',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        marginBottom: '16px'
                    }}
                >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                    type="button"
                    onClick={() => setView('forgot')}
                    style={{ width: '100%', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                >
                    Resend OTP
                </button>
            </form>
        </>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: 'white' }}>
            <style>
                {`
                @media (max-width: 900px) {
                    .left-section {
                        display: none !important;
                    }
                    .right-section {
                        padding: 40px !important;
                        align-items: center !important;
                    }
                    .mobile-logo {
                        display: block !important;
                    }
                    .login-container {
                        max-width: 100% !important;
                    }
                }
                `}
            </style>
            {/* Left Section */}
            <div className="left-section" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#8C0B14',
    fontWeight: 'bold',
    fontSize: '28px',
    marginBottom: '20px'
  }}
>
  <img
    src="https://bankpratinidhiuat.nsdlbank.co.in/pictures/assets/nsdl_icon_logo.png"
    alt="NSDL Logo"
    style={{ width: '35px', height: '35px', objectFit: 'contain' }}
  />
  NSDL Payments Bank
</div>
                    <div
                        style={{
                            width: '320px',
                            height: '320px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                        }}
                    >
                        <img
                            src="https://bankpratinidhiuat.nsdlbank.co.in/pictures/assets/nsdl_watermark.png"
                            alt="NSDL Watermark"
                            style={{ maxWidth: '100%', maxHeight: '100%', opacity: 2.0 }}
                        />
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="right-section" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '80px'
            }}>
                <div className="login-container" style={{ width: '100%', maxWidth: '400px' }}>
                    {view === 'login' && renderLoginForm()}
                    {view === 'forgot' && renderForgotView()}
                    {view === 'otp' && renderOtpView()}
                </div>
            </div>

            {/* ── Login Step Modals ── */}
            {(loginStep === 'confirm' || loginStep === 'confirmLoading' || loginStep === 'success') && (
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
                            <span style={{ fontWeight: '500', fontSize: '15px' }}>Login Successful!!</span>
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

                    {/* Spinner while processing confirm */}
                    {loginStep === 'confirmLoading' && <NsdlLoader />}

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

                            {/* Confirm step */}
                            {(loginStep === 'confirm' || loginStep === 'confirmLoading') && (
                                <>
                                    <p style={{ fontSize: '20px', fontWeight: '500', marginBottom: '24px', color: '#374151' }}>
                                        Congratulations!!! Login Successfull
                                    </p>
                                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                        <button
                                            disabled={loginStep === 'confirmLoading'}
                                            onClick={() => {
                                                setLoginStep('confirmLoading');
                                                setTimeout(() => {
                                                    setShowToast(false);
                                                    setLoginStep('idle');
                                                    navigate('/dashboard');
                                                }, 800);
                                            }}
                                            style={{
                                                padding: '10px 32px',
                                                backgroundColor: '#8C0B14',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontWeight: 'bold',
                                                cursor: loginStep === 'confirmLoading' ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            OK
                                        </button>
                                        <button
                                            disabled={loginStep === 'confirmLoading'}
                                            onClick={() => { setShowToast(false); setLoginStep('idle'); }}
                                            style={{
                                                padding: '10px 32px',
                                                backgroundColor: 'white',
                                                color: '#8C0B14',
                                                border: '1px solid #8C0B14',
                                                borderRadius: '6px',
                                                fontWeight: 'bold',
                                                cursor: loginStep === 'confirmLoading' ? 'not-allowed' : 'pointer'
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
            )}
        </div>
    );
};

export default Login;
