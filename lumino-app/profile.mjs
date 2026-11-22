import { LEVELS, SUBJECTS, subjectById, topicById } from './curriculum.mjs?v=34';
import { TROPHIES } from './content.mjs?v=24';
import { hydrate, spr, uiIcon } from './pixel-art.mjs?v=31';
import { AVATARS, DAILY_GOALS, NAME_LIMIT, currentStreak } from './progress.mjs?v=34';
import { openGuardianPreview } from './guardian-preview.mjs?v=31';

export const displayName = profile => profile.name.trim() || 'Learner';
export const canReadAloud = () => 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

export function escapeHTML(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return value.replace(/[&<>"']/g, character => entities[character]);
}

function segments(panel) {
  return `<div class="profile-segments" role="group" aria-label="Profile sections">
    <button type="button" data-profile-panel="profile" aria-pressed="${panel === 'profile'}">Profile</button>
    <button type="button" data-profile-panel="settings" aria-pressed="${panel === 'settings'}">Settings</button>
  </div>`;
}

function section(title, content) {
  return `<section><h2 class="section-title">${title}</h2><div class="profile-card">${content}</div></section>`;
}

function fieldLabel(title, detail = '') {
  return `<b>${title}</b>${detail ? `<small>${detail}</small>` : ''}`;
}

function subjectRow(subject, plan, completed) {
  const topic = plan && topicById(subject, plan.topicId);
  const level = topic && LEVELS.find(item => item.id === plan.levels[topic.id]);
  const status = topic ? [topic.name, level?.name].filter(Boolean).join(' · ') : completed ? 'Starter lesson completed' : 'Not started';
  const action = topic ? 'Change' : 'Start';
  return `<div class="profile-row">${uiIcon(subject.id)}
    <div class="profile-label">${fieldLabel(subject.name, status)}</div>
    <button type="button" class="textbtn" data-profile-subject="${subject.id}" aria-label="${action} ${subject.name}">${action}</button>
  </div>`;
}

function profileMarkup(state, tutorPicker) {
  const { profile, bestStreak, completed, lessonResults, plans, previous, xp } = state;
  const name = escapeHTML(displayName(profile));
  const streak = currentStreak(state);
  const trophies = TROPHIES.filter(({ d }) => bestStreak >= d).length;
  const since = profile.since === null ? '' : new Intl.DateTimeFormat(undefined, {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(profile.since * 864e5);
  const summary = [
    [spr('flame', 3, streak ? '' : 'off'), streak, 'Day streak'],
    [spr('star', 3), xp, 'XP'],
    [spr('bolt', 3), Object.keys(lessonResults).length, 'Lessons done'],
    [spr('trophy', 3, trophies ? 'bronze' : 'off'), `${trophies} of ${TROPHIES.length}`, 'Trophies'],
  ];

  return `<header class="profile-heading">
      <div class="profile-avatar" data-profile-avatar>${uiIcon(`avatar-${profile.avatar}`)}</div>
      <div><h2 data-profile-name>${name}</h2><span class="profile-badge">Independent learner</span>
        ${since ? `<p class="muted profile-since">Learning since ${since}</p>` : ''}</div>
    </header>
    <div class="profile-tiles" aria-label="Learning summary">${summary.map(([icon, value, label]) =>
      `<div class="profile-tile">${icon}<b>${value}</b><small>${label}</small></div>`).join('')}</div>
    ${section('About me', `<div class="profile-row profile-row-stack">
      <label class="profile-label" for="profile-name">${fieldLabel('Display name', 'Shown on your profile and in the sample league.')}</label>
      <input class="profile-field" id="profile-name" type="text" maxlength="${NAME_LIMIT}" autocomplete="off" value="${escapeHTML(profile.name)}" data-profile-name-input>
    </div><div class="profile-row profile-row-stack">
      <b class="profile-label">Avatar</b>
      <div class="profile-avatar-options" role="group" aria-label="Avatar colour">${AVATARS.map(colour =>
        `<button type="button" data-avatar-colour="${colour}" aria-label="${colour[0].toUpperCase() + colour.slice(1)} avatar" aria-pressed="${colour === profile.avatar}">${uiIcon(`avatar-${colour}`)}</button>`).join('')}</div>
    </div>`)}
    ${section('My subjects', SUBJECTS.map(subject => subjectRow(subject, plans[subject.id], completed.includes(subject.id))).join(''))}
    <section><h2 class="section-title">My tutor</h2>${tutorPicker}</section>
    ${previous.length ? section('Prior achievements', `<p class="muted">Starter lessons you completed before the current learning plans.</p>
      <ul>${previous.map(id => `<li>${subjectById(id).name}</li>`).join('')}</ul>`) : ''}
    <section class="profile-guardian-callout">
      <div>${spr('shield', 5)}<span><h2>Learning on your own</h2><p class="muted">See how a parent or guardian could follow a learner’s progress and set limits.</p></span></div>
      <button type="button" class="btn block" data-guardian-preview>Preview guardian area</button>
    </section>
    ${section('Account', `<div class="profile-actions">
      <div class="profile-row"><a class="textbtn" href="../about.html">About Lumino ↗</a></div>
      <div class="profile-row"><div class="profile-label">${fieldLabel('Reset my progress', 'Erases your plans, XP and streak on this device.')}</div>
        <button type="button" class="chip profile-danger" data-reset aria-label="Reset my progress">Reset</button></div>
      <p class="muted profile-status" data-reset-status role="status"></p>
    </div>`)}`;
}

function switchRow(key, label, value, description, available = true) {
  return `<div class="profile-row">
    <div class="profile-label" id="profile-label-${key}">${fieldLabel(label, description)}</div>
    <button type="button" class="profile-switch" role="switch" aria-checked="${value}" aria-labelledby="profile-label-${key}"${available ? ` data-profile-switch="${key}"` : ' disabled'}></button>
  </div>`;
}

function settingsMarkup(profile, tutorName) {
  const readAloud = canReadAloud();
  return `<h2 class="sr">Settings</h2>
    ${section('Daily goal', `<div class="profile-row profile-row-stack">
      <div class="profile-label">${fieldLabel('Minutes of learning each day', 'Set a target for your daily practice.')}</div>
      <div class="profile-goals" role="group" aria-label="Minutes of learning each day">${DAILY_GOALS.map(goal =>
        `<button type="button" class="chip" data-profile-goal="${goal}" aria-pressed="${goal === profile.goal}">${goal} min</button>`).join('')}</div>
    </div>`)}
    ${section('Reminders', `${switchRow('remind', 'Daily reminder', profile.remind, `${tutorName} will nudge you in the Learn tab.`)}
      <div class="profile-row profile-reminder-time" data-reminder-time-row${profile.remind ? '' : ' hidden'}>
        <label class="profile-label" for="profile-reminder-time"><b>Reminder time</b></label>
        <input class="profile-field" id="profile-reminder-time" type="time" value="${profile.reminderTime}" required>
      </div>`)}
    ${section('Learning help', `${switchRow('hints', 'Hints before answers', profile.hints, 'Show a tutor hint before you answer a question.')}
      ${switchRow('read', 'Read questions aloud', readAloud && profile.read, readAloud ? 'Use your device’s voice to read lesson questions.' : 'Unavailable in this browser.', readAloud)}`)}
    ${section('Sound and comfort', `${switchRow('sfx', 'Sound effects', false, 'Coming later', false)}
      ${switchRow('music', 'Music', false, 'Coming later', false)}
      ${switchRow('largeText', 'Larger text', profile.largeText, 'Makes text bigger across the app.')}
      ${switchRow('reduceMotion', 'Reduce motion', profile.reduceMotion, 'Turns off most animations.')}`)}
    ${section('Privacy', switchRow('league', 'Show my sample league entry', profile.league, 'Show your nickname and XP in the example scores on this device.'))}`;
}

export function mountProfile(body, { state, tutor, tutorChoices, bindTutorChoices, persist, applyPreferences, openSubject, reset, renderShortcut }) {
  const profile = state.profile;

  function render(panel, focusSelector) {
    const content = panel === 'settings' ? settingsMarkup(profile, tutor().name) : profileMarkup(state, tutorChoices(tutor().id, 'choice'));
    body.innerHTML = `<div class="profile-page">${segments(panel)}${content}</div>`;
    hydrate(body);
    for (const button of body.querySelectorAll('[data-profile-panel]')) {
      button.addEventListener('click', () => {
        if (button.dataset.profilePanel === panel) return;
        body.parentElement.scrollTop = 0;
        render(button.dataset.profilePanel, `[data-profile-panel="${button.dataset.profilePanel}"]`);
      });
    }
    if (panel === 'settings') bindSettings();
    else bindProfile();
    renderShortcut();
    if (focusSelector) body.querySelector(focusSelector)?.focus();
  }

  function bindProfile() {
    const name = body.querySelector('[data-profile-name]');
    body.querySelector('[data-profile-name-input]').addEventListener('input', event => {
      profile.name = event.currentTarget.value.slice(0, NAME_LIMIT);
      name.textContent = displayName(profile);
      persist();
    });
    const avatar = body.querySelector('[data-profile-avatar] img');
    const choices = [...body.querySelectorAll('[data-avatar-colour]')];
    for (const button of choices) button.addEventListener('click', () => {
      profile.avatar = button.dataset.avatarColour;
      for (const item of choices) item.setAttribute('aria-pressed', String(item === button));
      avatar.src = button.querySelector('img').src;
      persist();
    });
    for (const button of body.querySelectorAll('[data-profile-subject]')) {
      button.addEventListener('click', () => openSubject(subjectById(button.dataset.profileSubject)));
    }
    bindTutorChoices(body, id => {
      state.tutor = id;
      persist();
    });
    body.querySelector('[data-guardian-preview]').addEventListener('click', () => {
      openGuardianPreview(body, () => render('profile', '[data-guardian-preview]'));
    });
    body.querySelector('[data-reset]').addEventListener('click', () => reset(body.querySelector('[data-reset-status]')));
  }

  function bindSettings() {
    const goals = [...body.querySelectorAll('[data-profile-goal]')];
    for (const button of goals) button.addEventListener('click', () => {
      profile.goal = Number(button.dataset.profileGoal);
      for (const item of goals) item.setAttribute('aria-pressed', String(item === button));
      persist();
    });
    for (const button of body.querySelectorAll('[data-profile-switch]')) button.addEventListener('click', () => {
      const key = button.dataset.profileSwitch;
      profile[key] = !profile[key];
      button.setAttribute('aria-checked', String(profile[key]));
      if (key === 'remind') body.querySelector('[data-reminder-time-row]').hidden = !profile.remind;
      applyPreferences();
      persist();
    });
    const input = body.querySelector('#profile-reminder-time');
    input.addEventListener('change', () => {
      if (input.validity.valid) profile.reminderTime = input.value;
      else input.value = profile.reminderTime;
      persist();
    });
  }

  render('profile');
}
