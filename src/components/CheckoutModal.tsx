import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Smartphone, Truck, ShieldCheck, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { CartItem, OrderFormData } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onClearCart,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Review, 2: Shipping, 3: Payment, 4: Confirmed
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Valid email address is required';
    }
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Valid 10-digit Indian mobile number is required';
    }
    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = 'Valid 6-digit postal PIN code is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep(3);
    }
  };

  const handleSimulatePayment = () => {
    setIsSubmitting(true);
    // Simulate gateway checkout callback
    setTimeout(() => {
      const generatedId = `STK-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedId);
      setIsSubmitting(false);
      setStep(4);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FBF9F5] rounded-2xl max-w-2xl w-full border border-[#EAE6DD] shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#EAE6DD] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold tracking-wider uppercase text-[#242320]">
              STICKS Checkout
            </span>
            <span className="text-[11px] font-mono bg-[#EAE5D9] text-[#595752] px-2 py-0.5 rounded">
              Demo Environment
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 text-[#73716A] hover:text-[#242320] rounded-full hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (Steps 1 to 3) */}
        {step < 4 && (
          <div className="px-6 py-3 bg-[#F4F1EA] border-b border-[#EAE6DD] flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1.5 font-medium ${step >= 1 ? 'text-[#242320]' : 'text-[#8C887E]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#242320] text-white' : 'bg-[#DDD8CC]'}`}>
                1
              </span>
              <span>Review</span>
            </div>
            <div className="w-8 h-[1px] bg-[#DDD8CC]" />
            <div className={`flex items-center gap-1.5 font-medium ${step >= 2 ? 'text-[#242320]' : 'text-[#8C887E]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#242320] text-white' : 'bg-[#DDD8CC]'}`}>
                2
              </span>
              <span>Delivery</span>
            </div>
            <div className="w-8 h-[1px] bg-[#DDD8CC]" />
            <div className={`flex items-center gap-1.5 font-medium ${step >= 3 ? 'text-[#242320]' : 'text-[#8C887E]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#242320] text-white' : 'bg-[#DDD8CC]'}`}>
                3
              </span>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* STEP 1: Review Order */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#242320]">Review Your Selection</h3>
              <span className="text-xs text-[#73716A]">{items.length} unique items</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant || 'default'}`}
                  className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-[#EAE6DD]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded bg-[#F2EFE9]"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-[#242320] line-clamp-1">{item.product.name}</h4>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-[#73716A]">Variant: {item.selectedVariant}</p>
                      )}
                      <span className="text-[11px] text-[#595752] font-mono">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#242320] font-mono tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="p-4 bg-[#F2EFE9] rounded-xl space-y-2 text-xs border border-[#E5DFD3]">
              <div className="flex justify-between text-[#595752]">
                <span>Items Subtotal</span>
                <span className="font-mono tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#595752]">
                <span>Carbon-Neutral Delivery (India)</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div className="pt-2 border-t border-[#DDD8CC] flex justify-between text-sm font-bold text-[#242320]">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-[#595752] hover:text-[#242320] cursor-pointer"
              >
                Back to Store
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#242320] text-[#FBF9F5] text-xs font-semibold rounded-md hover:bg-[#383733] transition-all cursor-pointer"
              >
                <span>Enter Shipping Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Shipping Form */}
        {step === 2 && (
          <form onSubmit={handleNextToPayment} className="p-6 space-y-4">
            <h3 className="text-base font-bold text-[#242320]">Delivery & Contact Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-[#4A4843] font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Priya Sharma"
                  className={`w-full px-3 py-2 bg-white rounded-md border ${
                    formErrors.fullName ? 'border-red-500' : 'border-[#D5D0C5]'
                  } focus:outline-none focus:ring-1 focus:ring-[#242320]`}
                />
                {formErrors.fullName && <p className="text-[11px] text-red-500 mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-[#4A4843] font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="priya@example.com"
                  className={`w-full px-3 py-2 bg-white rounded-md border ${
                    formErrors.email ? 'border-red-500' : 'border-[#D5D0C5]'
                  } focus:outline-none focus:ring-1 focus:ring-[#242320]`}
                />
                {formErrors.email && <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-[#4A4843] font-medium mb-1">Mobile Phone (+91) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className={`w-full px-3 py-2 bg-white rounded-md border ${
                    formErrors.phone ? 'border-red-500' : 'border-[#D5D0C5]'
                  } focus:outline-none focus:ring-1 focus:ring-[#242320]`}
                />
                {formErrors.phone && <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-[#4A4843] font-medium mb-1">PIN Code (6 digits) *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                  placeholder="560001"
                  className={`w-full px-3 py-2 bg-white rounded-md border ${
                    formErrors.pincode ? 'border-red-500' : 'border-[#D5D0C5]'
                  } focus:outline-none focus:ring-1 focus:ring-[#242320]`}
                />
                {formErrors.pincode && <p className="text-[11px] text-red-500 mt-1">{formErrors.pincode}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#4A4843] font-medium mb-1">Street Address / Apartment *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Flat 402, Green Meadows, 14th Cross"
                  className={`w-full px-3 py-2 bg-white rounded-md border ${
                    formErrors.address ? 'border-red-500' : 'border-[#D5D0C5]'
                  } focus:outline-none focus:ring-1 focus:ring-[#242320]`}
                />
                {formErrors.address && <p className="text-[11px] text-red-500 mt-1">{formErrors.address}</p>}
              </div>

              <div>
                <label className="block text-[#4A4843] font-medium mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Bengaluru"
                  className={`w-full px-3 py-2 bg-white rounded-md border ${
                    formErrors.city ? 'border-red-500' : 'border-[#D5D0C5]'
                  } focus:outline-none focus:ring-1 focus:ring-[#242320]`}
                />
                {formErrors.city && <p className="text-[11px] text-red-500 mt-1">{formErrors.city}</p>}
              </div>

              <div>
                <label className="block text-[#4A4843] font-medium mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Karnataka"
                  className={`w-full px-3 py-2 bg-white rounded-md border ${
                    formErrors.state ? 'border-red-500' : 'border-[#D5D0C5]'
                  } focus:outline-none focus:ring-1 focus:ring-[#242320]`}
                />
                {formErrors.state && <p className="text-[11px] text-red-500 mt-1">{formErrors.state}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAE6DD]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#595752] hover:text-[#242320] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Bag</span>
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#242320] text-[#FBF9F5] text-xs font-semibold rounded-md hover:bg-[#383733] transition-all cursor-pointer"
              >
                <span>Select Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Payment & Gateway Selection */}
        {step === 3 && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#242320]">Payment Method</h3>
              <p className="text-xs text-[#73716A] mt-0.5">
                Select your preferred checkout mode for this prototype order.
              </p>
            </div>

            {/* Payment Method Cards */}
            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'upi'
                    ? 'border-[#242320] bg-white ring-1 ring-[#242320]'
                    : 'border-[#EAE6DD] bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="accent-[#242320]"
                  />
                  <div className="flex items-center gap-2 text-xs font-medium text-[#242320]">
                    <Smartphone className="w-4 h-4 text-[#3D4F3E]" />
                    <span>UPI Instant (Google Pay, PhonePe, Paytm, BHIM)</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#3D523C] font-semibold">Fastest</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'card'
                    ? 'border-[#242320] bg-white ring-1 ring-[#242320]'
                    : 'border-[#EAE6DD] bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="accent-[#242320]"
                  />
                  <div className="flex items-center gap-2 text-xs font-medium text-[#242320]">
                    <CreditCard className="w-4 h-4 text-[#3D4F3E]" />
                    <span>Credit / Debit Card (Visa, MasterCard, RuPay)</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#73716A]">Gateway Tokenized</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'border-[#242320] bg-white ring-1 ring-[#242320]'
                    : 'border-[#EAE6DD] bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="accent-[#242320]"
                  />
                  <div className="flex items-center gap-2 text-xs font-medium text-[#242320]">
                    <Truck className="w-4 h-4 text-[#3D4F3E]" />
                    <span>Cash on Delivery (Pay upon delivery)</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#73716A]">Available</span>
              </label>
            </div>

            {/* Architecture Integration Notice */}
            <div className="p-4 bg-[#F2EFE9] rounded-xl border border-[#E5DFD3] text-xs text-[#595752] space-y-1">
              <div className="font-semibold text-[#242320] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3D523C]" />
                <span>Production Payment Integration Ready</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                In production, clicking complete initiates the Razorpay / Stripe Standard Checkout webhook handler. No sensitive card details touch this frontend.
              </p>
            </div>

            {/* Final Order Amount Summary */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EAE6DD]">
              <span className="text-xs text-[#595752]">
                Shipping to: <strong>{formData.city || 'India'}</strong> ({formData.pincode})
              </span>
              <div className="text-right">
                <span className="text-xs text-[#73716A] block">Total to Pay</span>
                <span className="text-lg font-bold text-[#242320] font-mono tabular-nums">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAE6DD]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#595752] hover:text-[#242320] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Address</span>
              </button>
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center min-w-44 px-6 py-3 bg-[#242320] text-[#FBF9F5] text-xs font-semibold rounded-md hover:bg-[#383733] transition-all cursor-pointer shadow-xs disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <span>Complete Order (Demo)</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Order Confirmed Screen */}
        {step === 4 && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#EBF3EA] text-[#2E6B34] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 stroke-[2]" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#73716A]">
                Order Confirmed
              </span>
              <h3 className="text-2xl font-bold text-[#242320] mt-1">
                Thank You, {formData.fullName.split(' ')[0] || 'Friend'}!
              </h3>
              <p className="text-xs text-[#595752] mt-1.5 max-w-md mx-auto">
                Your order <strong className="font-mono text-[#242320]">#{orderNumber}</strong> has been logged in this prototype session. A confirmation email simulation has been dispatched to {formData.email || 'your email'}.
              </p>
            </div>

            <div className="bg-[#F2EFE9] p-4 rounded-xl border border-[#E5DFD3] text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-[#595752]">
                <span>Status</span>
                <span className="font-semibold text-[#2E6B34]">Preparing Plastic-Free Dispatch</span>
              </div>
              <div className="flex items-center justify-between text-[#595752]">
                <span>Estimated Arrival</span>
                <span className="font-medium text-[#242320]">3–5 Business Days</span>
              </div>
              <div className="flex items-center justify-between text-[#595752]">
                <span>Delivery Carrier</span>
                <span className="text-[#242320]">BlueDart / Delhivery Surface</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-7 py-3 bg-[#242320] text-[#FBF9F5] text-xs font-semibold rounded-md hover:bg-[#383733] transition-colors cursor-pointer"
              >
                Continue Exploring STICKS
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
