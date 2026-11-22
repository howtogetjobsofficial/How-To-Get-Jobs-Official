import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  Plus,
  Link2,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  LogOut,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  loadRegistrations,
  markRegistrationsSynced,
  loadLinkedSheetConfig,
  saveLinkedSheetConfig,
  extractSpreadsheetId,
  getSpreadsheetMetadata,
  createWebinarSpreadsheet,
  appendRegistrationsToSheet,
  fetchSheetRows,
  APPS_SCRIPT_TEMPLATE,
  DEFAULT_SHEET_ACCOUNT_EMAIL,
  WebinarRegistration,
  LinkedSheetConfig,
  SheetMetadata,
} from '../lib/googleSheets';
import { Logo } from './Logo';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: (config: LinkedSheetConfig | null) => void;
}

type PendingMutation =
  | {
      type: 'create';
      spreadsheetTitle: string;
    }
  | {
      type: 'sync';
      registrations: WebinarRegistration[];
      spreadsheetId: string;
      spreadsheetTitle: string;
      sheetTabTitle: string;
    };

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [linkedConfig, setLinkedConfig] = useState<LinkedSheetConfig | null>(() =>
    loadLinkedSheetConfig()
  );
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>(() =>
    loadRegistrations()
  );

  // Connect existing spreadsheet state
  const [sheetUrlInput, setSheetUrlInput] = useState('');
  const [fetchedMeta, setFetchedMeta] = useState<SheetMetadata | null>(null);
  const [selectedTab, setSelectedTab] = useState('');
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  // Create new sheet title
  const [newSheetTitle, setNewSheetTitle] = useState(
    'How to Get Jobs — Free Webinar Registrations (30 Nov 2026)'
  );

  // Live preview rows from Google Sheets
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Explicit confirmation dialog before any Sheets mutation
  const [pendingMutation, setPendingMutation] = useState<PendingMutation | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  // Optional public webhook for unauthenticated visitors / bypassing Error 403 testing block
  const [showWebhookHelp, setShowWebhookHelp] = useState(true);
  const [preferredEmail, setPreferredEmail] = useState(
    () => loadLinkedSheetConfig()?.organizerEmail || DEFAULT_SHEET_ACCOUNT_EMAIL
  );
  const [webhookInput, setWebhookInput] = useState(
    () => loadLinkedSheetConfig()?.appsScriptWebhookUrl || ''
  );
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser) => {
        setUser(authedUser);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRegistrations(loadRegistrations());
      const currentCfg = loadLinkedSheetConfig();
      setLinkedConfig(currentCfg);
      setPreferredEmail(currentCfg?.organizerEmail || DEFAULT_SHEET_ACCOUNT_EMAIL);
      setWebhookInput(currentCfg?.appsScriptWebhookUrl || '');
      setErrorMsg(null);
      setStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pendingRegistrations = registrations.filter((r) => !r.syncedToSheet);

  const handleGoogleLogin = async (emailHint?: string) => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    setStatusMsg(null);
    const target = (emailHint ?? preferredEmail).trim() || DEFAULT_SHEET_ACCOUNT_EMAIL;
    try {
      const result = await googleSignIn(target);
      setUser(result.user);
      setNeedsAuth(false);
      if (linkedConfig) {
        const updatedCfg: LinkedSheetConfig = {
          ...linkedConfig,
          organizerEmail: result.user.email || target,
        };
        saveLinkedSheetConfig(updatedCfg);
        setLinkedConfig(updatedCfg);
        onConfigUpdated?.(updatedCfg);
      }
      setStatusMsg(
        `Connected as ${result.user.email || target}. Choose or create a spreadsheet below.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setErrorMsg(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setNeedsAuth(true);
    setPreviewRows([]);
    setStatusMsg('Signed out of Google.');
  };

  const handleFetchExistingSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);

    const token = getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setErrorMsg('Please sign in with Google first.');
      return;
    }

    const id = extractSpreadsheetId(sheetUrlInput);
    if (!id) {
      setErrorMsg('Please paste a valid Google Sheets URL or Spreadsheet ID.');
      return;
    }

    setIsFetchingMeta(true);
    try {
      const meta = await getSpreadsheetMetadata(token, id);
      setFetchedMeta(meta);
      if (meta.sheets.length > 0) {
        setSelectedTab(meta.sheets[0].title);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not read spreadsheet metadata. Check the URL and permissions.';
      setErrorMsg(msg);
      setFetchedMeta(null);
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleConfirmLinkExistingSheet = () => {
    if (!fetchedMeta || !selectedTab) return;
    const newConfig: LinkedSheetConfig = {
      spreadsheetId: fetchedMeta.spreadsheetId,
      spreadsheetTitle: fetchedMeta.title,
      sheetTabTitle: selectedTab,
      organizerEmail: user?.email || preferredEmail.trim() || DEFAULT_SHEET_ACCOUNT_EMAIL,
      appsScriptWebhookUrl: webhookInput.trim() || linkedConfig?.appsScriptWebhookUrl,
    };
    saveLinkedSheetConfig(newConfig);
    setLinkedConfig(newConfig);
    onConfigUpdated?.(newConfig);
    setFetchedMeta(null);
    setSheetUrlInput('');
    setStatusMsg(`Linked to "${newConfig.spreadsheetTitle}" (Tab: ${newConfig.sheetTabTitle}).`);
    handleRefreshPreview(newConfig);
  };

  const handleRefreshPreview = async (cfgOverride?: LinkedSheetConfig) => {
    const cfg = cfgOverride || linkedConfig;
    const token = getAccessToken();
    if (!cfg || !token) return;

    setIsLoadingPreview(true);
    setErrorMsg(null);
    try {
      const rows = await fetchSheetRows(token, cfg.spreadsheetId, cfg.sheetTabTitle);
      setPreviewRows(rows);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to fetch spreadsheet rows.';
      setErrorMsg(msg);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const executePendingMutation = async () => {
    if (!pendingMutation) return;
    const token = getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setPendingMutation(null);
      setErrorMsg('Google session expired. Please sign in with Google again.');
      return;
    }

    setIsMutating(true);
    setErrorMsg(null);
    setStatusMsg(null);

    try {
      if (pendingMutation.type === 'create') {
        const createdCfg = await createWebinarSpreadsheet(token, pendingMutation.spreadsheetTitle);
        const fullCfg: LinkedSheetConfig = {
          ...createdCfg,
          organizerEmail: user?.email || preferredEmail.trim() || DEFAULT_SHEET_ACCOUNT_EMAIL,
          appsScriptWebhookUrl: webhookInput.trim() || linkedConfig?.appsScriptWebhookUrl,
        };
        saveLinkedSheetConfig(fullCfg);
        setLinkedConfig(fullCfg);
        onConfigUpdated?.(fullCfg);
        setStatusMsg(
          `Created Google Sheet "${fullCfg.spreadsheetTitle}" and initialized column headers.`
        );
        await handleRefreshPreview(fullCfg);
      } else if (pendingMutation.type === 'sync') {
        const { registrations: rowsToSync, spreadsheetId, spreadsheetTitle, sheetTabTitle } =
          pendingMutation;
        const addedCount = await appendRegistrationsToSheet(
          token,
          spreadsheetId,
          sheetTabTitle,
          rowsToSync
        );
        const updatedRegs = markRegistrationsSynced(rowsToSync.map((r) => r.ticketId));
        setRegistrations(updatedRegs);
        setStatusMsg(
          `Successfully appended ${addedCount} webinar registration(s) to "${spreadsheetTitle}" (${sheetTabTitle}).`
        );
        await handleRefreshPreview();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Sheets update failed.';
      setErrorMsg(msg);
    } finally {
      setIsMutating(false);
      setPendingMutation(null);
    }
  };

  const handleSaveWebhook = () => {
    const trimmed = webhookInput.trim();
    if (trimmed && !trimmed.startsWith('https://script.google.com/')) {
      setErrorMsg(
        'Please paste a valid Google Apps Script Web App URL starting with https://script.google.com/...'
      );
      return;
    }
    setErrorMsg(null);
    const baseCfg: LinkedSheetConfig = linkedConfig || {
      spreadsheetId: '',
      spreadsheetTitle: 'How to Get Jobs — Webinar Sheet (Apps Script)',
      sheetTabTitle: 'Registrations',
      organizerEmail: preferredEmail.trim() || DEFAULT_SHEET_ACCOUNT_EMAIL,
    };
    const updated: LinkedSheetConfig = {
      ...baseCfg,
      organizerEmail: preferredEmail.trim() || DEFAULT_SHEET_ACCOUNT_EMAIL,
      appsScriptWebhookUrl: trimmed || undefined,
    };
    saveLinkedSheetConfig(updated);
    setLinkedConfig(updated);
    onConfigUpdated?.(updated);
    setStatusMsg(
      trimmed
        ? 'Google Apps Script webhook connected! Every free webinar registration will automatically append to your Google Sheet.'
        : 'Apps Script webhook cleared.'
    );
  };

  const handleTestWebhook = async () => {
    const targetUrl = webhookInput.trim() || linkedConfig?.appsScriptWebhookUrl;
    if (!targetUrl) {
      setErrorMsg('Paste your Apps Script Web App URL first, then click Test.');
      return;
    }
    setIsTestingWebhook(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await fetch(targetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          submittedAt: new Date().toISOString(),
          ticketId: 'HGJ-TEST',
          fullName: 'Test Registration Check',
          email: preferredEmail.trim() || DEFAULT_SHEET_ACCOUNT_EMAIL,
          phone: 'N/A',
          status: 'Connection Test',
          webinarDate: '30 Nov, 2026',
        }),
      });
      setStatusMsg(
        'Test row sent! Check your Google Sheet in howtogetjobsofficial@gmail.com to confirm "HGJ-TEST" appeared.'
      );
    } catch {
      setErrorMsg('Could not reach the Apps Script URL. Verify it is deployed with "Anyone" access.');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleUnlinkSheet = () => {
    saveLinkedSheetConfig(null);
    setLinkedConfig(null);
    setPreviewRows([]);
    setWebhookInput('');
    onConfigUpdated?.(null);
    setStatusMsg('Spreadsheet link cleared from this browser.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Top Modal Header */}
        <div className="bg-[#004D4E] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006C6D] border border-[#D3EDE9]/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-[#F1B01C]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">
                Link Free Webinar Form to Google Sheets
              </h3>
              <p className="text-xs text-[#D3EDE9]">
                Sync attendee registrations directly into your Google Spreadsheet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#D3EDE9] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Google Sheets panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Status / Error Notifications */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {statusMsg && (
            <div className="p-3.5 rounded-2xl bg-[#D3EDE9]/50 border border-[#006C6D]/30 text-xs text-[#004D4E] font-medium flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#006C6D] shrink-0 mt-0.5" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Explicit Confirmation Overlay for Any Google Sheet Mutation */}
          {pendingMutation && (
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-[#F1B01C] space-y-3 shadow-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#004D4E] shrink-0 mt-0.5" />
                <div className="space-y-1.5 text-xs text-slate-800">
                  <div className="font-black text-sm text-slate-950">
                    Confirm Google Sheets Update
                  </div>
                  {pendingMutation.type === 'create' ? (
                    <p>
                      Create a new Google Sheet named{' '}
                      <strong>“{pendingMutation.spreadsheetTitle}”</strong> in your Google account
                      with header columns (Submitted At, Pass ID, Full Name, Email, Phone, Profile,
                      Webinar Date)?
                    </p>
                  ) : (
                    <>
                      <p>
                        Append <strong>{pendingMutation.registrations.length}</strong> registration
                        row(s) to <strong>“{pendingMutation.spreadsheetTitle}”</strong> (Tab:{' '}
                        <strong>{pendingMutation.sheetTabTitle}</strong>)?
                      </p>
                      <ul className="bg-white/80 rounded-xl p-2.5 border border-amber-200 space-y-1 max-h-28 overflow-y-auto">
                        {pendingMutation.registrations.map((reg) => (
                          <li key={reg.ticketId} className="text-[11px] text-slate-700">
                            • <strong>{reg.fullName}</strong> ({reg.email}) — {reg.ticketId}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={isMutating}
                  onClick={() => setPendingMutation(null)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isMutating}
                  onClick={executePendingMutation}
                  className="px-5 py-2 rounded-full text-xs font-black bg-[#006C6D] hover:bg-[#004D4E] text-white shadow-sm cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isMutating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Google Sheet...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F1B01C]" />
                      <span>Confirm & Update Google Sheet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Google Sign-In Status */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase font-extrabold tracking-wider text-[#006C6D]">
                  Step 1 • Google Account Authorization
                </div>
                {needsAuth ? (
                  <p className="text-xs text-slate-600 mt-0.5">
                    Sign in with Google using <strong>{preferredEmail || DEFAULT_SHEET_ACCOUNT_EMAIL}</strong> to link your spreadsheet.
                  </p>
                ) : (
                  <p className="text-xs text-slate-800 mt-0.5 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#006C6D]" />
                    <span>
                      Signed in as <strong>{user?.email || user?.displayName}</strong>
                    </span>
                  </p>
                )}
              </div>

              {needsAuth ? (
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  disabled={isLoggingIn}
                  className="gsi-material-button shrink-0"
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        style={{ display: 'block' }}
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
                    </span>
                  </div>
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin(preferredEmail)}
                    disabled={isLoggingIn}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold bg-[#D3EDE9] hover:bg-[#c0e2dc] text-[#004D4E] cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoggingIn ? 'animate-spin' : ''}`} />
                    <span>Switch Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Preferred Target Google Email Input */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-2.5">
              <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                Target Google Sheet Email:
              </label>
              <input
                type="email"
                value={preferredEmail}
                onChange={(e) => setPreferredEmail(e.target.value)}
                placeholder="howtogetjobsofficial@gmail.com"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006C6D]"
              />
              {!needsAuth &&
                user?.email &&
                preferredEmail.trim() &&
                user.email.toLowerCase() !== preferredEmail.trim().toLowerCase() && (
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin(preferredEmail)}
                    className="px-3.5 py-1.5 rounded-full text-[11px] font-black bg-[#F1B01C] hover:bg-[#df9f12] text-slate-950 cursor-pointer shrink-0"
                  >
                    Switch to {preferredEmail.trim()}
                  </button>
                )}
            </div>

            {/* Error 403 / OAuth Testing Mode Recovery Guide */}
            <div className="text-[11px] text-slate-700 bg-amber-50 rounded-xl p-3.5 border border-[#F1B01C]/60 space-y-2 leading-relaxed">
              <div className="font-extrabold text-slate-950">
                Seeing “Error 403: access_denied” for {DEFAULT_SHEET_ACCOUNT_EMAIL}?
              </div>
              <p>
                Google blocks unverified apps in Testing mode for accounts not listed as Test Users.
                Use any of these <strong>3 quick fixes</strong>:
              </p>
              <ul className="space-y-1 pl-3">
                <li>
                  <strong>1. Add Test User (10 sec):</strong> Open Google Cloud Audience settings as{' '}
                  <code>shamakiwilliams11@gmail.com</code>, add{' '}
                  <strong>{DEFAULT_SHEET_ACCOUNT_EMAIL}</strong> under <em>Test users</em>, then click Sign in again.
                </li>
                <li>
                  <strong>2. Share the Sheet (Fastest OAuth):</strong> Share your sheet in{' '}
                  <strong>{DEFAULT_SHEET_ACCOUNT_EMAIL}</strong> with <code>shamakiwilliams11@gmail.com</code> (Editor), then sign in below as <code>shamakiwilliams11@gmail.com</code>.
                </li>
                <li>
                  <strong>3. Direct Apps Script Link (Zero OAuth Needed):</strong> Paste the Apps Script Web App URL from{' '}
                  <strong>{DEFAULT_SHEET_ACCOUNT_EMAIL}</strong>’s Google Sheet right below.
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="https://console.cloud.google.com/auth/audience?project=gen-lang-client-0088803615"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black bg-[#006C6D] hover:bg-[#004D4E] text-white"
                >
                  <span>Open Test Users in Google Cloud</span>
                  <ExternalLink className="w-3 h-3 text-[#F1B01C]" />
                </a>
                {needsAuth && (
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin('shamakiwilliams11@gmail.com')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 cursor-pointer"
                  >
                    <span>Sign in as shamakiwilliams11@gmail.com</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Connected Spreadsheet or Setup Options */}
          {linkedConfig && linkedConfig.spreadsheetId ? (
            <div className="p-5 rounded-2xl bg-[#D3EDE9]/30 border-2 border-[#006C6D] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase font-extrabold tracking-wider text-[#006C6D]">
                    Linked Google Sheet
                  </div>
                  <h4 className="text-base font-black text-slate-950 mt-0.5">
                    {linkedConfig.spreadsheetTitle}
                  </h4>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Target Tab: <strong>{linkedConfig.sheetTabTitle}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${linkedConfig.spreadsheetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold bg-[#006C6D] hover:bg-[#004D4E] text-white transition-colors"
                  >
                    <span>Open Sheet</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#F1B01C]" />
                  </a>
                  <button
                    type="button"
                    onClick={handleUnlinkSheet}
                    className="px-3.5 py-2 rounded-full text-xs font-bold bg-white border border-slate-300 text-slate-600 hover:text-red-600 hover:border-red-300 cursor-pointer"
                  >
                    Change Sheet
                  </button>
                </div>
              </div>

              {/* Sync Queue Box */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-slate-900">
                    Local Webinar Registrations: {registrations.length} total
                  </div>
                  <div className="text-slate-600">
                    {pendingRegistrations.length > 0 ? (
                      <span className="text-[#DC2626] font-bold">
                        {pendingRegistrations.length} pending row(s) waiting to sync to Google Sheets
                      </span>
                    ) : (
                      <span className="text-[#006C6D] font-bold">
                        All local registrations are synced.
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!needsAuth && (
                    <button
                      type="button"
                      onClick={() => handleRefreshPreview()}
                      disabled={isLoadingPreview}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isLoadingPreview ? 'animate-spin' : ''}`}
                      />
                      <span>Read Sheet</span>
                    </button>
                  )}

                  {!needsAuth && pendingRegistrations.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingMutation({
                          type: 'sync',
                          registrations: pendingRegistrations,
                          spreadsheetId: linkedConfig.spreadsheetId,
                          spreadsheetTitle: linkedConfig.spreadsheetTitle,
                          sheetTabTitle: linkedConfig.sheetTabTitle,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-[#F1B01C] hover:bg-[#df9f12] text-slate-950 shadow-xs cursor-pointer"
                    >
                      <span>Sync {pendingRegistrations.length} Row(s)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview Table from Connected Google Sheet */}
              {previewRows.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#004D4E]">
                    Live Google Sheet Rows ({previewRows.length - 1} entries)
                  </div>
                  <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 max-h-48">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 sticky top-0">
                        <tr>
                          {(previewRows[0] || []).map((cell, idx) => (
                            <th key={idx} className="px-3 py-2 font-bold whitespace-nowrap">
                              {cell}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewRows.slice(1).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className="px-3 py-2 text-slate-700 whitespace-nowrap"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            !needsAuth && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option A: Create New Google Sheet */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-[#D3EDE9] text-[#006C6D] flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-slate-950">
                      Create New Webinar Sheet
                    </h4>
                    <p className="text-xs text-slate-600">
                      Automatically creates a formatted spreadsheet with registration columns in your
                      Google Drive.
                    </p>
                    <input
                      type="text"
                      value={newSheetTitle}
                      onChange={(e) => setNewSheetTitle(e.target.value)}
                      placeholder="Spreadsheet title"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006C6D]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingMutation({
                        type: 'create',
                        spreadsheetTitle:
                          newSheetTitle.trim() ||
                          'How to Get Jobs — Free Webinar Registrations (30 Nov 2026)',
                      })
                    }
                    className="w-full py-2.5 px-4 rounded-full text-xs font-black bg-[#006C6D] hover:bg-[#004D4E] text-white cursor-pointer transition-colors"
                  >
                    Create Google Sheet
                  </button>
                </div>

                {/* Option B: Link Existing Google Sheet */}
                <form
                  onSubmit={handleFetchExistingSheet}
                  className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-[#F1B01C]/20 text-slate-950 flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-[#006C6D]" />
                    </div>
                    <h4 className="text-sm font-black text-slate-950">
                      Connect Existing Google Sheet
                    </h4>
                    <p className="text-xs text-slate-600">
                      Paste your Google Spreadsheet link or ID to inspect its tabs and link the
                      form.
                    </p>
                    <input
                      type="text"
                      value={sheetUrlInput}
                      onChange={(e) => setSheetUrlInput(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006C6D]"
                    />
                  </div>

                  {fetchedMeta ? (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-[#006C6D] truncate">
                        Found: {fetchedMeta.title}
                      </div>
                      <select
                        value={selectedTab}
                        onChange={(e) => setSelectedTab(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      >
                        {fetchedMeta.sheets.map((s) => (
                          <option key={s.sheetId} value={s.title}>
                            Tab: {s.title}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleConfirmLinkExistingSheet}
                        className="w-full py-2.5 px-4 rounded-full text-xs font-black bg-[#F1B01C] hover:bg-[#df9f12] text-slate-950 cursor-pointer"
                      >
                        Link Selected Tab
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isFetchingMeta || !sheetUrlInput.trim()}
                      className="w-full py-2.5 px-4 rounded-full text-xs font-black bg-slate-900 hover:bg-slate-800 text-white cursor-pointer disabled:opacity-50"
                    >
                      {isFetchingMeta ? 'Loading Tabs...' : 'Find Spreadsheet Tabs'}
                    </button>
                  )}
                </form>
              </div>
            )
          )}

          {/* Direct Google Sheet Apps Script Link (Works for howtogetjobsofficial@gmail.com without OAuth verification) */}
          <div className="border-2 border-[#006C6D]/30 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowWebhookHelp(!showWebhookHelp)}
              className="w-full px-5 py-3.5 bg-[#D3EDE9]/40 hover:bg-[#D3EDE9]/60 flex items-center justify-between text-xs font-extrabold text-[#004D4E] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>Direct Link via Google Apps Script (Works Instantly for {DEFAULT_SHEET_ACCOUNT_EMAIL})</span>
                {linkedConfig?.appsScriptWebhookUrl && (
                  <span className="text-[10px] bg-[#006C6D] text-white px-2 py-0.5 rounded-full font-black uppercase">
                    Active
                  </span>
                )}
              </span>
              {showWebhookHelp ? (
                <ChevronUp className="w-4 h-4 text-[#004D4E]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#004D4E]" />
              )}
            </button>

            {showWebhookHelp && (
              <div className="p-5 bg-white border-t border-slate-200 space-y-3 text-xs text-slate-600">
                <p className="text-slate-700 leading-relaxed">
                  To connect your Google Sheet in <strong>{DEFAULT_SHEET_ACCOUNT_EMAIL}</strong> immediately
                  without needing Google app verification or Test User approval:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-700">
                  <li>
                    Sign into Google Sheets with <strong>{DEFAULT_SHEET_ACCOUNT_EMAIL}</strong> and open your Webinar sheet.
                  </li>
                  <li>
                    Click <strong>Extensions → Apps Script</strong>, paste the script below, and click <strong>Save</strong>.
                  </li>
                  <li>
                    Click <strong>Deploy → New deployment → Web app</strong>, set <em>Execute as</em> to <strong>Me ({DEFAULT_SHEET_ACCOUNT_EMAIL})</strong> and <em>Who has access</em> to <strong>Anyone</strong>.
                  </li>
                  <li>
                    Copy the Web App URL (ending in <code>/exec</code>), paste it below, and click <strong>Save URL</strong>.
                  </li>
                </ol>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-[#F1B01C]/50 text-[11px] text-slate-700 leading-relaxed">
                  <strong>Tip if Apps Script says “Sorry, unable to open the file at present”:</strong>{' '}
                  Google Apps Script breaks when multiple Google accounts are signed into the same browser (<code>authuser=7</code>). Open a new <strong>Incognito window</strong> (<code>Ctrl+Shift+N</code>), sign in <strong>only</strong> with <strong>{DEFAULT_SHEET_ACCOUNT_EMAIL}</strong>, open your sheet there, and click <strong>Extensions → Apps Script</strong>.
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={webhookInput}
                    onChange={(e) => setWebhookInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006C6D]"
                  />
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleSaveWebhook}
                      className="px-4 py-2 rounded-full font-black text-xs bg-[#006C6D] hover:bg-[#004D4E] text-white cursor-pointer"
                    >
                      Save URL
                    </button>
                    <button
                      type="button"
                      disabled={isTestingWebhook || !webhookInput.trim()}
                      onClick={handleTestWebhook}
                      className="px-4 py-2 rounded-full font-black text-xs bg-[#F1B01C] hover:bg-[#df9f12] text-slate-950 cursor-pointer disabled:opacity-50"
                    >
                      {isTestingWebhook ? 'Sending...' : 'Test Row'}
                    </button>
                  </div>
                </div>

                <div className="relative bg-slate-950 text-slate-100 p-3 rounded-xl font-mono text-[10px] overflow-x-auto">
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-sans font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3 h-3 text-[#F1B01C]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                  <pre className="pr-16">{APPS_SCRIPT_TEMPLATE}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Logo variant="teal" className="h-6 scale-75 origin-left" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full font-bold text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
