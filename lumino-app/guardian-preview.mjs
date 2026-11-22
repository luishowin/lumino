import { subjectById } from './curriculum.mjs?v=34';
import { hydrate, spr, uiIcon } from './pixel-art.mjs?v=31';

const children = [
  { name: 'Baraka', grade: 'Grade 7', week: [12, 18, 0, 25, 15, 9, 21], lessons: 9, streak: 6,
    subjects: [['math', 'Algebra', 3], ['physics', 'Motion and energy', 1], ['biology', 'Living things', 4], ['english', 'Reading', 2]],
    focus: 'Solving equations', limit: '30 min', quiet: '20:00 to 06:30', league: 'Nickname only', allowed: 'All subjects' },
  { name: 'Neema', grade: 'Grade 3', week: [8, 0, 10, 12, 0, 14, 6], lessons: 5, streak: 2,
    subjects: [['math', 'Basic arithmetic', 2], ['english', 'Reading', 3], ['biology', 'Living things', 1]],
    focus: 'Adding fractions', limit: '15 min', quiet: '19:00 to 07:00', league: 'Hidden', allowed: 'Mathematics, Biology, English' },
];
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function guardianMarkup(child) {
  const total = child.week.reduce((minutes, value) => minutes + value, 0);
  const peak = Math.max(...child.week);
  return `<div class="topline"><button type="button" class="textbtn" data-exit-preview>← Back to Profile</button>${spr('shield', 3)}</div>
    <header><h2 class="guardian-title" tabindex="-1">Guardian area</h2>
      <p class="muted">Preview for Grace Mwangi using sample learner data.</p></header>
    <div class="chips" role="group" aria-label="Sample learner">${children.map(({ name, grade }, index) =>
      `<button type="button" class="chip" data-preview-child="${index}" aria-pressed="${name === child.name}">${name} · ${grade}</button>`).join('')}</div>
    <section><h2 class="section-title">This week</h2>
      <figure class="profile-card guardian-chart">
        <div class="guardian-bars" role="img" aria-label="${child.week.map((minutes, i) => `${weekdays[i]}: ${minutes} minutes`).join(', ')}">
          ${child.week.map((minutes, i) => `<div aria-hidden="true"><small>${minutes}</small>
            <span><i style="--height:${Math.max(4, 100 * minutes / peak)}%"></i></span><b>${weekdays[i]}</b></div>`).join('')}
        </div><figcaption class="muted">Minutes per day, Monday to Sunday.</figcaption>
      </figure>
      <div class="profile-tiles guardian-tiles">${[[total, 'Minutes'], [child.lessons, 'Lessons'], [child.streak, 'Day streak']].map(([value, label]) =>
        `<div class="profile-tile"><b>${value}</b><small>${label}</small></div>`).join('')}</div>
    </section>
    <section><h2 class="section-title">Progress by subject</h2><div class="profile-card">${child.subjects.map(([id, topic, count]) =>
      `<div class="profile-row">${uiIcon(id)}<div class="profile-label"><b>${subjectById(id).name}</b><small>${topic}</small></div>
        <progress class="guardian-progress" value="${count}" max="4" aria-label="${subjectById(id).name}: ${count} of 4 topics"></progress></div>`).join('')}</div>
      <p class="guardian-note">Suggested focus <b>${child.focus}</b></p></section>
    ${[
      ['Limits and schedule', [['Daily time limit', child.limit], ['Quiet hours', child.quiet], ['Allowed subjects', child.allowed]]],
      ['Safety and privacy', [['Weekly league', child.league], ['Tutor chat history', 'Available to the guardian']]],
      ['Notifications', [['Weekly progress email', 'Sunday'], ['Streak at risk', 'On'], ['Time limit reached', 'On']]],
      ['Profile and data', [['Learning data', 'Download preview'], ['Guardian PIN', 'Demo PIN'], ['Reset progress', 'Preview only'], ['Delete profile', 'Preview only']]],
    ].map(([title, rows]) => `<section><h2 class="section-title">${title}</h2><div class="profile-card">${rows.map(([label, value]) =>
      `<div class="profile-row"><b class="profile-label">${label}</b><span class="guardian-value muted">${value}</span></div>`).join('')}</div></section>`).join('')}`;
}

export function openGuardianPreview(body, onBack) {
  const pin = '1234';
  let digits = '';

  function show(html) {
    body.innerHTML = `<div class="profile-page">${html}</div>`;
    hydrate(body);
    body.querySelector('[data-exit-preview]').addEventListener('click', onBack);
  }

  function dashboard(index, focus) {
    show(guardianMarkup(children[index]));
    for (const button of body.querySelectorAll('[data-preview-child]')) {
      button.addEventListener('click', () => dashboard(Number(button.dataset.previewChild), `[data-preview-child="${button.dataset.previewChild}"]`));
    }
    body.querySelector(focus).focus({ preventScroll: true });
  }

  body.parentElement.scrollTop = 0;
  show(`<div class="topline"><button type="button" class="textbtn" data-exit-preview>← Back to Profile</button></div>
    <div class="guardian-pin" data-pin>
      ${spr('shield', 8)}<h2 class="guardian-title" tabindex="-1">Guardian area</h2>
      <p class="muted">Enter the demo PIN to open the guardian preview.</p>
      <div class="guardian-pin-dots" role="img" aria-label="0 of 4 digits entered"><i></i><i></i><i></i><i></i></div>
      <p class="profile-status" role="status"></p>
      <div class="guardian-keypad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', ''].map(key => key ?
        `<button type="button" class="chip" data-pin-key="${key}">${key}</button>` : '<span></span>').join('')}
        <button type="button" class="chip" data-pin-key="0">0</button>
        <button type="button" class="chip" data-pin-key="delete" aria-label="Delete last digit">⌫</button>
      </div><p class="muted">Demo PIN <b>${pin}</b></p>
    </div>`);
  const keypad = body.querySelector('[data-pin]');
  const dots = keypad.querySelector('.guardian-pin-dots');
  const status = keypad.querySelector('[role="status"]');

  function enter(key) {
    digits = key === 'delete' ? digits.slice(0, -1) : digits + key;
    status.textContent = '';
    if (digits === pin) {
      dashboard(0, '.guardian-title');
      return;
    }
    if (digits.length === pin.length) {
      digits = '';
      status.textContent = 'That PIN doesn’t match. Try again.';
    }
    dots.setAttribute('aria-label', `${digits.length} of 4 digits entered`);
    [...dots.children].forEach((dot, index) => dot.classList.toggle('on', index < digits.length));
  }

  for (const button of keypad.querySelectorAll('[data-pin-key]')) {
    button.addEventListener('click', () => enter(button.dataset.pinKey));
  }
  keypad.addEventListener('keydown', event => {
    if (event.key === 'Escape') onBack();
    else if (/^\d$/.test(event.key) || event.key === 'Backspace') {
      event.preventDefault();
      enter(event.key === 'Backspace' ? 'delete' : event.key);
    }
  });
  keypad.querySelector('h2').focus({ preventScroll: true });
}
