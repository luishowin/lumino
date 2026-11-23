import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SNOOZE_DAYS, benefits, detectEnvironment, finish, guideMarkup, isDue, parseRecord, serialize, snooze,
} from '../lumino-app/install-guide.mjs';

const DAY = 86_400_000;
const UA = {
  iosSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  iosChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.6723.90 Mobile/15E148 Safari/604.1',
  iosWebView: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  iosInstagram: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0 Safari/604.1',
  ipadDesktopClass: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  macSafari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  macChrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  androidChrome: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
  androidWebView: 'Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  winEdge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
  winChrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  winFirefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
};

test('every iOS browser can use the Home Screen steps; embedded browsers cannot', () => {
  assert.equal(detectEnvironment(UA.iosSafari).kind, 'ios');
  assert.equal(detectEnvironment(UA.iosChrome).kind, 'ios');
  assert.equal(detectEnvironment(UA.iosWebView).kind, 'webview');
  assert.equal(detectEnvironment(UA.iosInstagram).kind, 'webview');
  assert.equal(detectEnvironment(UA.androidWebView).kind, 'webview');
});

test('iPads that report as a Mac are treated as iOS, real Macs are not', () => {
  assert.equal(detectEnvironment(UA.ipadDesktopClass, 5).kind, 'ios');
  assert.equal(detectEnvironment(UA.macSafari, 0).kind, 'mac-safari');
  assert.equal(detectEnvironment(UA.macChrome, 0).kind, 'desktop');
});

test('Android and desktop browsers are told apart', () => {
  assert.equal(detectEnvironment(UA.androidChrome).kind, 'android');
  assert.deepEqual(
    [UA.winEdge, UA.winChrome, UA.winFirefox].map(agent => detectEnvironment(agent).browser),
    ['edge', 'chrome', 'other'],
  );
  assert.equal(detectEnvironment(UA.winChrome).mobile, false);
  assert.equal(detectEnvironment(UA.androidChrome).mobile, true);
});

test('a new learner is due, and Not now waits 14 days, then 30, then stops', () => {
  const t0 = Date.UTC(2026, 10, 23);
  let record = parseRecord(null, t0);
  assert.equal(isDue(record, t0), true);

  record = snooze(record, t0);
  assert.equal(isDue(record, t0 + 13 * DAY), false);
  assert.equal(isDue(record, t0 + SNOOZE_DAYS[0] * DAY), true);

  const t1 = t0 + 15 * DAY;
  record = snooze(record, t1);
  assert.equal(isDue(record, t1 + 29 * DAY), false);
  assert.equal(isDue(record, t1 + SNOOZE_DAYS[1] * DAY), true);

  const t2 = t1 + 31 * DAY;
  record = snooze(record, t2);
  assert.equal(isDue(record, t2 + 365 * DAY), false);
});

test('installing or choosing never to be asked again is permanent', () => {
  const now = Date.UTC(2026, 10, 23);
  const record = finish(parseRecord(null, now), now);
  assert.equal(isDue(record, now + 1000 * DAY), false);
});

test('the old permanent flag counts as one Not now', () => {
  const now = Date.UTC(2026, 10, 23);
  const record = parseRecord('1', now);
  assert.deepEqual(record, { n: 1, at: now, done: false });
  assert.equal(isDue(record, now + DAY), false);
  assert.equal(isDue(record, now + 14 * DAY), true);
});

test('records survive storage and bad data falls back to a fresh start', () => {
  const now = Date.UTC(2026, 10, 23);
  const saved = snooze(parseRecord(null, now), now);
  assert.deepEqual(parseRecord(serialize(saved), now + DAY), saved);
  for (const junk of [null, '', 'nope', '[]', '{"n":"x","at":"y"}']) {
    assert.deepEqual(parseRecord(junk, now), { n: 0, at: 0, done: false });
  }
  // A clock set in the past never locks the offer away for years.
  assert.equal(parseRecord(JSON.stringify({ n: 1, at: now + 400 * DAY }), now).at, now);
});

test('guidance matches the platform and says Home Screen only on phones', () => {
  const ios = guideMarkup(detectEnvironment(UA.iosSafari));
  assert.match(ios, /Add to Home Screen/);
  assert.match(ios, /Open as Web App/);
  assert.equal((ios.match(/<li>/g) || []).length, 3);
  assert.match(ios, /fresh profile/);

  assert.match(guideMarkup(detectEnvironment(UA.macSafari)), /Add to Dock/);
  assert.match(guideMarkup(detectEnvironment(UA.winEdge)), /Install this site as an app/);
  assert.match(guideMarkup(detectEnvironment(UA.androidChrome)), /Install app/);

  assert.match(benefits(detectEnvironment(UA.iosSafari)), /Home Screen/);
  assert.match(benefits(detectEnvironment(UA.winChrome)), /desktop/);
});

test('the in-app browser notice names the right browser and carries an escaped link', () => {
  const ios = guideMarkup(detectEnvironment(UA.iosWebView), 'https://example.test/lumino-app/?a=1&b="2"');
  assert.match(ios, /Open in Safari/);
  assert.match(ios, /value="https:\/\/example\.test\/lumino-app\/\?a=1&amp;b=&quot;2&quot;"/);
  assert.match(guideMarkup(detectEnvironment(UA.androidWebView), 'x'), /Open in Chrome/);
});
