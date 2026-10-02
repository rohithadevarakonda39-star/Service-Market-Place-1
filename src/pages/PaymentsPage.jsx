import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Download, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Receipt,
  Wallet,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const PaymentsPage = () => {
  const { payments, bookings, openInvoiceModal, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Filter transactions
  const filteredPayments = (payments || []).filter(tx => {
    const matchesSearch = 
      (tx.transactionId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.bookingId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.paymentMethod || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || tx.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Aggregate metrics
  const totalPaid = (payments || [])
    .filter(p => p.status === 'SUCCESS' || p.status === 'CASH_PAID')
    .reduce((acc, curr) => acc + (curr.finalAmount || curr.amount || 0), 0);

  const pendingAmount = (payments || [])
    .filter(p => p.status === 'CASH_PENDING' || p.status === 'PENDING')
    .reduce((acc, curr) => acc + (curr.finalAmount || curr.amount || 0), 0);

  return (
    <div className="container py-8 max-w-6xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Payment Ledger & Receipts</h1>
          <p className="text-sm text-muted">Complete financial transaction history, tax invoices, and payment statuses</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="btn btn-outline btn-sm flex items-center gap-2"
            onClick={() => navigateTo('bookings')}
          >
            <span>My Bookings</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 bg-surface border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <span className="text-xs text-muted font-medium uppercase tracking-wider block">Total Disbursed</span>
            <span className="text-2xl font-bold text-foreground">₹{totalPaid.toFixed(2)}</span>
            <span className="text-[11px] text-emerald-400 block mt-0.5">Verified SafePay Transactions</span>
          </div>
        </div>

        <div className="card p-5 bg-surface border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-xs text-muted font-medium uppercase tracking-wider block">Cash / Pending</span>
            <span className="text-2xl font-bold text-foreground">₹{pendingAmount.toFixed(2)}</span>
            <span className="text-[11px] text-amber-400 block mt-0.5">Payable upon work completion</span>
          </div>
        </div>

        <div className="card p-5 bg-surface border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
            <Receipt size={24} />
          </div>
          <div>
            <span className="text-xs text-muted font-medium uppercase tracking-wider block">Total Records</span>
            <span className="text-2xl font-bold text-foreground">{(payments || []).length}</span>
            <span className="text-[11px] text-sky-400 block mt-0.5">Official GST-Compliant Invoices</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="card p-4 bg-surface border-border mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search by Txn ID, Booking, Service..."
              className="input-field w-full pl-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {[
              { id: 'ALL', label: 'All Transactions' },
              { id: 'SUCCESS', label: 'Paid' },
              { id: 'CASH_PENDING', label: 'Cash Pending' },
              { id: 'FAILED', label: 'Failed' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === f.id
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'bg-surface-elevated text-muted hover:text-foreground border border-border'
                }`}
                onClick={() => setFilterStatus(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      {filteredPayments.length === 0 ? (
        <div className="card p-12 text-center bg-surface border-border">
          <Receipt size={48} className="text-muted mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-1">No Transactions Found</h3>
          <p className="text-xs text-muted mb-4">No payment transactions match your query or filter criteria.</p>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden bg-surface border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated text-xs font-semibold text-muted uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Service & Provider</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPayments.map(tx => {
                  const matchedBooking = bookings.find(b => b.id === tx.bookingId || b.bookingId === tx.bookingId);

                  return (
                    <tr key={tx.transactionId} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-foreground">
                        {tx.transactionId}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          className="font-mono text-xs text-emerald-400 hover:underline"
                          onClick={() => navigateTo('booking-details', { bookingId: tx.bookingId })}
                        >
                          {tx.bookingId}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-foreground block text-xs">{tx.serviceName}</span>
                        <span className="text-[11px] text-muted block">{tx.providerName}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs text-foreground block">{tx.paymentMethod}</span>
                        <span className="text-[10px] text-muted font-mono">{tx.methodDetails || tx.gateway}</span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-muted whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-foreground text-sm">₹{tx.finalAmount || tx.amount}</span>
                        {tx.discount > 0 && (
                          <span className="block text-[10px] text-emerald-400">-₹{tx.discount} coupon</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {tx.status === 'SUCCESS' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle size={11} /> PAID
                          </span>
                        )}
                        {tx.status === 'CASH_PENDING' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Clock size={11} /> CASH PENDING
                          </span>
                        )}
                        {tx.status === 'FAILED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <AlertCircle size={11} /> FAILED
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm py-1 px-2.5 text-xs flex items-center gap-1.5 ml-auto"
                          onClick={() => {
                            if (matchedBooking) {
                              openInvoiceModal(matchedBooking);
                            } else {
                              openInvoiceModal({
                                id: tx.bookingId,
                                bookingId: tx.bookingId,
                                serviceName: tx.serviceName,
                                providerName: tx.providerName,
                                providerPhone: '+1 (555) 019-2834',
                                address: 'Springfield Metro Area',
                                date: 'Oct 02, 2026',
                                invoiceNumber: tx.invoiceNumber || 'INV-2026-9042',
                                issueDate: 'Oct 02, 2026',
                                pricing: {
                                  basePrice: tx.amount,
                                  serviceFee: 0,
                                  discount: tx.discount || 0,
                                  tax: tx.tax || 0,
                                  total: tx.finalAmount || tx.amount
                                }
                              });
                            }
                          }}
                        >
                          <FileText size={13} />
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
