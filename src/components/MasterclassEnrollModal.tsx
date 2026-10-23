import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Logo } from './Logo';

interface MasterclassEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    NGN: { symbol: '₦', value: '6,999', label: 'Official Programme Price' },
    USD: { symbol: '$', value: '4.50', label: 'Approx. USD' },
    GBP: { symbol: '£', value: '3.50', label: 'Approx. GBP' },
    EUR: { symbol: '€', value: '4.10', label: 'Approx. EUR' },
    GHS: { symbol: 'GH₵', value: '65', label: 'Approx. GHS' },
    KES: { symbol: 'KSh', value: '590', label: 'Approx. KES' },
    ZAR: { symbol: 'R', value: '85', label: 'Approx. ZAR' },
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
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
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
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
                7 LIVE SESSIONS
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                HOW TO GET JOBS MASTERCLASS
              </h3>
              <p className="text-[#D3EDE9] text-xs sm:text-sm mt-1 max-w-md mx-auto">
                A practical live Masterclass designed to help you improve your career positioning, job search, CV, LinkedIn, applications and interview preparation.
              </p>
            </div>

            <div className="p-6">
              {/* Primary Price Display: ₦6,999 & Approximate Currencies */}
              <div className="bg-[#D3EDE9]/50 border border-[#006C6D]/20 rounded-2xl p-4 mb-5 text-center">
                <div className="text-xs uppercase font-extrabold tracking-wider text-[#004D4E] mb-1">
                  Official Programme Fee
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#006C6D]">
                  ₦6,999
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1">
                  7 LIVE SESSIONS • LIVE INSTRUCTOR-LED
                </div>

                {/* Approximate currency toggle pills */}
                <div className="mt-4 pt-3 border-t border-[#006C6D]/15">
                  <div className="text-[11px] text-slate-600 mb-2 font-medium">
                    View approximate international equivalent:
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
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
                      <span className="text-sm font-black">
                        {currencyEquivalents[selectedCurrency].symbol}
                        {currencyEquivalents[selectedCurrency].value}
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 mt-3 leading-tight italic">
                    “International currency equivalents are approximate and may change with exchange rates. The official programme price is ₦6,999.”
                  </p>
                </div>
              </div>

              {/* 7 Live Sessions Summary */}
              <div className="space-y-1.5 text-xs text-slate-800 mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Includes All 7 Live Interactive Sessions:</div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                  <span>Session 1: Career Positioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                  <span>Session 2: Job Search Strategy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                  <span>Session 3: Build a CV Recruiters Can Understand</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                  <span>Session 4: Position Your LinkedIn Profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                  <span>Session 5: Write Stronger Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                  <span>Session 6: Prepare for Interviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                  <span>Session 7: Build Your Personal Job-Search System</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleEnroll} className="space-y-3.5">
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
                    className="w-full py-3.5 px-6 rounded-full font-extrabold text-sm bg-[#006C6D] hover:bg-[#004D4E] text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <span>Processing Enrollment...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#F1B01C]" />
                        <span>Enroll Now • Pay ₦6,999</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#006C6D]" />
                    <span>Live Interactive Cohort Access</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Direct Instructor Support</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#D3EDE9] text-[#006C6D] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Welcome to the Masterclass, {formData.fullName.split(' ')[0]}!
            </h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Your registration for the <strong>7 LIVE SESSIONS</strong> of the How to Get Jobs Masterclass is received. Admission details and calendar schedule have been sent to <strong>{formData.email}</strong>.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-[#006C6D] text-white text-left text-xs space-y-2">
              <div className="font-bold text-[#F1B01C] text-sm">Next Steps:</div>
              <div>1. Check your email for live session link invitations and preparation brief.</div>
              <div>2. Have your current CV ready for live interactive audit in Session 3.</div>
              <div>3. Join the live interactive classroom 10 minutes before start time.</div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-[#006C6D] hover:bg-[#004D4E] text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
