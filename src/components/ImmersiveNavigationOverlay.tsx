import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  Calendar, 
  Lock, 
  Sparkles, 
  Compass,
  CheckCircle2,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { Logo } from './Logo';
import { PAYSTACK_PAYMENT_URL } from './MasterclassEnrollModal';

export interface NavMenuVisualItem {
  id: string;
  label: string;
  tagline: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  bgImage: string;
  themeColor: string;
  targetView: 'landing' | 'webinar' | 'masterclass';
  targetSection?: string;
  description: string;
  stats?: { label: string; value: string };
  highlights?: string[];
}

export const MENU_ITEMS: NavMenuVisualItem[] = [
  {
    id: 'home',
    label: 'Home',
    tagline: 'Become More Employable. Position Yourself Better. Get Hired.',
    badge: 'Overview',
    badgeColor: 'bg-[#D3EDE9] text-[#006C6D]',
    icon: Compass,
    bgImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=85',
    themeColor: '#006C6D',
    targetView: 'landing',
    targetSection: 'top',
    description: 'Helping graduates, job seekers, early-career professionals and career switchers improve how they search, position themselves, apply and prepare for opportunities.',
    stats: { label: 'Focus', value: 'Career Readiness' },
    highlights: ['Practical CV, LinkedIn & Job Search Strategy', 'From random applications to strategic positioning']
  },
  {
    id: 'webinar',
    label: 'Free Webinar',
    tagline: 'Applying for Jobs But Not Getting Hired?',
    icon: Calendar,
    bgImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2400&q=85',
    themeColor: '#DC2626',
    targetView: 'webinar',
    description: 'Practical online session revealing the 6-second recruiter CV test, ATS filter secrets, and tactical job search methods.',
    stats: { label: 'Format', value: 'Virtual Session' },
    highlights: ['Interactive Q&A', 'Immediate Instant Pass & Calendar Invite']
  },
  {
    id: 'masterclass',
    label: 'Masterclass',
    tagline: 'From Applying Randomly to Applying Strategically',
    icon: Lock,
    bgImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2400&q=85',
    themeColor: '#006C6D',
    targetView: 'masterclass',
    description: 'Intensive cohort covering CV architecture, LinkedIn optimization, ATS navigation, interview mastery and job systems.',
    stats: { label: 'Format', value: 'Instructor-Led' },
    highlights: ['Direct enrollment checkout', 'Interactive Instructor-Led Sessions + Templates']
  }
];

interface ImmersiveNavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: 'landing' | 'webinar' | 'masterclass';
  onNavigate: (view: 'landing' | 'webinar' | 'masterclass', sectionId?: string) => void;
  onOpenWebinarModal: () => void;
  onOpenMasterclassModal: () => void;
}

export const ImmersiveNavigationOverlay: React.FC<ImmersiveNavigationOverlayProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenWebinarModal,
  onOpenMasterclassModal,
}) => {
  // Active hovered or selected item determines the dedicated background image and info panel
  const initialItemId = currentView === 'webinar' ? 'webinar' : currentView === 'masterclass' ? 'masterclass' : 'home';
  const [activeItemId, setActiveItemId] = useState<string>(initialItemId);

  // Sync active item when overlay opens or view changes
  useEffect(() => {
    if (isOpen) {
      if (currentView === 'webinar') setActiveItemId('webinar');
      else if (currentView === 'masterclass') setActiveItemId('masterclass');
      else setActiveItemId('home');
    }
  }, [isOpen, currentView]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const activeItem = MENU_ITEMS.find((item) => item.id === activeItemId) || MENU_ITEMS[0];

  const handleItemClick = (item: NavMenuVisualItem) => {
    onNavigate(item.targetView, item.targetSection);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-950 transition-opacity duration-500 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation"
    >
      {/* ========================================================================= */}
      {/* 1. DEDICATED CINEMATIC BACKGROUND TRANSITIONS PER MENU ITEM               */}
      {/* Replicating the reference site: Each menu item has its own dedicated photo */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {MENU_ITEMS.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${
                isActive 
                  ? 'opacity-40 scale-100 filter-none' 
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{
                backgroundImage: `url("${item.bgImage}")`,
              }}
            />
          );
        })}

        {/* Cinematic gradient vignette overlays for contrast & text readability */}
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/70 to-slate-950/95" />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/80 to-[#004D4E]/50" />
        
        {/* Subtle decorative grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #D3EDE9 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP FLOATING CONTROL BAR (LOGO + CLOSE BUTTON + QUICK ACTIONS)         */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full px-4 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo variant="white" />
          <span className="hidden sm:inline-block text-xs font-mono uppercase tracking-widest text-[#D3EDE9]/70 border-l border-white/20 pl-3">
            Navigation Experience
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenWebinarModal();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-[#D3EDE9] text-[#004D4E] hover:bg-white transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Free Webinar</span>
          </button>

          <a
            href={PAYSTACK_PAYMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-[#F1B01C] text-slate-950 hover:bg-[#df9f12] transition-all cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-950" />
            <span>Register for Masterclass</span>
            <ExternalLink className="w-3 h-3 text-slate-950" />
          </a>

          {/* Close button with spring tactile feedback */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-transform active:scale-90 border border-white/20 cursor-pointer flex items-center gap-2"
            aria-label="Close navigation"
          >
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">Close</span>
            <X className="w-5 h-5 text-[#F1B01C]" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN INTERACTIVE DUAL-PANE NAVIGATION AREA                             */}
      {/* Left: List of animated interactive menu items with hover triggers        */}
      {/* Right: Dynamic preview card with active visuals and highlights             */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 lg:px-16 py-8 flex flex-col justify-center">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Nav Items */}
          <div className="lg:col-span-7 space-y-1.5 sm:space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#F1B01C] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F1B01C]" />
              <span>Select Destination Section</span>
            </div>

            <nav aria-label="Immersive Menu" className="space-y-1 sm:space-y-1.5">
              {MENU_ITEMS.map((item, index) => {
                const isActive = item.id === activeItemId;
                const IconComponent = item.icon;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActiveItemId(item.id)}
                    onFocus={() => setActiveItemId(item.id)}
                    className="group"
                  >
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                        isActive
                          ? 'bg-white/15 border-white/30 backdrop-blur-md shadow-lg translate-x-2'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Number Index */}
                        <span className={`text-xs font-mono font-bold transition-colors ${
                          isActive ? 'text-[#F1B01C]' : 'text-white/40 group-hover:text-white/70'
                        }`}>
                          0{index + 1}
                        </span>

                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isActive ? 'bg-[#006C6D] text-white shadow-xs' : 'bg-white/5 text-white/70 group-hover:text-white'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>

                        {/* Label & Tagline */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`text-base sm:text-xl font-extrabold tracking-tight transition-colors ${
                              isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                            }`}>
                              {item.label}
                            </h3>
                            {item.badge && (
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs transition-colors hidden sm:block ${
                            isActive ? 'text-[#D3EDE9]' : 'text-white/40 group-hover:text-white/60'
                          }`}>
                            {item.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Right Indicator Arrow */}
                      <div className={`transition-all duration-300 ${
                        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-60'
                      }`}>
                        <div className="w-8 h-8 rounded-full bg-[#F1B01C] text-slate-950 flex items-center justify-center font-bold">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right Column: Live Context Card for Active Section */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-4 transition-all duration-500 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#F1B01C]">
                  Live Section Focus
                </span>
                {activeItem.stats && (
                  <span className="text-xs font-bold bg-[#004D4E] text-[#D3EDE9] px-3 py-1 rounded-full border border-[#006C6D]">
                    {activeItem.stats.label}: <strong>{activeItem.stats.value}</strong>
                  </span>
                )}
              </div>

              {/* Mini Preview Snapshot */}
              <div className="relative rounded-2xl overflow-hidden h-40 border border-white/10">
                <img
                  src={activeItem.bgImage}
                  alt={activeItem.label}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">
                    {activeItem.label}
                  </span>
                  <span className="text-[10px] bg-[#F1B01C] text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                    Interactive
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-black text-white leading-tight">
                  {activeItem.tagline}
                </h4>
                <p className="text-xs text-[#D3EDE9] leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              {/* Highlights */}
              {activeItem.highlights && activeItem.highlights.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  {activeItem.highlights.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F1B01C] shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Jump Button */}
              <button
                onClick={() => handleItemClick(activeItem)}
                className="w-full py-3 px-5 rounded-full font-black text-xs uppercase tracking-wider bg-[#F1B01C] hover:bg-[#df9f12] text-slate-950 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <span>Navigate to {activeItem.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FOOTER STATUS BAR WITH SOCIAL / DIRECT CONTACT                         */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full px-4 sm:px-8 py-3.5 bg-slate-950/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 gap-2">
        <div className="flex items-center gap-4">
          <span className="text-[#D3EDE9]">
            <strong className="text-white">Free Webinar</strong> • Virtual Session
          </span>
          <span>•</span>
          <span className="text-[#D3EDE9]">
            <strong className="text-white">Masterclass</strong> • Instructor-Led
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#F1B01C]">
          <span>Press ESC or click Close to return</span>
          <span>•</span>
          <a
            href={PAYSTACK_PAYMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1 font-bold text-white"
          >
            <span>Paystack Checkout</span>
            <ExternalLink className="w-3 h-3 text-[#F1B01C]" />
          </a>
        </div>
      </div>
    </div>
  );
};
