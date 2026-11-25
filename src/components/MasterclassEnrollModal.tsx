import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Lock, ExternalLink, CreditCard, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Logo } from './Logo';

interface MasterclassEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PAYSTACK_PAYMENT_URL = 'https://paystack.shop/pay/howtogetjobs';

export const MasterclassEnrollModal: React.FC<MasterclassEnrollModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [selectedCurrency, setSelectedCurrency] = useState<'NGN' | 'USD' | 'GBP' | 'EUR' | 'GHS' | 'KES' | 'ZAR'>('NGN');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  // Approximate currency equivalents based on official price of ₦6,999
  const currencyEquivalents = {
    NGN: { symbol: '₦', value: '6,999', label: 'Official Program Price' },
    USD: { symbol: '$', value: '4.50', label: 'Approx. USD' },
    GBP: { symbol: '£', value: '3.50', label: 'Approx. GBP' },
    EUR: { symbol: '€', value: '4.10', label: 'Approx. EUR' },
    GHS: { symbol: 'GH₵', value: '65', label: 'Approx. GHS' },
    KES: { symbol: 'KSh', value: '590', label: 'Approx. KES' },
    ZAR: { symbol: 'R', value: '85', label: 'Approx. ZAR' },
  };

  const handleEnrollAndPay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Store registration locally
    try {
      localStorage.setItem(
        'htgj_masterclass_candidate',
        JSON.stringify({
          ...formData,
          enrolledAt: new Date().toISOString(),
          paymentStatus: 'pending_paystack',
          paymentUrl: PAYSTACK_PAYMENT_URL,
        })
      );
    } catch {
      // ignore
    }

    // Launch Paystack payment link
    const paystackWindow = window.open(PAYSTACK_PAYMENT_URL, '_blank', 'noopener,noreferrer');
    if (!paystackWindow) {
      // In case popups are blocked by browser, location fallback or user clicks link
      window.location.href = PAYSTACK_PAYMENT_URL;
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#006C6D', '#F1B01C', '#DC2626'],
        });
      } catch {
        // ignore
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          <div>
            {/* Header in Flyer Teal */}
            <div className="bg-[#006C6D] p-6 text-white text-center">
              <div className="flex justify-center mb-2">
                <Logo variant="white" />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#F1B01C] text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                7 LIVE SESSIONS • MASTERCLASS
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                HOW TO GET JOBS MASTERCLASS
              </h3>
              <p className="text-[#D3EDE9] text-xs sm:text-sm mt-1 max-w-md mx-auto">
                A practical live Masterclass designed to help you improve your career positioning, job search, CV, LinkedIn, applications and interview preparation.
              </p>
            </div>

            <div className="p-6">
              {/* Direct Instant Paystack Button (Top CTA) */}
              <div className="bg-transparent border border-slate-200 rounded-2xl p-4 mb-5 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left">
                    <div className="text-xs uppercase font-extrabold tracking-wider text-[#006C6D]">
                      Official Tuition Fee
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-950">
                      ₦6,999
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      One-time payment • All 7 Live Sessions
                    </div>
                  </div>

                  <a
                    href={PAYSTACK_PAYMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black text-sm bg-[#006C6D] hover:bg-[#004D4E] text-white shadow-md transition-all cursor-pointer hover:scale-102"
                  >
                    <CreditCard className="w-4 h-4 text-[#F1B01C]" />
                    <span>Pay with Paystack</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Approximate currency toggle pills */}
                <div className="mt-4 pt-3 border-t border-slate-200 text-left">
                  <div className="text-[11px] text-slate-600 mb-2 font-medium">
                    View approximate international equivalent:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(['NGN', 'USD', 'GBP', 'EUR', 'GHS', 'KES', 'ZAR'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setSelectedCurrency(curr)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          selectedCurrency === curr
                            ? 'bg-[#006C6D] text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>

                  {selectedCurrency !== 'NGN' && (
                    <div className="mt-2 text-xs font-bold text-[#006C6D]">
                      {currencyEquivalents[selectedCurrency].label}:{' '}
                      <span className="text-sm font-black text-slate-900">
                        {currencyEquivalents[selectedCurrency].symbol}
                        {currencyEquivalents[selectedCurrency].value}
                      </span>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-500 mt-2 italic leading-tight">
                    “International currency equivalents are approximate and may change with exchange rates. The official program price is ₦6,999.”
                  </p>
                </div>
              </div>

              {/* Masterclass Flyer Preview Card & Audience Badges */}
              <div className="mb-5 bg-transparent border border-[#006C6D]/40 p-3.5 rounded-2xl text-slate-900 flex items-center gap-3.5">
                <img
                  src="/assets/aistudio/image_70face9d.png"
                  alt="How to Get Jobs Masterclass Flyer"
                  className="w-16 h-20 object-cover rounded-lg border border-[#F1B01C] shrink-0 shadow-sm"
                />
                <div className="space-y-1 text-xs">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#006C6D]">
                    From Applying Randomly to Applying Strategically
                  </div>
                  <div className="font-extrabold text-slate-950 text-sm">
                    Inside the Masterclass
                  </div>
                  <div className="text-[11px] text-slate-600">
                    For: Graduates • Job seekers • Career switchers • Early career professionals
                  </div>
                </div>
              </div>

              {/* 7 Live Sessions Summary - Exact 7 Pointers from Flyer */}
              <div className="space-y-2 text-xs text-slate-800 mb-5 bg-transparent p-4 rounded-2xl border border-[#006C6D]/25">
                <div className="font-black text-[#004D4E] flex items-center justify-between">
                  <span>Inside the Masterclass (7 Live Sessions):</span>
                  <span className="text-[11px] text-[#006C6D] font-bold">100% Live</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span><strong>Session 1:</strong> Identify jobs you're actually qualified for</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span><strong>Session 2:</strong> Search for jobs beyond job boards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span><strong>Session 3:</strong> Build a CV recruiters can quickly understand</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span><strong>Session 4:</strong> Write stronger applications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span><strong>Session 5:</strong> Prepare for interviews with confidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span><strong>Session 6:</strong> Follow up professionally</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span><strong>Session 7:</strong> Build a personal job search strategy</span>
                  </div>
                </div>
              </div>

              {/* Form to enter candidate details and proceed to Paystack */}
              <form onSubmit={handleEnrollAndPay} className="space-y-3.5">
                <div className="text-xs font-bold text-slate-800 pb-1">
                  Enter your details to receive live session invitations and syllabus materials:
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chisom Nwosu"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006C6D] text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. chisom@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006C6D] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 ... or +44 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006C6D] text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-full font-extrabold text-sm sm:text-base bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <span>Redirecting to Paystack...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-950" />
                        <span>Proceed to Paystack Checkout • ₦6,999</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Paystack Trust & Security Badges */}
                <div className="bg-transparent p-3 rounded-xl border border-slate-200 mt-2 space-y-1.5 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-[#006C6D]" />
                    <span>Secured by Paystack (256-Bit SSL Encryption)</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Accepts Debit & Credit Cards, Bank Transfer, USSD, and Apple Pay.
                  </div>
                  <div className="pt-1">
                    <a
                      href={PAYSTACK_PAYMENT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#006C6D] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Direct Paystack Link: paystack.shop/pay/howtogetjobs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-transparent border border-[#006C6D]/30 text-[#006C6D] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Complete Your Payment on Paystack
            </h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              A secure Paystack payment window has opened for <strong>{formData.fullName}</strong>. Once completed, your admission pass and calendar schedule will be confirmed for <strong>{formData.email}</strong>.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-transparent border-2 border-[#006C6D] text-slate-800 text-left text-xs space-y-2.5">
              <div className="font-bold text-[#006C6D] text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Paystack Payment Instructions:</span>
              </div>
              <div>1. Complete your ₦6,999 payment on the Paystack checkout page.</div>
              <div>2. You can pay via Card, Bank Transfer, USSD, or Apple Pay.</div>
              <div>3. If the payment tab did not open, click the button below to open Paystack now.</div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={PAYSTACK_PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-black text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 transition-all cursor-pointer shadow-md"
              >
                <span>Re-open Paystack Checkout (₦6,999)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-full font-bold text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
