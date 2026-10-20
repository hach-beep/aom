import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Sparkles, Calendar } from 'lucide-react';

export const TeamView: React.FC = () => {
  const { team, setCurrentPage, setSelectedServiceForBooking } = useSalon();

  const handleBookWithArtisan = (member: { name: string; role: string }) => {
    setSelectedServiceForBooking(`Appointment with ${member.name} (${member.role})`);
    setCurrentPage('home');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <main>
      <section className="page-header" style={{ background: 'var(--blush)', padding: '60px 0' }}>
        <div className="wrap">
          <div className="eyebrow">The Hands Behind the Glow</div>
          <h1>Meet Our Artisans</h1>
          <p className="subtitle">
            Our certified team of beauty professionals is dedicated to bringing your personal vision to life.
          </p>
        </div>
      </section>

      <section className="team-section" style={{ padding: '65px 0' }}>
        <div className="wrap">
          {team.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#fff',
                border: '1px solid var(--blush)',
                borderRadius: '8px',
              }}
            >
              <Sparkles size={36} color="var(--rose)" style={{ marginBottom: '12px' }} />
              <h3 style={{ color: 'var(--wine)' }}>No team members added yet</h3>
              <p style={{ color: '#777' }}>You can add team members via the Salon Control Center (Admin).</p>
            </div>
          ) : (
            <div className="team-grid-page">
              {team.map((emp) => (
                <article key={emp.id} className="team-card">
                  <div className="avatar-container">
                    <svg
                      className="avatar"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        background: '#f8eeed',
                        padding: '24px',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '3px solid #eadbd7',
                      }}
                    >
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="#713b4d"
                      />
                    </svg>
                  </div>
                  <h3>{emp.name}</h3>
                  <div className="role">{emp.role}</div>
                  <p className="bio">{emp.bio}</p>
                  <button
                    onClick={() => handleBookWithArtisan(emp)}
                    style={{
                      marginTop: '20px',
                      background: 'none',
                      border: '1px solid #eadbd7',
                      padding: '8px 16px',
                      borderRadius: '3px',
                      color: 'var(--wine)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--blush)';
                      e.currentTarget.style.borderColor = 'var(--rose)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.borderColor = '#eadbd7';
                    }}
                  >
                    <Calendar size={13} /> Request with {emp.name.split(' ')[0]}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
