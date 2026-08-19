import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCourseById } from '../../api/courseApi';
import { createOrder, verifyPayment } from '../../api/checkoutApi';

const STEPS = {
  REVIEW: 'review',
  PAYING: 'paying',
  SUCCESS: 'success',
};

// --- Icons ---
function AmazonPayIcon() {
  return (
    <svg className="w-6 h-6 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 12.3c0 3.3-1.6 5.5-4.4 5.5-2.6 0-4.1-2-4.1-5.1 0-3.2 1.6-5.3 4.4-5.3 2.5 0 4.1 1.9 4.1 4.9zm-4.3-7.2c-4.4 0-7.7 2.8-7.7 7.5 0 4.8 3.4 7.6 7.9 7.6 3.1 0 5.4-1.3 6.8-3.7l-2.2-1.4c-.9 1.4-2.3 2.1-4 2.1-2.2 0-3.6-1.3-3.9-3.5h9.8c.1-.5.1-1 .1-1.4 0-4.7-2.6-7.6-6.8-7.6z"/>
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg className="w-6 h-6 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function UpiIcon() {
  return (
    <svg className="w-6 h-6 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

export default function CheckoutPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Core Data State
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(STEPS.REVIEW);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // New UI State
  const [selectedMethod, setSelectedMethod] = useState('amazonpay');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    name: "Alex Johnson",
    street: "123 Innovation Way, Suite 400",
    city: "Tech City",
    state: "CA",
    zip: "94016"
  });
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  useEffect(() => {
    let cancelled = false;
    getCourseById(courseId)
      .then((res) => {
        if (!cancelled) setCourse(res.data.data || res.data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load course details.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [courseId]);

  // Derived Pricing Calculations
  const coursePrice = typeof course?.price === 'number' ? course.price : 0;
  const shippingFee = 0; // Digital course
  const tax = coursePrice * 0.18; // Example: 18% tax
  const grandTotal = (coursePrice + shippingFee + tax).toFixed(2);

  const handlePay = async () => {
    setError(null);
    setProcessing(true);
    setStep(STEPS.PAYING);

    try {
      // Create order via API using the calculated grand total
      const order = await createOrder({ courseId, amount: parseFloat(grandTotal) });

      // Mock payment simulation payload (Replace with Razorpay/Stripe payload later)
      const mockPaymentId = `pay_mock_${Date.now()}`;
      const mockSignature = 'mock_signature';

      const result = await verifyPayment({
        orderId: order.orderId,
        paymentId: mockPaymentId,
        signature: mockSignature,
      });

      if (result.success) {
        setStep(STEPS.SUCCESS);
        toast.success('Payment successful — you are enrolled!', { theme: 'dark' });
      } else {
        throw new Error('Payment could not be verified.');
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setStep(STEPS.REVIEW);
    } finally {
      setProcessing(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="p-6 text-sm text-zinc-400">Loading checkout</div>
      </div>
    );
  }

  // 2. Error / Missing Data State
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="p-6 text-sm text-red-500">Course not found.</div>
      </div>
    );
  }

  // 3. Success State
  if (step === STEPS.SUCCESS) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-[var(--surface-glass,rgba(24,24,27,0.7))] border border-[var(--border,#27272a)] backdrop-blur-xl p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Payment successful!</h2>
          <p className="mt-2 text-sm text-zinc-400">
            You're now securely enrolled in <span className="text-zinc-200 font-semibold">{course.title}</span>.
          </p>
          <button
            onClick={() => navigate('/learner')}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all"
          >
            Go to my dashboard
          </button>
        </div>
      </div>
    );
  }

  // 4. Main Checkout Interface
  return (
    <div className="min-h-[calc(100vh-8rem)] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-[var(--surface-glass,rgba(24,24,27,0.7))] border border-[var(--border,#27272a)] rounded-3xl backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Steps & Payment Options */}
        <div className="lg:col-span-7 p-6 md:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-[var(--border,#27272a)]">
          <div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Checkout Experience</h1>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Billing / Shipping Address */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">1. Billing Details</h2>
              <button 
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-xs font-medium text-amber-400 hover:underline"
              >
                {isEditingAddress ? 'Done' : 'Change'}
              </button>
            </div>

            {isEditingAddress ? (
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[var(--border,#27272a)] bg-zinc-900/50">
                <input 
                  type="text" 
                  value={address.name} 
                  onChange={(e) => setAddress({...address, name: e.target.value})}
                  placeholder="Full Name"
                  className="col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-400 transition-colors"
                />
                <input 
                  type="text" 
                  value={address.street} 
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                  placeholder="Street Address"
                  className="col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-400 transition-colors"
                />
                <input 
                  type="text" 
                  value={address.city} 
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  placeholder="City"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-400 transition-colors"
                />
                <input 
                  type="text" 
                  value={address.zip} 
                  onChange={(e) => setAddress({...address, zip: e.target.value})}
                  placeholder="ZIP / Postal Code"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-[var(--border,#27272a)] bg-zinc-900/40 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm text-white">{address.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{address.street}, {address.city}, {address.state} {address.zip}</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_#10b981]" />
              </div>
            )}
          </div>

          {/* Step 2: Payment Methods */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">2. Choose Payment Method</h2>
            
            <div className="space-y-3">

              {/* Option B: UPI */}
              <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-emerald-400 bg-emerald-500/10' : 'border-[var(--border,#27272a)] bg-zinc-900/40 hover:bg-zinc-900'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={selectedMethod === 'upi'} 
                    onChange={() => setSelectedMethod('upi')}
                    className="accent-emerald-500"
                  />
                  <UpiIcon />
                  <div>
                    <p className="text-sm font-semibold text-white">UPI / QR Code</p>
                    <p className="text-xs text-zinc-400">Google Pay, PhonePe, Paytm or any UPI app</p>
                  </div>
                </div>
              </label>

              {selectedMethod === 'upi' && (
                <div className="pl-7 pr-2 transition-all">
                  <input 
                    type="text"
                    placeholder="Enter UPI ID (e.g. username@oksbi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              {/* Option C: Cards */}
              <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-indigo-400 bg-indigo-500/10' : 'border-[var(--border,#27272a)] bg-zinc-900/40 hover:bg-zinc-900'}`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={selectedMethod === 'card'} 
                    onChange={() => setSelectedMethod('card')}
                    className="accent-indigo-500"
                  />
                  <CreditCardIcon />
                  <div>
                    <p className="text-sm font-semibold text-white">Credit / Debit Card</p>
                    <p className="text-xs text-zinc-400">Visa, Mastercard, RuPay, Amex</p>
                  </div>
                </div>
              </label>

              {selectedMethod === 'card' && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[var(--border,#27272a)] bg-zinc-900/55 transition-all">
                  <input 
                    type="text" 
                    placeholder="Card Number"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    className="col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 font-mono tracking-widest"
                  />
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 font-mono"
                  />
                  <input 
                    type="password" 
                    placeholder="CVV"
                    maxLength={4}
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary & CTA Box */}
        <div className="lg:col-span-5 bg-zinc-900/60 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <h2 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>Course: {course.title}</span>
                <span className="font-mono">₹{coursePrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-zinc-300">
                <span>Estimated Tax (18% GST)</span>
                <span className="font-mono">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-[var(--border,#27272a)] pt-3 flex justify-between items-baseline font-bold text-lg text-white">
                <span>Order Total</span>
                <span className="font-mono text-xl text-amber-400">₹{grandTotal}</span>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Backed by <strong className="text-amber-300">Secure A-to-Z Guarantee</strong>. Verified 256-bit encrypted checkout.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span>Place Your Order &amp; Pay ₹{grandTotal}</span>
              )}
            </button>
            <p className="text-[11px] text-center text-zinc-500">
              Payment is simulated in this build — real gateway integration pending Pod B's contract.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}