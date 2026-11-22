import { LEVELS, topicById } from './curriculum.mjs?v=34';
import { byId, starters } from './lessons/index.mjs';
import { MOTION_SKILLS } from './physics-motion.mjs?v=59';

export const CART_ID = 'cart-workshop';
const game = (id, title) => ({ type: 'game', id, title });
const sandbox = (id, title) => ({ type: 'sandbox', id, title });
const cart = game(CART_ID, 'Cart Workshop');
const relay = game('trail-desert', 'Desert canyon relay');

const routes = {
  physics: {
    scenes: ['jungle-canyon', 'mountain-forest'],
    topics: [
      { id: 'speed-and-velocity', name: 'Motion', subtitle: 'Speed, distance and time', introSubtitle: 'Motion: speed, distance and time',
        groups: MOTION_SKILLS.map(skill => ({ lessons: skill.lessons,
          activities: skill.id === 'average-speed' ? [cart, relay] : [] })) },
      { id: 'simple-circuits', subtitle: 'Circuit symbols and components', sandbox: sandbox('circuit-workshop', 'Circuit workshop') },
      { id: 'conservation-of-energy', subtitle: 'Energy stores and transfers', activities: [game('trail-mountains', 'Rocky Mountains gravity swing')], sandbox: sandbox('energy-workshop', 'Energy workshop') },
      { id: 'momentum', subtitle: 'Momentum in collisions', sandbox: sandbox('momentum-lab', 'Momentum lab') },
    ],
  },
  math: {
    scenes: ['terraced-valley', 'sunset-valley'],
    topics: [
      { id: 'simple-equations', name: 'Linear equations', starter: true, activities: [game('trail-rice', 'Rice Fields crossing')] },
      { id: 'fractions', subtitle: 'Parts of a whole', sandbox: sandbox('fraction-workshop', 'Fraction workshop') },
      { id: 'patterns-and-rules', subtitle: 'Finding the nth term', sandbox: sandbox('math-playground', 'Math Playground') },
      { id: 'quadratics', subtitle: 'Solving real-world quadratics', sandbox: sandbox('quadratic-lab', 'Quadratic lab') },
    ],
  },
  chemistry: {
    scenes: ['temple-ruins', 'jungle-canyon'],
    topics: [
      { id: 'physical-and-chemical-change', starter: true, activities: [game('trail-city', 'City trail')] },
      { id: 'the-periodic-table', subtitle: 'Groups and periods', sandbox: sandbox('elements-workshop', 'Elements workshop') },
      { id: 'acids-and-bases', subtitle: 'Neutralisation', sandbox: sandbox('reaction-workshop', 'Reaction workshop') },
      { id: 'rates-of-reaction', subtitle: 'Interpreting rate graphs', sandbox: sandbox('rates-lab', 'Rates lab') },
    ],
  },
  biology: {
    scenes: ['mountain-forest', 'terraced-valley'],
    topics: [
      { id: 'photosynthesis', starter: true, activities: [game('trail-rainforest', 'Rainforest trail')], sandbox: sandbox('biology-lab', 'Biology Lab') },
      { id: 'cell-structure', subtitle: 'Plant and animal cells', sandbox: sandbox('cell-workshop', 'Cell workshop') },
      { id: 'digestion', subtitle: 'Enzymes and absorption', sandbox: sandbox('digestion-lab', 'Digestion lab') },
      { id: 'dna-and-inheritance', subtitle: 'Genetic crosses and pedigrees', sandbox: sandbox('inheritance-lab', 'Inheritance lab') },
    ],
  },
  english: {
    scenes: ['sunset-temple', 'temple-ruins'],
    topics: [
      { id: 'paragraph-structure', name: 'Paragraphs and opening sentences', starter: true, activities: [game('trail-wheat', 'Wheat Fields trail')] },
      { id: 'making-inferences', subtitle: 'Reading for clues', sandbox: sandbox('clue-workshop', 'Clue workshop') },
      { id: 'persuasive-writing', subtitle: 'Supporting a viewpoint', sandbox: sandbox('editor-workshop', 'Editor’s workshop') },
      { id: 'analysing-an-authors-choices', subtitle: 'Language and its effects', sandbox: sandbox('writer-workshop', 'Writer’s workshop') },
    ],
  },
};

export function roadmapBands(subject) {
  const { topics, scenes } = routes[subject.id];
  return topics.map((topic, index) => {
    const name = topic.name ?? topicById(subject, topic.id).name;
    const starter = starters[subject.id];
    const subtitle = topic.subtitle ?? starter.title;
    const intro = byId.get(`${subject.id}-${topic.id}-intro`);
    const groups = topic.groups ?? (topic.starter ? [{ lessons: [starter] }] : []);
    let ordinal = 0;
    function lesson(content) {
      return { type: 'lesson', id: content.id, title: content.title, content,
        number: `${index + 1}.${String(ordinal++).padStart(2, '0')}` };
    }
    const nodes = [lesson(intro)];
    nodes[0].subtitle = topic.introSubtitle ?? subtitle;
    for (const group of groups) {
      nodes.push(...group.lessons.map(lesson), ...(group.activities ?? []));
    }
    nodes.push(...(topic.activities ?? []), topic.sandbox ?? sandbox(topic.id + '-sandbox', name + ' Sandbox'));
    if (index === topics.length - 1) nodes.push({ type: 'end', id: subject.id + '-end', title: 'More topics coming up!' });
    return { id: topic.id, level: LEVELS[index], name, subtitle, scene: scenes[index % scenes.length], nodes };
  });
}

export function currentLesson(bands, results, startId) {
  const lessons = bands.flatMap(band => band.nodes.filter(item => item.type === 'lesson'));
  const start = Math.max(0, lessons.findIndex(item => item.id === startId));
  return [...lessons.slice(start), ...lessons.slice(0, start)].find(item => !results[item.id]);
}

const compass = Array.from({ length: 32 }, (_, i) =>
  `<line x1="40" y1="12" x2="40" y2="${i % 8 === 0 ? 3 : 8}" stroke-width="${i % 8 === 0 ? 2.5 : 1.5}" transform="rotate(${i * 11.25} 40 40)"/>`
).join('');

function chapterLevel(label) {
  return `<span class="chapter-level"><i></i><span>${label}</span><i></i></span>`;
}

function nodeMarkup(item, side, state, current, subjectName) {
  if (item.type === 'end') {
    return `<li class="map-stop map-end"><button type="button" class="map-band-heading map-end-marker"
        data-node-state="end" data-map-node="${item.id}">
      ${chapterLevel(subjectName)}<span class="chapter-title">${item.title}</span></button></li>`;
  }
  const done = item.type === 'lesson' ? state.lessonResults[item.id] : state.gameResults[item.id] === 'completed';
  const active = item.id === current?.id;
  const status = active ? 'Current lesson' : done ? 'Completed' : 'Upcoming';
  const detail = { lesson: status, game: done ? 'Game · Completed' : 'Game', sandbox: 'Sandbox · Coming soon' }[item.type];
  const label = [item.number, item.title, detail].filter(Boolean).join(' · ');
  return `<li class="map-stop" data-side="${side}"><button type="button" class="map-node" data-node-state="${active ? 'current' : done ? 'completed' : item.type}"
      data-map-node="${item.id}" aria-label="${label}" ${active ? 'aria-current="step"' : ''}>
    <span class="map-node-icon" aria-hidden="true"><svg viewBox="0 0 80 80"><use href="#map-compass"/></svg><b>${item.number ?? '★'}</b></span>
    <span class="map-node-text"><b>${item.title}</b>${item.subtitle ? `<small>${item.subtitle}</small>` : ''}
      <small class="map-status">${detail}</small></span></button></li>`;
}

export function mapMarkup(subject, bands, state, current) {
  let stop = 0;
  const placement = state.plans[subject.id];
  return `<div class="roadmap" role="region" aria-label="${subject.name} roadmap">
    <svg width="0" height="0" aria-hidden="true" class="compass-def"><defs><g id="map-compass" stroke="currentColor" stroke-linecap="round">${compass}<circle cx="40" cy="40" r="25.5" stroke-width="2.5"/></g></defs></svg>
    <svg class="roadmap-route" aria-hidden="true"></svg>
    ${bands.map((band, index) => {
      const suggested = placement?.levels[placement.topicId] === band.level.id;
      return `<section class="map-band" style="--scene:url('../assets/roadmaps/${band.scene}.webp')" aria-label="Topic ${index + 1} · ${band.name}" ${suggested ? 'data-placement' : ''}>
        <header class="map-band-heading">${chapterLevel(band.level.name)}
        <h3 class="chapter-title">${band.name}</h3><p><span>Topic ${index + 1} · ${band.subtitle}</span>${suggested ? '<span class="placement-chip">Your level</span>' : ''}</p></header>
        <ol class="map-nodes">${band.nodes.map(item => nodeMarkup(item, stop++ % 2 ? 'right' : 'left', state, current, subject.name)).join('')}</ol></section>`;
    }).join('')}</div>`;
}

export function drawRoadmap(root) {
  const svg = root.querySelector('.roadmap-route');
  const anchors = [...root.querySelectorAll('.map-node-icon,.map-end-marker')];
  const current = root.querySelector('[aria-current="step"] .map-node-icon');
  const reached = current ? anchors.indexOf(current) : anchors.length - 2;
  function paint() {
    const base = svg.getBoundingClientRect();
    const points = anchors.map(anchor => {
      const rect = anchor.getBoundingClientRect();
      const y = anchor.matches('.map-end-marker') ? rect.top - 12 : rect.top + rect.height / 2;
      return { x: rect.left + rect.width / 2 - base.left, y: y - base.top };
    });
    svg.innerHTML = points.slice(1).map((b, i) => {
      const a = points[i];
      const mid = (a.y + b.y) / 2;
      return `<path class="${i < reached ? 'reached' : ''}" d="M${a.x} ${a.y} C${a.x} ${mid},${b.x} ${mid},${b.x} ${b.y}"/>`;
    }).join('');
  }
  paint();
  if (typeof ResizeObserver === 'undefined') {
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }
  const observer = new ResizeObserver(paint);
  root.querySelectorAll('.map-band,.map-stop,.map-band-heading').forEach(el => observer.observe(el));
  return () => observer.disconnect();
}

export function centerCurrentLesson(scrollport) {
  const target = scrollport.querySelector('[aria-current="step"]') ?? scrollport.querySelector('[data-node-state="end"]');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  scrollport.scrollTop += rect.top + rect.height / 2 - scrollport.getBoundingClientRect().top - scrollport.clientHeight / 2;
}
