import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Users, 
  Video, 
  Play,
  CreditCard,
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WebinarFlyer } from './components/WebinarFlyer';
import { MasterclassFlyer } from './components/MasterclassFlyer';
import { WebinarCountdown } from './components/WebinarCountdown';
import { RegistrationModal } from './components/RegistrationModal';
import { MasterclassEnrollModal, PAYSTACK_PAYMENT_URL } from './components/MasterclassEnrollModal';
import { ImmersiveNavigationOverlay } from './components/ImmersiveNavigationOverlay';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { TestimonialSlider } from './components/TestimonialSlider';
import {
  loadLinkedSheetConfig,
  LinkedSheetConfig,
  DEFAULT_SHEET_ACCOUNT_EMAIL,
} from './lib/googleSheets';

export default function App() {
  // Navigation view: 'landing' (first view / landing page), 'webinar' (strictly free webinar), 'masterclass' (strictly masterclass)
  const [currentView, setCurrentView] = useState<'landing' | 'webinar' | 'masterclass'>('landing');
  const [isWebinarModalOpen, setIsWebinarModalOpen] = useState(false);
  const [isMasterclassModalOpen, setIsMasterclassModalOpen] = useState(false);
  const [isImmersiveNavOpen, setIsImmersiveNavOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [linkedSheetConfig, setLinkedSheetConfig] = useState<LinkedSheetConfig | null>(() =>
    loadLinkedSheetConfig()
  );
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Currency converter state for Masterclass pricing
  const [pricingCurrency, setPricingCurrency] = useState<'NGN' | 'USD' | 'GBP' | 'EUR' | 'GHS' | 'KES' | 'ZAR'>('NGN');

  const currencyRates = {
    NGN: { symbol: '₦', value: '6,999', note: 'Official Program Price' },
    USD: { symbol: '$', value: '4.50', note: 'Approx. USD equivalent' },
    GBP: { symbol: '£', value: '3.50', note: 'Approx. GBP equivalent' },
    EUR: { symbol: '€', value: '4.10', note: 'Approx. EUR equivalent' },
    GHS: { symbol: 'GH₵', value: '65', note: 'Approx. GHS equivalent' },
    KES: { symbol: 'KSh', value: '590', note: 'Approx. KES equivalent' },
    ZAR: { symbol: 'R', value: '85', note: 'Approx. ZAR equivalent' },
  };

  // Sync with browser hash if user uses direct link or back button
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'webinar') {
        setCurrentView('webinar');
      } else if (hash === 'masterclass') {
        setCurrentView('masterclass');
      } else {
        setCurrentView('landing');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (view: 'landing' | 'webinar' | 'masterclass', sectionId?: string) => {
    setCurrentView(view);
    window.location.hash = view === 'landing' ? '' : view;

    if (sectionId && view === 'landing') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8FBFA] text-slate-900 selection:bg-[#F1B01C] selection:text-slate-950 font-sans">
      {/* Static / Fixed Background Picture (Parallax backdrop remaining static while scrolling to bottom for all pages) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
        aria-hidden="true"
      >
        {/* Crisp static photographic backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.06] scale-100 filter grayscale"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85")`,
          }}
        />

        {/* Brand tint wash matching webinar flyer teal palette */}
        <div className="absolute inset-0 bg-radial from-[#D3EDE9]/40 via-transparent to-[#004D4E]/10" />

        {/* Ambient watermark accent */}
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#006C6D]/5 blur-3xl pointer-events-none" />
      </div>

      {/* 1. NAVBAR - Suspended floating island (Yonbox / Schrödinger Techs style) */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenWebinarModal={() => setIsWebinarModalOpen(true)}
        onOpenMasterclassModal={() => setIsMasterclassModalOpen(true)}
        onOpenImmersiveNav={() => setIsImmersiveNavOpen(true)}
      />

      <main className="relative z-10 flex-1 space-y-16 sm:space-y-24 pb-20">
        {/* ========================================================================= */}
        {/* VIEW 1: LANDING PAGE (DEFAULT FIRST VIEW)                                */}
        {/* ========================================================================= */}
        {currentView === 'landing' && (
          <div className="space-y-16 sm:space-y-24">
            {/* Landing Hero Section with Transparent Motion / Dynamic Backdrop */}
            <section className="relative overflow-hidden bg-[#004D4E] text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
              {/* Animated / transparent backdrop layers */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {/* Subtle high-resolution translucent texture & image overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 scale-105"
                  style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80")`,
                  }}
                />
                
                {/* Floating ambient motion gradient orbs matching flyer palette */}
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#006C6D] blur-3xl opacity-40 animate-float-slow" />
                <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#F1B01C] blur-3xl opacity-20 animate-float-reverse" />
                <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-[#002E2F] blur-2xl opacity-60 animate-pulse-glow" />

                {/* Subtle grid pattern overlay for professional depth */}
                <div 
                  className="absolute inset-0 opacity-[0.07]" 
                  style={{
                    backgroundImage: 'radial-gradient(circle, #D3EDE9 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                  }}
                />

                {/* Top-to-bottom transparency gradient blend */}
                <div className="absolute inset-0 bg-linear-to-b from-[#004D4E]/80 via-transparent to-[#004D4E]/90" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                  {/* Notice: Center logo box removed as requested: only the logo by the left side of the navbar is displayed */}

                  {/* Exact Hero Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                    Become More Employable.<br />
                    Position Yourself Better.<br />
                    <span className="text-[#F1B01C]">Get Hired.</span>
                  </h1>

                  {/* Exact Supporting Text */}
                  <p className="text-base sm:text-lg lg:text-xl text-[#D3EDE9] leading-relaxed max-w-2xl mx-auto font-normal">
                    Helping graduates, job seekers, early-career professionals and career switchers improve how they search, position themselves, apply and prepare for opportunities.
                  </p>

                  {/* The Two Portals CTAs Leading to Registration */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => handleNavigate('webinar')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-extrabold text-sm sm:text-base bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 shadow-xl transition-all cursor-pointer active:scale-95"
                    >
                      <span>REGISTER FOR THE FREE WEBINAR</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleNavigate('masterclass')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-sm sm:text-base bg-[#003B3C]/80 hover:bg-[#002E2F] text-white border border-[#D3EDE9]/30 transition-all cursor-pointer backdrop-blur-xs"
                    >
                      <span>EXPLORE THE MASTERCLASS</span>
                      <ChevronRight className="w-4 h-4 text-[#F1B01C]" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Two Main Program Portals Section */}
            <section id="learning-paths" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                  Two Structured Ways to Accelerate Your Career
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Portal Card 1: Free Webinar */}
                <div className="bg-white rounded-3xl p-8 border-2 border-[#006C6D] shadow-lg flex flex-col justify-between hover:shadow-xl transition-all">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                      <span>100% FREE</span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-950">
                      Free Live Webinar
                    </h3>

                    <div className="text-sm font-bold text-[#006C6D] flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date: <strong>30 Nov, 2026</strong> • 8:00 PM WAT</span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      "Applying for Jobs But Not Getting Hired?" A practical live session revealing why good candidates get screened out and how to fix your CV, LinkedIn, and search strategy.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <button
                      onClick={() => handleNavigate('webinar')}
                      className="w-full py-3.5 px-6 rounded-full font-black text-sm bg-[#006C6D] hover:bg-[#004D4E] text-white transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Go to Free Webinar Portal</span>
                      <ArrowRight className="w-4 h-4 text-[#F1B01C]" />
                    </button>
                  </div>
                </div>

                {/* Portal Card 2: Masterclass (Fitted Background Image + Contrast Overlay) */}
                <div className="relative overflow-hidden bg-[#004D4E] text-white rounded-3xl p-8 border-2 border-[#006C6D] shadow-lg flex flex-col justify-between hover:shadow-xl transition-all">
                  <div
                    className="absolute inset-0 bg-cover bg-center pointer-events-none select-none"
                    style={{
                      backgroundImage: `url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=80")`,
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-br from-[#004D4E]/92 via-[#003B3C]/88 to-slate-950/92 pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#F1B01C] text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                      <span>7 LIVE SESSIONS</span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      HOW TO GET JOBS MASTERCLASS
                    </h3>

                    <div className="text-sm font-bold text-[#F1B01C] flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#F1B01C]" />
                      <span>Live Instructor-Led Masterclass</span>
                    </div>

                    <p className="text-[#D3EDE9] text-sm leading-relaxed">
                      A practical live Masterclass designed to help you improve your career positioning, job search, CV, LinkedIn, applications and interview preparation.
                    </p>
                  </div>

                  <div className="relative z-10 pt-6 border-t border-white/15 mt-6">
                    <button
                      onClick={() => handleNavigate('masterclass')}
                      className="w-full py-3.5 px-6 rounded-full font-black text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Explore Masterclass Program</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonial Slider Section (Auto-cycling carousel) */}
            <TestimonialSlider />

            {/* 1. Mission, 2. Vision, 3. Goal */}
            <section id="mission-vision" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                  Mission, Vision & Goal
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Mission */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center font-bold text-lg">
                      01
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">1. Mission</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      To equip graduates, job seekers, early-career professionals and career switchers across Africa with the skills, tools, knowledge, mentorship, and opportunities they need to become job-ready, access meaningful employment, and build sustainable careers.
                    </p>
                  </div>
                </div>

                {/* 2. Vision */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center font-bold text-lg">
                      02
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">2. Vision</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      To become Africa’s leading employability and career development platform, building a future where everyone has access to the knowledge, capabilities, and support needed to thrive in the world of work.
                    </p>
                  </div>
                </div>

                {/* 3. Goal */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center font-bold text-lg">
                      03
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">3. Goal</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      To help individuals become competitive, confident, and career-ready by bridging the gap between what employers expect and what job seekers can offer.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Values */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                  Core Values
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Opportunity and Access */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">1. Opportunity and Access</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We believe talent exists everywhere, but access to preparation and opportunity is not equal. We work to make career resources, guidance, and opportunities more accessible.
                  </p>
                </div>

                {/* 2. Practical Impact */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">2. Practical Impact</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We prioritize actionable knowledge, useful tools, and real-world experiences that help graduates, job seekers, early-career professionals and career switchers improve their employability and achieve measurable career progress.
                  </p>
                </div>

                {/* 3. Empowerment */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">3. Empowerment</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We help graduates, job seekers, early-career professionals and career switchers take ownership of their career journeys by building their confidence, strengthening their capabilities, and equipping them to make informed career decisions.
                  </p>
                </div>
              </div>
            </section>

            {/* General FAQ Section */}
            <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-950">
                  FAQs
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'How do I choose between the Free Webinar and the Masterclass?',
                    a: 'The Free Webinar on 30 Nov is an intensive 2-hour live session covering the core mistakes applicants make and how recruiters screen candidates. The Masterclass is the full 7 Live Sessions program with hands-on CV revamps, interview prep, and direct instructor coaching for ₦6,999.',
                  },
                  {
                    q: 'What date is the Free Webinar?',
                    a: 'The Free Webinar takes place on 30 Nov, 2026, starting at 8:00 PM WAT (GMT +1) virtually on Zoom and YouTube.',
                  },
                  {
                    q: 'Is the Masterclass self-paced or live?',
                    a: 'The Masterclass is 100% live and instructor-led across 7 interactive sessions, and every session will be recorded. Participants who register but miss a live session will have access to the recording.',
                  },
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 hover:text-[#006C6D] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-[#006C6D] ml-4 font-bold text-xl">
                        {activeFaq === idx ? '−' : '+'}
                      </span>
                    </button>
                    {activeFaq === idx && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: STRICTLY FREE WEBINAR PORTAL                                     */}
        {/* ========================================================================= */}
        {currentView === 'webinar' && (
          <div className="space-y-16 sm:space-y-24 animate-in fade-in duration-200">
            {/* Header Banner */}
            <div className="relative overflow-hidden bg-[#004D4E] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#006C6D]">
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none select-none"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2400&q=85")`,
                }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-linear-to-b from-[#004D4E]/90 via-[#003B3C]/85 to-[#002E2F]/92 pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 max-w-4xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                  <Play className="w-3 h-3 fill-current" />
                  <span>100% FREE LIVE WEBINAR</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white">
                  Applying for Jobs But Not Getting Hired?
                </h1>
                <p className="text-base sm:text-lg text-[#D3EDE9] max-w-2xl mx-auto">
                  A practical live online session for graduates, job seekers and early-career professionals who want to understand why their applications are not converting into interviews and what they can do differently.
                </p>

                {/* Exact Date Callout */}
                <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white/10 backdrop-blur-xs text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border border-white/25">
                  <Calendar className="w-4 h-4 text-[#F1B01C]" />
                  <span>Date: <strong>30 Nov, 2026</strong></span>
                  <span>•</span>
                  <Clock className="w-4 h-4 text-[#F1B01C]" />
                  <span>Time: <strong>8:00 PM WAT (GMT +1)</strong></span>
                  <span>•</span>
                  <Video className="w-4 h-4 text-[#F1B01C]" />
                  <span>Virtual (Zoom & YouTube)</span>
                </div>
              </div>
            </div>

            {/* Live Countdown to 30 Nov, 2026 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <WebinarCountdown onRegisterClick={() => setIsWebinarModalOpen(true)} />
            </div>

            {/* Official Attached Flyer Prominently Displayed */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-transparent border border-[#006C6D]/30 px-3.5 py-1.5 rounded-full inline-block">
                    Official Session Flier
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                    Dissecting the Real Reasons Candidates Get Ghosted
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Stop guessing. This session will dismantle the automated filters, resume formatting flaws, and weak application positioning that keep qualified candidates invisible.
                  </p>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-slate-950">What You Will Learn (From the Flier):</h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#006C6D] shrink-0 mt-0.5" />
                        <span>Why good candidates still struggle to get interviews</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#006C6D] shrink-0 mt-0.5" />
                        <span>How recruiters actually evaluate applications</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#006C6D] shrink-0 mt-0.5" />
                        <span>CV, LinkedIn & job search mistakes to avoid</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#006C6D] shrink-0 mt-0.5" />
                        <span>A better strategy for finding and applying for global opportunities.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsWebinarModalOpen(true)}
                      className="px-8 py-4 rounded-full font-black text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Claim Free Spot For 30 Nov</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleNavigate('masterclass')}
                      className="px-6 py-4 rounded-full font-bold text-xs bg-transparent border border-slate-300 hover:border-[#006C6D] text-slate-800 transition-colors cursor-pointer text-center"
                    >
                      Looking for the Masterclass? →
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 flex justify-center">
                  <WebinarFlyer onRegisterClick={() => setIsWebinarModalOpen(true)} />
                </div>
              </div>
            </div>

            {/* Who Should Attend Dedicated Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden bg-[#004D4E] text-white rounded-3xl p-8 sm:p-12 border-2 border-[#006C6D] shadow-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none select-none"
                  style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80")`,
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-linear-to-br from-[#004D4E]/92 via-[#003B3C]/88 to-slate-950/92 pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Who Should Attend This Free Webinar
                    </h3>
                    <p className="text-[#D3EDE9] text-sm mt-1">
                      Specifically designed for proactive job seekers ready for answers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#D3EDE9]">
                    <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/20">
                      <div className="font-bold text-white text-sm mb-1">Graduates & NYSC</div>
                      <div>Seeking first professional roles and entering the corporate market.</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/20">
                      <div className="font-bold text-white text-sm mb-1">Struggling Job Seekers</div>
                      <div>Sending dozens of resumes without receiving interview responses.</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/20">
                      <div className="font-bold text-white text-sm mb-1">Early-Career Pros</div>
                      <div>Ready to move beyond entry-level pay into higher compensation.</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/20">
                      <div className="font-bold text-white text-sm mb-1">Career Switchers</div>
                      <div>Transitioning into new industries or global remote opportunities.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Sheets Registration Link & Sync Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#006C6D]/25 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#006C6D]">
                      Google Sheets Integration • {linkedSheetConfig?.organizerEmail || DEFAULT_SHEET_ACCOUNT_EMAIL}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-950">
                      {linkedSheetConfig?.spreadsheetId
                        ? `Linked Sheet: ${linkedSheetConfig.spreadsheetTitle}`
                        : linkedSheetConfig?.appsScriptWebhookUrl
                        ? 'Google Sheet Connected via Apps Script'
                        : 'Link Free Webinar Form to Google Sheets'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                      {linkedSheetConfig?.spreadsheetId
                        ? `Saving attendee registrations to tab "${linkedSheetConfig.sheetTabTitle}" (${linkedSheetConfig.organizerEmail || DEFAULT_SHEET_ACCOUNT_EMAIL}). Sign in with Google to view live rows or sync pending entries.`
                        : linkedSheetConfig?.appsScriptWebhookUrl
                        ? `Auto-forwarding new Free Webinar form entries directly to ${linkedSheetConfig.organizerEmail || DEFAULT_SHEET_ACCOUNT_EMAIL}'s Google Sheet.`
                        : `Connect ${DEFAULT_SHEET_ACCOUNT_EMAIL} via Google Apps Script or Google Sign-In to save attendee registrations.`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {linkedSheetConfig?.spreadsheetId && (
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${linkedSheetConfig.spreadsheetId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-xs font-bold bg-[#D3EDE9] hover:bg-[#c2e4de] text-[#004D4E] transition-colors"
                    >
                      <span>Open Google Sheet</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setIsSheetsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black bg-[#006C6D] hover:bg-[#004D4E] text-white shadow-sm transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#F1B01C]" />
                    <span>
                      {linkedSheetConfig?.spreadsheetId || linkedSheetConfig?.appsScriptWebhookUrl
                        ? 'Manage & Sync Google Sheet'
                        : 'Connect Google Sheet'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: STRICTLY MASTERCLASS PORTAL (NO PRICE TAG IN NAV/BADGE)           */}
        {/* ========================================================================= */}
        {currentView === 'masterclass' && (
          <div className="space-y-16 sm:space-y-24 animate-in fade-in duration-200">
            {/* Masterclass Hero Header */}
            <div className="relative overflow-hidden bg-[#004D4E] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#006C6D]">
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none select-none"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2400&q=85")`,
                }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-linear-to-b from-[#004D4E]/90 via-[#003B3C]/85 to-[#002E2F]/92 pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 max-w-4xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#F1B01C] text-slate-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                  <span>7 LIVE SESSIONS • INSTRUCTOR-LED</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white">
                  HOW TO GET JOBS MASTERCLASS
                </h1>
                <p className="text-base sm:text-xl font-bold text-[#F1B01C] max-w-2xl mx-auto">
                  From Applying randomly to applying strategically.
                </p>
                <p className="text-sm sm:text-base text-[#D3EDE9] max-w-2xl mx-auto leading-relaxed">
                  This practical career masterclass was designed to help you position yourself, find better opportunities and improve your chances of getting hired.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={PAYSTACK_PAYMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black text-sm sm:text-base bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 shadow-xl transition-all cursor-pointer active:scale-95"
                  >
                    <CreditCard className="w-4 h-4 text-slate-950" />
                    <span>Pay with Paystack (₦6,999)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setIsMasterclassModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-xs transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#F1B01C]" />
                    <span>Enrollment Guide & Syllabus</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Official Masterclass Flyer Showcase & Target Audience Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-transparent border border-[#006C6D]/30 px-3.5 py-1.5 rounded-full inline-block">
                    Official Masterclass Flier
                  </span>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 leading-tight">
                    From Applying Randomly to Applying Strategically
                  </h2>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    This practical career masterclass was designed to help you position yourself, find better opportunities and improve your chances of getting hired.
                  </p>

                  {/* Who Should Attend - Matching Flyer */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-[#004D4E] uppercase tracking-wide">
                      <Users className="w-4 h-4 text-[#006C6D]" />
                      <span>Who Should Attend?</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-transparent border border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-950">Graduates</div>
                          <div className="text-[11px] text-slate-500">Entering the corporate workplace</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-transparent border border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-950">Job Seekers</div>
                          <div className="text-[11px] text-slate-500">Struggling with screening rejections</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-transparent border border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-950">Career Switchers</div>
                          <div className="text-[11px] text-slate-500">Pivoting into high-growth industries</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-transparent border border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-transparent border border-[#006C6D]/30 text-[#006C6D] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-950">Early Career Professionals</div>
                          <div className="text-[11px] text-slate-500">Advancing into mid-level roles</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href={PAYSTACK_PAYMENT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 rounded-full font-black text-sm bg-[#006C6D] hover:bg-[#004D4E] text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-[#F1B01C]" />
                      <span>Join the Masterclass — Just ₦6,999</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => setIsMasterclassModalOpen(true)}
                      className="px-6 py-4 rounded-full font-bold text-xs bg-transparent border border-slate-300 hover:border-[#006C6D] text-slate-800 transition-colors cursor-pointer text-center"
                    >
                      View Syllabus Guide
                    </button>
                  </div>
                </div>

                {/* Masterclass Flyer Image Showcase */}
                <div className="lg:col-span-6 flex justify-center">
                  <MasterclassFlyer onEnrollClick={() => setIsMasterclassModalOpen(true)} />
                </div>
              </div>
            </div>

            {/* The 7 Live Sessions in Depth - Exact 7 Pointers from Flyer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8">
                <div className="text-center max-w-2xl mx-auto">
                  <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-transparent border border-[#006C6D]/30 px-3.5 py-1.5 rounded-full inline-block">
                    Inside the Masterclass
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-2">
                    The 7 Live Interactive Sessions
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Derived directly from our core curriculum pointers: hands-on, live instructor delivery with real-time feedback.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
                  {[
                    {
                      num: 'SESSION 1',
                      title: "Identify jobs you're actually qualified for",
                      desc: 'Clarify your true market positioning, pinpoint the roles matching your exact competencies, and eliminate guesswork so you stop wasting hours applying for mismatches.',
                    },
                    {
                      num: 'SESSION 2',
                      title: 'Search for jobs beyond job boards',
                      desc: 'Uncover the hidden job market, engage hiring managers and internal talent recruiters directly, and find unadvertised vacancies before they reach public portals.',
                    },
                    {
                      num: 'SESSION 3',
                      title: 'Build a CV recruiters can quickly understand',
                      desc: 'Craft a clean, ATS-compliant and human-friendly CV with quantified metrics that communicates your measurable impact in the critical 6-second recruiter screen.',
                    },
                    {
                      num: 'SESSION 4',
                      title: 'Write stronger applications',
                      desc: 'Tailor your application responses, screening questions, and cover notes to address the exact competencies hiring managers are scoring candidates on.',
                    },
                    {
                      num: 'SESSION 5',
                      title: 'Prepare for interviews with confidence',
                      desc: 'Master structured storytelling frameworks, handle tough behavioral and competency questions with poise, and project commanding presence in panels.',
                    },
                    {
                      num: 'SESSION 6',
                      title: 'Follow up professionally',
                      desc: 'Navigate post-interview communication, inquire about application statuses with poise, and stay top-of-mind without sounding anxious or desperate.',
                    },
                    {
                      num: 'SESSION 7',
                      title: 'Build a personal job search strategy',
                      desc: 'Establish a systematic daily and weekly execution pipeline, track applications methodically, and sustain high momentum until you land multiple offers.',
                    },
                  ].map((sess, idx) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl bg-transparent border border-slate-200 flex items-start gap-4 ${
                        idx === 6 ? 'md:col-span-2' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-transparent border border-[#006C6D] text-[#006C6D] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#006C6D]">
                          {sess.num}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-950 mt-0.5">
                          {sess.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {sess.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Masterclass Pricing Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#006C6D] shadow-lg text-center space-y-6">
                <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-transparent border border-[#006C6D]/30 px-3.5 py-1.5 rounded-full inline-block">
                  Official Program Tuition
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                  Masterclass Pricing
                </h2>

                <div className="py-2">
                  <div className="text-4xl sm:text-6xl font-black text-[#006C6D] tracking-tight">
                    ₦6,999
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-800 mt-2">
                    7 LIVE SESSIONS • LIVE INSTRUCTOR-LED
                  </div>
                </div>

                {/* Approximate International Currency Equivalents */}
                <div className="bg-transparent p-5 rounded-2xl border border-slate-200 text-center max-w-xl mx-auto">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Approximate International Currency Equivalents
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {(['NGN', 'USD', 'GBP', 'EUR', 'GHS', 'KES', 'ZAR'] as const).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setPricingCurrency(curr)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          pricingCurrency === curr
                            ? 'bg-[#006C6D] text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>

                  <div className="text-sm font-bold text-[#006C6D]">
                    {currencyRates[pricingCurrency].note}:{' '}
                    <span className="text-lg font-black text-slate-900">
                      {currencyRates[pricingCurrency].symbol}
                      {currencyRates[pricingCurrency].value}
                    </span>
                  </div>

                  {/* Mandatory currency note */}
                  <p className="text-[11px] text-slate-500 mt-3 italic leading-relaxed">
                    “International currency equivalents are approximate and may change with exchange rates. The official program price is ₦6,999.”
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={PAYSTACK_PAYMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-black text-base bg-[#006C6D] hover:bg-[#004D4E] text-white shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <CreditCard className="w-5 h-5 text-[#F1B01C]" />
                    <span>Proceed to Paystack Payment (₦6,999)</span>
                    <ExternalLink className="w-4 h-4 text-[#F1B01C]" />
                  </a>

                  <button
                    onClick={() => setIsMasterclassModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-sm text-[#006C6D] hover:bg-[#D3EDE9]/40 border border-[#006C6D]/30 transition-all cursor-pointer"
                  >
                    <span>Enrollment Details & Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#004D4E] border-2 border-[#006C6D] text-white p-8 sm:p-14 shadow-xl text-center">
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none select-none"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80")`,
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-linear-to-br from-[#004D4E]/92 via-[#003B3C]/88 to-slate-950/92 pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#F1B01C]">
                Take Action on Your Career Today
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Become More Employable. Position Yourself Better. Get Hired.
              </h2>

              <p className="text-[#D3EDE9] text-sm sm:text-base">
                Join the free live webinar on 30 Nov, 2026 at 8:00 PM WAT, or secure your place in the complete 7 Live Sessions Masterclass.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setIsWebinarModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 shadow-xl transition-all cursor-pointer"
                >
                  Register Free Webinar (30 Nov)
                </button>

                <a
                  href={PAYSTACK_PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-xs transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-[#F1B01C]" />
                  <span>Register for Masterclass</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#F1B01C]" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenWebinarModal={() => setIsWebinarModalOpen(true)}
        onOpenMasterclassModal={() => setIsMasterclassModalOpen(true)}
      />

      {/* Modals & Fullscreen Overlays */}
      <RegistrationModal
        isOpen={isWebinarModalOpen}
        onClose={() => setIsWebinarModalOpen(false)}
        onOpenSheetsSync={() => setIsSheetsModalOpen(true)}
      />

      <GoogleSheetsSyncModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        onConfigUpdated={(cfg) => setLinkedSheetConfig(cfg)}
      />

      <MasterclassEnrollModal
        isOpen={isMasterclassModalOpen}
        onClose={() => setIsMasterclassModalOpen(false)}
      />

      {/* Replicated Dynamic Immersive Navigation System (Dedicated Backgrounds per Item) */}
      <ImmersiveNavigationOverlay
        isOpen={isImmersiveNavOpen}
        onClose={() => setIsImmersiveNavOpen(false)}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenWebinarModal={() => setIsWebinarModalOpen(true)}
        onOpenMasterclassModal={() => setIsMasterclassModalOpen(true)}
      />
    </div>
  );
}
