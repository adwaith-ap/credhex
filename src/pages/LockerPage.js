import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CertificateCard from '../components/CertificateCard';
import UploadModal from '../components/UploadModal';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const LockerPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  useEffect(() => {
    filterAndSortCertificates();
  }, [certificates, searchTerm, sortBy]);

  const fetchCertificates = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: files, error } = await supabase.storage
        .from('certificates')
        .list(`${user.id}/`, { limit: 100 });

      if (error) throw error;

      const certificatesWithUrls = files.map(file => ({
        ...file,
        path: `${user.id}/${file.name}`,
        url: `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/certificates/${user.id}/${file.name}`
      }));

      setCertificates(certificatesWithUrls);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCertificates = () => {
    let filtered = certificates.filter(cert =>
      cert.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return (b.metadata?.size || 0) - (a.metadata?.size || 0);
        case 'date':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilteredCertificates(filtered);
  };

  const handleDelete = async (certificate) => {
    if (!window.confirm(`Are you sure you want to delete "${certificate.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase.storage
        .from('certificates')
        .remove([certificate.path]);

      if (error) throw error;

      setCertificates(prev => prev.filter(cert => cert.name !== certificate.name));
      alert('Certificate deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete certificate');
    }
  };

  const handleUpdate = async (certificate, updates) => {
    // For now, we'll just handle renaming by re-uploading with new name
    // In a real app, you might want to implement proper renaming
    console.log('Update requested:', certificate, updates);
    alert('Rename functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="locker-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Loading your certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="locker-page">
      <Navbar />
      
      <div className="locker-content">
        <div className="locker-header">
          <h1>Certificate Locker</h1>
          <p>Manage and organize your digital certificates</p>
        </div>

        <div className="locker-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
            </select>
          </div>

          <button
            className="btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <span className="btn-icon">⬆️</span>
            Upload
          </button>
        </div>

        <div className="certificates-grid">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.name}
                certificate={certificate}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔒</div>
              <h3>
                {searchTerm ? 'No certificates found' : 'Your locker is empty'}
              </h3>
              <p>
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Upload your first certificate to get started'
                }
              </p>
              {!searchTerm && (
                <button
                  className="btn-primary"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  Upload Certificate
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={fetchCertificates}
      />
    </div>
  );
};

export default LockerPage;