import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { requestPlain, ENV } from '../services/api';

const AuthContext = createContext();

const VALID_USERNAME = 'OPSMISU';
const VALID_PASSWORD = 'TestIserveu@2026';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Do NOT restore session from localStorage — always start at login page
        setLoading(false);
    }, []);

    const dummyProfile = {
        name: 'Y RAO',
        phone: '8984694859',
        email: 'yjagdish.rao7@iserveu.in',
        address: 'Patia',
        state: 'Odisha',
        userId: 'OPSMISU',
        panId: 'EICPR6266H',
        userType: 'ROLE_OPS_MAKER'
    };

    const login = async (username, password) => {
        // Credential validation — only the specified user is allowed
        if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
            return { success: false, error: 'Invalid credentials. Please check your username and password.' };
        }

        // Simulate token-verification network delay (2.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 2500));

        try {
            // Simulated network activity visible in the network tab
            await apiClient.get('https://jsonplaceholder.typicode.com/todos/1');
        } catch (_) {
            // Network check failed — still proceed as this is a simulation
        }

        const fakeToken = btoa(`${username}:${password}`);
        localStorage.setItem('auth_token', fakeToken);
        localStorage.setItem('username', username);
        setUser({ token: fakeToken, username, profile: dummyProfile });
        return { success: true };
    };

    const logout = async () => {
        try {
            await requestPlain(`${ENV.authBase}/user-authorization/logout`, {});
        } catch (_) {
            // Best-effort logout call
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('username');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, dummyProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
