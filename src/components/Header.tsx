import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Menu, X, Sparkles, Shield, LayoutDashboard } from 'lucide-react';
import { PageView } from '../types';

export const Header: React.FC = () => {
  const { currentPage, setCurrentPage, appointments } = useSalon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;

  const navigateTo = (page: PageView, anchorId?: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header>
      <div className="wrap nav">
        <a
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('home', 'home');
          }}
          href="#home"
        >
          The Bridal Bloom
          <span>Beauty • Grace • Glamour</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="main-nav" aria-label="Main navigation" style={{ display: 'flex' }}>
          <button
            onClick={() => navigateTo('home', 'home')}
            className={currentPage === 'home' ? 'active' : ''}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('services')}
            className={currentPage === 'services' ? 'active' : ''}
          >
            Services &amp; Pricing
          </button>
          <button
            onClick={() => navigateTo('team')}
            className={currentPage === 'team' ? 'active' : ''}
          >
            Our Artisans
          </button>
          <button
            onClick={() => navigateTo('home', 'about')}
          >
            Our Story
          </button>
          <button
            onClick={() => navigateTo('home', 'contact')}
          >
            Contact
          </button>

          {/* Worker Dashboard Link */}
          <button
            onClick={() => navigateTo('worker-dashboard')}
            className={currentPage === 'worker-dashboard' ? 'active' : ''}
            title="Worker Appointment Dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              color: currentPage === 'worker-dashboard' ? 'var(--wine)' : '#333',
            }}
          >
            <LayoutDashboard size={15} color="var(--wine)" />
            Worker Dashboard
            {pendingCount > 0 && (
              <span
                style={{
                  background: '#ea580c',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>

          {/* Employer Control */}
          <button
            onClick={() => navigateTo('admin')}
            className={currentPage === 'admin' ? 'active' : ''}
            title="Website & Price Control Center"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', opacity: 0.85 }}
          >
            <Shield size={14} /> Website Control
          </button>

          <button
            className="btn"
            onClick={() => navigateTo('home', 'contact')}
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <Sparkles size={14} style={{ marginRight: '6px' }} />
            Book a Visit
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--wine)',
            display: 'none',
            cursor: 'pointer',
            padding: '6px',
          }}
          className="mobile-toggle-btn"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--cream)',
            borderBottom: '1px solid #eadbd7',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <button
            style={{ textAlign: 'left', padding: '10px 0', border: 'none', background: 'none', fontSize: '1rem', color: 'var(--wine)', fontWeight: 600 }}
            onClick={() => navigateTo('home', 'home')}
          >
            Home
          </button>
          <button
            style={{ textAlign: 'left', padding: '10px 0', border: 'none', background: 'none', fontSize: '1rem', color: 'var(--wine)', fontWeight: 600 }}
            onClick={() => navigateTo('services')}
          >
            Services &amp; Pricing
          </button>
          <button
            style={{ textAlign: 'left', padding: '10px 0', border: 'none', background: 'none', fontSize: '1rem', color: 'var(--wine)', fontWeight: 600 }}
            onClick={() => navigateTo('team')}
          >
            Meet Our Artisans
          </button>

          <button
            style={{
              textAlign: 'left',
              padding: '10px 0',
              border: 'none',
              background: 'none',
              fontSize: '1rem',
              color: 'var(--wine)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={() => navigateTo('worker-dashboard')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutDashboard size={18} /> Worker Dashboard
            </span>
            {pendingCount > 0 && (
              <span
                style={{
                  background: '#ea580c',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                }}
              >
                {pendingCount} new
              </span>
            )}
          </button>

          <button
            style={{
              textAlign: 'left',
              padding: '10px 0',
              border: 'none',
              background: 'none',
              fontSize: '1rem',
              color: 'var(--wine)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onClick={() => navigateTo('admin')}
          >
            <Shield size={16} /> Website &amp; Price Control
          </button>

          <button
            className="btn"
            style={{ width: '100%', marginTop: '6px' }}
            onClick={() => navigateTo('home', 'contact')}
          >
            Book a Visit
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          nav.main-nav {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
