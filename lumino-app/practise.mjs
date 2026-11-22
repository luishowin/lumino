// Practise: prompt-first home and the live-tutor session screen.
// Pure helpers (storage, markup, titles) are exported separately so they can be unit tested.

import { subjectById, topicById } from './curriculum.mjs?v=34';
import { cleanQuestion } from './tutor-client.mjs?v=59';

export const PRACTISE_KEY = 'lumino.practise.v1';
export const SESSION_GOAL = 5;
const MAX_SESSIONS = 8;
const MAX_MESSAGES = 80;
const TUTOR_IDS = ['linda', 'charles'];

const escapeText = value => String(value).replace(/[&<>"']/g, character =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

/* ---------- storage ---------- */

function cleanMessage(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const role = raw.role === 'user' ? 'user' : raw.role === 'tutor' ? 'tutor' : null;
  if (!role || typeof raw.text !== 'string') return null;
  const message = { role, text: raw.text.slice(0, 2000) };
  if (role === 'tutor' && raw.question) {
    const question = cleanQuestion(raw.question);
    if (question) {
      message.question = question;
      if (Number.isInteger(raw.picked) && raw.picked >= 0 && raw.picked < question.options.length) message.picked = raw.picked;
    }
  }
  return message;
}

export function sanitizeSessions(raw) {
  if (!Array.isArray(raw)) return [];
  const sessions = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    if (typeof item.id !== 'string' || !subjectById(item.subject) || !TUTOR_IDS.includes(item.tutor)) continue;
    const messages = (Array.isArray(item.messages) ? item.messages : []).map(cleanMessage).filter(Boolean).slice(-MAX_MESSAGES);
    if (!messages.length) continue;
    sessions.push({
      id: item.id.slice(0, 60), subject: item.subject, tutor: item.tutor,
      title: typeof item.title === 'string' ? item.title.slice(0, 80) : 'Practice',
      updated: Number.isFinite(item.updated) ? item.updated : 0, messages,
    });
  }
  return sessions.sort((a, b) => b.updated - a.updated).slice(0, MAX_SESSIONS);
}

export function loadSessions(storage) {
  try { return sanitizeSessions(JSON.parse(storage?.getItem(PRACTISE_KEY) ?? '[]')); } catch { return []; }
}

export function saveSessions(storage, sessions) {
  if (!storage) return false;
  try { storage.setItem(PRACTISE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS))); return true; } catch { return false; }
}

export function clearSessions(storage) {
  if (!storage) return true;
  try { storage.removeItem(PRACTISE_KEY); return true; } catch { return false; }
}

export function newSession({ subject, tutor, now = Date.now() }) {
  return { id: `p${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`, subject, tutor, title: 'New practice', updated: now, messages: [] };
}

export function sessionTitle(text) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length > 48 ? `${clean.slice(0, 47).trimEnd()}…` : clean || 'Practice';
}

export function sessionProgress(session) {
  const asked = session.messages.filter(message => message.question);
  const answered = asked.filter(message => Number.isInteger(message.picked));
  const correct = answered.filter(message => message.picked === message.question.answer).length;
  return { answered: answered.length, correct, pct: Math.min(100, Math.round(answered.length / SESSION_GOAL * 100)) };
}

/* ---------- home ---------- */

export function suggestionsFor(subject) {
  const topics = subject.groups.flatMap(group => group.topics);
  const starter = topicById(subject, subject.starterTopic) ?? topics[0];
  const other = topics.find(topic => topic.id !== starter.id) ?? starter;
  return [`Quiz me on ${starter.name}`, `Explain ${other.name} simply`, 'Give me a hard question'];
}

export function practiseHomeMarkup({ tabs, subject, tutor, mistakes, sessions, suggestions, guided, guidedNote }) {
  const recent = sessions.slice(0, 4);
  return `${tabs}
  <div class="practise-home">
    <section class="pr-hero" data-tutor="${tutor.id}" aria-labelledby="practice-title">
      <div class="pr-portrait" aria-hidden="true"></div>
      <div>
        <h2 id="practice-title">What would you like to practise?</h2>
        <p>${escapeText(tutor.name)} is ready. Ask anything or pick a prompt.</p>
      </div>
    </section>
    <form class="pr-composer" data-compose>
      <label class="sr" for="pr-input">Message ${escapeText(tutor.name)}</label>
      <input id="pr-input" name="message" type="text" maxlength="500" autocomplete="off" enterkeyhint="send"
        placeholder="Ask ${escapeText(tutor.name)} about ${escapeText(subject.name)}…">
      <button class="pr-send" type="submit" aria-label="Send message" disabled>↑</button>
    </form>
    <div class="pr-suggest" role="group" aria-label="Suggested prompts">
      ${suggestions.map(text => `<button class="chip" type="button" data-prompt="${escapeText(text)}">${escapeText(text)}</button>`).join('')}
    </div>
    <div class="pr-attach" role="group" aria-label="Attachments, coming soon">
      <button class="chip" type="button" disabled>
        <svg class="pr-attach-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="3.5"/></svg>
        Photo <span class="pr-soon">Available soon</span></button>
      <button class="chip" type="button" disabled>
        <svg class="pr-attach-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3m-5 5 5-5 5 5M3 15v5h18v-5"/></svg>
        File <span class="pr-soon">Available soon</span></button>
    </div>
    <section class="pr-section" aria-labelledby="pr-mistakes">
      <h3 id="pr-mistakes">Practise your mistakes</h3>
      ${mistakes.length
        ? `<div class="practice-choices">${mistakes.map(item => `<button class="choice" type="button" data-mistake="${escapeText(item.id)}">
            <span><b>${escapeText(item.title)}</b><small>${item.misses} different questions missed</small></span></button>`).join('')}</div>`
        : '<p class="empty muted">Questions you miss will collect here, so you can practise exactly what you need.</p>'}
    </section>
    ${recent.length ? `<section class="pr-section" aria-labelledby="pr-jump">
      <h3 id="pr-jump">Jump back in</h3>
      <ul class="pr-jump">${recent.map(session => {
        const { answered, pct } = sessionProgress(session);
        const owner = subjectById(session.subject);
        return `<li><button class="choice pr-jump-card" type="button" data-resume="${escapeText(session.id)}"
          aria-label="Resume ${escapeText(session.title)}, ${answered} of ${SESSION_GOAL} questions answered">
          <span class="pr-ring" style="--pct:${pct}" aria-hidden="true"><span class="pr-ring-num">${pct}%</span></span>
          <span><b>${escapeText(session.title)}</b><small>${escapeText(owner?.name ?? '')} · ${answered} answered</small></span></button></li>`;
      }).join('')}</ul></section>` : ''}
    <section class="pr-section" aria-labelledby="pr-guided">
      <h3 id="pr-guided">Guided practice</h3>
      <p class="muted">${escapeText(guidedNote)}</p>
      ${guided}
    </section>
  </div>`;
}

export function bindPractiseHome(body, { onAsk, onResume, onMistake }) {
  const form = body.querySelector('[data-compose]');
  const input = form.querySelector('input');
  const send = form.querySelector('.pr-send');
  input.addEventListener('input', () => { send.disabled = !input.value.trim(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (text) onAsk(text);
  });
  for (const button of body.querySelectorAll('[data-prompt]')) button.addEventListener('click', () => onAsk(button.dataset.prompt));
  for (const button of body.querySelectorAll('[data-resume]')) button.addEventListener('click', () => onResume(button.dataset.resume));
  for (const button of body.querySelectorAll('[data-mistake]')) button.addEventListener('click', () => onMistake(button.dataset.mistake));
}

/* ---------- session ---------- */

export function sessionMarkup({ tutor, subject }) {
  return `<section class="screen pr-session" data-tutor="${tutor.id}" aria-label="Practice with ${escapeText(tutor.name)}">
    <header class="pr-session-top">
      <button type="button" class="textbtn" data-exit>← Practise</button>
      <div class="pr-who"><span class="pr-avatar" aria-hidden="true"></span>
        <span><b>${escapeText(tutor.name)}</b><small>${escapeText(subject.name)} · AI preview</small></span></div>
      <span class="pr-count" data-count></span>
    </header>
    <div class="pr-log" role="log" aria-live="polite" aria-label="Conversation" data-log tabindex="0"></div>
    <div class="pr-quick" data-quick role="group" aria-label="Quick replies"></div>
    <form class="pr-composer" data-compose>
      <label class="sr" for="pr-session-input">Message ${escapeText(tutor.name)}</label>
      <input id="pr-session-input" name="message" type="text" maxlength="500" autocomplete="off" enterkeyhint="send" placeholder="Reply to ${escapeText(tutor.name)}…">
      <button class="pr-send" type="submit" aria-label="Send message" disabled>↑</button>
      <button class="pr-send pr-stop" type="button" aria-label="Stop reply" data-stop hidden>■</button>
    </form>
  </section>`;
}

const QUICK_REPLIES = ['Another question', 'Explain it differently', 'Make it harder'];

export function bindSession(node, { session, subject, tutor, client, reducedMotion, onChange, onAnswer, onExit, initialText }) {
  const log = node.querySelector('[data-log]');
  const quick = node.querySelector('[data-quick]');
  const form = node.querySelector('[data-compose]');
  const input = form.querySelector('input');
  const send = form.querySelector('button[type="submit"]');
  const stop = form.querySelector('[data-stop]');
  const count = node.querySelector('[data-count]');
  let controller = null;
  let busy = false;
  let disposed = false;

  const scrollDown = () => { log.scrollTop = log.scrollHeight; };

  function updateCount() {
    const { answered } = sessionProgress(session);
    count.textContent = `${answered} of ${SESSION_GOAL}`;
    count.setAttribute('aria-label', `${answered} of ${SESSION_GOAL} questions answered`);
  }

  function updateControls() {
    send.hidden = busy;
    stop.hidden = !busy;
    send.disabled = !input.value.trim();
    log.setAttribute('aria-busy', String(busy));
    renderQuick();
  }

  function renderQuick() {
    quick.replaceChildren();
    const last = session.messages.at(-1);
    const ready = !busy && last?.role === 'tutor' && (!last.question || Number.isInteger(last.picked));
    if (!ready) return;
    for (const label of QUICK_REPLIES) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.textContent = label;
      button.addEventListener('click', () => submit(label));
      quick.append(button);
    }
  }

  function bubble(message) {
    const el = document.createElement('div');
    el.className = `pr-msg ${message.role}`;
    const text = document.createElement('p');
    text.className = 'pr-text';
    text.textContent = message.text;
    el.append(text);
    log.append(el);
    return { el, text };
  }

  function renderQuestion(parent, message) {
    const question = message.question;
    const wrap = document.createElement('div');
    wrap.className = 'pr-question';
    wrap.setAttribute('role', 'group');
    const stem = document.createElement('p');
    stem.className = 'pr-stem';
    stem.id = `pr-q-${Math.random().toString(36).slice(2, 8)}`;
    stem.textContent = question.stem;
    wrap.setAttribute('aria-labelledby', stem.id);
    const options = document.createElement('div');
    options.className = 'choices';
    const feedback = document.createElement('p');
    feedback.className = 'pr-explain';
    feedback.setAttribute('role', 'status');

    function reveal() {
      const right = message.picked === question.answer;
      options.querySelectorAll('button').forEach((button, index) => {
        button.disabled = true;
        if (index === question.answer) button.classList.add('right');
        else if (index === message.picked) button.classList.add('wrong');
      });
      const verdict = document.createElement('strong');
      verdict.textContent = right ? 'That’s right. ' : 'Not quite. ';
      feedback.replaceChildren(verdict, document.createTextNode(question.explanation));
      feedback.dataset.result = right ? 'right' : 'retry';
    }

    question.options.forEach((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      const text = document.createElement('b');
      text.textContent = label;
      button.append(text);
      button.addEventListener('click', () => {
        if (Number.isInteger(message.picked)) return;
        const before = sessionProgress(session).answered;
        message.picked = index;
        reveal();
        onAnswer({
          questionId: question.id, topicId: question.topicId, subjectId: subject.id,
          right: index === question.answer, given: label,
        });
        onChange(session);
        updateCount();
        if (before + 1 === SESSION_GOAL) addNote(`${SESSION_GOAL} questions answered. Keep going, or head back whenever you like.`);
        renderQuick();
        scrollDown();
        quick.querySelector('button')?.focus({ preventScroll: true });
      });
      options.append(button);
    });
    wrap.append(stem, options, feedback);
    if (Number.isInteger(message.picked)) reveal();
    parent.append(wrap);
  }

  function addNote(text) {
    const note = document.createElement('p');
    note.className = 'pr-note';
    note.textContent = text;
    log.append(note);
  }

  function renderHistory() {
    for (const message of session.messages) {
      const { el } = bubble(message);
      if (message.question) renderQuestion(el, message);
    }
    scrollDown();
  }

  async function runTurn() {
    busy = true;
    controller = new AbortController();
    const history = session.messages.slice();
    const reply = { role: 'tutor', text: '' };
    const { el, text } = bubble(reply);
    const typing = document.createElement('span');
    typing.className = 'pr-typing';
    typing.setAttribute('aria-hidden', 'true');
    typing.innerHTML = '<i></i><i></i><i></i>';
    el.append(typing);
    updateControls();
    scrollDown();
    let pending = '';
    const flush = () => { if (pending) { reply.text += pending; text.textContent = reply.text; pending = ''; } };
    try {
      for await (const event of client.send({ tutorId: tutor.id, subjectId: subject.id, messages: history, signal: controller.signal })) {
        if (disposed) return;
        typing.remove();
        if (event.type === 'text') {
          pending += event.delta;
          if (!reducedMotion) { flush(); scrollDown(); }
        } else if (event.type === 'question') {
          flush();
          reply.question = event.question;
          renderQuestion(el, reply);
        }
      }
      flush();
    } catch (error) {
      flush();
      typing.remove();
      if (error?.name !== 'AbortError') {
        reply.text ||= 'I couldn’t answer that just now. Try again in a moment.';
        text.textContent = reply.text;
        el.classList.add('error');
      }
    } finally {
      typing.remove();
      busy = false;
      controller = null;
    }
    if (disposed) return;
    if (!reply.text && !reply.question) el.remove();
    else {
      if (!reply.text) text.remove();
      session.messages.push(reply);
      onChange(session);
    }
    updateControls();
    scrollDown();
  }

  function submit(raw) {
    const value = String(raw).trim();
    if (!value || busy) return;
    const message = { role: 'user', text: value.slice(0, 500) };
    session.messages.push(message);
    bubble(message);
    onChange(session);
    input.value = '';
    runTurn();
  }

  form.addEventListener('submit', event => { event.preventDefault(); submit(input.value); });
  input.addEventListener('input', () => { send.disabled = busy || !input.value.trim(); });
  stop.addEventListener('click', () => { controller?.abort(); input.focus(); });
  node.querySelector('[data-exit]').addEventListener('click', () => { controller?.abort(); onExit(); });

  updateCount();
  renderHistory();
  updateControls();
  if (initialText) submit(initialText);
  else if (session.messages.at(-1)?.role === 'user') runTurn();

  return () => { disposed = true; controller?.abort(); };
}
