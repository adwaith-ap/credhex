import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <div className="landing-content">
        <div className="hero-section">
          <div className="logo-container">
            <div className="logo-icon animated-icon">🔐</div>
            <h1 className="logo-title">CredHex</h1>
          </div>
          
          <h2 className="hero-subtitle">Your Digital Certificate Vault</h2>
          <p className="hero-description">
            Securely store, manage, and access your certificates from anywhere. 
            Experience the future of digital document management.
          </p>

          <div className="cta-buttons">
            <Link to="/register" className="btn-primary large">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary large">
              Sign In
            </Link>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Storage</h3>
            <p>Bank-level encryption keeps your certificates safe</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">☁️</div>
            <h3>Cloud Access</h3>
            <p>Access your documents from any device, anywhere</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Reliable</h3>
            <p>Lightning-fast uploads and downloads</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Organization</h3>
            <p>Intelligent categorization and search</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;