import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const AccountPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      alert('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Error updating password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== 'DELETE') {
      alert('Account deletion cancelled');
      return;
    }

    try {
      // First delete all user files
      const { data: files } = await supabase.storage
        .from('certificates')
        .list(`${user.id}/`);

      if (files && files.length > 0) {
        const filePaths = files.map(file => `${user.id}/${file.name}`);
        await supabase.storage
          .from('certificates')
          .remove(filePaths);
      }

      // Note: Supabase doesn't provide direct user deletion from client
      // In a real app, you'd call a server function to handle this
      alert('Account deletion requested. Please contact support to complete the process.');
    } catch (error) {
      alert('Error deleting account: ' + error.message);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'storage', label: 'Storage', icon: '💾' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' }
  ];

  return (
    <div className="account-page">
      <Navbar />
      
      <div className="account-content">
        <div className="account-header">
          <h1>Account Settings</h1>
          <p>Manage your CredHex account preferences</p>
        </div>

        <div className="account-layout">
          <div className="account-sidebar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="account-main">
            {activeTab === 'profile' && (
              <div className="tab-content">
                <h2>Profile Information</h2>
                <div className="profile-section">
                  <div className="profile-avatar">
                    <div className="avatar-circle">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="info-item">
                      <label>Email Address</label>
                      <p>{user?.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Account Created</label>
                      <p>{new Date(user?.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="info-item">
                      <label>Account Status</label>
                      <span className="status-badge active">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tab-content">
                <h2>Security Settings</h2>
                <div className="security-section">
                  <h3>Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="password-form">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value
                        })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value
                        })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value
                        })}
                        className="form-input"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="tab-content">
                <h2>Storage Usage</h2>
                <div className="storage-section">
                  <div className="storage-card">
                    <div className="storage-icon">💾</div>
                    <div className="storage-info">
                      <h3>Current Plan: Free</h3>
                      <p>1 GB storage limit</p>
                      <div className="storage-bar">
                        <div className="storage-used" style={{width: '25%'}}></div>
                      </div>
                      <p className="storage-text">250 MB used of 1 GB</p>
                    </div>
                  </div>
                  <button className="btn-primary">Upgrade Storage</button>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="tab-content">
                <h2>Danger Zone</h2>
                <div className="danger-section">
                  <div className="danger-card">
                    <h3>Delete Account</h3>
                    <p>
                      Permanently delete your CredHex account and all associated data. 
                      This action cannot be undone.
                    </p>
                    <button 
                      className="btn-danger"
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;