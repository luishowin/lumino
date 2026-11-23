// Install guidance for Lumino: which browser we are in, when to ask again, and the steps to show.
// Pure on purpose (no DOM access at import) so the rules can run under `node --test`.

export const SHORTCUT_KEY = 'lumino.shortcut.dismissed';

const DAY = 86_400_000;
// Wait this long after the 1st and 2nd "Not now". A 3rd one stops the offer for good.
export const SNOOZE_DAYS = [14, 30];

// Apps that open links in their own embedded browser, which cannot add anything to a Home Screen.
const IN_APP = /FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|TikTok|musical_ly|Bytedance|LinkedInApp|Pinterest|Twitter|MicroMessenger|WhatsApp|GSA\//;

/**
 * kind: 'ios' | 'webview' | 'mac-safari' | 'android' | 'desktop'
 * Every real iOS browser (Safari, Chrome, Edge, Firefox) carries a "Safari/" token in its
 * user agent. A bare WKWebView, which is what in-app browsers are built on, does not.
 */
export function detectEnvironment(agent = '', touchPoints = 0) {
  const mac = /Macintosh/.test(agent);
  const ios = /iPad|iPhone|iPod/.test(agent) || (mac && touchPoints > 1);
  const android = /Android/.test(agent);
  const embedded = (ios && (!/Safari\//.test(agent) || IN_APP.test(agent)))
    || (android && (/; wv\)/.test(agent) || IN_APP.test(agent)));
  let kind = 'desktop';
  if (embedded) kind = 'webview';
  else if (ios) kind = 'ios';
  else if (mac && /Version\/[\d.]+.*Safari\//.test(agent)) kind = 'mac-safari';
  else if (android) kind = 'android';
  const browser = /Edg\//.test(agent) ? 'edge'
    : /Chrome\//.test(agent) && !/OPR\/|Vivaldi\//.test(agent) ? 'chrome' : 'other';
  return { kind, browser, ios, mobile: ios || android };
}

// --- When to ask ---------------------------------------------------------------------------

export function parseRecord(raw, now = Date.now()) {
  // The first version stored '1' and never asked again, although the button said "Not now".
  // Treat it as one snooze so those learners hear from us once more, later.
  if (raw === '1') return { n: 1, at: now, done: false };
  try {
    const value = JSON.parse(raw);
    if (value && typeof value === 'object') {
      return {
        n: Math.max(0, Math.trunc(Number(value.n)) || 0),
        at: Math.min(Number(value.at) || 0, now),
        done: value.done === true,
      };
    }
  } catch {}
  return { n: 0, at: 0, done: false };
}

export function isDue({ n = 0, at = 0, done = false } = {}, now = Date.now()) {
  if (done || n > SNOOZE_DAYS.length) return false;
  if (n === 0) return true;
  return now - at >= SNOOZE_DAYS[n - 1] * DAY;
}

export const snooze = (record, now = Date.now()) => ({ n: record.n + 1, at: now, done: false });
export const finish = (record, now = Date.now()) => ({ ...record, at: now, done: true });
export const serialize = record => JSON.stringify(record);

// --- What to show --------------------------------------------------------------------------

const SHARE = '<svg class="ios-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 15V3M8 7l4-4 4 4M6 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1"/></svg>';
const PLUS = '<svg class="ios-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';

const FRESH_PROFILE = '<p class="install-note">Heads up: the app keeps its own progress, so it starts with a fresh profile. Anything you have done in this browser stays here.</p>';

function iosSteps() {
  return `<ol class="install-steps">
    <li><p>Tap <b>Share</b>. If you can’t see it, tap <b>•••</b> first.</p>
      <div class="ios-demo ios-demo--key" aria-hidden="true"><span class="ios-key is-target">${SHARE}</span></div></li>
    <li><p>Choose <b>Add to Home Screen</b>. Tap <b>View More</b> if it isn’t listed.</p>
      <div class="ios-demo" aria-hidden="true"><span class="ios-row ios-item is-target">${PLUS}<span>Add to Home Screen</span></span></div></li>
    <li><p>Keep <b>Open as Web App</b> switched on, then tap <b>Add</b>.</p>
      <div class="ios-demo" aria-hidden="true"><span class="ios-row"><span>Open as Web App</span><i class="ios-toggle"></i></span><span class="ios-add is-target">Add</span></div></li>
  </ol>${FRESH_PROFILE}`;
}

const attr = text => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function webviewNote(env, href) {
  const browser = env.ios ? 'Safari' : 'Chrome';
  return `<p>This page is open inside another app’s browser, which can’t add Lumino to your Home Screen.
    Open the app’s menu, choose <b>Open in ${browser}</b>, then add it from there.</p>
    <p class="install-link"><input class="install-url" readonly value="${attr(href)}" aria-label="Lumino link" data-install-url>
    <button class="textbtn" type="button" data-install-copy>Copy link</button></p>
    <p class="install-note">Progress in this in-app browser doesn’t carry over, so it’s best to switch before you go further.</p>`;
}

export function guideMarkup(env, href = '') {
  switch (env.kind) {
    case 'ios': return iosSteps();
    case 'webview': return webviewNote(env, href);
    case 'mac-safari':
      return `<p>In Safari on macOS Sonoma or later, choose <b>File → Add to Dock</b>, then click Add.</p>${FRESH_PROFILE}`;
    case 'android':
      return '<p>Open your browser menu and choose <b>Install app</b> or <b>Add to Home screen</b>.</p>';
    default:
      if (env.browser === 'edge') {
        return '<p>In Edge, open the menu and choose <b>More tools → Apps → Install this site as an app</b>. In your list of installed apps, open Lumino’s details to create a desktop shortcut.</p>';
      }
      if (env.browser === 'chrome') {
        return '<p>In Chrome, open the menu and choose <b>Cast, save and share → Install page as app</b> or <b>Create shortcut</b> to save Lumino to your desktop.</p>';
      }
      return '<p>Drag the site icon next to the browser address to your desktop. Reopen it in the same browser profile to keep your progress.</p>';
  }
}

export function benefits(env) {
  return `Opens full screen from your ${env.mobile ? 'Home Screen' : 'desktop'} in one tap, and keeps working offline.`;
}
