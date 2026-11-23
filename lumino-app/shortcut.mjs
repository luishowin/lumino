import { SHORTCUT_KEY, benefits, detectEnvironment, finish, guideMarkup, isDue, parseRecord, serialize, snooze } from './install-guide.mjs?v=1';

const SUGGEST_DELAY = 2500;

export function setupShortcut(stage, storage) {
  const standalone = matchMedia('(display-mode: standalone)');
  const inApp = () => standalone.matches || navigator.standalone === true;
  const env = detectEnvironment(navigator.userAgent, navigator.maxTouchPoints);
  const here = location.href.split('#')[0];
  const guidance = guideMarkup(env, here);
  // iOS and in-app browsers keep a separate copy of the learner's progress, so ask early there.
  const askEarly = env.kind === 'ios' || env.kind === 'webview';

  let record = parseRecord(read());
  let pendingPrompt;
  let prompting = false;
  let sheet;
  let decided = false;
  let timer = 0;
  let suggested = false;
  if (read() === '1') write(record);

  function read() {
    try { return storage?.getItem(SHORTCUT_KEY) ?? null; } catch { return null; }
  }
  function write(next) {
    record = next;
    try { storage?.setItem(SHORTCUT_KEY, serialize(next)); } catch {}
  }
  const due = () => isDue(record) && !inApp();

  function refresh() {
    stage.querySelector('.shortcut-help')?.toggleAttribute('hidden', inApp());
    const offer = stage.querySelector('.shortcut-offer');
    if (!offer) return;
    const hide = !due();
    if (hide && offer.contains(document.activeElement)) {
      offer.previousElementSibling?.querySelector('button')?.focus({ preventScroll: true });
    }
    offer.hidden = hide;
    const button = offer.querySelector('[data-shortcut-add]');
    const panel = offer.querySelector('.shortcut-guidance');
    button.setAttribute('aria-disabled', String(prompting));
    if (pendingPrompt && panel.hidden) button.removeAttribute('aria-expanded');
    else button.setAttribute('aria-expanded', String(!panel.hidden));
  }

  function later() {
    write(snooze(record));
    refresh();
  }
  function never() {
    write(finish(record));
    refresh();
  }

  // One tap: the browser shows its own confirmation, and Lumino lands on the desktop or Home Screen.
  async function installNow() {
    if (!pendingPrompt || prompting) return false;
    const install = pendingPrompt;
    pendingPrompt = undefined;
    prompting = true;
    refresh();
    try {
      const choice = (await install.prompt()) ?? (await install.userChoice);
      if (choice?.outcome === 'accepted') never();
      else later();
      return true;
    } catch {
      return false;
    } finally {
      prompting = false;
      refresh();
    }
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    if (env.kind === 'ios' || env.kind === 'mac-safari') return;
    pendingPrompt = event;
    paintSheet();
    refresh();
  });
  window.addEventListener('appinstalled', () => {
    pendingPrompt = undefined;
    decided = true;
    sheet?.close();
    never();
  });
  if (standalone.addEventListener) standalone.addEventListener('change', refresh);
  else standalone.addListener?.(refresh);

  // --- Card at the end of the roadmap, and the Profile help: always there, never in the way ----

  stage.addEventListener('click', async event => {
    const offer = event.target.closest('.shortcut-offer');
    if (event.target.closest('[data-install-copy]')) {
      copyLink(event.target.closest('[data-install-copy]'));
      return;
    }
    if (!offer || offer.hidden) return;
    if (event.target.closest('[data-shortcut-dismiss]')) {
      later();
      return;
    }
    if (!event.target.closest('[data-shortcut-add]') || prompting) return;

    const panel = offer.querySelector('.shortcut-guidance');
    if (!pendingPrompt || !panel.hidden) {
      panel.hidden = !panel.hidden;
      refresh();
      return;
    }
    if (!(await installNow())) {
      panel.hidden = false;
      refresh();
    }
  });

  // --- Proactive sheet -------------------------------------------------------------------------

  function sheetKind() {
    if (env.kind === 'webview' || env.kind === 'ios') return env.kind;
    return pendingPrompt ? 'native' : null;
  }

  function paintSheet() {
    if (!sheet) return;
    const kind = sheetKind();
    if (!kind) return;
    const heading = kind === 'webview' ? 'Open Lumino in your browser'
      : env.mobile ? 'Add Lumino to your Home Screen' : 'Install Lumino';
    const body = kind === 'native'
      ? `<p class="muted">${benefits(env)}</p>
        <div class="install-actions">
          <button class="btn" type="button" data-install-go>Install Lumino</button>
          <button class="textbtn" type="button" data-install-later>Not now</button>
        </div>`
      : `<p class="muted">${benefits(env)}</p>
        <div class="shortcut-guidance">${guidance}</div>
        <div class="install-actions">
          <button class="btn" type="button" data-install-later>Got it</button>
        </div>`;
    sheet.innerHTML = `<div class="install-sheet-body">
      <h2 id="install-sheet-title">${heading}</h2>${body}
      <button class="textbtn install-never" type="button" data-install-never>Don’t ask again</button>
    </div>`;
  }

  function closeSheet(action) {
    if (decided) return;
    decided = true;
    action();
    sheet?.close();
  }

  function openSheet() {
    if (typeof HTMLDialogElement !== 'function' || !sheetKind()) return;
    sheet = document.createElement('dialog');
    sheet.className = 'install-sheet';
    sheet.setAttribute('aria-labelledby', 'install-sheet-title');
    decided = false;
    paintSheet();
    document.body.append(sheet);
    sheet.addEventListener('click', async event => {
      const hit = selector => event.target.closest(selector);
      if (event.target === sheet) closeSheet(later);
      else if (hit('[data-install-later]')) closeSheet(later);
      else if (hit('[data-install-never]')) closeSheet(never);
      else if (hit('[data-install-copy]')) copyLink(hit('[data-install-copy]'));
      else if (hit('[data-install-go]')) {
        decided = true;
        sheet.close();
        await installNow();
      }
    });
    // Escape and "just closing it" count as Not now.
    sheet.addEventListener('close', () => {
      if (!decided) later();
      sheet.remove();
      sheet = undefined;
    });
    sheet.showModal();
    suggested = true;
  }

  // Called whenever Learn is drawn. Waits for the learner to settle, and skips anything mid-task.
  function suggest({ progress = 0 } = {}) {
    if (suggested || timer || sheet || !due()) return;
    if (!askEarly && progress < 1) return;
    timer = setTimeout(() => {
      timer = 0;
      if (!stage.querySelector('.has-roadmap') || document.querySelector('dialog[open]') || !due()) return;
      openSheet();
    }, SUGGEST_DELAY);
  }

  async function copyLink(button) {
    const input = button.parentElement.querySelector('[data-install-url]');
    try {
      await navigator.clipboard.writeText(here);
      button.textContent = 'Copied';
    } catch {
      input?.select();
      button.textContent = 'Select and copy';
    }
  }

  return {
    offer: `<section class="shortcut-offer" aria-labelledby="shortcut-title" hidden>
      <div><h3 id="shortcut-title">Add a Lumino shortcut</h3>
        <p class="muted">${benefits(env)}</p></div>
      <div class="shortcut-actions">
        <button class="btn" type="button" data-shortcut-add aria-controls="shortcut-guidance">Add shortcut</button>
        <button class="textbtn" type="button" data-shortcut-dismiss>Not now</button>
      </div>
      <div class="shortcut-guidance" id="shortcut-guidance" hidden>${guidance}</div>
    </section>`,
    help: `<details class="shortcut-help"><summary class="textbtn">Add a shortcut</summary>
      <div class="shortcut-guidance">${guidance}</div>
    </details>`,
    refresh,
    suggest,
  };
}
