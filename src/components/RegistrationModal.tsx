import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Download,
  FileSpreadsheet,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Logo } from './Logo';
import {
  saveRegistrationLocally,
  markRegistrationsSynced,
  loadLinkedSheetConfig,
  getAccessToken,
  appendRegistrationsToSheet,
  WebinarRegistration,
  LinkedSheetConfig,
} from '../lib/googleSheets';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSheetsSync?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onOpenSheetsSync,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    status: 'Graduate / Job Seeker',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [submittedReg, setSubmittedReg] = useState<WebinarRegistration | null>(null);
  const [linkedConfig, setLinkedConfig] = useState<LinkedSheetConfig | null>(() =>
    loadLinkedSheetConfig()
  );
  const [isSyncingRow, setIsSyncingRow] = useState(false);
  const [rowSynced, setRowSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLinkedConfig(loadLinkedSheetConfig());
      setSyncError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasAuthToken = Boolean(getAccessToken());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const generatedTicket = 'HGJ-' + Math.floor(100000 + Math.random() * 900000);
    const registration: WebinarRegistration = {
      ticketId: generatedTicket,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      status: formData.status,
      submittedAt: new Date().toISOString(),
      webinarDate: '30 Nov, 2026',
      syncedToSheet: false,
    };

    saveRegistrationLocally(registration);
    setSubmittedReg(registration);
    setTicketId(generatedTicket);
    setRowSynced(false);
    setSyncError(null);
    setIsSubmitted(true);

    // Optional public Apps Script webhook forwarding if configured by the organizer
    const cfg = loadLinkedSheetConfig();
    setLinkedConfig(cfg);
    if (cfg?.appsScriptWebhookUrl) {
      try {
        await fetch(cfg.appsScriptWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(registration),
        });
        markRegistrationsSynced([registration.ticketId]);
        setRowSynced(true);
      } catch {
        // Keep local copy pending manual Google Sheet sync
      }
    }

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

  const handleConfirmedSheetSave = async () => {
    if (!submittedReg || !linkedConfig?.spreadsheetId) return;
    const token = getAccessToken();
    if (!token) {
      onClose();
      onOpenSheetsSync?.();
      return;
    }

    setIsSyncingRow(true);
    setSyncError(null);
    try {
      await appendRegistrationsToSheet(
        token,
        linkedConfig.spreadsheetId,
        linkedConfig.sheetTabTitle,
        [submittedReg]
      );
      markRegistrationsSynced([submittedReg.ticketId]);
      setRowSynced(true);
    } catch (err: unknown) {
      setSyncError(
        err instanceof Error ? err.message : 'Unable to save to Google Sheet right now.'
      );
    } finally {
      setIsSyncingRow(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      status: 'Graduate / Job Seeker',
    });
    setIsSubmitted(false);
    setSubmittedReg(null);
    setRowSynced(false);
    setSyncError(null);
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
      'DESCRIPTION:Practical live online session for graduates, job seekers and early-career professionals.\\nDate: 30 Nov, 2026 at 8:00 PM WAT\\nPass ID: ' +
        ticketId +
        '\\nZoom & YouTube Live Stream',
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

                {onOpenSheetsSync && (
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSheetsSync();
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#006C6D] hover:underline cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>
                        {linkedConfig?.spreadsheetId
                          ? `Linked to Google Sheet: ${linkedConfig.spreadsheetTitle}`
                          : 'Organizer: Link this form to Google Sheets'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-transparent border border-[#006C6D]/30 text-[#006C6D] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-950">
              Seat Reserved, {formData.fullName.split(' ')[0]}!
            </h3>
            <p className="text-slate-600 text-sm max-w-sm mx-auto">
              Your free webinar access pass for <strong>30 Nov, 2026</strong> has been registered.
              An invitation has been dispatched to <strong>{formData.email}</strong>.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-transparent text-slate-800 text-left shadow-sm border-2 border-[#006C6D]">
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-[#006C6D]/25">
                <span className="text-[10px] uppercase font-mono text-[#006C6D]">Pass ID:</span>
                <span className="text-sm font-mono font-bold text-[#004D4E]">{ticketId}</span>
              </div>
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#006C6D]" />
                  <span className="text-slate-900 font-medium">30 Nov, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#006C6D]" />
                  <span className="text-slate-900 font-medium">8:00 PM WAT (GMT +1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-[#006C6D]" />
                  <span className="text-slate-900 font-medium">Virtual (Zoom & YouTube)</span>
                </div>
              </div>
            </div>

            {/* Google Sheets Explicit Save Confirmation / Sync Status */}
            <div className="p-4 rounded-2xl bg-transparent border border-slate-200 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                  <FileSpreadsheet className="w-4 h-4 text-[#006C6D]" />
                  <span>Google Sheets Sync</span>
                </div>
                {rowSynced && (
                  <span className="text-[10px] font-black uppercase bg-transparent border border-[#006C6D]/40 text-[#004D4E] px-2.5 py-0.5 rounded-full">
                    Saved to Sheet
                  </span>
                )}
              </div>

              {syncError && <p className="text-[11px] text-[#DC2626] font-medium">{syncError}</p>}

              {rowSynced ? (
                <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
                  <span>
                    Entry recorded in{' '}
                    <strong>{linkedConfig?.spreadsheetTitle || 'Google Sheet'}</strong>.
                  </span>
                  {linkedConfig?.spreadsheetId && (
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${linkedConfig.spreadsheetId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#006C6D] hover:underline shrink-0"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ) : linkedConfig?.spreadsheetId && hasAuthToken ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-600">
                    Confirm saving <strong>{submittedReg?.fullName}</strong>’s registration row to{' '}
                    <strong>{linkedConfig.spreadsheetTitle}</strong> (Tab:{' '}
                    <strong>{linkedConfig.sheetTabTitle}</strong>)?
                  </p>
                  <button
                    type="button"
                    disabled={isSyncingRow}
                    onClick={handleConfirmedSheetSave}
                    className="w-full py-2.5 px-4 rounded-full text-xs font-black bg-[#006C6D] hover:bg-[#004D4E] text-white cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSyncingRow ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Google Sheet...</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#F1B01C]" />
                        <span>Confirm & Save Row to Google Sheet</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 text-xs text-slate-600">
                  <span>Registration saved locally. Link Google Sheets to sync rows.</span>
                  {onOpenSheetsSync && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSheetsSync();
                      }}
                      className="px-3 py-1.5 rounded-full text-[11px] font-black bg-[#F1B01C] hover:bg-[#df9f12] text-slate-950 cursor-pointer shrink-0"
                    >
                      Link Sheet
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={downloadCalendarInvite}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-[#006C6D] hover:bg-[#004D4E] text-white transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#F1B01C]" />
                Add to Calendar (.ics)
              </button>
              <button
                onClick={handleResetForm}
                className="py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                New Entry
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
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

