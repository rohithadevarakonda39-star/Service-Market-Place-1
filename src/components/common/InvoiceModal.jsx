import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, CheckCircle, ShieldCheck, FileCheck } from 'lucide-react';

export const InvoiceModal = () => {
  const { invoiceModal, closeInvoiceModal, addToast } = useApp();
  const { isOpen, booking } = invoiceModal;

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast(`Invoice ${booking.invoiceNumber || 'INV-2026'} downloaded successfully (PDF)`, 'success');
  };

  const pricing = booking.pricing || {
    basePrice: 65,
    serviceFee: 5.5,
    emergencyFee: 0,
    tax: 5.64,
    total: 76.14
  };

  return (
    <div className="modal-overlay" onClick={closeInvoiceModal}>
      <div className="modal-content invoice-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Toolbar */}
        <div className="invoice-toolbar no-print">
          <div className="toolbar-left">
            <FileCheck size={18} color="#10b981" />
            <span className="toolbar-title">Official Tax Invoice</span>
          </div>
          <div className="toolbar-actions">
            <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print Invoice">
              <Printer size={15} />
              <span>Print</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleDownload} title="Download PDF">
              <Download size={15} />
              <span>Download</span>
            </button>
            <button className="nav-icon-btn btn-sm" onClick={closeInvoiceModal} aria-label="Close invoice">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="invoice-sheet" id="invoice-sheet-printable">
          {/* Header */}
          <div className="invoice-top-row">
            <div className="invoice-brand">
              <div className="logo-brand">Servi<span className="logo-brand-accent">Go</span></div>
              <p className="invoice-brand-sub">Smart Marketplace Technologies Inc.</p>
              <p className="invoice-meta-text">Tax ID: US-928174201</p>
              <p className="invoice-meta-text">100 Market St, Suite 400, San Francisco CA</p>
            </div>
            <div className="invoice-summary-box">
              <h3 className="invoice-number-title">{booking.invoiceNumber || 'INV-2026-9042'}</h3>
              <p className="invoice-date">Date: {booking.issueDate || 'Oct 02, 2026'}</p>
              <span className="badge badge-verified invoice-paid-badge">
                <CheckCircle size={12} /> PAID IN FULL
              </span>
            </div>
          </div>

          <div className="invoice-divider"></div>

          {/* Billing & Service Provider Details */}
          <div className="invoice-parties-grid">
            <div className="party-box">
              <span className="party-label">BILLED TO:</span>
              <p className="party-name">Alex Morgan</p>
              <p className="party-text">{booking.address}</p>
              <p className="party-text">alex.morgan@servigo.io • +1 (555) 019-2834</p>
            </div>
            <div className="party-box">
              <span className="party-label">SERVICE SPECIALIST:</span>
              <p className="party-name">{booking.providerName}</p>
              <p className="party-text">Licensed ServiGo Certified Partner</p>
              <p className="party-text">Direct Contact: {booking.providerPhone}</p>
            </div>
          </div>

          {/* Order Details Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Service Item & Scope</th>
                <th>Category</th>
                <th>Qty</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{booking.serviceName}</strong>
                  <p className="table-subtext">Appointment Window: {booking.date} ({booking.timeSlot})</p>
                  {booking.isEmergency && <span className="badge badge-emergency">Emergency Priority Dispatch</span>}
                </td>
                <td>{booking.categoryName}</td>
                <td>1</td>
                <td className="text-right">${pricing.basePrice.toFixed(2)}</td>
              </tr>
              {booking.isEmergency && (
                <tr>
                  <td>20-Minute Emergency Response Fee</td>
                  <td>Add-on</td>
                  <td>1</td>
                  <td className="text-right">$20.00</td>
                </tr>
              )}
              <tr>
                <td>ServiGo Trust & Escrow Guarantee</td>
                <td>Protection</td>
                <td>1</td>
                <td className="text-right">${pricing.serviceFee.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Municipal Service Tax (8%)</td>
                <td>Tax</td>
                <td>1</td>
                <td className="text-right">${pricing.tax.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Grand Total */}
          <div className="invoice-totals-wrapper">
            <div className="invoice-notes">
              <h6>Payment Details:</h6>
              <p>Method: {booking.paymentMethod || 'Credit Card ending •••• 4242'}</p>
              <p>Authorization Code: AUTH_{Math.floor(100000 + Math.random() * 900000)}</p>
              <div className="official-stamp">
                <ShieldCheck size={28} color="#10b981" />
                <div>
                  <strong>SERVIGO VERIFIED</strong>
                  <span>Escrow Cleared & Insured</span>
                </div>
              </div>
            </div>

            <div className="totals-box">
              <div className="totals-row">
                <span>Subtotal:</span>
                <span>${(pricing.basePrice + (pricing.emergencyFee || 0)).toFixed(2)}</span>
              </div>
              <div className="totals-row">
                <span>Platform & Tax:</span>
                <span>${(pricing.serviceFee + pricing.tax).toFixed(2)}</span>
              </div>
              <div className="invoice-divider"></div>
              <div className="totals-row total-grand">
                <span>Total Paid:</span>
                <span className="grand-amount">${pricing.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="invoice-footer-note">
            Thank you for choosing ServiGo! For warranty claims or 30-day rework satisfaction guarantee, please present this invoice number.
          </div>
        </div>
      </div>

      <style>{`
        .invoice-modal-content {
          max-width: 680px;
          padding: 0;
          overflow: hidden;
        }

        .invoice-toolbar {
          padding: 0.85rem 1.25rem;
          background: var(--bg-card-elevated);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .toolbar-title {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .invoice-sheet {
          padding: 2rem;
          background: var(--bg-card);
          color: var(--text-primary);
        }

        .invoice-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .invoice-brand .logo-brand {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .invoice-brand-sub {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 2px;
        }
        .invoice-meta-text {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .invoice-summary-box {
          text-align: right;
        }
        .invoice-number-title {
          font-size: 1.25rem;
          color: var(--accent-primary);
        }
        .invoice-date {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin: 0.2rem 0;
        }
        .invoice-paid-badge {
          margin-top: 0.35rem;
        }

        .invoice-divider {
          height: 1px;
          background: var(--border-color);
          margin: 1.25rem 0;
        }

        .invoice-parties-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .party-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .party-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0.2rem 0;
        }
        .party-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.85rem;
        }
        .invoice-table th {
          background: var(--bg-card-elevated);
          padding: 0.65rem 0.85rem;
          text-align: left;
          color: var(--text-secondary);
          font-weight: 600;
          border-bottom: 1px solid var(--border-color);
        }
        .invoice-table td {
          padding: 0.75rem 0.85rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-secondary);
        }
        .text-right {
          text-align: right;
        }
        .table-subtext {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .invoice-totals-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .invoice-notes {
          flex: 1;
          min-width: 200px;
          font-size: 0.775rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .invoice-notes h6 {
          font-size: 0.825rem;
          color: var(--text-primary);
        }

        .official-stamp {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          border: 1.5px dashed var(--accent-primary);
          border-radius: var(--radius-sm);
          background: rgba(16, 185, 129, 0.05);
        }
        .official-stamp strong {
          display: block;
          font-size: 0.75rem;
          color: var(--accent-primary);
        }
        .official-stamp span {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .totals-box {
          width: 240px;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .total-grand {
          font-size: 1.1rem;
          color: var(--text-primary);
          font-weight: 700;
        }
        .grand-amount {
          color: var(--accent-primary);
        }

        .invoice-footer-note {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .modal-overlay {
            position: static;
            background: none;
            padding: 0;
          }
          .invoice-sheet {
            box-shadow: none;
            border: none;
          }
        }
      `}</style>
    </div>
  );
};
