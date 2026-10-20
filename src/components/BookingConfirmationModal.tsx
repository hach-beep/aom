import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { CheckCircle2, X, Calendar, Clock, Phone, Sparkles, MessageSquare, Copy, Check } from 'lucide-react';

export const BookingConfirmationModal: React.FC = () => {
  const { lastConfirmedBooking, showConfirmationModal, setShowConfirmationModal } = useSalon();
  const [copied, setCopied] = useState(false);

  if (!showConfirmationModal || !lastConfirmedBooking) {
    return null;
  }

  const booking = lastConfirmedBooking;

  const handleCopyDetails = async () => {
    const text = [
      'The Bridal Bloom - Appointment Confirmation',
      `Booking ID: ${booking.id}`,
      `Guest Name: ${booking.name}`,
      `Contact: ${booking.phone}`,
      `Service: ${booking.service}`,
      `Preferred Date: ${booking.date}`,
      `Preferred Time: ${booking.time || 'Morning/Flexible'}`,
      `Status: ${booking.status}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hello The Bridal Bloom! I submitted an appointment request.\nReference ID: ${booking.id}\nName: ${booking.name}\nService: ${booking.service}\nDate: ${booking.date}\nPhone: ${booking.phone}`
    );
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(48, 36, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        padding: '20px',
      }}
      onClick={() => setShowConfirmationModal(false)}
    >
      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--rose)',
          borderRadius: '8px',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          animation: 'modalFadeIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--wine), #542a39)',
            color: 'white',
            padding: '28px 24px 24px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <button
            onClick={() => setShowConfirmationModal(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            <CheckCircle2 size={36} color="#f8eeed" />
          </div>

          <div className="eyebrow" style={{ color: 'var(--gold)', letterSpacing: '2px' }}>
            Request Received
          </div>
          <h2 style={{ color: 'white', fontSize: '1.8rem', margin: '6px 0 8px' }}>
            Your Visit is Registered!
          </h2>
          <p style={{ color: '#f0dfe2', margin: 0, fontSize: '0.92rem' }}>
            Thank you for choosing The Bridal Bloom. We're excited to pamper you!
          </p>
        </div>

        {/* Booking Card Details */}
        <div style={{ padding: '24px' }}>
          <div
            style={{
              background: 'white',
              border: '1px solid #efe2df',
              borderRadius: '6px',
              padding: '18px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f3e9e7',
                paddingBottom: '12px',
                marginBottom: '14px',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Booking Reference
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: 'var(--wine)',
                  background: 'var(--blush)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                }}
              >
                {booking.id.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--gold)" />
                <strong style={{ color: 'var(--ink)' }}>Service:</strong>
                <span style={{ color: 'var(--wine)', fontWeight: 600 }}>{booking.service}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--rose)" />
                <strong style={{ color: 'var(--ink)' }}>Date:</strong>
                <span>{booking.date}</span>
                {booking.time && (
                  <>
                    <Clock size={15} color="var(--rose)" style={{ marginLeft: '8px' }} />
                    <span>{booking.time}</span>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--rose)" />
                <strong style={{ color: 'var(--ink)' }}>Contact:</strong>
                <span>{booking.name} ({booking.phone})</span>
              </div>
            </div>

            <div
              style={{
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid #f3e9e7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Status:</span>
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  padding: '3px 10px',
                  borderRadius: '12px',
                }}
              >
                ● {booking.status} Confirmation
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#66545a', margin: '0 0 20px', lineHeight: 1.5, textAlign: 'center' }}>
            Our salon coordinator has received your appointment in real-time and will reach out shortly via call or WhatsApp.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: '#25D366',
                borderColor: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.95rem',
              }}
            >
              <MessageSquare size={16} /> Open &amp; Confirm via WhatsApp
            </a>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-outline"
                onClick={handleCopyDetails}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {copied ? <Check size={16} color="green" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>

              <button
                className="btn"
                onClick={() => setShowConfirmationModal(false)}
                style={{ flex: 1 }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
