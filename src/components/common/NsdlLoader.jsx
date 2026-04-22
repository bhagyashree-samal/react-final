import React from 'react';

const NsdlLoader = () => (
    <div style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 3000
    }}>
        <div style={{ position: 'relative', width: '110px', height: '110px' }}>
            {/* Outer spinning arc */}
            <div style={{
                position: 'absolute', inset: 0,
                border: '5px solid transparent',
                borderTopColor: '#8C0B14',
                borderRightColor: '#8C0B14',
                borderRadius: '50%',
                animation: 'nsdlSpin 1s linear infinite'
            }} />
            {/* Inner counter-spinning arc */}
            <div style={{
                position: 'absolute', inset: '18px',
                border: '4px solid transparent',
                borderBottomColor: '#8C0B14',
                borderLeftColor: '#8C0B14',
                borderRadius: '50%',
                animation: 'nsdlSpin 0.75s linear infinite reverse'
            }} />
            {/* Center diagonal slash */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{
                    width: '3px', height: '55px',
                    background: 'linear-gradient(to bottom, transparent, #8C0B14, transparent)',
                    borderRadius: '4px',
                    transform: 'rotate(40deg)'
                }} />
            </div>
        </div>

        <style>{`
            @keyframes nsdlSpin {
                0%   { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

export default NsdlLoader;
