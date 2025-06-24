import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LockerPage from './pages/LockerPage';
import ServicesPage from './pages/ServicesPage';
import AccountPage from './pages/AccountPage';
import './styles/global.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/locker" element={
              <ProtectedRoute>
                <LockerPage />
              </ProtectedRoute>
            } />
            <Route path="/services" element={
              <ProtectedRoute>
                <ServicesPage />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;