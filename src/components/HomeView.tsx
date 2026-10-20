import React, { useState, useEffect } from 'react';
import { useSalon } from '../context/SalonContext';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { services, setCurrentPage, selectedServiceForBooking, setSelectedServiceForBooking, bookAppointment } = useSalon();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: selectedServiceForBooking || '',
    date: '',
    time: '11:00 AM',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedServiceForBooking) {
      setFormData((prev) => ({ ...prev, service: selectedServiceForBooking }));
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedServiceForBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.service) return;

    setSubmitting(true);
    try {
      // Save directly to Firebase Firestore - this triggers the confirmation modal automatically
      await bookAppointment({
        name: formData.name,
        phone: formData.phone,
        service: formData.service,
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time,
        notes: formData.message,
        bookedBy: 'customer',
      });

      // Clear form inputs
      setFormData({
        name: '',
        phone: '',
        service: '',
        date: '',
        time: '11:00 AM',
        message: '',
      });
    } catch (err) {
      console.error('Error booking appointment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Your beauty, beautifully celebrated</div>
            <h1>
              Every look tells<br />a <em>love story.</em>
            </h1>
            <p>
              From your bridal glow to your everyday refresh, discover thoughtful beauty and grooming services designed to help you feel your very best.
            </p>

            <div className="hero-actions">
              <a
                className="btn"
                href="#contact"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Your Appointment
              </a>
              <div className="hero-sub-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setCurrentPage('services')}
                  style={{ flex: 1, textAlign: 'center', whiteSpace: 'nowrap', padding: '12px 8px' }}
                >
                  Explore Services &amp; Prices
                </button>
                <button
                  className="btn"
                  onClick={() => setCurrentPage('team')}
                  style={{ flex: 1, textAlign: 'center', whiteSpace: 'nowrap', padding: '12px 8px' }}
                >
                  Meet Our Artisans
                </button>
              </div>
            </div>
          </div>

          <div className="hero-art" aria-label="Elegant blush and rose salon-inspired artwork">
            <div className="portrait"></div>
            <div className="flower one">✿</div>
            <div className="flower two">✿</div>
            <div className="float-card">A little luxury, just for you ✧</div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section id="services-overview">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">A little something for everyone</div>
            <h2>Beauty that feels like you</h2>
            <p>Choose your moment. We’ll help you get ready with care, attention and a personal touch.</p>
          </div>

          <div className="services-overview-grid">
            <article className="service-card">
              <div className="service-icon">✧</div>
              <h3>Bridal Studio</h3>
              <p>Bridal makeup, hair styling and special-event looks planned around your outfit, occasion and personal style.</p>
              <button
                className="book-link"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSelectedServiceForBooking('Bridal Studio Consultation');
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Bridal Consultation ➔
              </button>
            </article>

            <article className="service-card">
              <div className="service-icon">❀</div>
              <h3>Hair &amp; Makeup</h3>
              <p>Fresh cuts, styling, blow-dries and makeup for celebrations, evenings out or a little everyday confidence.</p>
              <button
                className="book-link"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSelectedServiceForBooking('Celebration Hair & Makeup');
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Hair &amp; Makeup ➔
              </button>
            </article>

            <article className="service-card">
              <div className="service-icon">✦</div>
              <h3>Skin &amp; Self-Care</h3>
              <p>Relaxing facial and beauty-care options to make time for yourself and leave feeling refreshed.</p>
              <button
                className="book-link"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSelectedServiceForBooking('Skin & Self-Care Facial');
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Facial &amp; Skin Care ➔
              </button>
            </article>

            <article className="service-card">
              <div className="service-icon">◇</div>
              <h3>Women's Salon</h3>
              <p>Personal grooming and beauty services in a welcoming, comfortable salon environment.</p>
              <button
                className="book-link"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSelectedServiceForBooking("Women's Salon Grooming");
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Salon Treatment ➔
              </button>
            </article>

            <article className="service-card">
              <div className="service-icon">✂</div>
              <h3>Men's Grooming</h3>
              <p>Neat haircuts, beard grooming and occasion-ready finishing for a polished look.</p>
              <button
                className="book-link"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSelectedServiceForBooking("Men's Occasion Grooming");
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Grooming Session ➔
              </button>
            </article>

            <article className="service-card">
              <div className="service-icon">♡</div>
              <h3>Event Packages</h3>
              <p>Custom beauty packages for engagements, weddings, family celebrations and other special days.</p>
              <button
                className="book-link"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  setSelectedServiceForBooking('Wedding Event Package');
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Customize Event Package ➔
              </button>
            </article>
          </div>

          <div style={{ textAlign: 'center', marginTop: '45px' }}>
            <button
              className="btn btn-outline"
              onClick={() => setCurrentPage('services')}
              style={{ padding: '14px 28px', fontSize: '1rem' }}
            >
              View Full Menu &amp; Live Pricing <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="wrap about-grid">
          <div className="about-art">
            <strong>
              Bloom into<br />your best self.
            </strong>
          </div>
          <div className="about-copy">
            <div className="eyebrow">Welcome to The Bridal Bloom</div>
            <h2>
              Feel cared for.<br />Leave glowing.
            </h2>
            <p>
              We believe beauty is personal. The Bridal Bloom is imagined as a warm, elegant space where every guest can relax, feel listened to and enjoy a look that suits them.
            </p>
            <p>
              Whether you're preparing for your wedding or simply taking a moment for yourself, our goal is to make your visit feel special from start to finish.
            </p>
            <div className="features-tags">
              <span>♡ Personal attention</span>
              <span>✧ Occasion-ready looks</span>
              <span>◇ Welcoming atmosphere</span>
            </div>
            <a
              className="btn"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Let's Plan Your Look
            </a>
          </div>
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section className="booking-banner">
        <div className="wrap">
          <div className="eyebrow">Your special moment starts here</div>
          <h2>Ready to bloom?</h2>
          <p>Tell us what you're planning and the service you're interested in. We’ll help you take the next step toward your look.</p>
          <a
            className="btn"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Request an Appointment
          </a>
        </div>
      </section>

      {/* Contact & Booking Form */}
      <section className="contact" id="contact">
        <div className="wrap contact-grid">
          <div>
            <div className="eyebrow">Get in touch</div>
            <h2>Let's make it beautiful.</h2>
            <p>Have a wedding date coming up or want to ask about our salon services? Send us your details and we can follow up.</p>

            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={20} color="var(--wine)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--wine)' }}>Location:</strong>
                  <p style={{ margin: '2px 0 0', color: 'var(--ink)' }}>
                    F-7 / Bahria Town, Islamabad &amp; Rawalpindi, Pakistan
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Phone size={20} color="var(--wine)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--wine)' }}>Phone / WhatsApp:</strong>
                  <p style={{ margin: '2px 0 0', color: 'var(--ink)' }}>
                    +92 (300) 555-BLOOM / 051-285-BLOOM
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Clock size={20} color="var(--wine)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--wine)' }}>Opening Hours:</strong>
                  <p style={{ margin: '2px 0 0', color: 'var(--ink)' }}>
                    Monday – Sunday: 10:00 AM – 8:00 PM (By Appointment &amp; Walk-ins)
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px', padding: '18px', background: 'var(--blush)', borderRadius: '4px', borderLeft: '4px solid var(--wine)' }}>
              <strong style={{ color: 'var(--wine)', fontSize: '0.95rem' }}>Instant Real-time Confirmation:</strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#66545a' }}>
                When you submit, your reservation is logged in our cloud booking system, and a confirmation card with your booking details will appear immediately.
              </p>
            </div>
          </div>

          <form className="contact-card" id="bookingForm" onSubmit={handleSubmit}>
            <h3 style={{ color: 'var(--wine)', fontSize: '1.6rem', margin: 0 }}>Appointment request</h3>
            <p className="small-text">Fill in the details to reserve your salon session.</p>

            <label htmlFor="name">Your name *</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Fatima Zahra"
              required
            />

            <label htmlFor="phone">Phone number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +92 300 1234567"
              required
            />

            <label htmlFor="service">Service of interest *</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              required
            >
              <option value="">Choose a service</option>
              <optgroup label="Published Menu Services">
                {services.map((s) => (
                  <option key={s.id} value={`${s.name} (${s.price})`}>
                    {s.name} — {s.price}
                  </option>
                ))}
              </optgroup>
              <optgroup label="General Categories">
                <option value="Bridal makeup & Styling">Bridal makeup &amp; Styling</option>
                <option value="Party Hair & Makeup">Party Hair &amp; Makeup</option>
                <option value="Skin & Facial Therapy">Skin &amp; Facial Therapy</option>
                <option value="Women's Salon Service">Women's Salon Service</option>
                <option value="Men's Grooming Session">Men's Grooming Session</option>
                <option value="Custom Event Package">Custom Event Package</option>
              </optgroup>
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
              <div>
                <label htmlFor="date">Preferred date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="time">Time slot</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                </select>
              </div>
            </div>

            <label htmlFor="message">Anything we should know?</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Wedding date, bridal outfit color, allergy information, or questions"
            ></textarea>

            <button
              className="btn"
              type="submit"
              disabled={submitting}
              style={{ marginTop: '16px', width: '100%', fontSize: '1rem' }}
            >
              {submitting ? 'Connecting to Cloud...' : 'Confirm & Request Appointment'}
            </button>

            <p className="small-text" style={{ marginTop: '10px', textAlign: 'center' }}>
              ✦ Instant confirmation card appears immediately upon submission.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};
