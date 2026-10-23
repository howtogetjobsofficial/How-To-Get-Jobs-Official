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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner with Flyer Palette */}
      <div className="bg-[#006C6D] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F1B01C] animate-pulse"></span>
            <span className="font-medium text-[#D3EDE9]">
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

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Standalone without any words underneath */}
          <div
            onClick={() => handleNav('landing')}
            className="cursor-pointer transition-opacity hover:opacity-95"
            title="How to Get Jobs - Home"
          >
            <Logo variant="teal" />
          </div>

          {/* EXACTLY TWO NAVIGATION MENUS ONLY */}
          <nav className="hidden md:flex items-center gap-3 text-sm font-bold">
            {/* 1. The Free Webinar Menu */}
            <button
              onClick={() => handleNav('webinar')}
              className={`px-5 py-2.5 rounded-full text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                currentView === 'webinar'
                  ? 'bg-[#006C6D] text-white shadow-md'
                  : 'text-slate-800 hover:text-[#006C6D] hover:bg-[#D3EDE9]/40'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#F1B01C]" />
              <span>Free Webinar</span>
            </button>

            {/* 2. The Masterclass Menu (NO price tag) */}
            <button
              onClick={() => handleNav('masterclass')}
              className={`px-5 py-2.5 rounded-full text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                currentView === 'masterclass'
                  ? 'bg-[#006C6D] text-white shadow-md'
                  : 'text-slate-800 hover:text-[#006C6D] hover:bg-[#D3EDE9]/40'
              }`}
            >
              <Lock className="w-4 h-4 text-[#F1B01C]" />
              <span>Masterclass</span>
            </button>
          </nav>

          {/* Quick Registration Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenWebinarModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black text-[#006C6D] bg-[#D3EDE9] hover:bg-[#c2e4de] transition-colors cursor-pointer"
            >
              <span>Register Free</span>
            </button>

            <button
              onClick={onOpenMasterclassModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-black text-slate-950 bg-[#F1B01C] hover:bg-[#d99c12] shadow-sm transition-all cursor-pointer"
            >
              <span>Enroll Masterclass</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenWebinarModal}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#DC2626] cursor-pointer"
            >
              Free Webinar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only the two menus + quick actions */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-3 shadow-xl">
          <button
            onClick={() => handleNav('landing')}
            className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold ${
              currentView === 'landing' ? 'bg-[#D3EDE9] text-[#006C6D]' : 'text-slate-800'
            }`}
          >
            Home / Landing Page
          </button>

          <button
            onClick={() => handleNav('webinar')}
            className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'webinar' ? 'bg-[#006C6D] text-white' : 'text-slate-800'
            }`}
          >
            <span>Free Webinar</span>
            <span className="text-xs bg-[#DC2626] text-white px-2 py-0.5 rounded font-black">
              FREE
            </span>
          </button>

          <button
            onClick={() => handleNav('masterclass')}
            className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'masterclass' ? 'bg-[#006C6D] text-white' : 'text-slate-800'
            }`}
          >
            <span>Masterclass</span>
            <span className="text-xs bg-[#F1B01C] text-slate-950 px-2 py-0.5 rounded font-black">
              7 LIVE
            </span>
          </button>

          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWebinarModal();
              }}
              className="w-full py-2.5 text-center text-xs font-black rounded-full bg-[#D3EDE9] text-[#004D4E]"
            >
              Register Webinar
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMasterclassModal();
              }}
              className="w-full py-2.5 text-center text-xs font-black rounded-full bg-[#006C6D] text-white"
            >
              Enroll Masterclass
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
