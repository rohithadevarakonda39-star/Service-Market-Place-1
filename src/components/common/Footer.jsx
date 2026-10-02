import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, PhoneCall, CheckCircle, Mail, ArrowRight, Heart } from 'lucide-react';

export const Footer = () => {
  const { navigateTo, addToast, setSelectedCategory } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast('Subscribed to ServiGo perks & weekly service discounts!', 'success');
    setEmail('');
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    navigateTo('services');
  };

  return (
    <>
      <footer className="footer-root">
        {/* Emergency Hotline Banner */}
        <div className="hotline-banner">
          <div className="container">
            <div className="hotline-wrapper">
              <div className="hotline-info">
                <div className="hotline-icon">
                  <PhoneCall size={24} />
                </div>
                <div>
                  <h4 className="hotline-title">Need Urgent Emergency Repairs?</h4>
                  <p className="hotline-desc">24/7 priority emergency dispatch across plumbing, electrical & locksmith in 20 minutes.</p>
                </div>
              </div>
              <div className="hotline-cta">
                <a href="tel:+18007378446" className="btn btn-primary btn-glow">
                  <PhoneCall size={18} />
                  <span>Call 1-800-SERVI-GO</span>
                </a>
                <button 
                  onClick={() => {
                    setSelectedCategory('emergency-services');
                    navigateTo('services');
                  }} 
                  className="btn btn-secondary"
                >
                  Dispatch Online
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="container footer-main-content">
          <div className="footer-grid">
            {/* Column 1: Brand Info */}
            <div className="footer-col brand-col">
              <div className="logo-wrapper" onClick={() => navigateTo('home')}>
                <div className="logo-icon-box">
                  <ShieldCheck size={24} color="#10b981" />
                </div>
                <div className="logo-text-group">
                  <span className="logo-brand">Servi<span className="logo-brand-accent">Go</span></span>
                  <span className="logo-sub">Smart Service Marketplace</span>
                </div>
              </div>
              <p className="brand-tagline">
                The premier on-demand marketplace connecting discerning homeowners and businesses with verified, high-precision service professionals.
              </p>
              <div className="trust-pills">
                <span className="trust-pill"><CheckCircle size={14} color="#10b981" /> 100% Background Checked</span>
                <span className="trust-pill"><CheckCircle size={14} color="#10b981" /> $1M Service Protection</span>
                <span className="trust-pill"><CheckCircle size={14} color="#10b981" /> Escrow Milestone Payouts</span>
              </div>
            </div>

            {/* Column 2: Popular Categories */}
            <div className="footer-col">
              <h5 className="footer-heading">Top Categories</h5>
              <ul className="footer-links">
                <li><button onClick={() => handleCategoryClick('home-cleaning')}>Home Cleaning</button></li>
                <li><button onClick={() => handleCategoryClick('plumbing')}>Plumbing & Drainage</button></li>
                <li><button onClick={() => handleCategoryClick('electrician')}>Electrical & Smart Home</button></li>
                <li><button onClick={() => handleCategoryClick('ac-repair')}>AC Jet Servicing</button></li>
                <li><button onClick={() => handleCategoryClick('car-service')}>Doorstep Car Detailing</button></li>
                <li><button onClick={() => handleCategoryClick('beauty-salon')}>In-Home Beauty & Salon</button></li>
                <li><button onClick={() => handleCategoryClick('laptop-repair')}>Laptop & Gadget Repair</button></li>
              </ul>
            </div>

            {/* Column 3: Platform Navigation */}
            <div className="footer-col">
              <h5 className="footer-heading">Platform</h5>
              <ul className="footer-links">
                <li><button onClick={() => navigateTo('home')}>Explore Marketplace</button></li>
                <li><button onClick={() => navigateTo('services')}>Browse All 30+ Services</button></li>
                <li><button onClick={() => navigateTo('providers')}>Verified Providers Directory</button></li>
                <li><button onClick={() => navigateTo('bookings')}>Track Live Bookings</button></li>
                <li><button onClick={() => navigateTo('profile')}>User Account & History</button></li>
                <li><button onClick={() => navigateTo('register')}>Become a ServiGo Pro</button></li>
                <li><button onClick={() => navigateTo('settings')}>Security & Preferences</button></li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Guarantee */}
            <div className="footer-col newsletter-col">
              <h5 className="footer-heading">Stay Updated</h5>
              <p className="newsletter-text">Receive exclusive seasonal service coupons, maintenance reminders & safety tips.</p>
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <div className="newsletter-input-box">
                  <Mail size={16} className="newsletter-icon" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="newsletter-input"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  <span>Subscribe</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p className="copyright-text">
              © {new Date().getFullYear()} ServiGo Inc. All rights reserved. Designed for reliability & excellence.
            </p>
            <div className="footer-legal-links">
              <button className="legal-btn">Privacy Policy</button>
              <span>•</span>
              <button className="legal-btn">Terms of Service</button>
              <span>•</span>
              <button className="legal-btn">Safety Guarantee</button>
              <span>•</span>
              <button className="legal-btn">Sitemap</button>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .footer-root {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          margin-top: 4rem;
        }

        .hotline-banner {
          background: linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.08));
          border-bottom: 1px solid var(--border-subtle);
          padding: 1.5rem 0;
        }

        .hotline-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          align-items: flex-start;
          justify-content: space-between;
        }
        @media (min-width: 768px) {
          .hotline-wrapper {
            flex-direction: row;
            align-items: center;
          }
        }

        .hotline-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hotline-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--accent-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }

        .hotline-title {
          font-size: 1.15rem;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .hotline-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .hotline-cta {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .footer-main-content {
          padding-top: 3.5rem;
          padding-bottom: 2.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
          }
        }

        .brand-col .brand-tagline {
          margin-top: 1rem;
          margin-bottom: 1.25rem;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .trust-pills {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .trust-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .footer-heading {
          font-size: 1rem;
          margin-bottom: 1.2rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .footer-links button {
          font-size: 0.85rem;
          color: var(--text-muted);
          transition: color var(--transition-fast), transform var(--transition-fast);
          text-align: left;
        }
        .footer-links button:hover {
          color: var(--accent-primary);
          transform: translateX(4px);
        }

        .newsletter-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .newsletter-input-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.6rem 0.85rem;
          transition: border-color var(--transition-fast);
        }
        .newsletter-input-box:focus-within {
          border-color: var(--accent-primary);
        }
        .newsletter-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }
        .newsletter-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
          width: 100%;
        }

        .footer-bottom {
          margin-top: 3.5rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          font-size: 0.825rem;
          color: var(--text-muted);
        }
        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
          }
        }

        .footer-legal-links {
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }
        .legal-btn {
          font-size: 0.825rem;
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }
        .legal-btn:hover {
          color: var(--accent-primary);
        }
      `}</style>
    </>
  );
};
