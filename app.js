import { mountOnboarding } from './lumino-app/onboarding.mjs?v=44';
import { adventureMarkup, mountAdventure } from './adventure/game.mjs?v=30';
import { landscape, trails } from './adventure/levels.mjs';
import { LESSONS, RIVALS, TRAIL_LESSONS, TROPHIES, TUTORS, TUTOR_HELP } from './lumino-app/content.mjs?v=24';
import { LEVELS, SUBJECTS, subjectById, topicById } from './lumino-app/curriculum.mjs?v=34';
import { drawSky, hydrate, spr, uiIcon } from './lumino-app/pixel-art.mjs?v=31';
import { boostRemaining, clearProgress, completeLesson, currentStreak, freshProgress, loadProgress, localDay, recordAnswer, saveProgress, startDailyBoost, starterLessonId, weakSkills } from './lumino-app/progress.mjs?v=34';
import { canReadAloud, displayName, escapeHTML, mountProfile } from './lumino-app/profile.mjs?v=34';
import { bindWorkshop, workshopMarkup } from './lumino-app/cart-workshop.mjs?v=34';
import { drawDistanceGraph, getPracticeSession, MOTION_LESSONS, MOTION_SKILLS, motionSkillFor } from './lumino-app/physics-motion.mjs?v=34';
import { CART_ID, drawRoadmap, mapMarkup, roadmapBands } from './lumino-app/roadmap.mjs?v=48';

const stage = document.querySelector('#stage');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const sections = [
  ['learn', 'Learn'], ['practise', 'Practise', 'bolt'], ['ranks', 'Ranks', 'trophy'], ['you', 'You'],
];

let storage;
try { storage = window.localStorage; } catch {}
let state = loadProgress(storage);
let dispose;
let shortcut;
let dismissedReminderDay;

const tutor = () => TUTORS.find(item => item.id === state.tutor) || TUTORS[1];

function applyPreferences() {
  document.documentElement.classList.toggle('large-text', state.profile.largeText);
  document.documentElement.classList.toggle('reduce-motion', state.profile.reduceMotion);
}

const reduceMotion = () => motion.matches || state.profile.reduceMotion;

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
  let reduced = reduceMotion();

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
    if (reduced !== reduceMotion()) {
      reduced = reduceMotion();
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
function welcome() {
  const host = mount('<section aria-label="Welcome to Lumino"></section>');
  host.classList.remove('enter');
  const plan = state.plans[state.subject];
  dispose = mountOnboarding(host, {
    tutor: state.tutor,
    subject: state.subject,
    level: plan?.levels[plan.topicId],
    reduceMotion: state.profile.reduceMotion,
  }, {
    onTutor(id) { state.tutor = id; persist(); },
    onSubject(id) { state.subject = id; persist(); },
    onLevel(level) {
      const topicId = subjectById(state.subject).starterTopic;
      state.plans[state.subject] = {
        topicId, levels: { ...state.plans[state.subject]?.levels, [topicId]: level },
      };
      persist();
    },
    onFinish(action) {
      if (action === 'start') {
        lesson(state.subject, { fromOffer: true, welcomeReward: !state.rechargeGiven });
      } else {
        state.profile.since ??= localDay();
        state.onboarded = true;
        persist();
        home('learn');
      }
    },
  });
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

function chooseTopic(subject, returnTab, focusedTopic) {
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
  { back: () => home(returnTab),
    backLabel: returnTab === 'you' ? 'Back to You' : returnTab ? 'Back to Learn' : 'Change subject' });
  for (const button of node.querySelectorAll('[data-topic]')) {
    button.addEventListener('click', () => chooseLevel(subject, topicById(subject, button.dataset.topic), returnTab));
  }
}

function starterAvailable(subject, topic, level) {
  return subject.starterTopic === topic.id && level.id === 'beginner';
}

function chooseLevel(subject, topic, returnTab, recommendation) {
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
    </div>`,
  { back: () => chooseTopic(subject, returnTab, topic.id), backLabel: 'Change topic' });
  for (const button of node.querySelectorAll('[data-level]')) {
    const level = LEVELS.find(item => item.id === button.dataset.level);
    button.addEventListener('click', () => reviewPlan(subject, topic, level, returnTab, recommendation));
  }
  click(node, '[data-help-level]', () => confidenceCheck(subject, topic, returnTab));
}

function confidenceCheck(subject, topic, returnTab) {
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
    back: () => chooseLevel(subject, topic, returnTab),
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
        chooseLevel(subject, topic, returnTab, recommendation ?? 'advanced');
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
  return `<article class="card topic-plan">
    <span class="tag-label">${level?.name ?? 'Starting level to choose'}</span>
    <h3>${topic.name}</h3>
    ${level ? `<p>${topic.goals[level.id]}</p>
      ${ready && offerLesson ? `<button type="button" class="textbtn" data-topic-lesson>${LESSONS[subject.id].title} →</button>`
        : `<span class="tag">${ready ? 'Starter lesson available' : 'Lesson coming soon'}</span>`}` : ''}
  </article>`;
}

function reviewPlan(subject, topic, level, returnTab, recommendation) {
  const node = screen('Your learning plan', `
    ${topicPlanCard(subject, topic, level)}
    <button type="button" class="btn block" data-continue>Confirm my plan</button>`, {
    back: () => chooseLevel(subject, topic, returnTab, recommendation),
    backLabel: 'Change level',
    side: `<span class="muted">${subject.name}</span>`,
  });
  click(node, '[data-continue]', () => {
    const levels = { ...state.plans[subject.id]?.levels, [topic.id]: level.id };
    state.plans[subject.id] = { topicId: topic.id, levels };
    state.subject = subject.id;
    persist();
    home(returnTab);
  });
}

function openTrail(id, { onBack = () => home('learn'), onWorkshop } = {}) {
  const page = mount(`<div class="trail-page">${adventureMarkup(id, onWorkshop ? 'Back to lesson' : 'Back to Learn')}</div>`);
  dispose = mountAdventure(page, id, { onBack, onWorkshop, reducedMotion: reduceMotion() });
}

function lesson(sid, options = {}, initialStep = 0) {
  const { fromOffer = false, welcomeReward = false, practice = false, returnTab = 'learn' } = options;
  const subject = subjectById(sid);
  const baseline = LESSONS[sid];
  const starterId = starterLessonId(sid);
  const content = options.content ?? (sid === 'physics'
    ? MOTION_LESSONS.find(item => item.id === starterId)
    : { ...baseline, id: starterId, questions: [
        { ...baseline.apply, id: `${starterId}-apply` }, { ...baseline.recall, id: `${starterId}-recall` },
      ] });
  const skill = options.skill ?? (sid === 'physics' ? motionSkillFor(content.id) : null);
  const trail = !practice && content.id === starterId && trails.find(item => item.id === TRAIL_LESSONS[sid]);
  let multiplier = options.multiplier;
  if (multiplier === undefined && !practice && !state.lessonResults[content.id]) {
    if (startDailyBoost(state)) persist();
    multiplier = boostRemaining(state) ? 2 : 1;
  }
  const questionCount = content.questions.length;
  const totalSteps = questionCount + 1;
  let step = initialStep;
  let correct = 0;
  let finished = false;
  let response = null;
  const speech = state.profile.read && canReadAloud() ? window.speechSynthesis : null;
  const area = step => !step ? 'Learn' : step === questionCount ? 'Recall' : 'Apply';
  const help = () => skill?.hints[tutor().id] ?? TUTOR_HELP[sid][tutor().id][Math.min(step, 2)];

  const node = mount(`<section class="screen" aria-label="${practice ? 'Practice session' : 'Lesson'}">
    <div class="topline"><button type="button" class="textbtn" data-exit>✕ Exit ${practice ? 'practice' : 'lesson'}</button>
      <span class="muted" data-step></span></div>
    <div data-dots></div><div data-lesson></div>
  </section>`);
  if (speech) dispose = () => speech.cancel();
  const lessonBody = node.querySelector('[data-lesson]');
  click(node, '[data-exit]', fromOffer ? welcome : () => home(returnTab));

  function lessonTutor() {
    const person = tutor();
    const pose = response?.right ? 'encouraging' : step ? 'thinking' : 'greeting';
    return `<div class="lesson-tutor">
      ${tutorDialogue(person, pose, person.name, `
        <p class="tutor-dialogue-feedback" data-feedback data-result="${response?.right ? 'right' : 'retry'}" role="status">${response?.message ?? ''}</p>
        <button class="textbtn tutor-help" type="button" data-hint>
          ${step ? 'Give me a hint' : 'Explain it another way'}
        </button>
        <p data-help aria-live="polite">${step && state.profile.hints && !response ? help() : ''}</p>`)}
      <details class="switch-tutor"><summary>Switch tutor</summary>${tutorChoices(person.id, 'choice')}</details>
    </div>`;
  }

  function bindHelp(container) {
    const dialogue = container.querySelector('[data-tutor-dialogue]');
    click(container, '[data-hint]', () => {
      container.querySelector('[data-help]').textContent = help();
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
    if (step === questionCount) {
      if (finished) return;
      finished = true;
      const result = completeLesson(state, sid, correct, welcomeReward, localDay(), {
        lessonId: content.id, multiplier, practice, questionCount,
      });
      persist();
      results({ ...result, questionCount, returnTab });
    } else {
      step++;
      draw();
    }
  }

  function draw() {
    response = null;
    node.querySelector('[data-step]').textContent = `${area(step)} · ${step + 1} of ${totalSteps}`;
    node.querySelector('[data-dots]').innerHTML = dots(totalSteps, step + 1);
    const question = content.questions[step - 1];
    const trailLink = trail ? `<div class="lesson-trail">
      <img src="${landscape(trail)}" alt="">
      <div><p class="muted">Optional trail</p><button type="button" class="textbtn" data-play-trail>Explore ${trail.name}</button></div>
    </div>` : '';

    lessonBody.innerHTML = step === 0
      ? `<article class="lesson-card"><span class="tag-label">${practice ? 'Review' : 'New idea'}</span><h2>${content.title}</h2><p>${content.learn}</p>
          ${skill?.id === 'distance-time-graphs' ? '<canvas class="distance-graph" width="400" height="220" role="img" aria-label="Distance rises from 0 to 6 metres in 2 seconds, to 18 metres in 5 seconds, then stays at 18 metres until 7 seconds."></canvas>' : ''}
          <div class="ex">${content.ex}</div></article>
        ${lessonTutor()}${trailLink}
        <div class="footer-cta"><button class="btn block" type="button" data-next>Continue to Apply</button></div>`
      : `<div class="lesson-card"><span class="tag-label">${step === questionCount ? 'Quick recall' : content.applyLabel ?? 'Apply the idea'}</span><h2>${question.q}</h2></div>
        <div class="choices lesson-answers" role="group" aria-label="Answers">
          ${question.o.map((answer, index) => `<button class="choice" type="button" data-answer="${index}"><b>${answer}</b></button>`).join('')}
        </div>${lessonTutor()}<div class="footer-cta" data-answer-actions></div>`;

    if (!step) {
      const graph = lessonBody.querySelector('.distance-graph');
      if (graph) drawDistanceGraph(graph);
      click(lessonBody, '[data-next]', nextStep);
      if (trail) {
        const resume = { ...options, multiplier };
        click(lessonBody, '[data-play-trail]', () => openTrail(trail.id, {
          onBack: () => lesson(sid, resume),
          onWorkshop: () => lesson(sid, resume, 1),
        }));
      }
    } else {
      const answers = [...lessonBody.querySelectorAll('[data-answer]')];
      for (const [index, button] of answers.entries()) {
        button.addEventListener('click', () => {
          const right = index === question.a;
          if (right) correct++;
          recordAnswer(state, {
            questionId: question.id, subject: sid, topicId: subject.starterTopic,
            subtopicId: skill?.id ?? 'starter', skillTag: question.skillTag ?? skill?.id ?? 'starter',
            givenAnswer: question.o[index], right,
          });
          persist();
          speech?.cancel();
          answers.forEach(answer => { answer.disabled = true; });
          answers[question.a].classList.add('right');
          if (!right) button.classList.add('wrong');
          response = { right, message: `<strong>${right ? 'That’s right.' : 'Not quite.'}</strong> ${question.why}` };
          lessonBody.querySelector('[data-tutor-dialogue]').dataset.pose = right ? 'encouraging' : 'thinking';
          const feedback = lessonBody.querySelector('[data-feedback]');
          feedback.dataset.result = right ? 'right' : 'retry';
          feedback.innerHTML = response.message;
          const nextLabel = step === questionCount ? 'See my results' : step === questionCount - 1 ? 'Continue to Recall' : 'Next question';
          const actions = lessonBody.querySelector('[data-answer-actions]');
          actions.innerHTML = `<button type="button" class="btn block" data-next>${nextLabel}</button>`;
          click(actions, '[data-next]', nextStep);
          actions.querySelector('[data-next]').focus();
        });
      }
    }
    hydrate(lessonBody);
    bindHelp(lessonBody.querySelector('.lesson-tutor'));
    node.scrollTop = 0;
    focusHeading(lessonBody);
    if (step && speech) {
      speech.cancel();
      const utterance = new SpeechSynthesisUtterance(question.q);
      utterance.lang = document.documentElement.lang;
      speech.speak(utterance);
    }
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
  const rows = RIVALS.map(([name, score]) => ({ name, score, learner: false }));
  if (state.profile.league) {
    const name = escapeHTML(state.profile.name.trim() ? displayName(state.profile) : 'You');
    rows.push({ name, score: xp, learner: true });
  }
  rows.sort((a, b) => b.score - a.score || Number(a.learner) - Number(b.learner));
  return `<ol class="sample-league">${rows.map(({ name, score, learner }, index) =>
    `<li class="${learner ? 'me' : ''}"><span class="rank">${index + 1}</span><span class="rank-name">${name}${learner ? '' : ' <small>Example</small>'}</span><span class="rank-xp">${score} XP</span></li>`).join('')}</ol>`;
}

function results({ correct, gain, firstEver, claimed, questionCount, returnTab }) {
  const stars = [1, 2, 3].map(index => spr('star', 6, index <= 1 + Math.floor(correct * 2 / questionCount) ? '' : 'off')).join('');
  story([
    scene(5500, copy(gain ? 'Lesson complete' : 'Practice complete')
      + `<div class="results-summary"><div class="stars">${stars}</div><div class="big">+${gain}</div>
        <p class="muted">XP earned · ${correct} of ${questionCount} challenges right first time</p>
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
      else home(returnTab);
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
  const next = () => home(first ? 'learn' : 'ranks');
  click(node, '[data-skip]', next);
  click(node, '[data-commit]', () => {
    state.commit = selected;
    persist();
    next();
  });
}

function bindDock(node, scrollport, content) {
  const dock = node.querySelector('.dock');
  const tabs = node.querySelector('#section-tabs');
  const expand = node.querySelector('[data-expand-dock]');
  const current = tabs.querySelector('[aria-current="page"]');
  const input = new AbortController();
  const threshold = 12;
  let lastTop = scrollport.scrollTop;
  let lastRange = -1;
  let travel = 0;

  function setCompact(compact) {
    if (compact === tabs.hidden) return;
    const focused = document.activeElement;
    dock.classList.toggle('is-compact', compact);
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
  if (!stage.querySelector('.shortcut-offer')) {
    stage.querySelector('.home .roadmap')?.insertAdjacentHTML('afterend', shortcut.offer);
  }
  if (!stage.querySelector('.shortcut-help')) {
    stage.querySelector('.profile-actions')?.insertAdjacentHTML('afterbegin', shortcut.help);
  }
  shortcut.refresh();
}

function bindLearningReminder(body) {
  const { goal, remind, reminderTime } = state.profile;
  if (!remind) return;
  const [hours, minutes] = reminderTime.split(':').map(Number);
  const notice = element(`<aside class="learning-reminder" hidden>
    <p><b>${tutor().name}’s reminder</b> Set aside ${goal} minutes for today’s practice.</p>
    <button type="button" class="textbtn" aria-label="Dismiss today’s reminder">Dismiss</button>
  </aside>`);
  body.querySelector('.roadmap-controls').after(notice);

  function refresh() {
    const now = new Date();
    const today = localDay(now);
    const due = now.getHours() * 60 + now.getMinutes() >= hours * 60 + minutes;
    notice.hidden = !due || today === state.lastDay || today === dismissedReminderDay;
  }

  click(notice, 'button', () => {
    dismissedReminderDay = localDay();
    refresh();
    focusHeading(body);
  });
  refresh();
  const timer = setInterval(refresh, 30_000);
  return () => clearInterval(timer);
}

function home(tab) {
  const [, label, icon = tab] = sections.find(([id]) => id === tab);
  const node = mount(`<div class="home${tab === 'learn' ? ' has-roadmap' : ''}">
    <header class="topbar"><a class="brand" href="../"><img class="mark sm" src="../assets/lumino-icon-192.png?v=46" alt="">Lumino</a>
      <div class="stats" aria-label="Your stats">
        <button class="stat stat-link" type="button" data-open-streak title="Open your streak in Ranks">${spr('flame', 2)}${currentStreak(state)}<span class="sr"> day streak</span></button>
        <span class="stat" title="Streak recharges">${spr('bolt', 2)}${state.recharges}<span class="sr"> streak recharges</span></span>
        <span class="stat" title="XP">${spr('star', 2)}${state.xp}<span class="sr"> XP</span></span>
        <span class="stat boost-chip" data-boost hidden title="Double XP time remaining"></span>
      </div>
    </header>
    <div class="body"><div class="home-content"></div></div>
    <div class="dock">
      <nav class="dock-menu" aria-label="Sections">
      <div class="tabs" id="section-tabs">${sections.map(([id, name, tabIcon = id]) =>
        `<button type="button" class="tab" data-tab="${id}" ${id === tab ? 'aria-current="page"' : ''}>${uiIcon(tabIcon)}${name}</button>`).join('')}</div>
      <button type="button" class="dock-expand" data-expand-dock aria-controls="section-tabs" aria-expanded="true" aria-label="${label}. Show all sections" hidden>
        ${uiIcon(icon)}${label}<span class="dock-chevron" aria-hidden="true"></span>
      </button>
      </nav>
      ${tab === 'learn' ? `<div class="daily-lesson"><button type="button" class="btn banana" data-daily
        aria-labelledby="daily-lesson-label" aria-describedby="daily-lesson-detail"><b id="daily-lesson-label" data-daily-label></b>
        <small id="daily-lesson-detail" data-daily-detail></small></button></div>` : ''}
    </div>
    </div>`);
  const scrollport = node.querySelector('.body');
  const body = scrollport.querySelector('.home-content');
  const disposeTab = ({ learn: learnTab, ranks: ranksTab, practise: practiseTab, you: youTab })[tab](body);
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
  const disposeReminder = tab === 'learn' ? bindLearningReminder(body) : undefined;
  if (tab === 'learn') scrollport.scrollTop = scrollport.scrollHeight;
  const disposeDock = bindDock(node, scrollport, body);
  const disposeBoost = bindBoost(node, tab === 'learn');
  dispose = () => {
    disposeDock();
    disposeReminder?.();
    disposeBoost();
    if (typeof disposeTab === 'function') disposeTab();
  };

  click(node, '[data-open-streak]', () => {
    if (tab !== 'ranks') home('ranks');
    const heading = stage.querySelector('#ranks-streak');
    heading.focus();
    heading.scrollIntoView({ block: 'nearest' });
  });
  for (const button of node.querySelectorAll('[data-tab]')) {
    button.addEventListener('click', () => {
      if (button.dataset.tab !== tab) home(button.dataset.tab);
    });
  }
}

const selectedSubject = () => subjectById(state.subject) || SUBJECTS[0];

function subjectTabs(subject) {
  return `<div class="subj-tabs" role="group" aria-label="Subjects">${SUBJECTS.map(item =>
    `<button type="button" class="chip" data-subject="${item.id}" aria-pressed="${item.id === subject.id}">
      ${uiIcon(item.id)}${item.name}</button>`).join('')}</div>`;
}

function bindSubjects(body, tab) {
  for (const button of body.querySelectorAll('[data-subject]')) {
    button.addEventListener('click', () => {
      if (button.dataset.subject === selectedSubject().id) return;
      state.subject = button.dataset.subject;
      persist();
      home(tab);
      stage.querySelector(`[data-subject="${state.subject}"]`).focus({ preventScroll: true });
    });
  }
}

function nextLesson(subject) {
  const lessons = subject.id === 'physics' ? MOTION_LESSONS : [{ id: starterLessonId(subject.id) }];
  return lessons.find(item => !state.lessonResults[item.id]);
}

function bindBoost(node, isLearn) {
  const boost = node.querySelector('[data-boost]');
  const countdown = node.querySelector('[data-daily-detail]');
  const daily = node.querySelector('[data-daily]');
  const next = isLearn ? nextLesson(selectedSubject()) : null;

  function refresh() {
    const remaining = boostRemaining(state);
    boost.hidden = !remaining;
    if (remaining) {
      const seconds = Math.ceil(remaining / 1_000);
      boost.textContent = `×2 ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    }
    if (!daily) return;
    const today = localDay();
    const offer = Boolean(next && !remaining && (state.boostDay === null || state.boostDay < today));
    daily.querySelector('[data-daily-label]').textContent = next ? 'Start today’s lesson' : 'Review a lesson';
    daily.classList.toggle('xp-offer', offer);
    countdown.textContent = next && remaining ? 'Double XP is active'
      : offer ? 'Start to unlock 30 minutes of double XP' : '';
    countdown.hidden = !countdown.textContent;
  }

  if (daily) daily.onclick = () => {
    const subject = selectedSubject();
    if (next) lesson(subject.id, subject.id === 'physics' ? { content: next } : {});
    else if (subject.id === 'physics') startPractice(MOTION_SKILLS[1], 'learn');
    else lesson(subject.id, { practice: true });
  };
  refresh();
  const timer = setInterval(refresh, 1_000);
  return () => clearInterval(timer);
}

function openMapSheet(body, item, subject) {
  const physics = subject.id === 'physics';
  const collection = physics ? MOTION_SKILLS : [{
    title: LESSONS[subject.id].title,
    lessons: [{ id: starterLessonId(subject.id), title: LESSONS[subject.id].title }],
  }];
  const sheet = element(`<dialog class="map-sheet" aria-labelledby="map-sheet-title">
    <form method="dialog" class="sheet-close"><button class="textbtn" autofocus>Close</button></form>
    <h2 id="map-sheet-title">${item.title}</h2><p class="muted">${item.detail}</p>
    ${item.available ? `<div class="sheet-skills">${collection.map(skill => `
      <section><h3>${skill.title}</h3><div class="choices">${skill.lessons.map(item => `
        <button class="choice" type="button" data-open-lesson="${item.id}"><b>${item.title}</b>
          <small>${state.lessonResults[item.id] ? 'Completed · Review' : 'Start lesson'}</small></button>`).join('')}</div></section>`).join('')}</div>`
      : '<p class="sheet-soon">Available soon</p>'}</dialog>`);
  sheet.addEventListener('close', () => sheet.remove(), { once: true });
  body.append(sheet);
  sheet.showModal();
  for (const button of sheet.querySelectorAll('[data-open-lesson]')) {
    button.addEventListener('click', () => {
      sheet.close();
      const content = physics ? MOTION_LESSONS.find(item => item.id === button.dataset.openLesson) : undefined;
      lesson(subject.id, { content });
    });
  }
}

function launchWorkshop() {
  const back = () => home('learn');
  const workshop = screen('Cart Workshop', workshopMarkup(), { back, backLabel: 'Back to the roadmap' });
  bindWorkshop(workshop, {
    reducedMotion: reduceMotion,
    onComplete: () => {
      state.gameResults[CART_ID] = 'completed';
      persist();
      back();
    },
    onSkip: () => {
      state.gameResults[CART_ID] ??= 'skipped';
      persist();
      back();
    },
  });
}

function learnTab(body) {
  const subject = selectedSubject();
  const plan = state.plans[subject.id];
  const placement = plan?.levels[plan.topicId];
  const upcoming = nextLesson(subject);
  const motionSubtopic = subject.id === 'physics' ? (motionSkillFor(upcoming?.id) ?? MOTION_SKILLS[1]).title : undefined;
  const bands = roadmapBands(subject, motionSubtopic);
  body.innerHTML = `<div class="roadmap-controls">${subjectTabs(subject)}</div>
    ${mapMarkup(subject, bands, { placement, finished: !upcoming, gameResults: state.gameResults })}`;
  bindSubjects(body, 'learn');
  const nodes = bands.flatMap(band => band.nodes);
  for (const button of body.querySelectorAll('[data-map-node]')) {
    const item = nodes.find(node => node.id === button.dataset.mapNode);
    button.addEventListener('click', () => {
      if (item.id === CART_ID) launchWorkshop();
      else if (item.id.startsWith('trail-')) openTrail(item.id.slice(6));
      else openMapSheet(body, item, subject);
    });
  }
  return drawRoadmap(body.querySelector('.roadmap'));
}

function startPractice(skill, returnTab = 'practise') {
  const session = getPracticeSession(skill, state.practiceSerial);
  state.practiceSerial++;
  persist();
  lesson('physics', { content: session, skill, practice: true, returnTab });
}

function practiseTab(body) {
  const subject = selectedSubject();
  const weak = weakSkills(state, subject.id);
  const physics = subject.id === 'physics';
  const skills = weak.map(({ id }) => MOTION_SKILLS.find(skill => skill.id === id)).filter(Boolean);
  body.innerHTML = `${subjectTabs(subject)}
    <section class="practice-panel" aria-labelledby="practice-title">
      <h2 id="practice-title">What would you like to practise?</h2>
      ${physics ? `<p class="muted">${skills.length
        ? 'Review a skill you’ve missed on two or more different questions in the last 14 days.'
        : 'Choose a skill for a short refresher and three questions.'}</p>
        ${skills.length ? `<h3>Practise your mistakes</h3><div class="practice-choices">${skills.map(skill =>
          `<button class="choice" type="button" data-skill="${skill.id}"><b>${skill.title}</b>
          <small>${weak.find(item => item.id === skill.id).misses} different questions missed</small></button>`).join('')}</div>` : ''}
        <h3>Choose a skill</h3><div class="practice-choices">${MOTION_SKILLS.map(skill =>
          `<button class="choice" type="button" data-skill="${skill.id}"><b>${skill.title}</b></button>`).join('')}</div>`
        : `<p class="muted">Revisit the ${subject.name} starter with ${tutor().name}.</p>
          <button class="choice" type="button" data-review><b>${LESSONS[subject.id].title}</b></button>`}
    </section>`;
  bindSubjects(body, 'practise');
  if (physics) {
    for (const button of body.querySelectorAll('[data-skill]')) {
      button.addEventListener('click', () => startPractice(MOTION_SKILLS.find(skill => skill.id === button.dataset.skill)));
    }
  } else {
    click(body, '[data-review]', () => lesson(subject.id, { practice: true, returnTab: 'practise' }));
  }
}

function ranksTab(body) {
  const goal = state.commit;
  const active = currentStreak(state);
  body.innerHTML = `<div class="ranks-page"><section aria-labelledby="ranks-streak">
    <h2 class="section-title" id="ranks-streak" tabindex="-1">Your streak</h2>
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
    }).join('')}</div></section>
    <section aria-labelledby="ranks-league"><h2 id="ranks-league" class="section-title">Sample league</h2>
      <p class="muted section-description">Compare your XP with fictional example scores. Your XP is saved on this device.</p>
      ${ranksTable(state.xp)}</section></div>`;
  click(body, '[data-goal]', () => chooseGoal(false));
}

function youTab(body) {
  mountProfile(body, {
    state, tutor, tutorChoices, bindTutorChoices, persist, applyPreferences, renderShortcut,
    openSubject: subject => chooseTopic(subject, 'you'),
    reset: status => {
      if (!window.confirm('Erase your Lumino progress and profile preferences on this device, including prior achievements?')) return;
      if (!clearProgress(storage)) {
        status.textContent = 'Progress could not be cleared. Please try again.';
        return;
      }
      state = freshProgress();
      dismissedReminderDay = undefined;
      applyPreferences();
      welcome();
    },
  });
}

applyPreferences();
drawSky();
if (state.onboarded) home('learn');
else welcome();

import('./lumino-app/shortcut.mjs?v=22')
  .then(({ setupShortcut }) => {
    shortcut = setupShortcut(stage, storage);
    renderShortcut();
  })
  .catch(error => console.warn('Lumino shortcut unavailable.', error));
