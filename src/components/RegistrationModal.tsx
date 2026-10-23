import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, Video, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Logo } from './Logo';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    status: 'Graduate / Job Seeker',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedTicket = 'HGJ-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedTicket);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#006C6D', '#F1B01C', '#DC2626'],
      });
    } catch {
      // ignore
    }
  };

  const downloadCalendarInvite = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//How to Get Jobs//Free Webinar//EN',
      'BEGIN:VEVENT',
      'UID:' + ticketId + '@howtogetjobs.com',
      'DTSTAMP:20261022T000000Z',
      'DTSTART:20261130T190000Z',
      'DTEND:20261130T210000Z',
      'SUMMARY:How to Get Jobs: Applying for Jobs But Not Getting Hired? (Free Webinar)',
      'DESCRIPTION:Practical live online session for graduates, job seekers and early-career professionals.\\nDate: 30 Nov, 2026 at 8:00 PM WAT\\nPass ID: ' + ticketId + '\\nZoom & YouTube Live Stream',
      'LOCATION:Virtual (Zoom & YouTube)',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'HowToGetJobs-FreeWebinar-30Nov2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Modal Header in Flyer Teal */}
            <div className="bg-[#006C6D] p-6 text-white text-center">
              <div className="flex justify-center mb-3">
                <Logo variant="white" />
              </div>
              <div className="inline-block bg-[#DC2626] text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                100% Free Live Webinar
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Applying for Jobs But Not Getting Hired?
              </h3>
              <p className="text-[#D3EDE9] text-xs sm:text-sm mt-1">
                30 Nov, 2026 • 8:00 PM WAT (GMT +1) • Virtual (Zoom & YouTube)
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Adebayo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006C6D] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. samuel@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006C6D] text-sm"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Access links and session workbook will be sent to this email.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="+234 ... or +44 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006C6D] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Current Profile
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#006C6D]"
                >
                  <option value="Graduate / Job Seeker">Recent Graduate / NYSC</option>
                  <option value="Early-Career Professional">Early-Career Professional (0-3 yrs)</option>
                  <option value="Mid-Career Professional">Mid-Career Professional (3+ yrs)</option>
                  <option value="Career Switcher">Career Switcher</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full font-extrabold text-sm bg-[#F1B01C] hover:bg-[#d99c12] text-slate-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Confirm Free Seat For 30 Nov</span>
                </button>
                <div className="text-center text-[11px] text-slate-500 mt-2">
                  No payment required • 100% Free Live Access
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#D3EDE9] text-[#006C6D] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-950">
              Seat Reserved, {formData.fullName.split(' ')[0]}!
            </h3>
            <p className="text-slate-600 text-sm max-w-sm mx-auto">
              Your free webinar access pass for <strong>30 Nov, 2026</strong> has been registered. An invitation has been dispatched to <strong>{formData.email}</strong>.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-[#006C6D] text-white text-left shadow-md border border-[#004D4E]">
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-[#004D4E]">
                <span className="text-[10px] uppercase font-mono text-[#D3EDE9]">Pass ID:</span>
                <span className="text-sm font-mono font-bold text-[#F1B01C]">{ticketId}</span>
              </div>
              <div className="space-y-1 text-xs text-[#D3EDE9]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-medium">30 Nov, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-medium">8:00 PM WAT (GMT +1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-medium">Virtual (Zoom & YouTube)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadCalendarInvite}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-[#006C6D] hover:bg-[#004D4E] text-white transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#F1B01C]" />
                Add to Calendar (.ics)
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
