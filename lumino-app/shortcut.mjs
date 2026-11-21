const DISMISSED_KEY = 'lumino.shortcut.dismissed';

function shortcutInstructions(agent, appleMobile, safariMac) {
  const separateProgress = '<p>The app starts with a fresh learning profile. Your existing progress stays in your browser.</p>';

  if (appleMobile) {
    return `<p>In Safari, tap Share and choose <strong>Add to Home Screen</strong>. Turn on <strong>Open as Web App</strong>, then tap Add.</p>${separateProgress}`;
  }
  if (safariMac) {
    return `<p>In Safari on macOS Sonoma or later, choose <strong>File → Add to Dock</strong>, then click Add.</p>${separateProgress}`;
  }
  if (/Android/.test(agent)) {
    return '<p>Open your browser menu and choose <strong>Install</strong> or <strong>Add to Home Screen</strong>. In Chrome, look under Install and create shortcut.</p>';
  }
  if (/Edg\//.test(agent)) {
    return '<p>In Edge, open the menu and choose <strong>More tools → Apps → Install this site as an app</strong>. In your list of installed apps, open Lumino’s details to create a desktop shortcut.</p>';
  }
  if (/Chrome\//.test(agent) && !/OPR\/|Vivaldi\//.test(agent)) {
    return '<p>In Chrome, open the menu and choose <strong>Cast, save and share → Create shortcut</strong> to save Lumino to your desktop.</p>';
  }
  return '<p>Drag the site icon next to the browser address to your desktop. Reopen it in the same browser profile to keep your progress.</p>';
}

export function setupShortcut(stage, storage) {
  const standalone = matchMedia('(display-mode: standalone)');
  const inApp = () => standalone.matches || navigator.standalone === true;
  const agent = navigator.userAgent;
  const mac = /Macintosh/.test(agent);
  const appleMobile = /iPad|iPhone|iPod/.test(agent) || (mac && navigator.maxTouchPoints > 1);
  const safariMac = mac && /Version\/[\d.]+.*Safari\//.test(agent);
  const instructions = shortcutInstructions(agent, appleMobile, safariMac);
  let dismissed = false;
  let pendingPrompt;
  let prompting = false;
  try { dismissed = storage?.getItem(DISMISSED_KEY) === '1'; } catch {}

  function refresh() {
    stage.querySelector('.shortcut-help')?.toggleAttribute('hidden', inApp());
    const offer = stage.querySelector('.shortcut-offer');
    if (!offer) return;
    const hide = dismissed || inApp();
    if (hide && offer.contains(document.activeElement)) {
      offer.previousElementSibling?.querySelector('button')?.focus({ preventScroll: true });
    }
    offer.hidden = hide;
    const button = offer.querySelector('[data-shortcut-add]');
    const guidance = offer.querySelector('.shortcut-guidance');
    button.setAttribute('aria-disabled', String(prompting));
    if (pendingPrompt && guidance.hidden) button.removeAttribute('aria-expanded');
    else button.setAttribute('aria-expanded', String(!guidance.hidden));
  }

  function dismiss() {
    dismissed = true;
    try { storage?.setItem(DISMISSED_KEY, '1'); } catch {}
    refresh();
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    if (appleMobile || safariMac) return;
    pendingPrompt = event;
    refresh();
  });
  window.addEventListener('appinstalled', () => {
    pendingPrompt = undefined;
    dismiss();
  });
  if (standalone.addEventListener) standalone.addEventListener('change', refresh);
  else standalone.addListener?.(refresh);

  stage.addEventListener('click', async event => {
    const offer = event.target.closest('.shortcut-offer');
    if (!offer || offer.hidden) return;
    if (event.target.closest('[data-shortcut-dismiss]')) {
      dismiss();
      return;
    }
    if (!event.target.closest('[data-shortcut-add]') || prompting) return;

    const guidance = offer.querySelector('.shortcut-guidance');
    if (!pendingPrompt || !guidance.hidden) {
      guidance.hidden = !guidance.hidden;
      refresh();
      return;
    }

    const install = pendingPrompt;
    pendingPrompt = undefined;
    prompting = true;
    refresh();
    try {
      const choice = (await install.prompt()) ?? (await install.userChoice);
      if (choice?.outcome === 'accepted' || choice?.outcome === 'dismissed') dismiss();
      else guidance.hidden = false;
    } catch {
      guidance.hidden = false;
    } finally {
      prompting = false;
      refresh();
    }
  });

  return {
    offer: `<section class="shortcut-offer" aria-labelledby="shortcut-title" hidden>
      <div><h3 id="shortcut-title">Add a Lumino shortcut</h3>
        <p class="muted">Open Lumino from your desktop or Home Screen.</p></div>
      <div class="shortcut-actions">
        <button class="btn" type="button" data-shortcut-add aria-controls="shortcut-guidance">Add shortcut</button>
        <button class="textbtn" type="button" data-shortcut-dismiss>Not now</button>
      </div>
      <div class="shortcut-guidance" id="shortcut-guidance" hidden>${instructions}</div>
    </section>`,
    help: `<details class="shortcut-help"><summary class="textbtn">Add a shortcut</summary>
      <div class="shortcut-guidance">${instructions}</div>
    </details>`,
    refresh,
  };
}
