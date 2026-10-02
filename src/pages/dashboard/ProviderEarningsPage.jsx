import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  ShieldCheck, 
  Briefcase, 
  Wallet, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Building2,
  ChevronRight
} from 'lucide-react';

export const ProviderEarningsPage = () => {
  const { bookings, payments, navigateTo, addToast } = useApp();

  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);

  // Financial aggregates
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED' || b.paymentStatus === 'PAID');
  const grossEarnings = completedJobs.reduce((acc, b) => acc + (b.price || b.pricing?.basePrice || 499), 0) + 1250;
  const platformCommissionRate = 0.10; // 10%
  const commissionDeduction = Number((grossEarnings * platformCommissionRate).toFixed(2));
  const netEarnings = Number((grossEarnings - commissionDeduction).toFixed(2));
  const availableBalance = Number((netEarnings * 0.45).toFixed(2)); // Available for instant withdrawal

  // Daily earnings simulation for charts
  const weeklyData = [
    { day: 'Mon', amount: 140, jobs: 2 },
    { day: 'Tue', amount: 260, jobs: 3 },
    { day: 'Wed', amount: 190, jobs: 2 },
    { day: 'Thu', amount: 320, jobs: 4 },
    { day: 'Fri', amount: 410, jobs: 5 },
    { day: 'Sat', amount: 480, jobs: 6 },
    { day: 'Sun', amount: 220, jobs: 3 }
  ];

  const maxWeeklyAmount = Math.max(...weeklyData.map(d => d.amount));

  const handleWithdrawalRequest = () => {
    addToast(`Payout request of ₹${availableBalance} submitted to HDFC Bank (•••• 4921). Disbursal within 2 hours.`, 'success');
    setPayoutModalOpen(false);
  };

  return (
    <div className="container max-w-6xl py-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button 
            className="btn btn-outline btn-sm flex items-center gap-2 mb-2"
            onClick={() => navigateTo('provider-dashboard')}
          >
            <ArrowLeft size={16} />
            <span>Back to Provider Center</span>
          </button>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Earnings & Settlements</h1>
          <p className="text-sm text-muted">Real-time revenue metrics, commission audits, and bank disbursements</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="btn btn-primary flex items-center gap-2 shadow-lg"
            onClick={() => setPayoutModalOpen(true)}
          >
            <Wallet size={16} />
            <span>Withdraw Balance (₹{availableBalance})</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 bg-surface border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted uppercase">Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <span className="text-2xl font-bold text-foreground">₹{grossEarnings.toFixed(2)}</span>
          <span className="text-[11px] text-emerald-400 block mt-1">+14.2% vs last cycle</span>
        </div>

        <div className="card p-5 bg-surface border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted uppercase">Net Payouts</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <span className="text-2xl font-bold text-foreground">₹{netEarnings.toFixed(2)}</span>
          <span className="text-[11px] text-muted block mt-1">After 10% platform fee</span>
        </div>

        <div className="card p-5 bg-surface border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted uppercase">Platform Fee</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <span className="text-2xl font-bold text-foreground">₹{commissionDeduction.toFixed(2)}</span>
          <span className="text-[11px] text-amber-400 block mt-1">Includes insurance & guarantee</span>
        </div>

        <div className="card p-5 bg-surface border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted uppercase">Available Balance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Wallet size={18} />
            </div>
          </div>
          <span className="text-2xl font-bold text-emerald-400">₹{availableBalance.toFixed(2)}</span>
          <span className="text-[11px] text-muted block mt-1">Ready for 1-click payout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card p-6 bg-surface border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Weekly Revenue Trend</h3>
                <p className="text-xs text-muted">Daily job payouts for the current cycle</p>
              </div>
              <div className="flex gap-1 bg-surface-elevated p-1 rounded-lg border border-border">
                {['week', 'month', 'year'].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`px-3 py-1 text-xs font-semibold rounded capitalize transition-all ${
                      dateRange === r ? 'bg-emerald-500 text-black shadow' : 'text-muted hover:text-foreground'
                    }`}
                    onClick={() => setDateRange(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Bar Chart Visual */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-border">
              {weeklyData.map(d => {
                const heightPercent = Math.max(15, (d.amount / maxWeeklyAmount) * 100);

                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[11px] font-mono text-muted group-hover:text-emerald-400 transition-colors">
                      ₹{d.amount}
                    </span>
                    <div className="w-full bg-surface-elevated rounded-t-lg overflow-hidden h-48 flex items-end">
                      <div
                        className="w-full bg-emerald-500/70 group-hover:bg-emerald-400 transition-all rounded-t duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-4 text-xs text-muted">
              <span>Total Jobs Billed: 25 completed services</span>
              <span className="text-emerald-400 font-semibold">Average Ticket: ₹320.00</span>
            </div>
          </div>

          {/* Recent Payout Settlements Ledger */}
          <div className="card p-6 bg-surface border-border">
            <h3 className="text-base font-bold text-foreground mb-4">Recent Settlements & Transferred Payouts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-elevated text-xs font-semibold text-muted uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Payout Ref</th>
                    <th className="py-3 px-4">Destination Bank</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { ref: 'PAY-20261001-901', bank: 'HDFC Bank (•••• 4921)', date: 'Oct 01, 2026', amount: 840.00, status: 'PROCESSED' },
                    { ref: 'PAY-20260924-442', bank: 'HDFC Bank (•••• 4921)', date: 'Sep 24, 2026', amount: 1120.00, status: 'PROCESSED' },
                    { ref: 'PAY-20260917-109', bank: 'HDFC Bank (•••• 4921)', date: 'Sep 17, 2026', amount: 950.00, status: 'PROCESSED' }
                  ].map(p => (
                    <tr key={p.ref} className="hover:bg-surface-elevated/50">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-foreground">{p.ref}</td>
                      <td className="py-3 px-4 text-xs text-muted flex items-center gap-2">
                        <Building2 size={14} className="text-emerald-400" />
                        <span>{p.bank}</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted">{p.date}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 text-sm">₹{p.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="badge badge-verified text-[10px] py-0.5 px-2">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Settlement Account & Commission Policy */}
        <div className="lg:col-span-4 space-y-6">
          {/* Linked Bank Card */}
          <div className="card p-6 bg-surface border-border">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Payout Destination Account
            </h4>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-400" />
                  HDFC Bank Direct Deposit
                </span>
                <span className="badge badge-verified text-[10px]">Verified</span>
              </div>
              <div className="space-y-1 font-mono text-xs text-muted">
                <p>Account: •••••••• 4921</p>
                <p>IFSC: HDFC0000240</p>
                <p>Beneficiary: Rahul Kumar Tech Services</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-muted">
              <div className="flex justify-between">
                <span>Standard Payout Schedule</span>
                <span className="font-semibold text-foreground">Every Tuesday</span>
              </div>
              <div className="flex justify-between">
                <span>Instant Withdrawal Fee</span>
                <span className="font-semibold text-emerald-400">0% (Promotional)</span>
              </div>
            </div>
          </div>

          {/* Platform Commission Transparent Policy */}
          <div className="card p-6 bg-surface border-border">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
              ServiGo Partner Commission
            </h4>
            <p className="text-xs text-muted leading-relaxed mb-4">
              ServiGo deducts a flat 10% platform fee from completed bookings to fund marketing, lead generation, 24/7 customer support, and ₹50,000 SafeCare property damage guarantee.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero lead acquisition costs</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Automated GST invoice generation</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Direct escrow payment protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Dialog Modal */}
      {payoutModalOpen && (
        <div className="modal-overlay" onClick={() => setPayoutModalOpen(false)}>
          <div className="modal-content max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Withdraw Partner Earnings</h3>
              <button className="nav-icon-btn btn-sm" onClick={() => setPayoutModalOpen(false)}>✕</button>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border mb-4 text-center">
              <span className="text-xs text-muted uppercase font-bold block mb-1">Available for Transfer</span>
              <span className="text-3xl font-extrabold text-emerald-400">₹{availableBalance.toFixed(2)}</span>
            </div>

            <div className="space-y-3 mb-6 text-xs text-muted">
              <div className="flex justify-between">
                <span>Transfer To</span>
                <span className="font-semibold text-foreground">HDFC Bank (•••• 4921)</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Arrival</span>
                <span className="font-semibold text-emerald-400">Under 15 minutes (IMPS)</span>
              </div>
              <div className="flex justify-between">
                <span>Transfer Charges</span>
                <span className="font-semibold text-foreground">₹0.00</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="btn btn-primary flex-1 py-2.5 font-bold text-sm"
                onClick={handleWithdrawalRequest}
              >
                Confirm Payout Transfer
              </button>
              <button
                type="button"
                className="btn btn-outline py-2.5 text-sm"
                onClick={() => setPayoutModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
