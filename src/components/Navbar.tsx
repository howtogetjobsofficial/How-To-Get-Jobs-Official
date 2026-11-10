import React, { useState } from 'react';
import { Menu, X, Calendar, Lock } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  currentView: 'landing' | 'webinar' | 'masterclass';
  onNavigate: (view: 'landing' | 'webinar' | 'masterclass') => void;
  onOpenWebinarModal: () => void;
  onOpenMasterclassModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenWebinarModal,
  onOpenMasterclassModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'landing' | 'webinar' | 'masterclass') => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Ticker Status Banner - Suspended cleanly above */}
      <div className="w-full bg-[#004D4E] text-[#D3EDE9] text-xs py-2 px-4 border-b border-[#006C6D]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F1B01C] animate-pulse"></span>
            <span className="font-medium text-xs">
              Next Free Live Webinar: <strong className="text-white">30 Nov, 2026 • 8:00 PM WAT</strong>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs">
            <button
              onClick={onOpenWebinarModal}
              className="text-[#F1B01C] hover:underline font-bold cursor-pointer"
            >
              Register Free Spot (30 Nov) →
            </button>
          </div>
        </div>
      </div>

      {/* Floating / Suspended Navbar Island - Exact Yonbox floating capsule structure */}
      <header className="sticky top-4 z-50 w-full px-3 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <div className="bg-white/92 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,40,40,0.14)] rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,77,78,0.2)]">
            <div className="flex items-center justify-between gap-4">
              {/* Standalone Logo on the left side - click leads to home */}
              <div
                onClick={() => handleNav('landing')}
                className="cursor-pointer transition-transform hover:scale-102 flex items-center shrink-0"
                title="How to Get Jobs - Home"
              >
                <Logo variant="teal" />
              </div>

              {/* Center Menu: Suspended Floating Pill Segment (Yonbox-style) */}
              <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/70">
                <button
                  onClick={() => handleNav('landing')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'landing'
                      ? 'bg-white text-[#006C6D] shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                  }`}
                >
                  Home
                </button>

                {/* 1. Free Webinar Menu */}
                <button
                  onClick={() => handleNav('webinar')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'webinar'
                      ? 'bg-[#006C6D] text-white shadow-xs font-extrabold'
                      : 'text-slate-700 hover:text-[#006C6D] hover:bg-white/60'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#F1B01C]" />
                  <span>Free Webinar</span>
                </button>

                {/* 2. Masterclass Menu */}
                <button
                  onClick={() => handleNav('masterclass')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'masterclass'
                      ? 'bg-[#006C6D] text-white shadow-xs font-extrabold'
                      : 'text-slate-700 hover:text-[#006C6D] hover:bg-white/60'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-[#F1B01C]" />
                  <span>Masterclass</span>
                </button>
              </nav>

              {/* Right CTA Actions - Pill Buttons matching Yonbox suspended style */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <button
                  onClick={onOpenWebinarModal}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-xs font-extrabold text-[#006C6D] bg-[#D3EDE9] hover:bg-[#bde2db] transition-colors cursor-pointer"
                >
                  <span>Free Webinar</span>
                </button>

                <button
                  onClick={onOpenMasterclassModal}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-black text-slate-950 bg-[#F1B01C] hover:bg-[#df9f12] shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <span>Enroll Masterclass</span>
                </button>
              </div>

              {/* Mobile Hamburger Button */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={onOpenWebinarModal}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#006C6D] cursor-pointer"
                >
                  Webinar
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown when open */}
            {mobileMenuOpen && (
              <div className="md:hidden pt-4 pb-2 border-t border-slate-100 mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => handleNav('landing')}
                  className={`w-full text-left py-2 px-3 rounded-full text-xs font-bold ${
                    currentView === 'landing' ? 'bg-[#D3EDE9] text-[#006C6D]' : 'text-slate-800'
                  }`}
                >
                  Home Landing
                </button>

                <button
                  onClick={() => handleNav('webinar')}
                  className={`w-full text-left py-2 px-3 rounded-full text-xs font-bold flex items-center justify-between ${
                    currentView === 'webinar' ? 'bg-[#006C6D] text-white' : 'text-slate-800'
                  }`}
                >
                  <span>Free Webinar</span>
                  <span className="text-[10px] bg-[#DC2626] text-white px-2 py-0.5 rounded-full font-black">
                    FREE
                  </span>
                </button>

                <button
                  onClick={() => handleNav('masterclass')}
                  className={`w-full text-left py-2 px-3 rounded-full text-xs font-bold flex items-center justify-between ${
                    currentView === 'masterclass' ? 'bg-[#006C6D] text-white' : 'text-slate-800'
                  }`}
                >
                  <span>Masterclass</span>
                  <span className="text-[10px] bg-[#F1B01C] text-slate-950 px-2 py-0.5 rounded-full font-black">
                    7 LIVE
                  </span>
                </button>

                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenWebinarModal();
                    }}
                    className="w-full py-2 text-center text-xs font-black rounded-full bg-[#D3EDE9] text-[#004D4E]"
                  >
                    Register Free
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenMasterclassModal();
                    }}
                    className="w-full py-2 text-center text-xs font-black rounded-full bg-[#F1B01C] text-slate-950"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
