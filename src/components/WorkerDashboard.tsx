import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import { Appointment, AppointmentStatus } from '../types';
import {
  Calendar,
  Clock,
  Phone,
  Search,
  PlusCircle,
  Trash2,
  CheckCircle,
  MessageSquare,
  X,
  UserCheck,
  Tag,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const {
    appointments,
    services,
    team,
    bookAppointment,
    updateAppointmentStatus,
    updateAppointmentDetails,
    deleteAppointment,
  } = useSalon();

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  // Manual booking modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    service: services[0]?.name || 'Royal Bridal Signature Package',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    assignedStaff: team[0]?.name || 'Unassigned',
    notes: '',
    status: 'Confirmed' as AppointmentStatus,
  });

  const [savingManual, setSavingManual] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
      const matchesSearch =
        appt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.phone.includes(searchTerm) ||
        appt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appt.notes && appt.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = appt.date === todayStr;
      } else if (dateFilter === 'upcoming') {
        matchesDate = appt.date >= todayStr;
      }

      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [appointments, statusFilter, searchTerm, dateFilter, todayStr]);

  // Statistics
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const todayCount = appointments.filter((a) => a.date === todayStr).length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.phone || !manualForm.service) return;

    setSavingManual(true);
    try {
      const newAppt = await bookAppointment({
        name: manualForm.name,
        phone: manualForm.phone,
        service: manualForm.service,
        date: manualForm.date,
        time: manualForm.time,
        assignedStaff: manualForm.assignedStaff,
        notes: manualForm.notes,
        bookedBy: 'staff',
      });

      if (manualForm.status !== 'Pending') {
        await updateAppointmentStatus(newAppt.id, manualForm.status);
      }

      setShowManualModal(false);
      setManualForm({
        name: '',
        phone: '',
        service: services[0]?.name || 'Bridal Studio',
        date: new Date().toISOString().split('T')[0],
        time: '11:00 AM',
        assignedStaff: team[0]?.name || 'Unassigned',
        notes: '',
        status: 'Confirmed',
      });
      showToast('Manual booking created successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error creating manual booking');
    } finally {
      setSavingManual(false);
    }
  };

  const [apptToDelete, setApptToDelete] = useState<Appointment | null>(null);

  const confirmDeleteAppointment = async () => {
    if (!apptToDelete) return;
    await deleteAppointment(apptToDelete.id);
    showToast(`✓ Appointment for ${apptToDelete.name} deleted.`);
    setApptToDelete(null);
  };

  const openWhatsAppToCustomer = (appt: Appointment) => {
    const text = encodeURIComponent(
      `Hello ${appt.name}! This is The Bridal Bloom salon regarding your appointment for ${appt.service} on ${appt.date} (${appt.time || 'agreed slot'}). We look forward to welcoming you!`
    );
    window.open(`https://wa.me/${appt.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <main style={{ minHeight: '85vh', padding: '30px 0 60px' }}>
      <div className="wrap">
        {/* Dashboard Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
            paddingBottom: '20px',
            borderBottom: '1px solid #eadbd7',
          }}
        >
          <div>
            <div className="eyebrow" style={{ color: 'var(--wine)' }}>
              Staff Operational Portal
            </div>
            <h1 style={{ fontSize: '2.4rem', margin: '4px 0 6px', color: 'var(--wine)' }}>
              Worker Appointment Dashboard
            </h1>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>
              Real-time Firestore synchronization for all customer reservations, manual walk-ins, and schedule statuses.
            </p>
          </div>

          <button
            className="btn"
            onClick={() => setShowManualModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              boxShadow: '0 4px 14px rgba(113, 59, 77, 0.2)',
            }}
          >
            <PlusCircle size={18} /> Add Manual Booking
          </button>
        </div>

        {/* Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '18px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: '#fff',
              border: '1px solid #eadbd7',
              padding: '18px 20px',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(113, 59, 77, 0.04)',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Total Appointments
            </span>
            <div style={{ fontSize: '2.2rem', fontFamily: 'Georgia, serif', color: 'var(--wine)', marginTop: '4px', fontWeight: 'bold' }}>
              {appointments.length}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>All-time registered</span>
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid #fed7aa',
              padding: '18px 20px',
              borderRadius: '6px',
              borderLeft: '4px solid #f97316',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#9a3412', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
              Needs Action (Pending)
            </span>
            <div style={{ fontSize: '2.2rem', fontFamily: 'Georgia, serif', color: '#ea580c', marginTop: '4px', fontWeight: 'bold' }}>
              {pendingCount}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#c2410c' }}>Awaiting staff confirmation</span>
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid #bbf7d0',
              padding: '18px 20px',
              borderRadius: '6px',
              borderLeft: '4px solid #22c55e',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
              Today's Schedule
            </span>
            <div style={{ fontSize: '2.2rem', fontFamily: 'Georgia, serif', color: '#15803d', marginTop: '4px', fontWeight: 'bold' }}>
              {todayCount}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>Scheduled for {todayStr}</span>
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid #eadbd7',
              padding: '18px 20px',
              borderRadius: '6px',
              borderLeft: '4px solid var(--wine)',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Confirmed
            </span>
            <div style={{ fontSize: '2.2rem', fontFamily: 'Georgia, serif', color: 'var(--wine)', marginTop: '4px', fontWeight: 'bold' }}>
              {confirmedCount}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>Confirmed active bookings</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            background: 'white',
            border: '1px solid #eadbd7',
            padding: '18px 20px',
            borderRadius: '6px',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={17} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder="Search by customer name, phone, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                background: '#fffdfa',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Date Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setDateFilter('all')}
              style={{
                padding: '7px 12px',
                borderRadius: '4px',
                border: '1px solid',
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: dateFilter === 'all' ? 'var(--wine)' : '#fff',
                color: dateFilter === 'all' ? '#fff' : 'var(--ink)',
                borderColor: dateFilter === 'all' ? 'var(--wine)' : '#ddd',
              }}
            >
              All Dates
            </button>
            <button
              onClick={() => setDateFilter('today')}
              style={{
                padding: '7px 12px',
                borderRadius: '4px',
                border: '1px solid',
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: dateFilter === 'today' ? 'var(--wine)' : '#fff',
                color: dateFilter === 'today' ? '#fff' : 'var(--ink)',
                borderColor: dateFilter === 'today' ? 'var(--wine)' : '#ddd',
              }}
            >
              Today ({todayCount})
            </button>
            <button
              onClick={() => setDateFilter('upcoming')}
              style={{
                padding: '7px 12px',
                borderRadius: '4px',
                border: '1px solid',
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: dateFilter === 'upcoming' ? 'var(--wine)' : '#fff',
                color: dateFilter === 'upcoming' ? '#fff' : 'var(--ink)',
                borderColor: dateFilter === 'upcoming' ? 'var(--wine)' : '#ddd',
              }}
            >
              Upcoming
            </button>
          </div>

          {/* Status Filter Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: 'pointer',
                  background:
                    statusFilter === status
                      ? 'var(--wine)'
                      : status === 'Pending'
                      ? '#fffbeb'
                      : status === 'Confirmed'
                      ? '#f0fdf4'
                      : '#fff',
                  color:
                    statusFilter === status
                      ? '#fff'
                      : status === 'Pending'
                      ? '#b45309'
                      : status === 'Confirmed'
                      ? '#15803d'
                      : 'var(--ink)',
                  borderColor: statusFilter === status ? 'var(--wine)' : '#eadbd7',
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div
            style={{
              background: '#fff',
              border: '1px solid #eadbd7',
              borderRadius: '8px',
              padding: '60px 20px',
              textAlign: 'center',
            }}
          >
            <Sparkles size={36} color="var(--rose)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--wine)', marginBottom: '8px' }}>No Appointments Found</h3>
            <p style={{ color: 'var(--muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
              {searchTerm || statusFilter !== 'All' || dateFilter !== 'all'
                ? 'No appointments match the selected filters. Try clearing your search or filters.'
                : 'No appointments registered in Firebase yet. Click "+ Add Manual Booking" to record your first client!'}
            </p>
            <button className="btn" onClick={() => setShowManualModal(true)}>
              <PlusCircle size={16} style={{ marginRight: '6px' }} /> Record Appointment
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredAppointments.map((appt) => {
              const isToday = appt.date === todayStr;

              return (
                <article
                  key={appt.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #eadbd7',
                    borderLeft: `5px solid ${
                      appt.status === 'Confirmed'
                        ? '#22c55e'
                        : appt.status === 'Pending'
                        ? '#f59e0b'
                        : appt.status === 'Completed'
                        ? '#6b7280'
                        : '#ef4444'
                    }`,
                    borderRadius: '6px',
                    padding: '20px 22px',
                    boxShadow: '0 4px 15px rgba(113, 59, 77, 0.04)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '12px',
                      borderBottom: '1px solid #f6efed',
                      paddingBottom: '14px',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--wine)' }}>{appt.name}</h3>
                        {appt.bookedBy === 'staff' ? (
                          <span
                            style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '10px',
                              textTransform: 'uppercase',
                            }}
                          >
                            Staff Booking
                          </span>
                        ) : (
                          <span
                            style={{
                              background: 'var(--blush)',
                              color: 'var(--wine)',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '10px',
                              textTransform: 'uppercase',
                            }}
                          >
                            Client Online
                          </span>
                        )}
                        {isToday && (
                          <span
                            style={{
                              background: '#fef08a',
                              color: '#854d0e',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '10px',
                              textTransform: 'uppercase',
                            }}
                          >
                            Today
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap', fontSize: '0.9rem', color: '#555' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Phone size={14} color="var(--rose)" />
                          <a href={`tel:${appt.phone}`} style={{ color: 'var(--ink)', fontWeight: 600 }}>
                            {appt.phone}
                          </a>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={14} color="var(--rose)" />
                          <strong>{appt.date}</strong>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} color="var(--rose)" />
                          <span>{appt.time || '11:00 AM'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Status & Delete Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <select
                        value={appt.status}
                        onChange={(e) => updateAppointmentStatus(appt.id, e.target.value as AppointmentStatus)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          border: '1px solid #ddd',
                          cursor: 'pointer',
                          background:
                            appt.status === 'Confirmed'
                              ? '#dcfce7'
                              : appt.status === 'Pending'
                              ? '#fef3c7'
                              : appt.status === 'Completed'
                              ? '#f3f4f6'
                              : '#fee2e2',
                          color:
                            appt.status === 'Confirmed'
                              ? '#15803d'
                              : appt.status === 'Pending'
                              ? '#b45309'
                              : appt.status === 'Completed'
                              ? '#374151'
                              : '#b91c1c',
                        }}
                      >
                        <option value="Pending">Pending Confirmation</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        className="btn-delete"
                        onClick={() => setApptToDelete(appt)}
                        title="Delete this appointment"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 10px' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Service, Assigned Staff, Notes */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '14px',
                      background: 'var(--cream)',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                        Booked Service:
                      </span>
                      <div style={{ color: 'var(--wine)', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Tag size={14} color="var(--gold)" /> {appt.service}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                        Assigned Artisan:
                      </span>
                      <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UserCheck size={14} color="var(--rose)" />
                        <select
                          value={appt.assignedStaff || 'Unassigned'}
                          onChange={(e) => updateAppointmentDetails(appt.id, { assignedStaff: e.target.value })}
                          style={{
                            border: '1px solid #ddd',
                            borderRadius: '3px',
                            background: '#fff',
                            fontSize: '0.85rem',
                            padding: '3px 8px',
                          }}
                        >
                          <option value="Unassigned">Unassigned</option>
                          {team.map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name} ({m.role.split(' ')[0]})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {appt.notes && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
                          Client Notes &amp; Requests:
                        </span>
                        <div style={{ color: '#555', fontStyle: 'italic', marginTop: '2px' }}>
                          "{appt.notes}"
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Footer */}
                  <div
                    style={{
                      marginTop: '14px',
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button
                      onClick={() => openWhatsAppToCustomer(appt)}
                      style={{
                        background: '#25D366',
                        border: 'none',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '3px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <MessageSquare size={13} /> Chat on WhatsApp
                    </button>

                    {appt.status !== 'Confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appt.id, 'Confirmed')}
                        style={{
                          background: '#15803d',
                          border: 'none',
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '3px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CheckCircle size={13} /> Confirm Booking
                      </button>
                    )}

                    {appt.status === 'Confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appt.id, 'Completed')}
                        style={{
                          background: 'var(--wine)',
                          border: 'none',
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '3px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CheckCircle size={13} /> Mark Completed
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Booking Modal */}
      {showManualModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(48, 36, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowManualModal(false)}
        >
          <div
            style={{
              background: '#fff',
              maxWidth: '560px',
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: 'var(--wine)',
                color: 'white',
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'white' }}>Add Manual Booking</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--blush)' }}>
                  Record a walk-in, phone reservation, or salon appointment
                </span>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', textTransform: 'uppercase', marginBottom: '5px' }}>
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maryam Noor"
                  value={manualForm.name}
                  onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', textTransform: 'uppercase', marginBottom: '5px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +92 300 9876543"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', textTransform: 'uppercase', marginBottom: '5px' }}>
                    Status
                  </label>
                  <select
                    value={manualForm.status}
                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as AppointmentStatus })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem', background: '#fff' }}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', textTransform: 'uppercase', marginBottom: '5px' }}>
                  Service *
                </label>
                <select
                  value={manualForm.service}
                  onChange={(e) => setManualForm({ ...manualForm, service: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem', background: '#fff' }}
                  required
                >
                  {services.map((s) => (
                    <option key={s.id} value={`${s.name} (${s.price})`}>
                      {s.name} — {s.price}
                    </option>
                  ))}
                  <option value="Custom Hair & Makeup Consultation">Custom Hair &amp; Makeup Consultation</option>
                  <option value="Bridal Package Walk-in">Bridal Package Walk-in</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', textTransform: 'uppercase', marginBottom: '5px' }}>
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={manualForm.date}
                    onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', textTransform: 'uppercase', marginBottom: '5px' }}>
                    Time Slot
                  </label>
                  <select
                    value={manualForm.time}
                    onChange={(e) => setManualForm({ ...manualForm, time: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem', background: '#fff' }}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', textTransform: 'uppercase', marginBottom: '5px' }}>
                  Assign to Artisan / Staff
                </label>
                <select
                  value={manualForm.assignedStaff}
                  onChange={(e) => setManualForm({ ...manualForm, assignedStaff: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem', background: '#fff' }}
                >
                  <option value="Unassigned">Unassigned (First Available)</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} — {m.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#444', textTransform: 'uppercase', marginBottom: '5px' }}>
                  Booking Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes, advance deposit details, or special preferences..."
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.95rem' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowManualModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={savingManual}
                  style={{ flex: 1 }}
                >
                  {savingManual ? 'Saving...' : 'Save to Firebase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Appointment Confirmation Modal */}
      {apptToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(48, 36, 42, 0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setApptToDelete(null)}
        >
          <div
            style={{
              background: '#fff',
              maxWidth: '460px',
              width: '100%',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', marginBottom: '12px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--wine)' }}>Delete Appointment?</h3>
            </div>
            <p style={{ color: '#555', fontSize: '0.95rem', margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to delete the appointment for <strong>"{apptToDelete.name}"</strong> ({apptToDelete.service}) on <strong>{apptToDelete.date}</strong>? This will remove it from Firebase permanently.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setApptToDelete(null)}
                style={{ padding: '9px 18px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAppointment}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '3px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-msg">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
};
