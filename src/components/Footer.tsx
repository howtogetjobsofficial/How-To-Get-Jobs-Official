import React from 'react';
import { Mail, ArrowRight, Calendar, Lock } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (view: 'landing' | 'webinar' | 'masterclass') => void;
  onOpenWebinarModal: () => void;
  onOpenMasterclassModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenWebinarModal,
  onOpenMasterclassModal,
}) => {
  return (
    <footer className="bg-[#004D4E] text-[#D3EDE9] pt-16 pb-12 border-t border-[#006C6D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#006C6D]">
          {/* Brand Column - Standalone Logo */}
          <div className="space-y-4">
            <Logo variant="white" />
            <p className="text-xs sm:text-sm text-[#D3EDE9] leading-relaxed max-w-sm">
              We help graduates, job seekers, early-career professionals and career switchers improve how they search, position themselves, apply and prepare for opportunities.
            </p>
          </div>

          {/* Quick Portals: The 2 Main Programmes */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
              Programmes
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('webinar')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#F1B01C]" />
                  <span>Free Webinar (30 Nov, 2026)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('masterclass')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#F1B01C]" />
                  <span>Masterclass (7 Live Sessions)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-[#D3EDE9]/75"
                >
                  Home / Overview Landing
                </button>
              </li>
            </ul>
          </div>

          {/* Masterclass 7 Live Sessions Summary */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
              Masterclass 7 Live Sessions
            </h4>
            <ul className="space-y-1.5 text-xs text-[#D3EDE9]">
              <li>Session 1: Career Positioning</li>
              <li>Session 2: Job Search Strategy</li>
              <li>Session 3: Build a CV Recruiters Can Understand</li>
              <li>Session 4: Position Your LinkedIn Profile</li>
              <li>Session 5: Write Stronger Applications</li>
              <li>Session 6: Prepare for Interviews</li>
              <li>Session 7: Build Your Personal Job-Search System</li>
            </ul>
          </div>

          {/* Actions & Contact */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
              Direct Contact
            </h4>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white">
              <Mail className="w-4 h-4 text-[#F1B01C] shrink-0" />
              <span>contact@howtogetjobs.com</span>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={onOpenWebinarModal}
                className="w-full py-2.5 px-4 rounded-full text-xs font-black bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Register Free Webinar (30 Nov)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenMasterclassModal}
                className="w-full py-2.5 px-4 rounded-full text-xs font-black bg-[#006C6D] hover:bg-[#005a5b] text-white transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#D3EDE9]/30"
              >
                <span>Enroll in Masterclass</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D3EDE9]/80 gap-3">
          <div>
            © {new Date().getFullYear()} How to Get Jobs. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#D3EDE9]">Free Webinar: 30 Nov, 2026 • 8:00 PM WAT</span>
            <span>•</span>
            <span className="text-[#D3EDE9]">Masterclass: 7 Live Sessions • ₦6,999</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
