import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Sparkles, 
  Users, 
  Target, 
  FileText, 
  Briefcase, 
  Video, 
  Layers, 
  ShieldCheck,
  HelpCircle,
  Play
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Logo } from './components/Logo';
import { WebinarFlyer } from './components/WebinarFlyer';
import { WebinarCountdown } from './components/WebinarCountdown';
import { RegistrationModal } from './components/RegistrationModal';
import { MasterclassEnrollModal } from './components/MasterclassEnrollModal';

export default function App() {
  // Navigation view: 'landing' (first view / landing page), 'webinar' (strictly free webinar), 'masterclass' (strictly masterclass)
  const [currentView, setCurrentView] = useState<'landing' | 'webinar' | 'masterclass'>('landing');
  const [isWebinarModalOpen, setIsWebinarModalOpen] = useState(false);
  const [isMasterclassModalOpen, setIsMasterclassModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Currency converter state for Masterclass pricing
  const [pricingCurrency, setPricingCurrency] = useState<'NGN' | 'USD' | 'GBP' | 'EUR' | 'GHS' | 'KES' | 'ZAR'>('NGN');

  const currencyRates = {
    NGN: { symbol: '₦', value: '6,999', note: 'Official Programme Price' },
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

  const handleNavigate = (view: 'landing' | 'webinar' | 'masterclass') => {
    setCurrentView(view);
    window.location.hash = view === 'landing' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFA] text-slate-900 selection:bg-[#F1B01C] selection:text-slate-950 font-sans">
      {/* 1. NAVBAR - Exactly Two Navigation Menus: Free Webinar & Masterclass (No price tag) */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenWebinarModal={() => setIsWebinarModalOpen(true)}
        onOpenMasterclassModal={() => setIsMasterclassModalOpen(true)}
      />

      <main className="flex-1 space-y-16 sm:space-y-24 pb-20">
        {/* ========================================================================= */}
        {/* VIEW 1: LANDING PAGE (DEFAULT FIRST VIEW)                                */}
        {/* ========================================================================= */}
        {currentView === 'landing' && (
          <div className="space-y-16 sm:space-y-24">
            {/* Landing Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-b from-[#006C6D] to-[#004D4E] text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                  {/* Standalone Logo at top of Hero - NO tagline or words underneath */}
                  <div className="flex justify-center mb-4">
                    <Logo variant="white" className="scale-110 sm:scale-125" />
                  </div>

                  {/* Exact Hero Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                    Become More Employable.<br />
                    Position Yourself Better.<br />
                    <span className="text-[#F1B01C]">Get Hired.</span>
                  </h1>

                  {/* Exact Supporting Text */}
                  <p className="text-base sm:text-lg lg:text-xl text-[#D3EDE9] leading-relaxed max-w-2xl mx-auto">
                    We help graduates, job seekers, early-career professionals and career switchers improve how they search, position themselves, apply and prepare for opportunities.
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
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-sm sm:text-base bg-[#004D4E] hover:bg-[#003B3C] text-white border border-[#D3EDE9]/30 transition-all cursor-pointer"
                    >
                      <span>EXPLORE THE MASTERCLASS</span>
                      <ChevronRight className="w-4 h-4 text-[#F1B01C]" />
                    </button>
                  </div>

                  {/* Key Highlights */}
                  <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#D3EDE9]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#F1B01C]" />
                      <span>Free Webinar: <strong>30 Nov, 2026</strong> • 8:00 PM WAT</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#F1B01C]" />
                      <span>Masterclass: <strong>7 Live Sessions</strong> • Instructor-Led</span>
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Two Main Programme Portals Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-[#D3EDE9] px-3.5 py-1.5 rounded-full">
                  Choose Your Learning Path
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3">
                  Two Structured Ways to Accelerate Your Career
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-2">
                  Select between the complimentary tactical webinar on 30 Nov or the intensive 7 Live Sessions Masterclass.
                </p>
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

                    <div className="space-y-2 pt-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#006C6D] shrink-0" />
                        <span>Why qualified applicants get rejected by ATS filters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#006C6D] shrink-0" />
                        <span>The 6-second recruiter resume evaluation framework</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#006C6D] shrink-0" />
                        <span>Includes live Q&A and instant downloadable pass</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
                    <button
                      onClick={() => handleNavigate('webinar')}
                      className="w-full py-3.5 px-6 rounded-full font-black text-sm bg-[#006C6D] hover:bg-[#004D4E] text-white transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Go to Free Webinar Portal</span>
                      <ArrowRight className="w-4 h-4 text-[#F1B01C]" />
                    </button>
                    <button
                      onClick={() => setIsWebinarModalOpen(true)}
                      className="w-full py-2 text-xs font-bold text-[#006C6D] hover:underline cursor-pointer text-center"
                    >
                      Instant 1-Click Registration (30 Nov)
                    </button>
                  </div>
                </div>

                {/* Portal Card 2: Masterclass (No price tag in badge) */}
                <div className="bg-[#004D4E] text-white rounded-3xl p-8 border-2 border-[#006C6D] shadow-lg flex flex-col justify-between hover:shadow-xl transition-all">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#F1B01C] text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                      <span>7 LIVE SESSIONS</span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      HOW TO GET JOBS MASTERCLASS
                    </h3>

                    <div className="text-sm font-bold text-[#F1B01C] flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Live Instructor-Led Masterclass</span>
                    </div>

                    <p className="text-[#D3EDE9] text-sm leading-relaxed">
                      A practical live Masterclass designed to help you improve your career positioning, job search, CV, LinkedIn, applications and interview preparation.
                    </p>

                    <div className="space-y-2 pt-2 text-xs text-[#D3EDE9]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#F1B01C] shrink-0" />
                        <span>All 7 live interactive curriculum sessions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#F1B01C] shrink-0" />
                        <span>Direct line-by-line CV and application teardowns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#F1B01C] shrink-0" />
                        <span>Official programme tuition: ₦6,999</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#006C6D] mt-6 space-y-2">
                    <button
                      onClick={() => handleNavigate('masterclass')}
                      className="w-full py-3.5 px-6 rounded-full font-black text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Explore Masterclass Programme</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsMasterclassModalOpen(true)}
                      className="w-full py-2 text-xs font-bold text-[#D3EDE9] hover:underline cursor-pointer text-center"
                    >
                      Direct Enrollment (₦6,999)
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Real Proof Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-[#D3EDE9] px-3 py-1 rounded-full">
                  Verified Candidates
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-2">
                  Real Proof
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Professionals who have benefited from the How to Get Jobs methodologies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#006C6D] transition-colors">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-bold text-lg mb-4">
                      MT
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-950">M.M. Tukur</h3>
                    <p className="text-sm font-semibold text-[#006C6D] mt-1">Marketing Lead, FunZ</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#006C6D]" />
                    <span>Verified Candidate</span>
                  </div>
                </div>

                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#006C6D] transition-colors">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-bold text-lg mb-4">
                      FE
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-950">Faith Ejeh</h3>
                    <p className="text-sm font-semibold text-[#006C6D] mt-1">Business Development Strategist, Shaféwears</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#006C6D]" />
                    <span>Verified Candidate</span>
                  </div>
                </div>

                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#006C6D] transition-colors">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-bold text-lg mb-4">
                      EA
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-950">Emmanuel Adetayo</h3>
                    <p className="text-sm font-semibold text-[#006C6D] mt-1">Mechanical Engineer</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#006C6D]" />
                    <span>Verified Candidate</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 1. Mission, 2. Vision, 3. Goal */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-[#D3EDE9] px-3.5 py-1.5 rounded-full">
                  Our Purpose & Commitments
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3">
                  Mission, Vision & Goal
                </h2>
                <p className="text-slate-600 text-sm mt-2">
                  Building a future where everyone has the capabilities, tools, and access needed to thrive in the world of work.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Mission */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-bold text-lg">
                      01
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">1. Mission</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      To equip people across Africa with the skills, tools, knowledge, mentorship, and opportunities they need to become job-ready, access meaningful employment, and build sustainable careers.
                    </p>
                  </div>
                </div>

                {/* 2. Vision */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-bold text-lg">
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
                    <div className="w-12 h-12 rounded-2xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-bold text-lg">
                      03
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">3. Goal</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      To help individuals become competitive, confident, and career-ready by bridging the gap between what employers expect and what job seekers can offer.
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                      We aim to achieve this by providing accessible career education, practical tools, mentorship, employability programs, and pathways to real opportunities, helping people move from searching for jobs to becoming the kind of talent opportunities compete for.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Core Values */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-[#D3EDE9] px-3.5 py-1.5 rounded-full">
                  What Guides Us
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3">
                  4. Core Values
                </h2>
                <p className="text-slate-600 text-sm mt-2">
                  The principles that shape our programs, our culture, and our commitment to candidates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Continuous Learning */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">1. Continuous Learning</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We believe employability can be developed. We promote continuous learning, practical skill-building, and personal growth to prepare people for an evolving world of work.
                  </p>
                </div>

                {/* 2. Opportunity and Access */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">2. Opportunity and Access</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We believe talent exists everywhere, but access to preparation and opportunity is not equal. We work to make career resources, guidance, and opportunities more accessible.
                  </p>
                </div>

                {/* 3. Practical Impact */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">3. Practical Impact</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We prioritize actionable knowledge, useful tools, and real-world experiences that help people improve their employability and achieve measurable career progress.
                  </p>
                </div>

                {/* 4. Empowerment */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    4
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">4. Empowerment</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We help people take ownership of their career journeys by building their confidence, strengthening their capabilities, and equipping them to make informed career decisions.
                  </p>
                </div>

                {/* 5. Integrity and Trust */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    5
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">5. Integrity and Trust</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We are committed to honesty, transparency, and responsible guidance. We strive to provide credible information and represent career opportunities truthfully.
                  </p>
                </div>

                {/* 6. Growth and Excellence */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    6
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">6. Growth and Excellence</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We pursue high standards in our work and continuously improve our programs, resources, and services to create lasting value for job seekers and employers.
                  </p>
                </div>

                {/* 7. Collaboration */}
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-[#006C6D] transition-colors md:col-span-2 lg:col-span-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center font-mono font-bold text-sm">
                    7
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950">7. Collaboration</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                    We believe meaningful progress happens when job seekers, employers, educators, mentors, and organizations work together to build a stronger and more inclusive employment ecosystem.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Guiding Philosophy */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-linear-to-br from-[#006C6D] to-[#004D4E] text-white rounded-3xl p-8 sm:p-14 shadow-xl border border-[#004D4E] space-y-8">
                <div className="max-w-3xl space-y-4">
                  <div className="inline-flex items-center gap-2 bg-[#F1B01C] text-slate-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    <span>OUR GUIDING PHILOSOPHY</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                    We don't just help people find jobs. We help them become ready for opportunities.
                  </h2>

                  <p className="text-base sm:text-lg text-[#D3EDE9] leading-relaxed">
                    We believe that getting a job is only one part of a successful career. People also need the skills to perform, the confidence to compete, the knowledge to navigate the workplace, and the support to continue growing.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#006C6D]/80">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-[#F1B01C] font-mono mb-6">
                    Our work follows a simple journey:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      { step: '1', title: 'Assess', desc: 'Diagnose current skills, strengths, and areas for strategic growth.' },
                      { step: '2', title: 'Learn', desc: 'Acquire practical tools, market insights, and recruiter frameworks.' },
                      { step: '3', title: 'Build', desc: 'Construct compelling resumes, LinkedIn presence, and interview assets.' },
                      { step: '4', title: 'Connect', desc: 'Tap into hiring networks, unadvertised roles, and mentors.' },
                      { step: '5', title: 'Grow', desc: 'Thrive on the job, deliver impact, and advance your long-term career.' },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="bg-[#003B3C] p-5 rounded-2xl border border-[#006C6D] text-left space-y-2 hover:border-[#F1B01C] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#F1B01C] text-slate-950 font-black text-sm flex items-center justify-center font-mono">
                          {item.step}
                        </div>
                        <h4 className="text-lg font-black text-white">{item.title}</h4>
                        <p className="text-[11px] text-[#D3EDE9] leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* General FAQ Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-[#D3EDE9] px-3 py-1 rounded-full">
                  Frequently Asked Questions
                </span>
                <h2 className="text-3xl font-extrabold text-slate-950 mt-2">
                  Common Questions
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'How do I choose between the Free Webinar and the Masterclass?',
                    a: 'The Free Webinar on 30 Nov is an intensive 2-hour live session covering the core mistakes applicants make and how recruiters screen candidates. The Masterclass is the full 7 Live Sessions programme with hands-on CV revamps, interview prep, and direct instructor coaching for ₦6,999.',
                  },
                  {
                    q: 'What date is the Free Webinar?',
                    a: 'The Free Webinar takes place on 30 Nov, 2026, starting at 8:00 PM WAT (GMT +1) virtually on Zoom and YouTube.',
                  },
                  {
                    q: 'Is the Masterclass self-paced or live?',
                    a: 'The Masterclass is 100% LIVE and instructor-led across 7 live interactive sessions. It is not a recorded self-paced course.',
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
            <div className="bg-[#006C6D] text-white py-12 px-4 sm:px-6 lg:px-8 text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
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
              <div className="inline-flex items-center gap-3 bg-[#004D4E] text-[#D3EDE9] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border border-[#006C6D]">
                <Calendar className="w-4 h-4 text-[#F1B01C]" />
                <span>Date: <strong className="text-white">30 Nov, 2026</strong></span>
                <span>•</span>
                <Clock className="w-4 h-4 text-[#F1B01C]" />
                <span>Time: <strong className="text-white">8:00 PM WAT (GMT +1)</strong></span>
                <span>•</span>
                <Video className="w-4 h-4 text-[#F1B01C]" />
                <span>Virtual (Zoom & YouTube)</span>
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
                  <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-[#D3EDE9] px-3.5 py-1.5 rounded-full">
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
                      className="px-6 py-4 rounded-full font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer text-center"
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
              <div className="bg-[#004D4E] text-white rounded-3xl p-8 sm:p-12 shadow-lg">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Who Should Attend This Free Webinar
                  </h3>
                  <p className="text-[#D3EDE9] text-sm mt-1">
                    Specifically designed for proactive job seekers ready for answers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#D3EDE9]">
                  <div className="bg-[#003B3C] p-5 rounded-2xl border border-[#006C6D]">
                    <div className="font-bold text-white text-sm mb-1">Graduates & NYSC</div>
                    <div>Seeking first professional roles and entering the corporate market.</div>
                  </div>
                  <div className="bg-[#003B3C] p-5 rounded-2xl border border-[#006C6D]">
                    <div className="font-bold text-white text-sm mb-1">Struggling Job Seekers</div>
                    <div>Sending dozens of resumes without receiving interview responses.</div>
                  </div>
                  <div className="bg-[#003B3C] p-5 rounded-2xl border border-[#006C6D]">
                    <div className="font-bold text-white text-sm mb-1">Early-Career Pros</div>
                    <div>Ready to move beyond entry-level pay into higher compensation.</div>
                  </div>
                  <div className="bg-[#003B3C] p-5 rounded-2xl border border-[#006C6D]">
                    <div className="font-bold text-white text-sm mb-1">Career Switchers</div>
                    <div>Transitioning into new industries or global remote opportunities.</div>
                  </div>
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
            <div className="bg-[#004D4E] text-white py-14 px-4 sm:px-6 lg:px-8 text-center space-y-4 border-b border-[#006C6D]">
              <div className="inline-flex items-center gap-2 bg-[#F1B01C] text-slate-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                <span>7 LIVE SESSIONS • INSTRUCTOR-LED</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white">
                HOW TO GET JOBS MASTERCLASS
              </h1>
              <p className="text-base sm:text-lg text-[#D3EDE9] max-w-2xl mx-auto leading-relaxed">
                A practical live Masterclass designed to help you improve your career positioning, job search, CV, LinkedIn, applications and interview preparation.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setIsMasterclassModalOpen(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm sm:text-base bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Enroll in Masterclass (₦6,999)</span>
                </button>
              </div>
            </div>

            {/* The 7 Live Sessions in Depth */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8">
                <div className="text-center max-w-2xl mx-auto">
                  <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-[#D3EDE9] px-3.5 py-1.5 rounded-full">
                    Complete Syllabus
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-2">
                    The 7 Live Interactive Sessions
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Live instructor delivery, candidate interaction, and real-time document audits.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
                  {[
                    {
                      num: 'SESSION 1',
                      title: 'Career Positioning',
                      desc: 'Clarify your exact value proposition, target job functions, and define where your background gives you an unfair competitive edge.',
                    },
                    {
                      num: 'SESSION 2',
                      title: 'Job Search Strategy',
                      desc: 'Build an intentional, high-converting pipeline instead of blindly submitting applications to overcrowded job boards.',
                    },
                    {
                      num: 'SESSION 3',
                      title: 'Build a CV Recruiters Can Understand',
                      desc: 'Craft an ATS-compliant and human-friendly CV with quantified metrics that passes the critical 6-second recruiter screen.',
                    },
                    {
                      num: 'SESSION 4',
                      title: 'Position Your LinkedIn Profile',
                      desc: 'Optimize your digital footprint, headline, and about section to attract inbound recruiter searches and direct interview invitations.',
                    },
                    {
                      num: 'SESSION 5',
                      title: 'Write Stronger Applications',
                      desc: 'Tailor your application answers, cover notes, and screening submissions to hit the exact competencies hiring managers evaluate.',
                    },
                    {
                      num: 'SESSION 6',
                      title: 'Prepare for Interviews',
                      desc: 'Master structured storytelling models (STAR-L), handle behavioral questions, and project authority in panel discussions.',
                    },
                    {
                      num: 'SESSION 7',
                      title: 'Build Your Personal Job-Search System',
                      desc: 'Establish repeatable daily and weekly execution habits, track follow-ups, and build momentum until you land multiple offers.',
                    },
                  ].map((sess, idx) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl bg-[#F8FBFA] border border-slate-200 flex items-start gap-4 ${
                        idx === 6 ? 'md:col-span-2' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#006C6D] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
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
                <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-[#D3EDE9] px-3.5 py-1.5 rounded-full">
                  Official Programme Tuition
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
                <div className="bg-[#F8FBFA] p-5 rounded-2xl border border-slate-200 text-center max-w-xl mx-auto">
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
                    “International currency equivalents are approximate and may change with exchange rates. The official programme price is ₦6,999.”
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsMasterclassModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-black text-base bg-[#006C6D] hover:bg-[#004D4E] text-white shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <span>Enroll Now for ₦6,999</span>
                    <ArrowRight className="w-4 h-4 text-[#F1B01C]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#006C6D] text-white p-8 sm:p-14 shadow-2xl text-center space-y-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#F1B01C]">
                Take Action on Your Career Today
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
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

                <button
                  onClick={() => setIsMasterclassModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm bg-[#004D4E] hover:bg-[#003B3C] text-white border border-[#D3EDE9]/40 transition-all cursor-pointer"
                >
                  Enroll in Masterclass (₦6,999)
                </button>
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

      {/* Modals */}
      <RegistrationModal
        isOpen={isWebinarModalOpen}
        onClose={() => setIsWebinarModalOpen(false)}
      />

      <MasterclassEnrollModal
        isOpen={isMasterclassModalOpen}
        onClose={() => setIsMasterclassModalOpen(false)}
      />
    </div>
  );
}
