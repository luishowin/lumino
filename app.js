import { adventureMarkup, mountAdventure } from './adventure/game.mjs';
import { landscape, trails } from './adventure/levels.mjs';
import { LESSONS, RIVALS, SUBJECTS, TRAIL_LESSONS, TROPHIES, TUTORS, TUTOR_HELP } from './lumino-app/content.mjs';
import { drawGround, drawSky, hydrate, spr } from './lumino-app/pixel-art.mjs';
import { clearProgress, completeLesson, currentStreak, freshProgress, loadProgress, localDay, saveProgress } from './lumino-app/progress.mjs';

const stage = document.querySelector('#stage');
const frame = document.querySelector('#frame');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const sections = [
  ['learn', 'Learn', 'star', ''], ['ranks', 'Ranks', 'trophy', 'bronze'],
  ['streak', 'Streak', 'flame', ''], ['you', 'You', 'hero', ''],
];

let storage;
try { storage = window.localStorage; } catch {}
let state = loadProgress(storage);
let dispose;

const subjectById = id => SUBJECTS.find(subject => subject.id === id);
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

function mount(html, layout = '') {
  dispose?.();
  dispose = undefined;
  frame.classList.toggle('wide', layout === 'wide');
  frame.classList.toggle('trail-frame', layout === 'trail');
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

function tutorRow(message, scale = 4) {
  return `<div class="tutorrow">${spr(tutor().id, scale)}<p class="bubble">${message}</p></div>`;
}

function screen(title, body, { back, backLabel = 'Back', side = '', wide = state.onboarded } = {}) {
  const node = mount(`<section class="screen">
    ${back || side ? `<div class="topline">${back ? `<button type="button" class="textbtn" data-back>← ${backLabel}</button>` : '<span></span>'}${side}</div>` : ''}
    <h2>${title}</h2>${body}
  </section>`, wide ? 'wide' : '');
  if (back) click(node, '[data-back]', back);
  return node;
}

function story(slides, { label, onDone, start = 0, skipLabel = 'Skip story' }) {
  const node = mount(`<section class="story" aria-label="${label}">
    <div class="story-toolbar">
      <div class="bars" aria-hidden="true">${slides.map(() => '<i><b></b></i>').join('')}</div>
      <div class="story-controls" aria-label="Story controls">
        <button class="textbtn" type="button" data-prev>Back</button>
        <button class="textbtn" type="button" data-pause aria-pressed="false">Pause</button>
        <button class="textbtn" type="button" data-skip>${skipLabel}</button>
        <button class="btn story-next" type="button" data-next>Next →</button>
      </div>
    </div>
    <div class="story-content"></div><div class="ground" aria-hidden="true"></div>
  </section>`);
  const content = node.querySelector('.story-content');
  const prev = node.querySelector('[data-prev]');
  const pause = node.querySelector('[data-pause]');
  const next = node.querySelector('[data-next]');
  const fills = [...node.querySelectorAll('.bars b')];
  let index = start;
  let paused = false;
  let pointer = null;
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
    next.textContent = index === slides.length - 1 ? 'Continue →' : 'Next →';
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
    if (!reduced && !paused && pointer === null && !document.hidden) {
      elapsed += delta;
      if (elapsed >= slides[index].duration) advance(1);
      else paint();
    }
    if (!dead) animation = requestAnimationFrame(tick);
  }

  const input = new AbortController();
  content.addEventListener('pointerdown', event => { pointer = event.pointerId; });
  function release(event) {
    if (event.pointerId === pointer) pointer = null;
  }
  window.addEventListener('pointerup', release, { signal: input.signal });
  window.addEventListener('pointercancel', release, { signal: input.signal });
  click(node, '[data-prev]', () => advance(-1));
  click(node, '[data-next]', () => advance(1));
  click(node, '[data-skip]', onDone);
  click(node, '[data-pause]', () => {
    paused = !paused;
    pause.textContent = paused ? 'Play' : 'Pause';
    pause.setAttribute('aria-pressed', String(paused));
  });
  node.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
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
      + cast(spr('hero', 8, '', 'bob'), spr('lantern', 8, '', 'lit'))),
    scene(7500, copy('How you learn here')
      + `<ol class="steps">
        <li><span class="num" aria-hidden="true">1</span><div><h3>Learn the idea</h3><p>A short, clear explanation from your tutor.</p></div></li>
        <li><span class="num" aria-hidden="true">2</span><div><h3>Put it to work</h3><p>Apply what you learned to a challenge in your subject.</p></div></li>
        <li><span class="num" aria-hidden="true">3</span><div><h3>Lock it in</h3><p>A quick recall check so it sticks.</p></div></li>
      </ol>` + cast(spr('hero', 6, '', 'bob'))),
    scene(6000, copy('A little every day', 'Build a streak, earn trophies and see how your XP compares in the sample league.')
      + cast(spr('flame', 12, '', 'pop'))),
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
  { back: () => welcome(2), wide: false });
  const preview = node.querySelector('[data-preview]');
  const next = node.querySelector('[data-continue]');
  function renderChoice() {
    const person = TUTORS.find(item => item.id === selected);
    preview.innerHTML = spr(person.id, 7, '', 'bob');
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
    scene(6500, copy(`Meet ${person.name}`) + tutorRow(`Hi, I’m ${person.name}. I’ll be right next to you while you learn. ${person.hi}`, 8)),
    scene(5000, copy('I explain ideas step by step.')
      + '<div class="story-example">3x + 5 = 20<br>3x = 15<br>x = 5</div>' + cast(spr(person.id, 6, '', 'bob'), spr('hero', 6))),
    scene(5200, copy('We try ideas together.')
      + '<div class="story-blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'
      + cast(spr(person.id, 6, '', 'bob'))),
    scene(5000, copy('I check what stuck, then take you further.')
      + `<div class="stars">${spr('star', 7)}${spr('star', 7)}${spr('star', 7)}</div>` + cast(spr(person.id, 6, '', 'bob'))),
  ], { label: 'Meet your tutor', onDone: chooseSubject });
}

function chooseSubject() {
  const node = screen('What would you like to learn first?',
    `<div class="choices" role="group" aria-label="Subject">${SUBJECTS.map(subject =>
      `<button type="button" class="pick" data-subject="${subject.id}">${spr(subject.icon, 3)}<b>${subject.name}</b></button>`).join('')}</div>
    <div class="onboarding-cast">${spr(tutor().id, 6, '', 'bob')}</div>`,
    { back: chooseTutor, backLabel: 'Change tutor', wide: false });
  for (const button of node.querySelectorAll('[data-subject]')) {
    button.addEventListener('click', () => {
      state.subject = button.dataset.subject;
      persist();
      chooseLevel(state.subject, false);
    });
  }
}

function chooseLevel(sid, fromHome) {
  const subject = subjectById(sid);
  const node = screen('Choose your starting level',
    tutorRow(`Which level feels closest in ${subject.name}? We’ll fine-tune it next.`)
    + `<div class="choices" role="group" aria-label="Level">${subject.levels.map((level, index) =>
      `<button type="button" class="choice" data-level="${index}"><span><b>${level.n}</b><small>${level.d}</small></span></button>`).join('')}</div>`,
    { back: fromHome ? () => home('learn') : chooseSubject, backLabel: fromHome ? 'Back to Learn' : 'Change subject' });
  for (const button of node.querySelectorAll('[data-level]')) {
    button.addEventListener('click', () => confidenceCheck(sid, Number(button.dataset.level), fromHome));
  }
}

function confidenceCheck(sid, li, fromHome) {
  const questions = subjectById(sid).levels[li].q;
  let index = 0;
  let score = 0;
  const node = screen('Confidence check', `<div data-dots></div>
    ${tutorRow('Do you know how to do this? Just answer, no need to solve it.')}
    <div class="qcard" data-question aria-live="polite"></div>
    <div class="answers">
      <button type="button" class="ans yes" data-score="1">Yes</button>
      <button type="button" class="ans maybe" data-score=".5">Maybe</button>
      <button type="button" class="ans" data-score="0">No</button>
    </div>`, { back: () => chooseLevel(sid, fromHome), backLabel: 'Level', side: '<span class="muted" data-count></span>' });
  function draw() {
    node.querySelector('[data-question]').textContent = questions[index];
    node.querySelector('[data-count]').textContent = `Question ${index + 1} of ${questions.length}`;
    node.querySelector('[data-dots]').innerHTML = dots(questions.length, index);
  }
  function answer(value) {
    score += value;
    index++;
    if (index === questions.length) buildPlan(sid, li, score / questions.length, fromHome);
    else draw();
  }
  for (const button of node.querySelectorAll('[data-score]')) {
    button.addEventListener('click', () => answer(Number(button.dataset.score)));
  }
  node.addEventListener('keydown', event => {
    if (event.repeat || event.ctrlKey || event.metaKey || !['1', '2', '3'].includes(event.key)) return;
    answer([1, .5, 0][Number(event.key) - 1]);
  });
  draw();
}

function buildPlan(sid, li, confidence, fromHome) {
  if (motion.matches) {
    reviewPlan(sid, li, confidence, fromHome);
    return;
  }
  mount(`<section class="screen build" role="status">
    ${cast(spr(tutor().id, 7, '', 'bob'), spr('hero', 7))}
    <h2>Creating your learning plan</h2>
    <div class="loadbar plan-load" aria-hidden="true">${'<i></i>'.repeat(8)}</div>
  </section>`, fromHome ? 'wide' : '');
  const timer = setTimeout(() => reviewPlan(sid, li, confidence, fromHome), 750);
  dispose = () => clearTimeout(timer);
}

function roadmap(level, suggested) {
  return `<ol class="path">${level.t.map((topic, index) => `<li>
    <span class="node ${index === suggested ? 'cur' : ''}" aria-hidden="true">${index + 1}</span>
    <div class="card"><h3>${topic}</h3><span class="tag">${index === suggested ? 'Suggested starting point · ' : ''}Coming soon</span></div>
  </li>`).join('')}</ol>`;
}

function reviewPlan(sid, li, confidence, fromHome) {
  const subject = subjectById(sid);
  const level = subject.levels[li];
  const start = confidence >= .8 ? 2 : confidence >= .4 ? 1 : 0;
  const alternative = confidence >= .85 && li < 3 ? li + 1 : confidence < .3 && li > 0 ? li - 1 : null;
  const node = screen('Your learning plan', `${tutorRow(`Try the starter lesson first. I’d suggest ${level.t[start]} when the rest of this level opens.`)}
    ${alternative === null ? '' : `<div class="note"><button type="button" class="textbtn" data-level-change>Try ${subject.levels[alternative].n} instead</button></div>`}
    <div class="card cur"><span class="tag-label">Starter lesson</span><h3>${LESSONS[sid].title}</h3></div>
    ${roadmap(level, start)}
    <div class="footer-cta"><button type="button" class="btn block" data-continue>Confirm my plan</button></div>`,
    { back: () => chooseLevel(sid, fromHome), backLabel: 'Change level', side: `<span class="muted">${subject.name} · ${level.n}</span>` });
  if (alternative !== null) click(node, '[data-level-change]', () => confidenceCheck(sid, alternative, fromHome));
  click(node, '[data-continue]', () => {
    state.plans[sid] = { level: li, start };
    state.subject = sid;
    persist();
    if (fromHome) home('learn');
    else welcomeOffer();
  });
}

function welcomeOffer() {
  const available = !state.rechargeGiven;
  const node = screen(available ? 'Start now and get a free streak recharge.' : 'Ready for your first lesson?',
    `<div class="offer-icon">${spr('bolt', 12, '', 'bob')}</div>
    <p class="muted">${available ? 'A recharge protects your streak if you miss a day. Finish a short lesson with ' + tutor().name + ' to claim it.' : 'Try a lesson with ' + tutor().name + ' and put an idea to work.'}</p>
    <div class="footer-cta">
      <button type="button" class="btn banana block" data-start>Start now</button>
      <button type="button" class="textbtn" data-skip>Not now</button>
    </div>`, { back: () => chooseLevel(state.subject, false), backLabel: 'Change level', wide: false });
  node.classList.add('offer');
  click(node, '[data-start]', () => lesson(state.subject, { fromOffer: true, welcomeReward: available }));
  click(node, '[data-skip]', () => {
    state.onboarded = true;
    persist();
    home('learn');
  });
}

function openTrail(id, { onBack = () => home('learn'), onWorkshop } = {}) {
  const page = mount(`<div class="trail-page">${adventureMarkup(id, onWorkshop ? 'Back to lesson' : 'Back to Learn')}</div>`, 'trail');
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

  const node = mount(`<section class="screen" aria-label="Lesson">
    <div class="topline"><button type="button" class="textbtn" data-exit>✕ Exit lesson</button><span class="muted" data-step></span></div>
    <div data-dots></div><div data-lesson></div>
  </section>`, fromOffer ? '' : 'wide');
  const lessonBody = node.querySelector('[data-lesson]');
  click(node, '[data-exit]', fromOffer ? welcomeOffer : () => home('learn'));

  function lessonTutor() {
    return `<div class="lesson-tutor">
      <div class="tutorrow">${spr(tutor().id, 4, step ? 'thoughtful' : 'neutral')}<div class="bubble"><strong>${tutor().name}</strong>
        <p data-help aria-live="polite"></p><button class="textbtn tutor-help" type="button" data-hint>
          ${step ? 'Give me a hint' : 'Explain it another way'}</button></div></div>
      <details class="switch-tutor"><summary>Switch tutor</summary>${tutorChoices(tutor().id, 'choice')}</details>
    </div>`;
  }

  function bindHelp(container) {
    const portrait = container.querySelector('.tutorrow > .tutor-sprite');
    click(container, '[data-hint]', () => {
      container.querySelector('[data-help]').textContent = TUTOR_HELP[sid][tutor().id][step];
      portrait.dataset.tone = 'speaking';
    });
    bindTutorChoices(container, id => {
      state.tutor = id;
      persist();
      const replacement = element(lessonTutor());
      if (portrait.dataset.tone === 'delighted' || portrait.dataset.tone === 'encouraging') {
        replacement.querySelector('.tutorrow > [data-sprite]').dataset.tone = portrait.dataset.tone;
      }
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
        </div>${lessonTutor()}<div data-feedback role="status"></div>`;

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
          lessonBody.querySelector('.lesson-tutor .tutorrow > .tutor-sprite').dataset.tone = right ? 'delighted' : 'encouraging';
          const feedback = lessonBody.querySelector('[data-feedback]');
          feedback.innerHTML = `<div class="feedback ${right ? '' : 'no'}"><b>${right ? 'That’s right.' : 'Not quite.'}</b> ${question.why}</div>
            <div class="footer-cta"><button type="button" class="btn block" data-next>${step === 2 ? 'See my results' : 'Continue to Recall'}</button></div>`;
          click(feedback, '[data-next]', nextStep);
          feedback.querySelector('[data-next]').focus();
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
  const stars = [1, 2, 3].map(index => spr('star', 7, index <= correct + 1 ? '' : 'off')).join('');
  story([
    scene(5500, copy(gain ? 'Lesson complete' : 'Practice complete')
      + `<div class="results-summary"><div class="stars">${stars}</div><div class="big">+${gain}</div>
        <p class="muted">XP earned · ${correct} of 2 challenges right first time</p>
        ${claimed ? '<p class="muted">You earned a streak recharge.</p>' : ''}</div>`),
    scene(5500, copy('Your streak')
      + `<div class="results-summary">${spr('flame', 9, '', 'pop')}<div class="big">${currentStreak(state)}</div>
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
        ${spr('trophy', 5, trophy.tone)}<b>${trophy.d} days</b><span class="t">${trophy.name} trophy</span></button>`).join('')}</div>
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

function home(tab) {
  const node = mount(`<div class="home">
    <header class="topbar"><a class="brand" href="../"><span class="mark sm" aria-hidden="true">L</span>Lumino</a>
      <div class="stats" aria-label="Your stats">
        <span class="stat" title="Day streak">${spr('flame', 2)}${currentStreak(state)}<span class="sr"> day streak</span></span>
        <span class="stat" title="Streak recharges">${spr('bolt', 2)}${state.recharges}<span class="sr"> streak recharges</span></span>
        <span class="stat" title="XP">${spr('star', 2)}${state.xp}<span class="sr"> XP</span></span>
      </div>
    </header>
    <div class="body"></div>
    <nav class="tabs" aria-label="Sections">${sections.map(([id, label, icon, tone]) =>
      `<button type="button" class="tab" data-tab="${id}" ${id === tab ? 'aria-current="page"' : ''}>${spr(icon, 2, tone)}${label}</button>`).join('')}</nav>
    </div>`, 'wide');
  const body = node.querySelector('.body');
  ({ learn: learnTab, ranks: ranksTab, streak: streakTab, you: youTab })[tab](body);
  hydrate(body);
  body.querySelector('.subj-tabs [aria-pressed="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  focusHeading(body);
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
  const level = plan && subject.levels[plan.level];
  body.innerHTML = `<div class="subj-tabs" role="group" aria-label="Subjects">${SUBJECTS.map(item =>
    `<button type="button" class="chip" data-subject="${item.id}" aria-pressed="${item.id === subject.id}">
      ${spr(item.icon, 2)}${item.name}</button>`).join('')}</div>
    <div class="maphead"><div><h2>${subject.name}</h2>${level ? `<span class="muted">${level.n}</span>` : ''}</div>
      ${level ? '<button type="button" class="textbtn" data-edit>Edit learning plan</button>' : ''}</div>
    ${level ? `<div class="starter-card card cur">
      <div><span class="tag-label">${done ? 'Completed' : 'Starter lesson'}</span><h3>${LESSONS[subject.id].title}</h3></div>
      <button type="button" class="btn" data-begin>${done ? 'Practice again' : 'Begin lesson'}</button></div>`
      : `<div class="empty">${tutorRow(`You haven’t set up your ${subject.name} path yet. A quick check will help us find your level.`)}
        <button type="button" class="btn" data-edit>Take the quick check</button></div>`}
    <section class="adventure-card" aria-labelledby="trail-card-title">
      <div><h3 id="trail-card-title">Landscape trails</h3><p>Explore six landscapes, build a crossing and power the canyon relay.</p>
        <button class="btn" type="button" data-explore>Explore the trails</button></div>
    </section>
    ${level ? `<h3 class="section-title">Your roadmap</h3>${roadmap(level, plan.start)}` : ''}`;
  for (const button of body.querySelectorAll('[data-subject]')) {
    button.addEventListener('click', () => {
      state.subject = button.dataset.subject;
      persist();
      home('learn');
      stage.querySelector(`[data-subject="${state.subject}"]`).focus();
    });
  }
  click(body, '[data-edit]', () => chooseLevel(subject.id, true));
  if (level) click(body, '[data-begin]', () => lesson(subject.id));
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
    <div class="streak-count">${spr('flame', 9, active ? '' : 'off')}
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
      return `<div class="pick trophy">${spr('trophy', 5, earned ? trophy.tone : 'off')}<b>${trophy.d} days</b>
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
drawGround();
if (state.onboarded) home('learn');
else if (!state.tutor) welcome();
else if (!state.subject) chooseSubject();
else if (state.plans[state.subject]) welcomeOffer();
else chooseLevel(state.subject, false);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js').catch(() => {});
