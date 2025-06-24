// src/components/CertificateItem.js
import React from 'react';

const CertificateItem = ({ name, url, onDelete }) => {
  return (
    <li style={{ marginBottom: '2rem' }}>
      <h4>{name}</h4>

      {/* 🔍 PDF Viewer */}
      <iframe
        src={url}
        title={name}
        width="100%"
        height="400px"
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          marginBottom: '0.5rem',
        }}
      />

      <div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginRight: '1rem',
            color: '#6c63ff',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}
        >
          Open in new tab
        </a>
        <button
          onClick={() => onDelete(name)}
          style={{
            background: '#ff4d4d',
            border: 'none',
            borderRadius: '5px',
            padding: '0.4rem 0.8rem',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default CertificateItem;
