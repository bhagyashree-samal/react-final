import React from 'react';
import { Landmark, ShieldCheck, Zap } from 'lucide-react';

const Dashboard = () => {
    return (
        <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'white', 
            padding: '40px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                // backgroundImage: 'url("https://bankpratinidhiuat.nsdlbank.co.in/pictures/assets/nsdl_icon_logo.png")',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                opacity: 0.5,
                pointerEvents: 'none',
                zIndex: 0
            }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h1 style={{ 
                    fontSize: '72px', 
                    fontWeight: '800', 
                    color: '#000000', 
                    marginBottom: '8px',
                    letterSpacing: '-0.02em'
                }}>
                    Welcome to NSDL
                </h1>
                
                <p style={{ 
                    fontSize: '42px', 
                    color: '#000000', 
                    fontWeight: '700',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    Banking made easy - Just in a jiffy
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
