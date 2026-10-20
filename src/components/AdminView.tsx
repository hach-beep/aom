import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { SalonService, TeamMember } from '../types';
import {
  UserPlus,
  PlusCircle,
  Trash2,
  Edit3,
  RotateCcw,
  Check,
  Tag,
  Users,
  LayoutDashboard,
  Save,
  X,
  AlertTriangle,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    services,
    team,
    appointments,
    setCurrentPage,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addService,
    updateService,
    deleteService,
    resetToDefaults,
  } = useSalon();

  const [activeTab, setActiveTab] = useState<'services' | 'team'>('services');

  // Service Add State
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Bridal Studio');
  const [isSavingService, setIsSavingService] = useState(false);

  // Service Edit State
  const [editingService, setEditingService] = useState<SalonService | null>(null);
  const [isUpdatingService, setIsUpdatingService] = useState(false);

  // Team Add State
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffBio, setStaffBio] = useState('');
  const [isSavingStaff, setIsSavingStaff] = useState(false);

  // Team Edit State
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isUpdatingMember, setIsUpdatingMember] = useState(false);

  // Custom In-App Deletion / Reset Confirm Modal (Replaces blocked window.confirm)
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: 'service' | 'team' | 'reset';
    id?: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'service',
    title: '',
    message: '',
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !servicePrice.trim() || !serviceDescription.trim()) return;
    setIsSavingService(true);
    try {
      await addService(serviceName, servicePrice, serviceDescription, serviceCategory);
      setServiceName('');
      setServicePrice('');
      setServiceDescription('');
      showToast('✓ New service published to website and Firebase!');
    } catch {
      showToast('Error saving service');
    } finally {
      setIsSavingService(false);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsUpdatingService(true);
    try {
      await updateService(
        editingService.id,
        editingService.name,
        editingService.price,
        editingService.description,
        editingService.category
      );
      setEditingService(null);
      showToast('✓ Service price & details updated in Firebase!');
    } catch {
      showToast('Error updating service');
    } finally {
      setIsUpdatingService(false);
    }
  };

  const executeDeleteAction = async () => {
    if (confirmDelete.type === 'service' && confirmDelete.id) {
      await deleteService(confirmDelete.id);
      showToast('✓ Service removed from website.');
    } else if (confirmDelete.type === 'team' && confirmDelete.id) {
      await deleteTeamMember(confirmDelete.id);
      showToast('✓ Team artisan removed.');
    } else if (confirmDelete.type === 'reset') {
      await resetToDefaults();
      showToast('✓ Default salon menu & artisans restored.');
    }
    setConfirmDelete({ isOpen: false, type: 'service', title: '', message: '' });
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffRole.trim() || !staffBio.trim()) return;
    setIsSavingStaff(true);
    try {
      await addTeamMember(staffName, staffRole, staffBio);
      setStaffName('');
      setStaffRole('');
      setStaffBio('');
      showToast('✓ New artisan added to website and Firebase!');
    } catch {
      showToast('Error saving team member');
    } finally {
      setIsSavingStaff(false);
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsUpdatingMember(true);
    try {
      await updateTeamMember(
        editingMember.id,
        editingMember.name,
        editingMember.role,
        editingMember.bio
      );
      setEditingMember(null);
      showToast('✓ Team member profile updated in Firebase!');
    } catch {
      showToast('Error updating team member');
    } finally {
      setIsUpdatingMember(false);
    }
  };

  return (
    <main style={{ minHeight: '85vh', padding: '30px 0 60px' }}>
      <div className="admin-box" style={{ maxWidth: '860px' }}>
        <div className="admin-header">
          <div>
            <div className="eyebrow" style={{ color: 'var(--wine)' }}>
              Employer Website Control
            </div>
            <h1 style={{ fontSize: '2.2rem', margin: '4px 0 4px', color: 'var(--wine)' }}>
              Website Control Page
            </h1>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.92rem' }}>
              Modify prices, update descriptions, add services, or manage staff. All changes sync directly to Firebase Cloud Firestore.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage('worker-dashboard')}
              className="btn"
              style={{
                padding: '8px 14px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#15803d',
                borderColor: '#15803d',
              }}
            >
              <LayoutDashboard size={14} /> Worker Dashboard ({appointments.length})
            </button>

            <button
              onClick={() =>
                setConfirmDelete({
                  isOpen: true,
                  type: 'reset',
                  title: 'Reset Website to Defaults?',
                  message: 'This will restore all default salon services and team artisans in Firebase Firestore.',
                })
              }
              className="btn btn-outline"
              style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Reset default items"
            >
              <RotateCcw size={14} /> Reset Defaults
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Tag size={16} /> Edit Services &amp; Prices ({services.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Users size={16} /> Manage Team Artisans ({team.length})
          </button>
        </div>

        {/* SECTION 1: SERVICES & PRICING */}
        {activeTab === 'services' && (
          <div>
            {/* Add Service Form */}
            <form className="admin-form" onSubmit={handleAddService}>
              <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--wine)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={18} /> Add New Menu Service
              </h2>

              <label htmlFor="serviceName">Service Name *</label>
              <input
                id="serviceName"
                type="text"
                required
                placeholder="e.g. Luxury Hair Styling &amp; Blowout"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label htmlFor="servicePrice">Price Display * (e.g. Rs. 15,000)</label>
                  <input
                    id="servicePrice"
                    type="text"
                    required
                    placeholder="e.g. Rs. 15,000"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="serviceCategory">Category</label>
                  <select
                    id="serviceCategory"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                  >
                    <option value="Bridal Studio">Bridal Studio</option>
                    <option value="Hair & Makeup">Hair &amp; Makeup</option>
                    <option value="Skin & Self-Care">Skin &amp; Self-Care</option>
                    <option value="Women's Salon">Women's Salon</option>
                    <option value="Men's Grooming">Men's Grooming</option>
                    <option value="Event Packages">Event Packages</option>
                  </select>
                </div>
              </div>

              <label htmlFor="serviceDescription">Service Description *</label>
              <textarea
                id="serviceDescription"
                rows={3}
                required
                placeholder="Detail inclusions, techniques, duration, and benefits..."
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
              ></textarea>

              <button
                type="submit"
                className="btn"
                disabled={isSavingService}
                style={{ background: 'var(--wine)' }}
              >
                {isSavingService ? 'Publishing to Firebase...' : '+ Publish Service to Website'}
              </button>
            </form>

            {/* List & Edit Existing Services */}
            <h3 style={{ fontSize: '1.3rem', color: 'var(--wine)', marginBottom: '6px' }}>
              Live Website Services &amp; Current Prices
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '0 0 16px' }}>
              Click <strong>"Edit Price &amp; Info"</strong> on any service to change its price in real time.
            </p>

            {services.length === 0 ? (
              <p style={{ color: '#777', fontStyle: 'italic' }}>No services published yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="roster-item"
                    style={{
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      background: '#fff',
                      border: '1px solid #efe2df',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '1.15rem', color: 'var(--wine)' }}>{s.name}</strong>
                          <span
                            style={{
                              background: 'var(--blush)',
                              color: 'var(--wine)',
                              padding: '3px 12px',
                              borderRadius: '16px',
                              fontSize: '0.95rem',
                              fontWeight: 700,
                            }}
                          >
                            {s.price}
                          </span>
                          {s.category && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--gold)',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                              }}
                            >
                              [{s.category}]
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '6px 0 0', color: '#66545a', fontSize: '0.9rem', lineHeight: 1.5 }}>
                          {s.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                          onClick={() => setEditingService(s)}
                          style={{
                            background: 'var(--blush)',
                            color: 'var(--wine)',
                            border: '1px solid var(--rose)',
                            padding: '6px 12px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Edit3 size={13} /> Edit Price &amp; Info
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() =>
                            setConfirmDelete({
                              isOpen: true,
                              type: 'service',
                              id: s.id,
                              title: `Delete "${s.name}"?`,
                              message: `Are you sure you want to remove "${s.name}" from your website? It will be removed from Firebase immediately.`,
                            })
                          }
                          title="Delete service"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: TEAM ARTISANS */}
        {activeTab === 'team' && (
          <div>
            <form className="admin-form" onSubmit={handleAddStaff}>
              <h2 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--wine)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} /> Add Team Artisan
              </h2>

              <label htmlFor="staffName">Full Name *</label>
              <input
                id="staffName"
                type="text"
                required
                placeholder="e.g. Hina Qureshi"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
              />

              <label htmlFor="staffRole">Job Title / Role *</label>
              <input
                id="staffRole"
                type="text"
                required
                placeholder="e.g. Master Bridal Hair Stylist"
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
              />

              <label htmlFor="staffBio">Short Bio &amp; Specialties *</label>
              <textarea
                id="staffBio"
                rows={3}
                required
                placeholder="Years of experience, signature looks, certifications..."
                value={staffBio}
                onChange={(e) => setStaffBio(e.target.value)}
              ></textarea>

              <button type="submit" className="btn" disabled={isSavingStaff}>
                {isSavingStaff ? 'Saving to Firebase...' : '+ Add Team Member to Website'}
              </button>
            </form>

            <h3 style={{ fontSize: '1.3rem', color: 'var(--wine)', marginBottom: '14px' }}>
              Live Artisan Staff Roster
            </h3>

            {team.length === 0 ? (
              <p style={{ color: '#777', fontStyle: 'italic' }}>No team members registered.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {team.map((emp) => (
                  <div
                    key={emp.id}
                    className="roster-item"
                    style={{
                      background: '#fff',
                      border: '1px solid #efe2df',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--wine)' }}>{emp.name}</strong>{' '}
                      <span style={{ color: 'var(--rose)', fontSize: '0.88rem', fontWeight: 600 }}>({emp.role})</span>
                      <p style={{ margin: '4px 0 0', color: '#66545a', fontSize: '0.88rem', lineHeight: 1.5 }}>
                        {emp.bio}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => setEditingMember(emp)}
                        style={{
                          background: 'var(--blush)',
                          color: 'var(--wine)',
                          border: '1px solid var(--rose)',
                          padding: '6px 12px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Edit3 size={13} /> Edit Profile
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() =>
                          setConfirmDelete({
                            isOpen: true,
                            type: 'team',
                            id: emp.id,
                            title: `Remove "${emp.name}"?`,
                            message: `Are you sure you want to remove "${emp.name}" from your team roster?`,
                          })
                        }
                        title="Remove team member"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* EDIT SERVICE MODAL */}
      {editingService && (
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
          onClick={() => setEditingService(null)}
        >
          <div
            style={{
              background: '#fff',
              maxWidth: '540px',
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
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'white' }}>Edit Service &amp; Price</h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateService} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px', color: 'var(--wine)' }}>
                    Price Display * (e.g. Rs. 20,000)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rs. 20,000"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '2px solid var(--wine)', borderRadius: '4px', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={editingService.category || 'Bridal Studio'}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}
                  >
                    <option value="Bridal Studio">Bridal Studio</option>
                    <option value="Hair & Makeup">Hair &amp; Makeup</option>
                    <option value="Skin & Self-Care">Skin &amp; Self-Care</option>
                    <option value="Women's Salon">Women's Salon</option>
                    <option value="Men's Grooming">Men's Grooming</option>
                    <option value="Event Packages">Event Packages</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingService(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={isUpdatingService}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Save size={16} /> {isUpdatingService ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEAM MEMBER MODAL */}
      {editingMember && (
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
          onClick={() => setEditingMember(null)}
        >
          <div
            style={{
              background: '#fff',
              maxWidth: '540px',
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
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'white' }}>Edit Artisan Profile</h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Artisan Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Role / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Bio &amp; Specialty *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingMember(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={isUpdatingMember}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Save size={16} /> {isUpdatingMember ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM IN-APP CONFIRM MODAL (NEVER BLOCKED BY IFRAMES) */}
      {confirmDelete.isOpen && (
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
          onClick={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
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
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--wine)' }}>{confirmDelete.title}</h3>
            </div>
            <p style={{ color: '#555', fontSize: '0.95rem', margin: '0 0 20px', lineHeight: 1.5 }}>
              {confirmDelete.message}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
                style={{ padding: '9px 18px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDeleteAction}
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
          <Check size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
};
