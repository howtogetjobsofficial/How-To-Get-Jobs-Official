import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

// Webinar start date & time updated to 30 Nov, 2026 at 8:00 PM WAT / GMT +1
export const WEBINAR_START_DATE = "2026-11-30T20:00:00+01:00";

interface CountdownProps {
  className?: string;
  onRegisterClick?: () => void;
}

export const WebinarCountdown: React.FC<CountdownProps> = ({
  className = '',
  onRegisterClick,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isLive: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(WEBINAR_START_DATE).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLive: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
        isLive: false,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative overflow-hidden w-full max-w-2xl mx-auto rounded-3xl bg-[#004D4E] text-white p-6 sm:p-8 shadow-xl border-2 border-[#006C6D] ${className}`}>
      {/* Fitted Background Image + Contrast Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none select-none"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2000&q=80")`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-br from-[#004D4E]/92 via-[#003B3C]/88 to-slate-950/92 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/25 text-[#F1B01C] flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Live Free Webinar Starts In:
              </h3>
              <p className="text-xs text-[#D3EDE9] font-medium">
                30 Nov, 2026 • 8:00 PM WAT (GMT +1)
              </p>
            </div>
          </div>

          {timeLeft.isLive ? (
            <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-xs font-black uppercase px-4 py-1.5 rounded-full animate-pulse shadow-md">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>LIVE NOW</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-[#D3EDE9] text-xs font-bold px-3 py-1 rounded-full">
              <span>WAT (GMT +1)</span>
            </div>
          )}
        </div>

        {timeLeft.isLive ? (
          <div className="text-center py-6">
            <div className="text-3xl sm:text-4xl font-black text-[#F1B01C] tracking-wide mb-2 animate-bounce">
              LIVE NOW
            </div>
            <p className="text-sm text-[#D3EDE9] mb-4">
              The session has begun on Zoom and YouTube!
            </p>
            {onRegisterClick && (
              <button
                onClick={onRegisterClick}
                className="py-3 px-8 rounded-full font-bold text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 transition-all cursor-pointer shadow-lg"
              >
                Join Session Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-4xl font-black text-white font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D3EDE9] mt-1">
                DAYS
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-4xl font-black text-white font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D3EDE9] mt-1">
                HOURS
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-4xl font-black text-white font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D3EDE9] mt-1">
                MINUTES
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-4xl font-black text-[#F1B01C] font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D3EDE9] mt-1">
                SECONDS
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
