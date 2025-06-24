import React from 'react';
import Navbar from '../components/Navbar';

const ServicesPage = () => {
  const services = [
    {
      icon: '🔐',
      title: 'Secure Storage',
      description: 'Bank-level encryption ensures your certificates are always protected',
      features: ['256-bit AES encryption', 'Secure cloud storage', 'Regular backups']
    },
    {
      icon: '📱',
      title: 'Multi-Device Access',
      description: 'Access your certificates from any device, anywhere in the world',
      features: ['Cross-platform support', 'Real-time sync', 'Offline access']
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find your certificates instantly with powerful search capabilities',
      features: ['Full-text search', 'Smart filters', 'Quick access']
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Track your certificate collection with detailed analytics',
      features: ['Usage statistics', 'Storage insights', 'Activity tracking']
    },
    {
      icon: '🤝',
      title: 'Easy Sharing',
      description: 'Share certificates securely with employers or institutions',
      features: ['Secure links', 'Access control', 'Expiring shares']
    },
    {
      icon: '⚡',
      title: 'Fast Performance',
      description: 'Lightning-fast uploads, downloads, and document processing',
      features: ['Instant uploads', 'Quick previews', 'Optimized delivery']
    }
  ];

  return (
    <div className="services-page">
      <Navbar />
      
      <div className="services-content">
        <div className="services-header">
          <h1>Our Services</h1>
          <p>Comprehensive digital certificate management solutions</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>✓ {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="premium-section">
          <div className="premium-card">
            <h2>Premium Features</h2>
            <p>Unlock advanced capabilities with CredHex Premium</p>
            
            <div className="premium-features">
              <div className="premium-feature">
                <span className="feature-icon">🚀</span>
                <div>
                  <h4>Unlimited Storage</h4>
                  <p>Store unlimited certificates without size restrictions</p>
                </div>
              </div>
              
              <div className="premium-feature">
                <span className="feature-icon">🔒</span>
                <div>
                  <h4>Advanced Security</h4>
                  <p>Two-factor authentication and advanced access controls</p>
                </div>
              </div>
              
              <div className="premium-feature">
                <span className="feature-icon">📈</span>
                <div>
                  <h4>Priority Support</h4>
                  <p>24/7 premium support with dedicated assistance</p>
                </div>
              </div>
            </div>

            <button className="btn-primary large">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;