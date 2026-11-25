import React, { useState } from 'react';
import { ExternalLink, CreditCard, Sparkles, ZoomIn, X, Users, Target, CheckCircle2, GraduationCap, Search, ArrowLeftRight, Briefcase } from 'lucide-react';
import { Logo } from './Logo';

export const PAYSTACK_PAYMENT_URL = 'https://paystack.shop/pay/howtogetjobs';

interface MasterclassFlyerProps {
  onEnrollClick?: () => void;
  className?: string;
}

export const MasterclassFlyer: React.FC<MasterclassFlyerProps> = ({
  onEnrollClick,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className={`relative max-w-lg w-full mx-auto ${className}`}>
        {/* Primary: The exact supplied official Masterclass flyer image */}
        {!imgError ? (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#006C6D] bg-transparent p-3 transition-transform duration-300 hover:scale-[1.01]">
            <div className="relative rounded-2xl overflow-hidden bg-white group cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
              <img
                src="/assets/aistudio/image_70face9d.png"
                alt="How to Get Jobs Masterclass Flyer - From Applying Randomly to Applying Strategically"
                onError={() => setImgError(true)}
                className="w-full h-auto block object-contain"
              />

              {/* Hover overlay for zoom indication */}
              <div className="absolute inset-0 bg-[#004D4E]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-950 text-xs font-black shadow-lg">
                  <ZoomIn className="w-4 h-4 text-[#006C6D]" />
                  <span>Click to Enlarge Flyer</span>
                </span>
              </div>
            </div>

            {/* Quick action bar beneath the flyer */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <a
                href={PAYSTACK_PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full font-black text-xs sm:text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>Pay ₦6,999 on Paystack</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onEnrollClick && (
                <button
                  type="button"
                  onClick={onEnrollClick}
                  className="w-full sm:w-auto py-3 px-4 rounded-full font-bold text-xs bg-[#003B3C] hover:bg-[#002E2F] text-[#D3EDE9] border border-[#006C6D] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F1B01C]" />
                  <span>Syllabus Guide</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Fallback structured display matching flyer content */
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#006C6D] bg-white p-6 sm:p-8 text-slate-900 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <Logo variant="teal" />
              <div className="inline-flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
                <span className="w-4 h-4 rounded-full bg-[#F1B01C] text-[#DC2626] flex items-center justify-center text-[10px]">▶</span>
                <span>MASTERCLASS</span>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#004D4E] tracking-tight">
                HOW TO GET JOBS
              </h2>
              <div className="text-sm font-black text-slate-900 mt-1">
                From Applying randomly to applying strategically.
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                This practical career masterclass was designed to help you position yourself, find better opportunities and improve your chances of getting hired.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div className="bg-transparent p-4 rounded-2xl border border-[#006C6D]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-[#004D4E] uppercase">
                  <Target className="w-4 h-4 text-[#006C6D]" />
                  <span>Inside the Masterclass</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span>Identify jobs you're actually qualified for</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span>Search for jobs beyond job boards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span>Build a CV recruiters can quickly understand</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span>Write stronger applications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span>Prepare for interviews with confidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span>Follow up professionally</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006C6D] shrink-0" />
                    <span>Build a personal job search strategy</span>
                  </div>
                </div>
              </div>

              <div className="bg-transparent p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-[#004D4E] uppercase">
                  <Users className="w-4 h-4 text-[#006C6D]" />
                  <span>Who should Attend?</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-[#006C6D]" /> Graduates</div>
                  <div className="flex items-center gap-1.5"><Search className="w-3.5 h-3.5 text-[#006C6D]" /> Job seekers</div>
                  <div className="flex items-center gap-1.5"><ArrowLeftRight className="w-3.5 h-3.5 text-[#006C6D]" /> Career switchers</div>
                  <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-[#006C6D]" /> Early career professionals</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={PAYSTACK_PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full font-black text-sm bg-[#006C6D] hover:bg-[#004D4E] text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-[#F1B01C]" />
                <span>Join the Masterclass — Just #6,999</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Full Flyer Preview Modal */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-[#006C6D] max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#004D4E] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#006C6D]">
              <div className="flex items-center gap-2 font-black text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F1B01C] animate-pulse"></span>
                <span>Official Masterclass Announcement Flyer</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-[#006C6D] transition-colors cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-900 overflow-y-auto flex-1 flex items-center justify-center">
              <img
                src="/assets/aistudio/image_70face9d.png"
                alt="How to Get Jobs Masterclass Flyer"
                className="max-h-[75vh] w-auto mx-auto object-contain rounded-xl shadow-xl"
              />
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <div className="text-xs uppercase font-extrabold text-[#006C6D]">Tuition Fee</div>
                <div className="text-xl font-black text-slate-950">Just ₦6,999</div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={PAYSTACK_PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-black text-xs sm:text-sm bg-[#006C6D] hover:bg-[#004D4E] text-white shadow-md transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-[#F1B01C]" />
                  <span>Pay with Paystack</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2.5 rounded-full font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
