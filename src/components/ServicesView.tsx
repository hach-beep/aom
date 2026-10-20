import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Search, Sparkles, Filter } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, setSelectedServiceForBooking, setCurrentPage } = useSalon();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category || 'General')))];

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || (s.category || 'General') === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReserve = (serviceName: string, servicePrice: string) => {
    setSelectedServiceForBooking(`${serviceName} (${servicePrice})`);
    setCurrentPage('home');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <main>
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">Indulge in Excellence</div>
          <h1>Menu &amp; Pricing</h1>
          <p className="subtitle">
            Explore our premium selection of luxury salon services tailored meticulously around your schedule and special event requirements.
          </p>

          {/* Search & Filter Bar */}
          <div
            style={{
              maxWidth: '650px',
              margin: '30px auto 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  color: 'var(--muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Search services (e.g. Bridal, Hair styling, Facial)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '30px',
                  border: '1px solid #dfceca',
                  background: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            {categories.length > 2 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Filter size={13} /> Filter:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      border: '1px solid',
                      cursor: 'pointer',
                      background: selectedCategory === cat ? 'var(--wine)' : '#fff',
                      color: selectedCategory === cat ? '#fff' : 'var(--wine)',
                      borderColor: selectedCategory === cat ? 'var(--wine)' : '#eadbd7',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="services-section" style={{ padding: '75px 0' }}>
        <div className="wrap">
          {filteredServices.length === 0 ? (
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
              <h3 style={{ color: 'var(--wine)', marginBottom: '8px' }}>No services found</h3>
              <p style={{ color: '#777', maxWidth: '400px', margin: '0 auto 20px' }}>
                {searchTerm
                  ? `No service matches "${searchTerm}". Try another search term.`
                  : 'No services published yet in this category.'}
              </p>
              {searchTerm && (
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="services-grid-page">
              {filteredServices.map((service) => (
                <article key={service.id} className="price-card">
                  <div>
                    <div className="price-card-header">
                      <div>
                        <h3>{service.name}</h3>
                        {service.category && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              color: 'var(--gold)',
                              fontWeight: 600,
                              display: 'block',
                              marginTop: '4px',
                            }}
                          >
                            {service.category}
                          </span>
                        )}
                      </div>
                      <span className="price-badge">{service.price}</span>
                    </div>
                    <p className="description">{service.description}</p>
                  </div>

                  <button
                    onClick={() => handleReserve(service.name, service.price)}
                    className="book-link"
                  >
                    Reserve Service ➔
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
