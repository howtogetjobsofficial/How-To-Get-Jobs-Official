import React from 'react';
import { Mail, ArrowRight, Calendar, Lock, CreditCard, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

export const PAYSTACK_PAYMENT_URL = 'https://paystack.shop/pay/howtogetjobs';

interface FooterProps {
  onNavigate: (view: 'landing' | 'webinar' | 'masterclass') => void;
  onOpenWebinarModal: () => void;
  onOpenMasterclassModal: () => void;
}

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/howtogetjobsofficial',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/howtogetjobs_official/',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zm9.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/howto_getjob',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/howtogetjobs/',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@howtogetjobs',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@howtogetjobs',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
];

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenWebinarModal,
}) => {
  return (
    <footer className="bg-[#004D4E] text-[#D3EDE9] pt-16 pb-12 border-t border-[#006C6D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#006C6D]">
          {/* Brand Column - Standalone Logo + Statement + Social Links */}
          <div className="space-y-4">
            <Logo variant="white" />
            <p className="text-xs sm:text-sm text-[#D3EDE9] leading-relaxed max-w-sm">
              Helping graduates, job seekers, early-career professionals and career switchers improve how they search, position themselves, apply and prepare for opportunities.
            </p>

            <div className="pt-1">
              <div className="text-[11px] uppercase tracking-wider font-mono font-bold text-white mb-2.5">
                Follow Us
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`How to Get Jobs on ${social.name}`}
                    title={social.name}
                    className="w-9 h-9 rounded-full bg-[#006C6D] hover:bg-[#F1B01C] text-white hover:text-slate-950 border border-[#D3EDE9]/30 flex items-center justify-center transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Portals: The 2 Main Programs */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
              Programs
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('webinar')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#F1B01C]" />
                  <span>Free Webinar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('masterclass')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-[#F1B01C]" />
                  <span>Masterclass</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Actions & Contact */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
              Direct Contact
            </h4>
            <a
              href="mailto:howtogetjobsofficial@gmail.com"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-white hover:text-[#F1B01C] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#F1B01C] shrink-0" />
              <span>howtogetjobsofficial@gmail.com</span>
            </a>

            <div className="pt-2 space-y-2">
              <button
                onClick={onOpenWebinarModal}
                className="w-full py-2.5 px-4 rounded-full text-xs font-black bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Register Free Webinar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={PAYSTACK_PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-full text-xs font-black bg-[#006C6D] hover:bg-[#005a5b] text-white transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#D3EDE9]/30"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#F1B01C]" />
                <span>Register for Masterclass</span>
                <ExternalLink className="w-3 h-3 text-[#F1B01C]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex items-center justify-center sm:justify-start text-xs text-[#D3EDE9]/80">
          <div>
            © {new Date().getFullYear()} How to Get Jobs. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
