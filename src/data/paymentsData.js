// Initial Mock Payment Transactions for Phase 4
export const initialPayments = [
  {
    transactionId: "TXN-20261001-8921",
    bookingId: "SV-20261001-9042",
    serviceName: "AC Deep Clean & Coil Overhaul",
    providerName: "Rahul Kumar",
    amount: 549,
    discount: 50,
    tax: 27.45,
    finalAmount: 526.45,
    paymentMethod: "UPI",
    methodDetails: "rahul.tech@okaxis",
    status: "SUCCESS",
    date: "2026-10-01T14:32:00Z",
    invoiceNumber: "INV-2026-9042",
    gateway: "Razorpay (Test Mode)"
  },
  {
    transactionId: "TXN-20260928-4412",
    bookingId: "SV-20260928-3190",
    serviceName: "Kitchen Pipe Burst Emergency Repair",
    providerName: "David Miller",
    amount: 120,
    discount: 0,
    tax: 6.00,
    finalAmount: 126.00,
    paymentMethod: "Credit Card",
    methodDetails: "Visa ending in 4242",
    status: "SUCCESS",
    date: "2026-09-28T11:15:00Z",
    invoiceNumber: "INV-2026-3190",
    gateway: "Razorpay (Test Mode)"
  },
  {
    transactionId: "TXN-20260925-1082",
    bookingId: "SV-20260925-1082",
    serviceName: "Master Electrical Panel Diagnostics",
    providerName: "Amina Al-Mansoor",
    amount: 140,
    discount: 20,
    tax: 7.00,
    finalAmount: 127.00,
    paymentMethod: "Net Banking",
    methodDetails: "HDFC Bank NetBanking",
    status: "SUCCESS",
    date: "2026-09-25T16:45:00Z",
    invoiceNumber: "INV-2026-1082",
    gateway: "Razorpay (Test Mode)"
  },
  {
    transactionId: "TXN-20261002-3310",
    bookingId: "SV-20261002-4821",
    serviceName: "Smart Lock Installation & Hub Setup",
    providerName: "Marcus Vance",
    amount: 85,
    discount: 0,
    tax: 4.25,
    finalAmount: 89.25,
    paymentMethod: "Cash on Service",
    methodDetails: "Direct Cash / Countertop",
    status: "CASH_PENDING",
    date: "2026-10-02T09:00:00Z",
    invoiceNumber: "INV-2026-4821",
    gateway: "Cash on Delivery"
  }
];

export const availableCoupons = [
  {
    code: "WELCOME10",
    discountPercent: 10,
    maxDiscount: 100,
    minOrder: 200,
    description: "10% off up to ₹100 on your booking"
  },
  {
    code: "SERVIGO20",
    discountPercent: 20,
    maxDiscount: 200,
    minOrder: 400,
    description: "20% off up to ₹200 for smart homeowners"
  },
  {
    code: "FIRSTBOOKING",
    discountFlat: 150,
    minOrder: 400,
    description: "Flat ₹150 off on orders above ₹400"
  },
  {
    code: "EMERGENCY50",
    discountFlat: 50,
    minOrder: 100,
    description: "Flat ₹50 priority assistance voucher"
  }
];
