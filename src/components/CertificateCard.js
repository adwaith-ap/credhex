import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const CertificateCard = ({ certificate, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(certificate.name);

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('certificates')
        .download(certificate.path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = certificate.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download certificate');
    }
  };

  const handleRename = async () => {
    if (newName.trim() && newName !== certificate.name) {
      await onUpdate(certificate, { name: newName.trim() });
    }
    setIsRenaming(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="certificate-card">
      <div className="card-header">
        <div className="file-icon">📄</div>
        <div className="file-info">
          {isRenaming ? (
            <div className="rename-input">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                autoFocus
              />
            </div>
          ) : (
            <h3 className="file-name" onClick={() => setIsRenaming(true)}>
              {certificate.name}
            </h3>
          )}
          <div className="file-meta">
            <span className="file-size">{formatFileSize(certificate.metadata?.size || 0)}</span>
            <span className="file-date">{formatDate(certificate.created_at)}</span>
          </div>
        </div>
        <button 
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="card-content">
          <div className="pdf-preview">
            <iframe
              src={certificate.url}
              title={certificate.name}
              className="pdf-viewer"
            />
          </div>
          
          <div className="card-actions">
            <button onClick={handleDownload} className="action-btn download">
              <span className="btn-icon">⬇️</span>
              Download
            </button>
            <button 
              onClick={() => window.open(certificate.url, '_blank')} 
              className="action-btn view"
            >
              <span className="btn-icon">👁️</span>
              View
            </button>
            <button 
              onClick={() => setIsRenaming(true)} 
              className="action-btn rename"
            >
              <span className="btn-icon">✏️</span>
              Rename
            </button>
            <button 
              onClick={() => onDelete(certificate)} 
              className="action-btn delete"
            >
              <span className="btn-icon">🗑️</span>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateCard;