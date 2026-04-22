import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import WalletAdjustment from './pages/WalletAdjustment';
import CreateCBCUser from './pages/CreateCBCUser';
import Dashboard from './pages/Dashboard';
import UserRequest from './pages/UserRequest';
import AuditTrail from './pages/AuditTrail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="wallet-adjustment" element={<WalletAdjustment />} />
            
            <Route path="user-management">
              <Route path="create-cbc" element={<CreateCBCUser />} />
              <Route path="user-request" element={<UserRequest />} />
            </Route>

            <Route path="audit" element={<AuditTrail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
