import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { providersData } from '../data/providersData';
import { servicesData } from '../data/servicesData';
import { ServiceCard } from '../components/cards/ServiceCard';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Heart, 
  Edit3, 
  Check, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, setCurrentUser, bookings, favorites, navigateTo, addToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);

  // Address book
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, label: 'Primary Residence', address: '742 Evergreen Terrace, Apt 4B, Springfield Metro' },
    { id: 2, label: 'Office / Workplace', address: '500 Innovation Way, Suite 300, Tech Park' }
  ]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name,
      email,
      phone,
      address
    }));
    setIsEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleAddAddress = () => {
    const newAddr = prompt('Enter new address description:');
    if (newAddr && newAddr.trim()) {
      setSavedAddresses([...savedAddresses, { id: Date.now(), label: 'Secondary Address', address: newAddr.trim() }]);
      addToast('Address added to your address book', 'success');
    }
  };

  const handleDeleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter(a => a.id !== id));
    addToast('Address removed', 'info');
  };

  // Favorited services
  const favoritedServices = servicesData.filter(s => favorites.includes(s.id));

  return (
    <div className="profile-page-root container">
      {/* Top Profile Summary Card */}
      <div className="card profile-header-card">
        <div className="profile-header-main">
          <img src={currentUser.avatar} alt={currentUser.name} className="profile-large-avatar" />
          <div className="profile-details-column">
            <div className="profile-name-badge">
              <h1 className="profile-h1">{currentUser.name}</h1>
              <span className="badge badge-verified">
                <ShieldCheck size={13} /> Verified Member
              </span>
            </div>
            <p className="profile-meta-line">
              <span>{currentUser.email}</span> • <span>{currentUser.phone}</span>
            </p>
            <p className="profile-meta-sub">
              Member since {currentUser.memberSince || 'March 2025'} • Primary Location: {currentUser.address}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'} btn-sm profile-edit-btn`}
        >
          <Edit3 size={15} />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Metrics Grid */}
      <div className="profile-metrics-row">
        <div className="card profile-stat-box" onClick={() => navigateTo('bookings')}>
          <Calendar size={22} color="#10b981" />
          <div className="stat-meta">
            <strong className="stat-number">{bookings.length}</strong>
            <span className="stat-sub">Total Bookings</span>
          </div>
        </div>

        <div className="card profile-stat-box" onClick={() => navigateTo('bookings')}>
          <ShieldCheck size={22} color="#10b981" />
          <div className="stat-meta">
            <strong className="stat-number">{bookings.filter(b => b.status === 'In Progress' || b.status === 'Confirmed').length}</strong>
            <span className="stat-sub">Active Appointments</span>
          </div>
        </div>

        <div className="card profile-stat-box">
          <Heart size={22} color="#ef4444" />
          <div className="stat-meta">
            <strong className="stat-number">{favorites.length}</strong>
            <span className="stat-sub">Saved Favorites</span>
          </div>
        </div>

        <div className="card profile-stat-box" onClick={() => navigateTo('settings')}>
          <CreditCard size={22} color="#10b981" />
          <div className="stat-meta">
            <strong className="stat-number">2</strong>
            <span className="stat-sub">Saved Payment Cards</span>
          </div>
        </div>
      </div>

      {/* Edit Form Modal/Drawer if editing */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="card-static profile-edit-form">
          <h3 className="block-title">Update Personal Information</h3>
          <div className="grid-2-inputs">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="input-field" 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input-field" 
                required 
              />
            </div>
          </div>
          <div className="grid-2-inputs">
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="input-field" 
                required 
              />
            </div>
            <div className="input-group">
              <label className="input-label">Primary Address</label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="input-field" 
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm btn-glow" style={{ alignSelf: 'flex-start' }}>
            <Check size={16} /> Save Changes
          </button>
        </form>
      )}

      {/* Main Content Layout */}
      <div className="profile-layout-columns">
        {/* Left Column: Address Book & Payment Methods */}
        <div className="profile-col-left">
          {/* Address Book */}
          <div className="card-static details-block">
            <div className="block-header-row">
              <h3 className="block-title">Saved Address Book</h3>
              <button onClick={handleAddAddress} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add Address
              </button>
            </div>

            <div className="address-items-list">
              {savedAddresses.map(addr => (
                <div key={addr.id} className="address-card-item">
                  <div className="address-icon-box">
                    <MapPin size={18} color="#10b981" />
                  </div>
                  <div className="address-content">
                    <strong>{addr.label}</strong>
                    <p>{addr.address}</p>
                  </div>
                  {savedAddresses.length > 1 && (
                    <button 
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="addr-delete-btn"
                      title="Delete Address"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card-static details-block">
            <div className="block-header-row">
              <h3 className="block-title">Payment Methods</h3>
              <button onClick={() => addToast('Add new card modal initiated', 'info')} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add Card
              </button>
            </div>

            <div className="payment-cards-list">
              <div className="payment-card-badge">
                <CreditCard size={20} color="#10b981" />
                <div className="payment-meta">
                  <strong>Mastercard ending •••• 4242</strong>
                  <span>Expires 08/28 • Default Payment Method</span>
                </div>
                <span className="badge badge-verified">Default</span>
              </div>
              <div className="payment-card-badge">
                <CreditCard size={20} color="#94a3b8" />
                <div className="payment-meta">
                  <strong>Visa ending •••• 9812</strong>
                  <span>Expires 11/27 • Backup</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Favorited Services */}
        <div className="profile-col-right">
          <div className="card-static details-block">
            <h3 className="block-title">Saved Services & Favorites ({favoritedServices.length})</h3>
            {favoritedServices.length > 0 ? (
              <div className="profile-favorites-grid">
                {favoritedServices.map(srv => (
                  <ServiceCard key={srv.id} service={srv} />
                ))}
              </div>
            ) : (
              <p className="no-favs-text">You haven't saved any services yet. Click the heart icon on any service card to bookmark it for later!</p>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Styles */}
      <style>{`
        .profile-page-root {
          padding-top: 2rem;
          padding-bottom: 4rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .profile-header-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .profile-header-main {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .profile-large-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-primary);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
        }

        .profile-name-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .profile-h1 {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
        }

        .profile-meta-line {
          font-size: 0.9rem;
          color: var(--text-primary);
          margin-top: 0.25rem;
        }
        .profile-meta-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .profile-metrics-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 900px) {
          .profile-metrics-row {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .profile-stat-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          cursor: pointer;
        }
        .stat-number {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          display: block;
          line-height: 1;
        }
        .stat-sub {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .profile-edit-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border: 1px solid var(--accent-primary);
        }

        .profile-layout-columns {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 1024px) {
          .profile-layout-columns {
            grid-template-columns: 1fr 1fr;
          }
        }

        .profile-col-left, .profile-col-right {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .block-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .address-items-list, .payment-cards-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .address-card-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: var(--bg-input);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .address-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: rgba(16, 185, 129, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .address-content {
          flex: 1;
        }
        .address-content strong {
          font-size: 0.85rem;
          color: var(--text-primary);
          display: block;
        }
        .address-content p {
          font-size: 0.775rem;
          color: var(--text-muted);
        }
        .addr-delete-btn {
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }
        .addr-delete-btn:hover {
          color: #ef4444;
        }

        .payment-card-badge {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: var(--bg-input);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .payment-meta {
          flex: 1;
        }
        .payment-meta strong {
          font-size: 0.85rem;
          color: var(--text-primary);
          display: block;
        }
        .payment-meta span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .profile-favorites-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 600px) {
          .profile-favorites-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .no-favs-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
