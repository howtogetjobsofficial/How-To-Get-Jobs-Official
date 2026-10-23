import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Play, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface WebinarFlyerProps {
  onRegisterClick?: () => void;
  className?: string;
}

export const WebinarFlyer: React.FC<WebinarFlyerProps> = ({
  onRegisterClick,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative max-w-lg w-full mx-auto ${className}`}>
      {/* Primary: The exact supplied official flyer image */}
      {!imgError ? (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#006C6D] bg-[#006C6D] p-3 transition-transform duration-300 hover:scale-[1.01]">
          <div className="relative rounded-2xl overflow-hidden bg-white">
            <img
              src="/assets/aistudio/Applying_for_Jobs_But_not_Getting_Hired_2_603ee25f.png"
              alt="Applying for Jobs But not Getting Hired? Free Webinar Flyer - 30 Nov, 2026"
              onError={() => setImgError(true)}
              className="w-full h-auto block object-contain"
            />
            {/* Prominent updated date sticker overlay reflecting the 30 Nov, 2026 schedule */}
            <div className="bg-[#D3EDE9] border-t-2 border-[#006C6D] p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#004D4E]">
              <div className="flex items-center gap-2 font-bold text-slate-950">
                <Calendar className="w-4 h-4 text-[#006C6D]" />
                <span>Updated Date: <strong>30 Nov, 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#006C6D]">
                <Clock className="w-3.5 h-3.5" />
                <span>8:00 PM WAT (GMT +1)</span>
              </div>
            </div>
          </div>

          {onRegisterClick && (
            <button
              onClick={onRegisterClick}
              className="mt-3.5 w-full py-3.5 px-6 rounded-full font-black text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Claim Your Free Spot For 30 Nov, 2026</span>
            </button>
          )}
        </div>
      ) : (
        /* Fallback SVG representation */
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#006C6D] bg-[#006C6D] p-3 transition-transform duration-300 hover:scale-[1.01]">
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 overflow-hidden text-slate-900">
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <Logo variant="teal" className="scale-90 origin-left" />
                <div className="inline-flex items-center gap-1.5 bg-[#DC2626] text-white text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full shadow-md">
                  <span>Free</span>
                  <span className="w-5 h-5 rounded-full bg-[#F1B01C] text-[#DC2626] flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </span>
                  <span>Webinar</span>
                </div>
              </div>

              <div className="pt-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 leading-tight tracking-tight">
                  Applying for<br />
                  Jobs But not<br />
                  Getting Hired?
                </h2>
                <p className="mt-3 text-slate-700 text-xs sm:text-sm leading-relaxed max-w-sm">
                  This is a practical online session for graduates, job seekers, and early career professionals who want to become more employable and improve your chances of getting hired.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <h3 className="text-sm font-bold text-slate-950">What You Will Learn</h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-950 font-bold">•</span>
                    <span>Why good candidates still struggle to get interviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-950 font-bold">•</span>
                    <span>How recruiters actually evaluate applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-950 font-bold">•</span>
                    <span>CV, LinkedIn & job search mistakes to avoid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-950 font-bold">•</span>
                    <span>A better strategy for finding and applying for global opportunities.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#D3EDE9] rounded-2xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#004D4E]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-900 shrink-0" />
                  <div className="font-bold text-slate-950">30 Nov, 2026</div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-900 shrink-0" />
                  <div className="font-bold text-slate-950">8:00 PM WAT</div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#DC2626] shrink-0" />
                  <div className="font-bold text-slate-950">Virtual (Zoom)</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Register FREE now.
                </span>
                <button
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 shadow-md transition-all cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>www.hgjobs.com</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
