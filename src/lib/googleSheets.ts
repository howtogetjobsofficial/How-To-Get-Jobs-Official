import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory only access token cache (never stored in localStorage/sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;

export interface WebinarRegistration {
  ticketId: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  submittedAt: string;
  webinarDate: string;
  syncedToSheet: boolean;
}

export const DEFAULT_SHEET_ACCOUNT_EMAIL = 'howtogetjobsofficial@gmail.com';

export interface LinkedSheetConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  sheetTabTitle: string;
  organizerEmail?: string;
  appsScriptWebhookUrl?: string;
}

export interface SheetMetadata {
  spreadsheetId: string;
  title: string;
  sheets: Array<{
    sheetId: number;
    title: string;
  }>;
}

const REGISTRATIONS_STORAGE_KEY = 'htgj_webinar_registrations_v1';
const SHEET_CONFIG_STORAGE_KEY = 'htgj_linked_sheet_config_v1';

export const WEBINAR_HEADERS = [
  'Submitted At',
  'Pass ID',
  'Full Name',
  'Email Address',
  'Phone / WhatsApp',
  'Current Profile',
  'Webinar Date',
];

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (
  loginHint: string = DEFAULT_SHEET_ACCOUNT_EMAIL
): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const customParams: Record<string, string> = {
      prompt: 'select_account',
    };
    if (loginHint.trim()) {
      customParams.login_hint = loginHint.trim();
    }
    provider.setCustomParameters(customParams);

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not obtain Google Sheets permission token. Please try again.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const clearAccessToken = () => {
  cachedAccessToken = null;
};

export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Local storage for registrations & non-secret spreadsheet configuration
export const loadRegistrations = (): WebinarRegistration[] => {
  try {
    const raw = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveRegistrationLocally = (reg: WebinarRegistration): WebinarRegistration[] => {
  const existing = loadRegistrations();
  const updated = [reg, ...existing];
  try {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage quota errors
  }
  return updated;
};

export const markRegistrationsSynced = (ticketIds: string[]): WebinarRegistration[] => {
  const idSet = new Set(ticketIds);
  const updated = loadRegistrations().map((reg) =>
    idSet.has(reg.ticketId) ? { ...reg, syncedToSheet: true } : reg
  );
  try {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
};

export const loadLinkedSheetConfig = (): LinkedSheetConfig | null => {
  try {
    const raw = localStorage.getItem(SHEET_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LinkedSheetConfig;
  } catch {
    return null;
  }
};

export const saveLinkedSheetConfig = (config: LinkedSheetConfig | null) => {
  try {
    if (!config) {
      localStorage.removeItem(SHEET_CONFIG_STORAGE_KEY);
    } else {
      localStorage.setItem(SHEET_CONFIG_STORAGE_KEY, JSON.stringify(config));
    }
  } catch {
    // ignore
  }
};

export const extractSpreadsheetId = (input: string): string => {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
};

const handleSheetsResponse = async (res: Response) => {
  if (res.status === 401) {
    cachedAccessToken = null;
    throw new Error('Your Google session expired. Please sign in with Google again.');
  }
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || `Google Sheets API error (${res.status})`;
    throw new Error(message);
  }
  return data;
};

export const getSpreadsheetMetadata = async (
  accessToken: string,
  spreadsheetId: string
): Promise<SheetMetadata> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}?fields=spreadsheetId,properties.title,sheets(properties(sheetId,title))`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await handleSheetsResponse(res);

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Untitled Spreadsheet',
    sheets: (data.sheets || []).map((s: { properties?: { sheetId?: number; title?: string } }) => ({
      sheetId: s.properties?.sheetId ?? 0,
      title: s.properties?.title || 'Sheet1',
    })),
  };
};

export const createWebinarSpreadsheet = async (
  accessToken: string,
  title = 'How to Get Jobs — Free Webinar Registrations (30 Nov 2026)'
): Promise<LinkedSheetConfig> => {
  const tabTitle = 'Registrations';
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        {
          properties: {
            title: tabTitle,
            gridProperties: { frozenRowCount: 1 },
          },
        },
      ],
    }),
  });

  const created = await handleSheetsResponse(createRes);
  const spreadsheetId = created.spreadsheetId as string;

  // Populate column headers in the newly created sheet
  await writeHeaderRow(accessToken, spreadsheetId, tabTitle);

  return {
    spreadsheetId,
    spreadsheetTitle: created.properties?.title || title,
    sheetTabTitle: tabTitle,
  };
};

export const writeHeaderRow = async (
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string
) => {
  const range = `${formatSheetNameForRange(sheetTitle)}!A1:G1`;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values: [WEBINAR_HEADERS],
      }),
    }
  );
  await handleSheetsResponse(res);
};

export const ensureHeaderRowIfEmpty = async (
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string
) => {
  const range = `${formatSheetNameForRange(sheetTitle)}!A1:G1`;
  const checkRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(range)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await handleSheetsResponse(checkRes);
  if (!data.values || data.values.length === 0) {
    await writeHeaderRow(accessToken, spreadsheetId, sheetTitle);
  }
};

export const appendRegistrationsToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
  registrations: WebinarRegistration[]
): Promise<number> => {
  if (registrations.length === 0) return 0;

  await ensureHeaderRowIfEmpty(accessToken, spreadsheetId, sheetTitle);

  const values = registrations.map((reg) => [
    new Date(reg.submittedAt).toLocaleString(),
    reg.ticketId,
    reg.fullName,
    reg.email,
    reg.phone || 'Not provided',
    reg.status,
    reg.webinarDate,
  ]);

  const range = `${formatSheetNameForRange(sheetTitle)}!A:G`;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        majorDimension: 'ROWS',
        values,
      }),
    }
  );

  const data = await handleSheetsResponse(res);
  return data?.updates?.updatedRows ?? registrations.length;
};

export const fetchSheetRows = async (
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string
): Promise<string[][]> => {
  const range = `${formatSheetNameForRange(sheetTitle)}!A1:G50`;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(range)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await handleSheetsResponse(res);
  return data.values || [];
};

function formatSheetNameForRange(sheetTitle: string): string {
  const escaped = sheetTitle.replace(/'/g, "''");
  return `'${escaped}'`;
}

export const APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Submitted At", "Pass ID", "Full Name", "Email Address", "Phone / WhatsApp", "Current Profile", "Webinar Date"]);
  }
  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.ticketId || "",
    data.fullName || "",
    data.email || "",
    data.phone || "",
    data.status || "",
    data.webinarDate || "30 Nov, 2026"
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}`;
