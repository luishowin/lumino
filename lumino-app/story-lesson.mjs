import { escapeHTML as esc } from './profile.mjs?v=34';

export const sections = ['Introduction', 'Goal', 'Definitions', 'Concept', 'Examples', 'Test', 'Summary', 'Sandbox'];

export function storySession(lesson) {
  const cards = [[lesson.intro], [lesson.goal], [lesson.definitions], lesson.concept,
    lesson.examples, lesson.quiz, [lesson.summary], [{}]].flatMap((items, section) =>
    items.map((item, index) => ({ item, section, index, count: items.length })));
  return { cards, position: 0, answers: new Map(), drafts: new Map(), alternate: new Set() };
}

export function fills({ section, index, count }) {
  return sections.map((_, i) => i < section ? 1 : i > section ? 0 : (index + 1) / count);
}

export function move(session, direction) {
  const card = session.cards[session.position];
  if (direction > 0 && card.section === 5 && !session.answers.has(card.item.id)) return 'locked';
  if (session.position + direction >= session.cards.length) return 'finished';
  session.position = Math.max(0, session.position + direction);
  return 'moved';
}

const list = (items, tag = 'ul') => `<${tag}>${items.map(s => `<li>${esc(s)}</li>`).join('')}</${tag}>`;
const formula = s => s ? `<div class="ex">${esc(s)}</div>` : '';
const button = (action, label) => `<button type="button" class="textbtn" data-action="${action}">${label}</button>`;

export function mountStory(node, lesson, session, { person, dialogue, profile, hint, answer, activity, exit, finish, drawGraph }) {
  node.innerHTML = `<header class="topline">${button('exit', '× Exit lesson')}<span data-position></span></header>
    <div class="bars" aria-hidden="true">${sections.map(() => '<i><b></b></i>').join('')}</div>
    <article class="lesson-card story-page" data-page></article><div data-guide></div>
    <div class="story-nav"><button class="btn secondary" data-action="back">Back</button><button class="btn" data-action="next">Next</button></div>
    <p class="story-status" role="status" aria-live="polite"></p>`;
  const page = node.querySelector('[data-page]');
  const status = node.querySelector('[role=status]');
  const next = node.querySelector('[data-action=next]');
  const current = () => session.cards[session.position];
  const graded = lesson.quiz.filter(q => q.type === 'mcq');
  const score = () => graded.filter(q => session.answers.get(q.id) === q.answer).length;
  const speech = profile.read && window.speechSynthesis;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let mic;
  function stopMic() {
    if (mic) { mic.onend = mic.onerror = mic.onresult = null; mic.abort(); mic = null; }
  }

  function render(read = true) {
    const { section, item, index, count } = current();
    const value = session.answers.get(item.id);
    const done = session.answers.has(item.id);
    const alt = session.alternate.has(session.position);
    const lines = ['Let’s start with a puzzle.', 'Keep these targets in mind.', 'Try saying each term out loud.',
      'Picture what happens at each step.', 'Follow the example one step at a time.',
      done ? 'Compare your reasoning with the explanation.' : 'Take a moment to think it through.',
      'Which idea will you remember tomorrow?', 'Finish here to save your result.'];
    let title, body;
    switch (section) {
      case 0: title = lesson.title; body = `<p>${esc(item.hook)}</p>`; break;
      case 1: title = 'By the end you can…'; body = list(item) + `<p class="muted">About ${lesson.estimatedMinutes} minutes</p>`; break;
      case 2: title = 'Key words'; body = `<dl>${item.map(d => `<dt>${esc(d.term)}</dt><dd>${esc(d.meaning)}</dd>`).join('')}</dl>`; break;
      case 3:
        title = item.title;
        body = `<p>${esc(alt ? item.alt : item.body)}</p>${formula(item.math)}${item.visual === 'distance-graph' ? '<canvas class="distance-graph" width="400" height="220" role="img" aria-label="Distance rises from zero to 6 metres at 2 seconds, to 18 metres at 5 seconds, then stays there until 7 seconds."></canvas>' : ''}${button('alt', alt ? 'Show original' : 'Explain it another way')}`;
        break;
      case 4:
        title = item.title;
        body = (item.steps ? list(item.steps, 'ol') : '') + (item.body ? `<p>${esc(item.body)}</p>` : '') + (item.activityId ? button('activity', 'Try it →') : '');
        break;
      case 5:
        title = item.q;
        if (item.type === 'mcq') {
          body = `<div class="choices">${item.options.map((o, i) => `<button class="choice ${done && i === item.answer ? 'right' : done && i === value ? 'wrong' : ''}" data-option="${i}" ${done ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>`;
          if (done) body += `<p class="story-feedback">${value === item.answer ? 'Correct.' : 'Correct answer: ' + esc(item.options[item.answer]) + '.'} ${esc(item.why)}</p>`;
        } else {
          body = `<label>Your explanation<textarea data-draft ${done ? 'readonly' : ''}>${esc(value ?? session.drafts.get(item.id) ?? '')}</textarea></label>`;
          if (done) body += `<p class="story-feedback"><b>A model answer</b><br>${esc(item.model)}</p>`;
          else body += (Recognition ? button('speak', 'Speak') : '') + button('submit', 'Submit explanation');
        }
        if (!done && profile.hints) body += `<p class="muted">${esc(hint)}</p>`;
        break;
      case 6: title = `You scored ${score()} / ${graded.length}`; body = list(item.takeaways) + formula(item.formula); break;
      case 7: title = 'Sandbox'; body = '<button class="btn" disabled>Coming soon</button>'; break;
    }
    const tag = section === 5 ? 'Test your understanding' : section === 4 ? ({ problem: 'Worked problem', 'real-world': 'Real world', activity: 'Optional activity' })[item.kind] : sections[section];
    page.innerHTML = `<span class="tag-label">${tag}${count > 1 ? ' · ' + (index + 1) + ' of ' + count : ''}</span><h2 tabindex="-1">${esc(title)}</h2>${body}`;
    const graph = page.querySelector('canvas');
    if (graph) drawGraph(graph);
    const line = item.tutorLine ?? lines[section];
    const pose = section === 5 ? (done ? 'encouraging' : 'thinking') : section === 0 ? 'greeting' : section >= 6 ? 'encouraging' : 'explaining';
    node.querySelector('[data-guide]').innerHTML = dialogue(person, pose, person.name, `<p>${esc(line)}</p>`);
    node.querySelector('[data-position]').textContent = `${sections[section]} · ${session.position + 1} of ${session.cards.length}`;
    const widths = fills(current());
    node.querySelectorAll('.bars b').forEach((b, i) => { b.style.transform = `scaleX(${widths[i]})`; });
    node.querySelector('[data-action=back]').disabled = session.position === 0;
    next.textContent = section === 7 ? 'Finish' : 'Next';
    next.setAttribute('aria-disabled', String(section === 5 && !done));
    status.textContent = '';
    page.scrollTop = 0;
    if (read) {
      page.querySelector('h2').focus({ preventScroll: true });
      if (speech && window.SpeechSynthesisUtterance) {
        speech.cancel();
        speech.speak(new SpeechSynthesisUtterance(page.innerText));
      }
    } else if (done) {
      next.focus();
      status.textContent = page.querySelector('.story-feedback')?.textContent ?? '';
    }
  }

  function go(direction) {
    const result = move(session, direction);
    if (result === 'locked') { status.textContent = current().item.type === 'mcq' ? 'Pick an answer to continue.' : 'Submit your explanation to continue.'; return; }
    stopMic();
    if (result === 'finished') finish(score(), graded.length);
    else render();
  }
  function listen() {
    stopMic();
    const field = page.querySelector('textarea');
    try {
      mic = new Recognition();
      mic.lang = document.documentElement.lang || 'en';
      mic.onresult = e => {
        field.value = [field.value, e.results[0][0].transcript].filter(Boolean).join(' ');
        session.drafts.set(current().item.id, field.value);
      };
      mic.onend = () => { mic = null; if (status.textContent === 'Listening…') status.textContent = ''; };
      mic.onerror = () => { status.textContent = 'Speech unavailable. Type your explanation below.'; };
      mic.start();
      status.textContent = 'Listening…';
    } catch { status.textContent = 'Speech unavailable. Type your explanation below.'; }
  }
  node.oninput = e => { if (e.target.matches('[data-draft]')) session.drafts.set(current().item.id, e.target.value); };
  node.onclick = e => {
    const target = e.target.closest('button');
    const item = current().item;
    if (!target) {
      if (!page.contains(e.target) || e.target.closest('textarea,input,label,a,select') || window.getSelection()?.toString()) return;
      const rect = page.getBoundingClientRect();
      go(e.clientX - rect.left < rect.width * .35 ? -1 : 1);
    } else if (target.hasAttribute('data-option') && !session.answers.has(item.id)) {
      const choice = Number(target.dataset.option);
      session.answers.set(item.id, choice);
      answer(item, choice);
      speech?.cancel?.();
      render(false);
    } else switch (target.dataset.action) {
      case 'exit': exit(); break;
      case 'next': go(1); break;
      case 'back': go(-1); break;
      case 'activity': activity(item.activityId); break;
      case 'alt':
        if (session.alternate.has(session.position)) session.alternate.delete(session.position);
        else session.alternate.add(session.position);
        render(); break;
      case 'speak': listen(); break;
      case 'submit': {
        const value = page.querySelector('textarea').value.trim();
        if (!value) { status.textContent = 'Add your explanation first.'; break; }
        stopMic();
        session.answers.set(item.id, value);
        render(false); break;
      }
    }
  };
  function key(e) {
    if (e.target.closest('textarea,input,select,[contenteditable=true]') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); }
  }
  document.addEventListener('keydown', key);
  render();
  return () => { stopMic(); speech?.cancel?.(); document.removeEventListener('keydown', key); };
}
