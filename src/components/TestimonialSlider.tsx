import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Briefcase } from 'lucide-react';

interface TestimonialItem {
  id: string;
  initials: string;
  name: string;
  role: string;
  quote: string;
  focusArea: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'mm-tukur',
    initials: 'MT',
    name: 'M.M. Tukur',
    role: 'Marketing Lead, FunZ',
    focusArea: 'Strategic Career Positioning',
    quote:
      'Applying the How to Get Jobs positioning framework helped me move beyond generic applications and clearly communicate measurable value to hiring teams.',
  },
  {
    id: 'faith-ejeh',
    initials: 'FE',
    name: 'Faith Ejeh',
    role: 'Business Development Strategist, Shaféwears',
    focusArea: 'CV & Opportunity Strategy',
    quote:
      'Restructuring my CV and outreach strategy around what employers actually look for transformed how I approach career growth and high-value opportunities.',
  },
  {
    id: 'emmanuel-adetayo',
    initials: 'EA',
    name: 'Emmanuel Adetayo',
    role: 'Mechanical Engineer',
    focusArea: 'Recruiter-Ready Applications',
    quote:
      'Instead of sending applications blindly, I learned how to translate my technical experience into clear, recruiter-ready impact.',
  },
];

export const TestimonialSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      nextSlide();
    }, 4500);

    return () => window.clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      id="testimonials"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Candidate Testimonials"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-[#006C6D] uppercase tracking-widest bg-[#D3EDE9] px-3.5 py-1.5 rounded-full">
          Candidate Stories
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3">
          Professionals Moving Forward
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Hear from professionals applying How to Get Jobs strategies across industries.
        </p>
      </div>

      {/* Main Carousel Container */}
      <div className="max-w-4xl mx-auto relative">
        <div className="bg-[#004D4E] rounded-3xl border-2 border-[#006C6D] shadow-xl overflow-hidden text-white relative">
          {/* Decorative Corner Ambient Accent */}
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#F1B01C]/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Sliding Track */}
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="w-full shrink-0 p-8 sm:p-12 md:p-14 flex flex-col justify-between space-y-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#006C6D] border border-[#D3EDE9]/30 flex items-center justify-center shrink-0">
                    <Quote className="w-6 h-6 text-[#F1B01C]" />
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#003B3C] text-[#D3EDE9] px-3.5 py-1.5 rounded-full border border-[#006C6D]">
                    <Briefcase className="w-3.5 h-3.5 text-[#F1B01C]" />
                    <span>{item.focusArea}</span>
                  </span>
                </div>

                <blockquote className="text-lg sm:text-2xl font-medium text-white leading-relaxed">
                  “{item.quote}”
                </blockquote>

                <div className="pt-6 border-t border-[#006C6D]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#F1B01C] text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                      {item.initials}
                    </div>
                    <div>
                      <div className="text-xl font-black text-white tracking-tight">
                        {item.name}
                      </div>
                      <div className="text-sm font-semibold text-[#D3EDE9]">{item.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Bar: Prev/Next + Dots + Name Selector */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          {/* Quick Name Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TESTIMONIALS.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#006C6D] text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#006C6D] hover:text-[#006C6D]'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Prev / Dot Progress / Next */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-[#006C6D] text-slate-800 hover:text-[#006C6D] flex items-center justify-center shadow-xs transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5" aria-label="Slide indicators">
              {TESTIMONIALS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show testimonial from ${item.name}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-7 bg-[#F1B01C]'
                      : 'w-2.5 bg-[#006C6D]/30 hover:bg-[#006C6D]/60'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full bg-[#006C6D] hover:bg-[#004D4E] text-white flex items-center justify-center shadow-xs transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
