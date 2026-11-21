import { adventureMarkup, mountAdventure } from './adventure/game.mjs';
import { landscape, trails } from './adventure/levels.mjs';
import { LESSONS, RIVALS, TRAIL_LESSONS, TROPHIES, TUTORS, TUTOR_HELP } from './lumino-app/content.mjs?v=24';
import { LEVELS, SUBJECTS, subjectById, topicById } from './lumino-app/curriculum.mjs?v=24';
import { drawSky, hydrate, spr } from './lumino-app/pixel-art.mjs?v=24';
import { clearProgress, completeLesson, currentStreak, freshProgress, loadProgress, localDay, saveProgress } from './lumino-app/progress.mjs?v=24';

const stage = document.querySelector('#stage');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const sections = [
  ['learn', 'Learn', 'star', ''], ['ranks', 'Ranks', 'trophy', 'bronze'],
  ['streak', 'Streak', 'flame', ''], ['you', 'You', 'hero', ''],
];

let storage;
try { storage = window.localStorage; } catch {}
let state = loadProgress(storage);
let dispose;
let shortcut;

const tutor = () => TUTORS.find(item => item.id === state.tutor) || TUTORS[1];

function element(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function focusHeading(root) {
  const heading = root.querySelector('h1, h2, h3');
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

function mount(html) {
  dispose?.();
  dispose = undefined;
  const node = typeof html === 'string' ? element(html) : html;
  node.classList.add('enter');
  stage.replaceChildren(node);
  hydrate(node);
  focusHeading(node);
  return node;
}

function persist() {
  if (saveProgress(storage, state)) return;
  const notice = document.querySelector('#storage-notice') || element('<p class="storage-notice" id="storage-notice" role="status"></p>');
  notice.textContent = 'Progress will only be available until you close this page.';
  if (!notice.isConnected) document.body.append(notice);
}

function click(root, selector, action) {
  root.querySelector(selector).addEventListener('click', action);
}

function dots(total, filled) {
  return `<div class="dots" aria-hidden="true">${Array.from({ length: total }, (_, index) =>
    `<i class="${index < filled ? 'on' : ''}"></i>`).join('')}</div>`;
}

function tutorDialogue(person, pose, title, body, heading = 'h3') {
  return `<div class="tutor-dialogue" data-tutor-dialogue="${person.id}" data-pose="${pose}">
    <div class="tutor-dialogue-portrait" aria-hidden="true"></div>
    <div class="tutor-dialogue-copy">
      <${heading} class="tutor-dialogue-title">${title}</${heading}>
      ${body}
    </div>
  </div>`;
}

function screen(title, body, { back, backLabel = 'Back', side = '' } = {}) {
  const node = mount(`<section class="screen${state.onboarded ? '' : ' onboarding'}">
    ${back || side ? `<div class="topline">${back ? `<button type="button" class="textbtn" data-back>← ${backLabel}</button>` : '<span></span>'}${side}</div>` : ''}
    <h2>${title}</h2>${body}
  </section>`);
  if (back) click(node, '[data-back]', back);
  return node;
}

function story(slides, { label, onDone, start = 0, skipLabel = 'Skip story', dialogue = false }) {
  const node = mount(`<section class="story${dialogue ? ' story--dialogue' : ''}" aria-label="${label}">
    <div class="story-content"></div>
    <div class="story-footer" role="group" aria-label="Story controls">
      <button class="story-edge" type="button" data-prev aria-label="Previous slide"><span aria-hidden="true">‹</span></button>
      <div class="story-tools">
        <div class="bars" aria-hidden="true">${slides.map(() => '<i><b></b></i>').join('')}</div>
        <span class="sr" data-story-position aria-live="polite"></span>
        <div class="story-actions">
          <button class="textbtn" type="button" data-pause>Pause</button>
          <button class="textbtn" type="button" data-skip>${skipLabel}</button>
        </div>
      </div>
      <button class="story-edge" type="button" data-next aria-label="Next slide"><span aria-hidden="true">›</span></button>
    </div>
    <div class="ground" aria-hidden="true"></div>
  </section>`);
  const content = node.querySelector('.story-content');
  const footer = node.querySelector('.story-footer');
  const prev = node.querySelector('[data-prev]');
  const pause = node.querySelector('[data-pause]');
  const next = node.querySelector('[data-next]');
  const position = node.querySelector('[data-story-position]');
  const fills = [...node.querySelectorAll('.bars b')];
  let index = start;
  let paused = false;
  let pointer = null;
  let tappedEdge = null;
  let elapsed = 0;
  let lastTime;
  let animation;
  let dead = false;
  let reduced = motion.matches;

  function paint() {
    fills.forEach((bar, i) => {
      const fill = i < index ? 1 : i > index ? 0 : reduced ? 1 : elapsed / slides[index].duration;
      bar.style.transform = `scaleX(${Math.min(1, fill)})`;
    });
  }

  function show(moveFocus) {
    elapsed = 0;
    content.innerHTML = slides[index].html;
    hydrate(content);
    content.scrollTop = 0;
    prev.disabled = index === 0;
    next.setAttribute('aria-label', index === slides.length - 1 ? 'Continue' : 'Next slide');
    position.textContent = `Slide ${index + 1} of ${slides.length}`;
    if (moveFocus) focusHeading(content);
    paint();
  }

  function advance(offset) {
    if (dead || index + offset < 0) return;
    if (index + offset >= slides.length) {
      onDone();
      return;
    }
    const active = document.activeElement;
    index += offset;
    show(content.contains(active) || active === prev && index === 0);
  }

  function tick(time) {
    const delta = lastTime === undefined ? 0 : Math.min(100, time - lastTime);
    lastTime = time;
    if (reduced !== motion.matches) {
      reduced = motion.matches;
      paint();
    }
    if (!reduced && !paused && pointer === null && !document.hidden && !footer.querySelector(':focus-visible:not([data-pause])')) {
      elapsed += delta;
      if (elapsed >= slides[index].duration) advance(1);
      else paint();
    }
    if (!dead) animation = requestAnimationFrame(tick);
  }

  const input = new AbortController();
  node.addEventListener('pointerdown', event => {
    if (!event.isPrimary) {
      pointer = null;
      return;
    }
    if (event.button !== 0) return;
    const edge = event.target.closest('.story-edge');
    if (edge) {
      tappedEdge = null;
      if (edge.disabled || event.pointerType === 'mouse') return;
    } else if (!content.contains(event.target) || event.target.closest('button, a, input, select, textarea, summary')) {
      return;
    }
    const bounds = node.getBoundingClientRect();
    pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      edge,
      canSwipe: !edge && event.pointerType !== 'mouse' && event.clientX >= bounds.left + 24 && event.clientX <= bounds.right - 24,
    };
  });
  function movedTooFar(event, gesture) {
    return Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 12;
  }
  function release(event) {
    if (event.pointerId !== pointer?.id) return;
    const gesture = pointer;
    pointer = null;
    if (event.type !== 'pointerup') return;
    if (gesture.edge) {
      if (!movedTooFar(event, gesture) && document.elementFromPoint(event.clientX, event.clientY)?.closest('.story-edge') === gesture.edge) {
        tappedEdge = gesture.edge;
        advance(tappedEdge === prev ? -1 : 1);
      }
      return;
    }
    if (!gesture.canSwipe) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (Math.abs(dx) >= 48 && Math.abs(dx) >= Math.abs(dy) * 1.5) advance(dx > 0 ? -1 : 1);
  }
  window.addEventListener('pointermove', event => {
    if (pointer?.edge && event.pointerId === pointer.id && movedTooFar(event, pointer)) pointer = null;
  }, { signal: input.signal });
  window.addEventListener('pointerup', release, { signal: input.signal });
  window.addEventListener('pointercancel', release, { signal: input.signal });
  function clickEdge(event) {
    const edge = event.currentTarget;
    // The browser may emit a compatibility click after an already handled touch tap.
    if (edge === tappedEdge && (event.detail > 0 || event.pointerType)) {
      tappedEdge = null;
      return;
    }
    advance(edge === prev ? -1 : 1);
  }
  prev.addEventListener('click', clickEdge);
  next.addEventListener('click', clickEdge);
  click(node, '[data-skip]', onDone);
  click(node, '[data-pause]', () => {
    paused = !paused;
    pause.textContent = paused ? 'Resume' : 'Pause';
  });
  node.addEventListener('keydown', event => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      advance(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dispose = () => {
    dead = true;
    input.abort();
    cancelAnimationFrame(animation);
  };
  show(true);
  animation = requestAnimationFrame(tick);
}

const scene = (duration, html) => ({ duration, html });
const copy = (title, text = '') => `<div class="story-copy"><h2>${title}</h2>${text ? `<p class="muted">${text}</p>` : ''}</div>`;
const cast = (...sprites) => `<div class="story-cast">${sprites.join('')}</div>`;

function welcome(start = 0) {
  story([
    scene(6500, copy('Build your way through this.', 'Learn an idea with your tutor, then put it to work. Try a lesson or explore a trail and build a way across.')
      + cast(spr('hero', 7, '', 'bob'), spr('lantern', 7, '', 'lit'))),
    scene(7500, copy('How you learn here')
      + `<ol class="steps">
        <li><span class="num" aria-hidden="true">1</span><div><h3>Learn the idea</h3><p>A short, clear explanation from your tutor.</p></div></li>
        <li><span class="num" aria-hidden="true">2</span><div><h3>Put it to work</h3><p>Apply what you learned to a challenge in your subject.</p></div></li>
        <li><span class="num" aria-hidden="true">3</span><div><h3>Lock it in</h3><p>A quick recall check so it sticks.</p></div></li>
      </ol>` + cast(spr('hero', 5, '', 'bob'))),
    scene(6000, copy('A little every day', 'Build a streak, earn trophies and see how your XP compares in the sample league.')
      + cast(spr('flame', 10, '', 'pop'))),
  ], { label: 'Welcome to Lumino', start, onDone: chooseTutor });
}

function tutorChoices(selected, style = 'pick') {
  return `<div class="choices" role="group" aria-label="Tutor">${TUTORS.map(person =>
    `<button type="button" class="${style}" data-tutor="${person.id}" aria-pressed="${person.id === selected}">
      ${spr(person.id, 3)}<span><b>${person.name}</b><small class="muted">${person.tag}</small></span>
    </button>`).join('')}</div>`;
}

function bindTutorChoices(node, onChoose) {
  const choices = [...node.querySelectorAll('[data-tutor]')];
  for (const choice of choices) {
    choice.addEventListener('click', () => {
      for (const item of choices) item.setAttribute('aria-pressed', String(item === choice));
      onChoose(choice.dataset.tutor);
    });
  }
}

function chooseTutor() {
  let selected = tutor().id;
  const node = screen('Pick your tutor', `<p class="muted">You can switch whenever you like during a lesson.</p>
    ${tutorChoices(selected)}
    <div class="onboarding-cast" data-preview></div>
    <div class="footer-cta"><button type="button" class="btn block" data-continue></button></div>`,
  { back: () => welcome(2) });
  const preview = node.querySelector('[data-preview]');
  const next = node.querySelector('[data-continue]');
  function renderChoice() {
    const person = TUTORS.find(item => item.id === selected);
    preview.innerHTML = spr(person.id, 6, '', 'bob');
    hydrate(preview);
    next.textContent = `Continue with ${person.name}`;
  }
  bindTutorChoices(node, id => { selected = id; renderChoice(); });
  renderChoice();
  next.addEventListener('click', () => {
    state.tutor = selected;
    persist();
    meetTutor();
  });
}

function meetTutor() {
  const person = tutor();
  story([
    scene(6500, tutorDialogue(person, 'greeting', `Meet ${person.name}`,
      `<p>Hi, I’m ${person.name}. I’ll be right next to you while you learn. ${person.hi}</p>`, 'h2')),
    scene(5000, tutorDialogue(person, 'explaining', 'I explain ideas step by step.',
      '<div class="story-example">3x + 5 = 20<br>3x = 15<br>x = 5</div>', 'h2')),
    scene(5200, tutorDialogue(person, 'thinking', 'We try ideas together.',
      '<div class="story-blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>', 'h2')),
    scene(5000, tutorDialogue(person, 'encouraging', 'I check what stuck, then take you further.',
      `<div class="stars">${spr('star', 6)}${spr('star', 6)}${spr('star', 6)}</div>`, 'h2')),
  ], { label: 'Meet your tutor', onDone: chooseSubject, dialogue: true });
}

function chooseSubject() {
  const node = screen('What would you like to learn first?',
    `<div class="choices" role="group" aria-label="Subject">${SUBJECTS.map(subject =>
      `<button type="button" class="pick" data-subject="${subject.id}">${spr(subject.icon, 3)}<b>${subject.name}</b></button>`).join('')}</div>
    <div class="onboarding-cast">${spr(tutor().id, 5, '', 'bob')}</div>`,
    { back: chooseTutor, backLabel: 'Change tutor' });
  for (const button of node.querySelectorAll('[data-subject]')) {
    button.addEventListener('click', () => {
      state.subject = button.dataset.subject;
      persist();
      chooseTopic(subjectById(state.subject), false);
    });
  }
}

function chooseTopic(subject, fromHome, focusedTopic) {
  const plan = state.plans[subject.id];
  const openTopic = focusedTopic ?? plan?.topicId ?? subject.starterTopic;
  const node = screen('Choose your topic', `<p class="muted">${subject.name}</p>
    <div class="topic-groups">${subject.groups.map(group => {
      const open = group.topics.some(topic => topic.id === openTopic);
      return `<details class="topic-group"${open ? ' open' : ''}>
        <summary>${group.name}</summary>
        <div class="choices">${group.topics.map(topic => {
          const level = LEVELS.find(item => item.id === plan?.levels[topic.id]);
          const label = level?.name ?? (topic.id === subject.starterTopic ? 'Starter lesson available' : '');
          return `<button type="button" class="choice" data-topic="${topic.id}">
            <span><b>${topic.name}</b>${label ? `<small>${label}</small>` : ''}</span></button>`;
        }).join('')}</div>
      </details>`;
    }).join('')}</div>`,
  { back: fromHome ? () => home('learn') : chooseSubject, backLabel: fromHome ? 'Back to Learn' : 'Change subject' });
  for (const button of node.querySelectorAll('[data-topic]')) {
    button.addEventListener('click', () => chooseLevel(subject, topicById(subject, button.dataset.topic), fromHome));
  }
}

function starterAvailable(subject, topic, level) {
  return subject.starterTopic === topic.id && level.id === 'beginner';
}

function chooseLevel(subject, topic, fromHome, recommendation) {
  const saved = state.plans[subject.id]?.levels[topic.id];
  const node = screen('Choose your starting level', `<div class="level-context">
    <p class="muted">${subject.name} · ${topic.name}</p>
    <button type="button" class="textbtn" data-help-level>Help me choose</button>
    </div>
    <div class="choices" role="group" aria-label="Starting level">${LEVELS.map(level => {
      const recommended = recommendation === level.id;
      const note = recommended ? ' · Recommended' : saved === level.id ? ' · Your current level' : '';
      const availability = starterAvailable(subject, topic, level) ? 'Starter lesson available' : 'Lesson coming soon';
      return `<button type="button" class="choice level-choice${recommended ? ' level-recommended' : ''}" data-level="${level.id}">
        <span><b>${level.name}</b><small>${level.description}</small>
          <span class="level-goal">${topic.goals[level.id]}</span>
          <small class="level-status">${availability}${note}</small>
        </span></button>`;
    }).join('')}
      <div class="level-preview"><span><b>Senior</b><small>AS &amp; A Level · Coming later</small></span></div>
    </div>`,
  { back: () => chooseTopic(subject, fromHome, topic.id), backLabel: 'Change topic' });
  for (const button of node.querySelectorAll('[data-level]')) {
    const level = LEVELS.find(item => item.id === button.dataset.level);
    button.addEventListener('click', () => reviewPlan(subject, topic, level, fromHome, recommendation));
  }
  click(node, '[data-help-level]', () => confidenceCheck(subject, topic, fromHome));
}

function confidenceCheck(subject, topic, fromHome) {
  let index = 0;
  let recommendation;
  const node = screen('Help me choose', `<div data-dots></div>
    ${tutorDialogue(tutor(), 'thinking', tutor().name, `<p>Think about ${topic.name}. Could you do this on your own?</p>`)}
    <div class="qcard" data-question aria-live="polite"></div>
    <div class="answers">
      <button type="button" class="ans yes" data-confidence="yes">Yes</button>
      <button type="button" class="ans maybe" data-confidence="maybe">Maybe</button>
      <button type="button" class="ans" data-confidence="not-yet">Not yet</button>
    </div>`, {
    back: () => chooseLevel(subject, topic, fromHome),
    backLabel: 'Back to levels',
    side: '<span class="muted" data-count></span>',
  });
  function draw() {
    node.querySelector('[data-question]').textContent = topic.goals[LEVELS[index].id];
    node.querySelector('[data-count]').textContent = `Question ${index + 1} of ${LEVELS.length}`;
    node.querySelector('[data-dots]').innerHTML = dots(LEVELS.length, index);
  }
  const buttons = [...node.querySelectorAll('[data-confidence]')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (button.dataset.confidence !== 'yes') recommendation ??= LEVELS[index].id;
      index++;
      if (index === LEVELS.length) {
        chooseLevel(subject, topic, fromHome, recommendation ?? 'advanced');
      } else {
        draw();
      }
    });
  }
  node.addEventListener('keydown', event => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || !/^[123]$/.test(event.key)) return;
    buttons[Number(event.key) - 1].click();
  });
  draw();
}

function topicPlanCard(subject, topic, level, offerLesson = false) {
  const ready = level && starterAvailable(subject, topic, level);
  return `<article class="card cur topic-plan">
    <span class="tag-label">${level?.name ?? 'Starting level to choose'}</span>
    <h3>${topic.name}</h3>
    ${level ? `<p>${topic.goals[level.id]}</p>
      ${ready && offerLesson ? `<button type="button" class="textbtn" data-topic-lesson>${LESSONS[subject.id].title} →</button>`
        : `<span class="tag">${ready ? 'Starter lesson available' : 'Lesson coming soon'}</span>`}` : ''}
  </article>`;
}

function reviewPlan(subject, topic, level, fromHome, recommendation) {
  const node = screen('Your learning plan', `
    ${topicPlanCard(subject, topic, level)}
    <button type="button" class="btn block" data-continue>Confirm my plan</button>`, {
    back: () => chooseLevel(subject, topic, fromHome, recommendation),
    backLabel: 'Change level',
    side: `<span class="muted">${subject.name}</span>`,
  });
  click(node, '[data-continue]', () => {
    const levels = { ...state.plans[subject.id]?.levels, [topic.id]: level.id };
    state.plans[subject.id] = { topicId: topic.id, levels };
    state.subject = subject.id;
    persist();
    if (fromHome) home('learn');
    else welcomeOffer();
  });
}

function welcomeOffer() {
  const subject = subjectById(state.subject);
  const topic = topicById(subject, state.plans[subject.id].topicId);
  const available = !state.rechargeGiven;
  const node = screen(available ? 'Start now and get a free streak recharge.' : 'Ready for your first lesson?',
    `<div class="offer-icon">${spr('bolt', 10, '', 'bob')}</div>
    <p class="muted">Try your ${subject.name} starter, <strong>${LESSONS[subject.id].title}</strong>, with ${tutor().name}.${available ? ' Finish it to earn a recharge that protects your streak if you miss a day.' : ''}</p>
    <div class="footer-cta">
      <button type="button" class="btn banana block" data-start>Start starter lesson</button>
      <button type="button" class="textbtn" data-skip>Not now</button>
    </div>`, { back: () => chooseLevel(subject, topic, false), backLabel: 'Change level' });
  node.classList.add('offer');
  click(node, '[data-start]', () => lesson(subject.id, { fromOffer: true, welcomeReward: available }));
  click(node, '[data-skip]', () => {
    state.onboarded = true;
    persist();
    home('learn');
  });
}

function openTrail(id, { onBack = () => home('learn'), onWorkshop } = {}) {
  const page = mount(`<div class="trail-page">${adventureMarkup(id, onWorkshop ? 'Back to lesson' : 'Back to Learn')}</div>`);
  dispose = mountAdventure(page, id, { onBack, onWorkshop });
}

function lesson(sid, options = {}, initialStep = 0) {
  const { fromOffer = false, welcomeReward = false } = options;
  const content = LESSONS[sid];
  const trail = trails.find(item => item.id === TRAIL_LESSONS[sid]);
  const labels = ['Learn', 'Apply', 'Recall'];
  let step = initialStep;
  let correct = 0;
  let finished = false;
  let response = null;

  const node = mount(`<section class="screen" aria-label="Lesson">
    <div class="topline"><button type="button" class="textbtn" data-exit>✕ Exit lesson</button><span class="muted" data-step></span></div>
    <div data-dots></div><div data-lesson></div>
  </section>`);
  const lessonBody = node.querySelector('[data-lesson]');
  click(node, '[data-exit]', fromOffer ? welcomeOffer : () => home('learn'));

  function lessonTutor() {
    const person = tutor();
    const pose = response?.right ? 'encouraging' : step ? 'thinking' : 'greeting';
    return `<div class="lesson-tutor">
      ${tutorDialogue(person, pose, person.name, `
        <p class="tutor-dialogue-feedback" data-feedback data-result="${response?.right ? 'right' : 'retry'}" role="status">${response?.message ?? ''}</p>
        <button class="textbtn tutor-help" type="button" data-hint>
          ${step ? 'Give me a hint' : 'Explain it another way'}
        </button>
        <p data-help aria-live="polite"></p>`)}
      <details class="switch-tutor"><summary>Switch tutor</summary>${tutorChoices(person.id, 'choice')}</details>
    </div>`;
  }

  function bindHelp(container) {
    const dialogue = container.querySelector('[data-tutor-dialogue]');
    click(container, '[data-hint]', () => {
      container.querySelector('[data-help]').textContent = TUTOR_HELP[sid][tutor().id][step];
      dialogue.dataset.pose = 'explaining';
    });
    bindTutorChoices(container, id => {
      state.tutor = id;
      persist();
      const replacement = element(lessonTutor());
      container.replaceWith(replacement);
      hydrate(replacement);
      bindHelp(replacement);
      replacement.querySelector('summary').focus();
    });
  }

  function nextStep() {
    if (step === 2) {
      if (finished) return;
      finished = true;
      const result = completeLesson(state, sid, correct, welcomeReward);
      persist();
      results(result);
    } else {
      step++;
      draw();
    }
  }

  function draw() {
    response = null;
    node.querySelector('[data-step]').textContent = `${labels[step]} · ${step + 1} of 3`;
    node.querySelector('[data-dots]').innerHTML = dots(3, step + 1);
    const question = step === 1 ? content.apply : content.recall;
    const trailLink = trail ? `<div class="lesson-trail">
      <img src="${landscape(trail)}" alt="">
      <div><p class="muted">Optional trail</p><button type="button" class="textbtn" data-play-trail>Explore ${trail.name}</button></div>
    </div>` : '';

    lessonBody.innerHTML = step === 0
      ? `<article class="lesson-card"><span class="tag-label">New idea</span><h2>${content.title}</h2><p>${content.learn}</p><div class="ex">${content.ex}</div></article>
        ${lessonTutor()}${trailLink}
        <div class="footer-cta"><button class="btn block" type="button" data-next>Continue to Apply</button></div>`
      : `<div class="lesson-card"><span class="tag-label">${step === 1 ? content.applyLabel : 'Quick recall'}</span><h2>${question.q}</h2></div>
        <div class="choices lesson-answers" role="group" aria-label="Answers">
          ${question.o.map((answer, index) => `<button class="choice" type="button" data-answer="${index}"><b>${answer}</b></button>`).join('')}
        </div>${lessonTutor()}<div class="footer-cta" data-answer-actions></div>`;

    if (!step) {
      click(lessonBody, '[data-next]', nextStep);
      if (trail) click(lessonBody, '[data-play-trail]', () => openTrail(trail.id, {
        onBack: () => lesson(sid, options),
        onWorkshop: () => lesson(sid, options, 1),
      }));
    } else {
      const answers = [...lessonBody.querySelectorAll('[data-answer]')];
      for (const [index, button] of answers.entries()) {
        button.addEventListener('click', () => {
          const right = index === question.a;
          if (right) correct++;
          answers.forEach(answer => { answer.disabled = true; });
          answers[question.a].classList.add('right');
          if (!right) button.classList.add('wrong');
          response = { right, message: `<strong>${right ? 'That’s right.' : 'Not quite.'}</strong> ${question.why}` };
          lessonBody.querySelector('[data-tutor-dialogue]').dataset.pose = right ? 'encouraging' : 'thinking';
          const feedback = lessonBody.querySelector('[data-feedback]');
          feedback.dataset.result = right ? 'right' : 'retry';
          feedback.innerHTML = response.message;
          const actions = lessonBody.querySelector('[data-answer-actions]');
          actions.innerHTML = `<button type="button" class="btn block" data-next>${step === 2 ? 'See my results' : 'Continue to Recall'}</button>`;
          click(actions, '[data-next]', nextStep);
          actions.querySelector('[data-next]').focus();
        });
      }
    }
    hydrate(lessonBody);
    bindHelp(lessonBody.querySelector('.lesson-tutor'));
    node.scrollTop = 0;
    focusHeading(lessonBody);
  }
  draw();
}

function weekRow() {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const practiced = state.days.includes(localDay(date));
    const label = date.toLocaleDateString(undefined, { weekday: 'short' });
    return `<li class="${index === 6 ? 'today' : ''}" aria-label="${label}: ${practiced ? 'Lesson completed' : 'No lesson recorded'}">
      ${spr('flame', 3, practiced ? '' : 'off')}<span aria-hidden="true">${label}</span></li>`;
  });
  return `<ol class="week" aria-label="Last seven days">${days.join('')}</ol>`;
}

function ranksTable(xp) {
  const rows = [...RIVALS.map(([name, score]) => ({ name, score, learner: false })), { name: 'You', score: xp, learner: true }]
    .sort((a, b) => b.score - a.score || Number(a.learner) - Number(b.learner));
  return `<ol class="sample-league">${rows.map(({ name, score, learner }, index) =>
    `<li class="${learner ? 'me' : ''}"><span class="rank">${index + 1}</span><span class="rank-name">${name}${learner ? '' : ' <small>Example</small>'}</span><span class="rank-xp">${score} XP</span></li>`).join('')}</ol>`;
}

function results({ correct, gain, firstEver, claimed }) {
  const stars = [1, 2, 3].map(index => spr('star', 6, index <= correct + 1 ? '' : 'off')).join('');
  story([
    scene(5500, copy(gain ? 'Lesson complete' : 'Practice complete')
      + `<div class="results-summary"><div class="stars">${stars}</div><div class="big">+${gain}</div>
        <p class="muted">XP earned · ${correct} of 2 challenges right first time</p>
        ${claimed ? '<p class="muted">You earned a streak recharge.</p>' : ''}</div>`),
    scene(5500, copy('Your streak')
      + `<div class="results-summary">${spr('flame', 8, '', 'pop')}<div class="big">${currentStreak(state)}</div>
        <p class="muted">${currentStreak(state) === 1 ? 'Day streak' : 'Days in a row'}</p>${weekRow()}</div>`),
    scene(6500, copy('Sample league', 'Compare your XP with fictional example scores.') + ranksTable(state.xp)),
  ], {
    label: 'Your results',
    skipLabel: 'Skip results',
    onDone: () => {
      if (firstEver && !state.commit) chooseGoal(true);
      else home('learn');
    },
  });
}

function chooseGoal(first) {
  let selected = state.commit || TROPHIES[0].d;
  const node = screen(first ? 'Commit to a streak' : 'Streak goal', `<p class="muted">Choose a goal and earn a trophy when you reach it.</p>
    <div class="trophies" role="group" aria-label="Streak goal">${TROPHIES.map(trophy =>
      `<button class="pick" type="button" data-days="${trophy.d}" aria-pressed="${trophy.d === selected}">
        ${spr('trophy', 4, trophy.tone)}<b>${trophy.d} days</b><span class="t">${trophy.name} trophy</span></button>`).join('')}</div>
    <div class="footer-cta">
      <button type="button" class="btn banana block" data-commit>Save goal</button>
      <button type="button" class="textbtn" data-skip>${first ? 'Not now' : 'Cancel'}</button>
    </div>`);
  const choices = [...node.querySelectorAll('[data-days]')];
  for (const button of choices) {
    button.addEventListener('click', () => {
      selected = Number(button.dataset.days);
      choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    });
  }
  const next = () => home(first ? 'learn' : 'streak');
  click(node, '[data-skip]', next);
  click(node, '[data-commit]', () => {
    state.commit = selected;
    persist();
    next();
  });
}

function bindDock(node, scrollport, content) {
  const tabs = node.querySelector('#section-tabs');
  const expand = node.querySelector('[data-expand-dock]');
  const current = tabs.querySelector('[aria-current="page"]');
  const input = new AbortController();
  const threshold = 12;
  let lastTop = 0;
  let lastRange = -1;
  let travel = 0;

  function setCompact(compact) {
    if (compact === tabs.hidden) return;
    const focused = document.activeElement;
    tabs.hidden = compact;
    expand.hidden = !compact;
    expand.setAttribute('aria-expanded', String(!compact));
    if (compact && tabs.contains(focused)) expand.focus({ preventScroll: true });
    if (!compact && focused === expand) current.focus({ preventScroll: true });
  }

  function trackScroll() {
    const range = scrollport.scrollHeight - scrollport.clientHeight;
    const top = Math.max(0, Math.min(range, scrollport.scrollTop));
    const delta = top - lastTop;
    lastTop = top;
    if (range !== lastRange || top <= 1) {
      lastRange = range;
      travel = 0;
      if (range < threshold || top <= 1) setCompact(false);
      return;
    }
    if (!delta) return;
    travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
    if (Math.abs(travel) < threshold) return;
    if (travel < 0 || !tabs.querySelector(':focus-visible')) setCompact(travel > 0);
    travel = 0;
  }

  expand.addEventListener('click', () => {
    travel = 0;
    setCompact(false);
    if (document.activeElement !== current) current.focus({ preventScroll: true });
  }, { signal: input.signal });
  scrollport.addEventListener('scroll', trackScroll, { passive: true, signal: input.signal });
  let resize;
  if ('ResizeObserver' in window) {
    resize = new ResizeObserver(trackScroll);
    resize.observe(scrollport);
    resize.observe(content);
  }
  trackScroll();
  return () => {
    input.abort();
    resize?.disconnect();
  };
}

function renderShortcut() {
  if (!shortcut) return;
  stage.querySelector('.home .adventure-card')?.insertAdjacentHTML('beforebegin', shortcut.offer);
  stage.querySelector('.profile-actions')?.insertAdjacentHTML('afterbegin', shortcut.help);
  shortcut.refresh();
}

function home(tab) {
  const [, label, icon, tone] = sections.find(([id]) => id === tab);
  const node = mount(`<div class="home">
    <header class="topbar"><a class="brand" href="../"><span class="mark sm" aria-hidden="true">L</span>Lumino</a>
      <div class="stats" aria-label="Your stats">
        <span class="stat" title="Day streak">${spr('flame', 2)}${currentStreak(state)}<span class="sr"> day streak</span></span>
        <span class="stat" title="Streak recharges">${spr('bolt', 2)}${state.recharges}<span class="sr"> streak recharges</span></span>
        <span class="stat" title="XP">${spr('star', 2)}${state.xp}<span class="sr"> XP</span></span>
      </div>
    </header>
    <div class="body"><div class="home-content"></div></div>
    <nav class="dock" aria-label="Sections">
      <div class="tabs" id="section-tabs">${sections.map(([id, name, sprite, color]) =>
        `<button type="button" class="tab" data-tab="${id}" ${id === tab ? 'aria-current="page"' : ''}>${spr(sprite, 2, color)}${name}</button>`).join('')}</div>
      <button type="button" class="dock-expand" data-expand-dock aria-controls="section-tabs" aria-expanded="true" aria-label="${label}. Show all sections" hidden>
        ${spr(icon, 2, tone)}${label}<span class="dock-chevron" aria-hidden="true"></span>
      </button>
    </nav>
    </div>`);
  const scrollport = node.querySelector('.body');
  const body = scrollport.querySelector('.home-content');
  ({ learn: learnTab, ranks: ranksTab, streak: streakTab, you: youTab })[tab](body);
  hydrate(body);
  renderShortcut();
  const selected = body.querySelector('.subj-tabs [aria-pressed="true"]');
  if (selected) {
    const scroller = selected.parentElement;
    const bounds = scroller.getBoundingClientRect();
    const chip = selected.getBoundingClientRect();
    scroller.scrollLeft += Math.min(0, chip.left - bounds.left) || Math.max(0, chip.right - bounds.right);
  }
  focusHeading(body);
  dispose = bindDock(node, scrollport, body);
  for (const button of node.querySelectorAll('[data-tab]')) {
    button.addEventListener('click', () => {
      if (button.dataset.tab !== tab) home(button.dataset.tab);
    });
  }
}

function learnTab(body) {
  const subject = subjectById(state.subject) || SUBJECTS[0];
  const plan = state.plans[subject.id];
  const done = state.completed.includes(subject.id);
  const topic = topicById(subject, plan?.topicId);
  const level = LEVELS.find(item => item.id === plan?.levels[topic?.id]);
  body.innerHTML = `<div class="subj-tabs" role="group" aria-label="Subjects">${SUBJECTS.map(item =>
    `<button type="button" class="chip" data-subject="${item.id}" aria-pressed="${item.id === subject.id}">
      ${spr(item.icon, 2)}${item.name}</button>`).join('')}</div>
    <div class="maphead"><h2>${subject.name}</h2>
      <button type="button" class="textbtn" data-edit>${topic ? 'Edit learning plan' : 'Choose a topic'}</button></div>
    <div class="starter-card card cur">
      <div><span class="tag-label">${done ? 'Completed' : 'Starter lesson'}</span><h3>${LESSONS[subject.id].title}</h3></div>
      <button type="button" class="btn" data-begin>${done ? 'Practice again' : 'Begin lesson'}</button></div>
    <section class="adventure-card" aria-labelledby="trail-card-title">
      <div><h3 id="trail-card-title">Landscape trails</h3><p>Explore six landscapes, build a crossing and power the canyon relay.</p>
        <button class="btn" type="button" data-explore>Explore the trails</button></div>
    </section>
    ${topic ? `<h3 class="section-title">Your learning plan</h3>${topicPlanCard(subject, topic, level, true)}` : ''}`;
  for (const button of body.querySelectorAll('[data-subject]')) {
    button.addEventListener('click', () => {
      state.subject = button.dataset.subject;
      persist();
      home('learn');
      stage.querySelector(`[data-subject="${state.subject}"]`).focus({ preventScroll: true });
    });
  }
  click(body, '[data-edit]', () => chooseTopic(subject, true));
  click(body, '[data-begin]', () => lesson(subject.id));
  if (level && topic && starterAvailable(subject, topic, level)) {
    click(body, '[data-topic-lesson]', () => lesson(subject.id));
  }
  click(body, '[data-explore]', () => openTrail('wheat'));
}

function ranksTab(body) {
  body.innerHTML = `<h2 class="section-title">Sample league</h2>
    <p class="muted section-description">Compare your XP with fictional example scores. Your XP is saved on this device.</p>
    ${ranksTable(state.xp)}`;
}

function streakTab(body) {
  const goal = state.commit;
  const active = currentStreak(state);
  body.innerHTML = `<h2 class="section-title">Your streak</h2>
    <div class="streak-count">${spr('flame', 8, active ? '' : 'off')}
      <div><div class="big">${active}</div><span class="muted">${active === 1 ? 'Day streak' : 'Days in a row'}</span></div>
    </div>${weekRow()}
    <div class="empty streak-goal">
      <b>${goal ? `Goal of ${goal} days` : 'No streak goal yet'}</b>
      ${goal ? `<progress value="${Math.min(state.bestStreak, goal)}" max="${goal}" aria-label="Best streak toward your goal"></progress>
        <span class="muted">Best streak: ${state.bestStreak} days</span>` : '<span class="muted">Pick a goal to earn a trophy.</span>'}
      <span class="muted">${state.recharges} streak recharge${state.recharges === 1 ? '' : 's'} available</span>
      <button class="textbtn" type="button" data-goal>${goal ? 'Change streak goal' : 'Set a streak goal'}</button>
    </div>
    <h3 class="section-title">Trophies</h3><div class="trophies">${TROPHIES.map(trophy => {
      const earned = state.bestStreak >= trophy.d;
      return `<div class="pick trophy">${spr('trophy', 4, earned ? trophy.tone : 'off')}<b>${trophy.d} days</b>
        <span class="t">${trophy.name}${earned ? ' · Earned' : ''}</span></div>`;
    }).join('')}</div>`;
  click(body, '[data-goal]', () => chooseGoal(false));
}

function youTab(body) {
  body.innerHTML = `<h2 class="section-title">Your tutor</h2>${tutorChoices(tutor().id, 'choice')}
    ${state.previous.length ? `<section class="previous-achievements"><h3 class="section-title">Prior achievements</h3>
      <p class="muted">Starter lessons you completed before this update</p>
      <ul>${state.previous.map(id => `<li>${subjectById(id).name}</li>`).join('')}</ul></section>` : ''}
    <div class="footer-cta profile-actions">
      <a class="textbtn" href="../about.html">About Lumino ↗</a>
      <button type="button" class="btn danger" data-reset>Reset my progress</button>
      <p class="muted" data-reset-status role="status"></p>
    </div>`;
  bindTutorChoices(body, id => {
    state.tutor = id;
    persist();
  });
  click(body, '[data-reset]', () => {
    if (!window.confirm('Erase your Lumino progress on this device, including prior achievements?')) return;
    if (!clearProgress(storage)) {
      body.querySelector('[data-reset-status]').textContent = 'Progress could not be cleared. Please try again.';
      return;
    }
    state = freshProgress();
    welcome();
  });
}

drawSky();
if (state.onboarded) home('learn');
else if (!state.tutor) welcome();
else if (!state.subject) chooseSubject();
else {
  const subject = subjectById(state.subject);
  const plan = state.plans[subject.id];
  if (!plan) chooseTopic(subject, false);
  else if (plan.levels[plan.topicId]) welcomeOffer();
  else chooseLevel(subject, topicById(subject, plan.topicId), false);
}

import('./lumino-app/shortcut.mjs?v=22')
  .then(({ setupShortcut }) => {
    shortcut = setupShortcut(stage, storage);
    renderShortcut();
  })
  .catch(error => console.warn('Lumino shortcut unavailable.', error));
