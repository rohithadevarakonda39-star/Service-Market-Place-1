import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Banknote, 
  Tag, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Lock, 
  FileText, 
  Download, 
  Printer, 
  Sparkles,
  QrCode,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { availableCoupons } from '../data/paymentsData';

export const PaymentPage = () => {
  const { 
    pageParams, 
    bookings, 
    navigateTo, 
    addToast, 
    processPayment, 
    openInvoiceModal,
    theme 
  } = useApp();

  const bookingId = pageParams?.bookingId;
  const booking = bookings.find(b => b.id === bookingId || b.bookingId === bookingId) || bookings[0];

  // Payment method selection
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi', 'card', 'debit', 'netbanking', 'wallet', 'cash'
  
  // Card form state
  const [cardForm, setCardForm] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardName: 'Alex Morgan',
    expiry: '08/29',
    cvv: '•••'
  });

  // UPI state
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [activeUpiApp, setActiveUpiApp] = useState('gpay');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState('servigo');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  const [testSimulateFailure, setTestSimulateFailure] = useState(false);

  // Financial calculations
  const rawBasePrice = booking?.price || booking?.pricing?.basePrice || 499;
  const rawAdditional = booking?.additionalCharges || booking?.pricing?.serviceFee || 0;
  const rawEmergency = booking?.isEmergency ? 20 : 0;
  const subtotal = rawBasePrice + rawAdditional + rawEmergency;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountFlat) {
      discount = appliedCoupon.discountFlat;
    } else if (appliedCoupon.discountPercent) {
      const calc = (subtotal * appliedCoupon.discountPercent) / 100;
      discount = Math.min(calc, appliedCoupon.maxDiscount || calc);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.05).toFixed(2)); // 5% GST/Platform tax
  const finalTotal = Number((taxableAmount + tax).toFixed(2));

  // Handle Coupon Application
  const handleApplyCoupon = (codeToApply = couponCode) => {
    const code = (codeToApply || '').trim().toUpperCase();
    setCouponError('');

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const matched = availableCoupons.find(c => c.code === code);
    if (!matched) {
      setCouponError('Invalid coupon code. Try WELCOME10 or SERVIGO20.');
      return;
    }

    if (matched.minOrder && subtotal < matched.minOrder) {
      setCouponError(`Minimum booking amount of ₹${matched.minOrder} required for ${code}.`);
      return;
    }

    setAppliedCoupon(matched);
    setCouponCode(matched.code);
    addToast(`Coupon "${matched.code}" applied successfully! Saved ₹${matched.discountFlat || ((subtotal * matched.discountPercent) / 100).toFixed(0)}`, 'success');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    addToast('Coupon removed.', 'info');
  };

  // Execute Payment
  const handlePayNow = () => {
    if (!booking) {
      addToast('Booking reference invalid.', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (testSimulateFailure) {
        addToast('Payment authorization simulated failure. Please retry or choose another method.', 'error');
        return;
      }

      const methodLabel = {
        upi: `UPI (${upiId || 'Direct QR'})`,
        card: `Credit Card (${cardForm.cardNumber.slice(-4)})`,
        debit: `Debit Card (${cardForm.cardNumber.slice(-4)})`,
        netbanking: `${selectedBank} NetBanking`,
        wallet: `${selectedWallet.toUpperCase()} Wallet`,
        cash: 'Cash on Service'
      }[selectedMethod] || 'UPI';

      const transaction = processPayment({
        bookingId: booking.id || booking.bookingId,
        paymentMethod: selectedMethod === 'cash' ? 'Cash on Service' : methodLabel,
        amount: finalTotal,
        subtotal,
        discount,
        tax,
        couponCode: appliedCoupon?.code || null,
        isCash: selectedMethod === 'cash'
      });

      setPaymentSuccessData(transaction);
      addToast(selectedMethod === 'cash' ? 'Cash on Service order recorded!' : 'Payment processed successfully!', 'success');
    }, 1400);
  };

  if (!booking) {
    return (
      <div className="container py-12 text-center">
        <AlertCircle size={48} className="text-warning mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Active Booking Found</h2>
        <p className="text-muted mb-6">The booking you are trying to pay for could not be found or has expired.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('bookings')}>
          Return to My Bookings
        </button>
      </div>
    );
  }

  // Success Confirmation Screen
  if (paymentSuccessData) {
    return (
      <div className="container max-w-3xl py-10 animate-fade-in">
        <div className="card text-center p-8 bg-surface border-emerald-subtle shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>

          <span className="badge badge-verified mb-2">
            {paymentSuccessData.status === 'CASH_PENDING' ? 'CASH ON SERVICE CONFIRMED' : 'PAYMENT SUCCESSFUL'}
          </span>

          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            {paymentSuccessData.status === 'CASH_PENDING' ? 'Booking Ready for Cash Pay' : 'Payment Completed!'}
          </h1>
          <p className="text-muted mb-6 max-w-md mx-auto text-sm">
            {paymentSuccessData.status === 'CASH_PENDING'
              ? 'Your booking is locked in. You can pay cash directly to the verified specialist upon service completion.'
              : 'Thank you! Your payment was verified securely. A receipt has been issued and your provider is notified.'}
          </p>

          {/* Payment receipt card */}
          <div className="bg-surface-elevated rounded-xl p-6 text-left border border-border mb-8 max-w-lg mx-auto">
            <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
              <div>
                <span className="text-xs text-muted block">Transaction ID</span>
                <span className="font-mono text-sm font-bold text-foreground">{paymentSuccessData.transactionId}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted block">Booking ID</span>
                <span className="font-mono text-sm font-semibold text-emerald-400">{booking.bookingId || booking.id}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted">Service</span>
                <span className="font-medium text-foreground">{booking.serviceName || booking.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Provider</span>
                <span className="font-medium text-foreground">{booking.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Payment Mode</span>
                <span className="font-medium text-foreground">{paymentSuccessData.paymentMethod}</span>
              </div>
              {paymentSuccessData.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Savings ({paymentSuccessData.couponCode})</span>
                  <span>-₹{paymentSuccessData.discount}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border font-bold text-base">
                <span>Total Amount</span>
                <span className="text-emerald-400">₹{paymentSuccessData.finalAmount}</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3 text-xs text-emerald-300">
              <ShieldCheck size={18} className="shrink-0" />
              <span>Protected by ServiGo SafePay Assurance. No direct provider fees before inspection.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              className="btn btn-primary flex items-center gap-2"
              onClick={() => openInvoiceModal(booking)}
            >
              <FileText size={18} />
              <span>View Official Invoice</span>
            </button>

            <button 
              className="btn btn-secondary flex items-center gap-2"
              onClick={() => navigateTo('tracking', { bookingId: booking.id || booking.bookingId })}
            >
              <MapPin size={18} />
              <span>Track Specialist</span>
            </button>

            <button 
              className="btn btn-outline"
              onClick={() => navigateTo('bookings')}
            >
              My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <button 
          className="btn btn-outline btn-sm flex items-center gap-2"
          onClick={() => navigateTo('booking-details', { bookingId: booking.id || booking.bookingId })}
        >
          <ArrowLeft size={16} />
          <span>Back to Booking Details</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-muted">
          <Lock size={14} className="text-emerald-400" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Payment Methods Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card p-6 bg-surface">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Select Payment Method</h2>
                <p className="text-xs text-muted">Choose your preferred transaction channel (India / Razorpay Ready)</p>
              </div>
              <span className="badge badge-emerald text-xs">Simulated Test Mode</span>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                  selectedMethod === 'upi'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-sm'
                    : 'border-border bg-surface-elevated text-muted hover:border-border-hover'
                }`}
                onClick={() => setSelectedMethod('upi')}
              >
                <Smartphone size={22} />
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                  selectedMethod === 'card'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-sm'
                    : 'border-border bg-surface-elevated text-muted hover:border-border-hover'
                }`}
                onClick={() => setSelectedMethod('card')}
              >
                <CreditCard size={22} />
                <span className="text-xs">Credit Card</span>
              </button>

              <button
                type="button"
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                  selectedMethod === 'debit'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-sm'
                    : 'border-border bg-surface-elevated text-muted hover:border-border-hover'
                }`}
                onClick={() => setSelectedMethod('debit')}
              >
                <CreditCard size={22} />
                <span className="text-xs">Debit Card</span>
              </button>

              <button
                type="button"
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                  selectedMethod === 'netbanking'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-sm'
                    : 'border-border bg-surface-elevated text-muted hover:border-border-hover'
                }`}
                onClick={() => setSelectedMethod('netbanking')}
              >
                <Building2 size={22} />
                <span className="text-xs">Net Banking</span>
              </button>

              <button
                type="button"
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                  selectedMethod === 'wallet'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-sm'
                    : 'border-border bg-surface-elevated text-muted hover:border-border-hover'
                }`}
                onClick={() => setSelectedMethod('wallet')}
              >
                <Wallet size={22} />
                <span className="text-xs">Wallets</span>
              </button>

              <button
                type="button"
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                  selectedMethod === 'cash'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-sm'
                    : 'border-border bg-surface-elevated text-muted hover:border-border-hover'
                }`}
                onClick={() => setSelectedMethod('cash')}
              >
                <Banknote size={22} />
                <span className="text-xs">Cash on Service</span>
              </button>
            </div>

            {/* Method Details Pane */}
            <div className="bg-surface-elevated border border-border rounded-xl p-5">
              {/* 1. UPI */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Instant UPI Payment</span>
                    <span className="text-xs text-muted">Zero transaction fee</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {['gpay', 'phonepe', 'paytm', 'bhim'].map(app => (
                      <button
                        key={app}
                        type="button"
                        className={`p-2 rounded-lg border text-xs font-semibold uppercase text-center transition-all ${
                          activeUpiApp === app
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                            : 'border-border text-muted hover:border-border-hover'
                        }`}
                        onClick={() => setActiveUpiApp(app)}
                      >
                        {app}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Enter Virtual Payment Address (VPA)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="input-field w-full pl-3 pr-24 text-sm"
                        placeholder="username@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <button 
                        type="button"
                        className="absolute right-2 top-2 text-xs font-bold text-emerald-400 hover:underline px-2 py-1"
                        onClick={() => addToast('VPA format verified!', 'success')}
                      >
                        Verify VPA
                      </button>
                    </div>
                  </div>

                  {/* QR Code Demo Preview */}
                  <div className="border border-border/80 rounded-lg p-3 bg-background flex items-center gap-4">
                    <div className="w-16 h-16 bg-surface-elevated border border-border rounded flex items-center justify-center text-emerald-400">
                      <QrCode size={40} />
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-foreground">Or Scan & Pay with any UPI App</p>
                      <p className="text-muted">Dynamic Razorpay QR generated for ₹{finalTotal}</p>
                      <span className="text-[10px] text-emerald-400 font-mono">Timer: 09:58 remaining</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Credit / Debit Card */}
              {(selectedMethod === 'card' || selectedMethod === 'debit') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {selectedMethod === 'card' ? 'Credit Card' : 'Debit Card'} Information
                    </span>
                    <span className="text-xs text-muted">Simulated test cards allowed</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="input-field w-full font-mono text-sm"
                        placeholder="•••• •••• •••• ••••"
                        value={cardForm.cardNumber}
                        onChange={(e) => setCardForm({...cardForm, cardNumber: e.target.value})}
                      />
                      <CreditCard className="absolute right-3 top-3 text-muted" size={16} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">Cardholder Name</label>
                      <input 
                        type="text" 
                        className="input-field w-full text-sm"
                        placeholder="e.g. Alex Morgan"
                        value={cardForm.cardName}
                        onChange={(e) => setCardForm({...cardForm, cardName: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-muted mb-1">Expiry</label>
                        <input 
                          type="text" 
                          className="input-field w-full text-center text-sm font-mono"
                          placeholder="MM/YY"
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({...cardForm, expiry: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted mb-1">CVV</label>
                        <input 
                          type="password" 
                          className="input-field w-full text-center text-sm font-mono"
                          placeholder="•••"
                          maxLength={4}
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({...cardForm, cvv: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-muted flex items-center gap-2">
                    <Lock size={12} className="text-emerald-400" />
                    <span>Card credentials are never saved on ServiGo servers. Verified via PCI-DSS Vault.</span>
                  </div>
                </div>
              )}

              {/* 3. Net Banking */}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-4">
                  <span className="text-sm font-semibold text-foreground block">Select Financial Institution</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'Punjab National'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                          selectedBank === bank
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                            : 'border-border text-foreground hover:border-border-hover'
                        }`}
                        onClick={() => setSelectedBank(bank)}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted">You will be securely redirected to {selectedBank} NetBanking gateway to authorize the transaction.</p>
                </div>
              )}

              {/* 4. Digital Wallets */}
              {selectedMethod === 'wallet' && (
                <div className="space-y-4">
                  <span className="text-sm font-semibold text-foreground block">Select Connected Wallet</span>
                  <div className="space-y-2">
                    {[
                      { id: 'servigo', name: 'ServiGo Cash Wallet', balance: '₹1,250.00' },
                      { id: 'paytm', name: 'Paytm Wallet', balance: '₹410.00' },
                      { id: 'amazon', name: 'Amazon Pay Balance', balance: '₹220.00' }
                    ].map(w => (
                      <div
                        key={w.id}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          selectedWallet === w.id
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-border hover:border-border-hover'
                        }`}
                        onClick={() => setSelectedWallet(w.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Wallet size={18} className={selectedWallet === w.id ? 'text-emerald-400' : 'text-muted'} />
                          <div>
                            <span className="text-sm font-medium text-foreground block">{w.name}</span>
                            <span className="text-xs text-muted">Available: {w.balance}</span>
                          </div>
                        </div>
                        {selectedWallet === w.id && <Check size={16} className="text-emerald-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Cash on Service */}
              {selectedMethod === 'cash' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-warning">
                    <Banknote size={24} />
                    <h4 className="font-bold text-foreground">Cash on Service Delivery</h4>
                  </div>
                  <p className="text-xs text-muted">
                    No online advance charge required right now. Pay the exact bill amount (₹{finalTotal}) directly in cash or UPI to the provider upon completion of the task.
                  </p>
                  <div className="bg-surface p-3 rounded border border-border text-xs text-muted">
                    • Physical inspection must be completed before handing over cash.<br />
                    • Provider will issue a verified digital receipt directly to your ServiGo account.
                  </div>
                </div>
              )}
            </div>

            {/* Test Simulation Controls */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
              <span>Developer Test Simulation:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={testSimulateFailure} 
                  onChange={(e) => setTestSimulateFailure(e.target.checked)} 
                  className="rounded text-emerald-500"
                />
                <span className={testSimulateFailure ? 'text-rose-400 font-semibold' : ''}>
                  Simulate Gateway Failure
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card p-6 bg-surface border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Payment Summary</h3>

            {/* Service & Provider brief */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border mb-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
                {booking.serviceName?.charAt(0) || 'S'}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-semibold text-foreground truncate">{booking.serviceName || booking.serviceTitle}</h4>
                <p className="text-xs text-muted truncate">Specialist: {booking.providerName}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted mt-1">
                  <span>{booking.date}</span>
                  <span>•</span>
                  <span>{booking.timeSlot || booking.time}</span>
                </div>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Have a Promo Code?
              </label>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <div>
                      <span className="font-bold block">{appliedCoupon.code} Applied</span>
                      <span className="text-[11px] text-emerald-300">{appliedCoupon.description}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="text-xs text-rose-400 hover:underline font-semibold"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 text-muted" size={15} />
                    <input 
                      type="text" 
                      placeholder="e.g. WELCOME10, SERVIGO20"
                      className="input-field w-full pl-9 text-xs uppercase"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleApplyCoupon()}
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {couponError}
                </p>
              )}

              {/* Fast click suggested coupons */}
              {!appliedCoupon && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {availableCoupons.slice(0, 3).map(c => (
                    <button
                      key={c.code}
                      type="button"
                      className="text-[10px] bg-surface-elevated hover:bg-emerald-500/10 hover:text-emerald-400 border border-border px-2 py-0.5 rounded transition-all"
                      onClick={() => handleApplyCoupon(c.code)}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-sm pt-4 border-t border-border">
              <div className="flex justify-between text-muted">
                <span>Base Service Price</span>
                <span>₹{rawBasePrice}</span>
              </div>

              {rawAdditional > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Additional Diagnostics</span>
                  <span>₹{rawAdditional}</span>
                </div>
              )}

              {booking.isEmergency && (
                <div className="flex justify-between text-rose-400">
                  <span>Rapid Emergency Dispatch</span>
                  <span>+₹20.00</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted">
                <span>Platform Fee & GST (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-border text-base font-extrabold text-foreground">
                <span>Total Payable</span>
                <span className="text-xl text-emerald-400">₹{finalTotal}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              className="btn btn-primary w-full mt-6 py-3 text-base font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20"
              disabled={isProcessing}
              onClick={handlePayNow}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authorizing via Secure Gateway...</span>
                </>
              ) : selectedMethod === 'cash' ? (
                <>
                  <Banknote size={18} />
                  <span>Confirm Cash on Service (₹{finalTotal})</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Pay Now • ₹{finalTotal}</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-400" /> Razorpay Secured
              </span>
              <span>•</span>
              <span>100% Refund Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
