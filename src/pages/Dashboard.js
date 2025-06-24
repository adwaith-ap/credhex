import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCertificates: 0,
    totalSize: 0,
    recentUploads: 0
  });
  const [recentCertificates, setRecentCertificates] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const { data: files, error } = await supabase.storage
        .from('certificates')
        .list(`${user.id}/`, { limit: 100 });

      if (error) throw error;

      const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      const recentFiles = files
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(file => ({
          ...file,
          url: `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/certificates/${user.id}/${file.name}`
        }));

      setStats({
        totalCertificates: files.length,
        totalSize,
        recentUploads: files.filter(file => {
          const uploadDate = new Date(file.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return uploadDate > weekAgo;
        }).length
      });

      setRecentCertificates(recentFiles);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your certificate overview.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <h3>{stats.totalCertificates}</h3>
              <p>Total Certificates</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💾</div>
            <div className="stat-info">
              <h3>{formatFileSize(stats.totalSize)}</h3>
              <p>Storage Used</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>{stats.recentUploads}</h3>
              <p>Recent Uploads</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <button 
            className="btn-primary large"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <span className="btn-icon">⬆️</span>
            Upload Certificate
          </button>
        </div>

        <div className="recent-section">
          <h2>Recent Certificates</h2>
          {recentCertificates.length > 0 ? (
            <div className="recent-grid">
              {recentCertificates.map((cert) => (
                <div key={cert.name} className="recent-card">
                  <div className="recent-icon">📄</div>
                  <div className="recent-info">
                    <h4>{cert.name}</h4>
                    <p>{new Date(cert.created_at).toLocaleDateString()}</p>
                  </div>
                  <button 
                    className="view-btn"
                    onClick={() => window.open(cert.url, '_blank')}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No certificates yet</h3>
              <p>Upload your first certificate to get started</p>
            </div>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;