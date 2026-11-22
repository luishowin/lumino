import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { LEVELS, SUBJECTS, subjectById } from '../lumino-app/curriculum.mjs';
import { stories } from '../lumino-app/lessons/index.mjs';
import { MOTION_SKILLS } from '../lumino-app/physics-motion.mjs';
import { freshProgress, loadProgress, PROGRESS_KEY } from '../lumino-app/progress.mjs';
import { centerCurrentLesson, currentLesson, mapMarkup, roadmapBands } from '../lumino-app/roadmap.mjs';
import { trails } from '../adventure/levels.mjs';

const physics = subjectById('physics');
const path = roadmapBands(physics);
const numbers = node => node.type === 'lesson';

test('every roadmap topic begins with exactly one playable X.00 and numbers only lessons', () => {
  const lessons = [], games = new Set();
  for (const subject of SUBJECTS) {
    const bands = roadmapBands(subject);
    assert.doesNotMatch(mapMarkup(subject, bands, freshProgress()), /map-divider/);
    assert.deepEqual(bands.map(b => b.level.id), LEVELS.map(l => l.id));
    bands.forEach((band, i) => {
      const [intro] = band.nodes;
      assert.equal(intro.content.kind, 'introduction');
      assert.equal(intro.title, 'Introduction to ' + band.name);
      assert.equal(intro.content.level, band.level.id);
      assert.equal(intro.content.topicId, band.id);
      assert.equal(band.nodes.filter(n => n.content?.kind === 'introduction').length, 1);
      let order = 0;
      for (const item of band.nodes) {
        if (item.type === 'lesson') {
          assert.equal(item.number, `${i + 1}.${String(order++).padStart(2, '0')}`);
          lessons.push(item.id);
        } else {
          assert.equal(item.number, undefined);
          if (item.type === 'game') games.add(item.id);
        }
      }
      assert.equal(band.nodes.filter(n => n.type !== 'end').at(-1).type, 'sandbox');
    });
    assert.equal(bands.at(-1).nodes.at(-1).title, 'More topics coming up!');
    assert.equal(bands.flatMap(b => b.nodes).filter(n => n.type === 'end').length, 1);
  }
  assert.deepEqual(lessons.sort(), stories.map(l => l.id).sort());
  assert.deepEqual(games, new Set(['cart-workshop', ...trails.map(t => 'trail-' + t.id)]));
});

test('Motion keeps its lesson order and both journey activities after average speed', () => {
  const nodes = path[0].nodes;
  assert.deepEqual(nodes.filter(numbers).slice(1).map(n => n.id), MOTION_SKILLS.flatMap(skill => skill.lessons.map(l => l.id)));
  const bridge = nodes.findIndex(n => n.id === 'physics-speed-on-the-bridge');
  assert.equal(nodes[bridge].number, '1.03');
  assert.deepEqual(nodes.slice(bridge + 2, bridge + 4).map(n => n.id), ['cart-workshop', 'trail-desert']);
});

test('the dock selection, highlighted node and centered scroll target agree', () => {
  const state = freshProgress();
  for (const node of path[0].nodes.filter(numbers).slice(0, 3)) state.lessonResults[node.id] = { attempts: 1 };
  const current = currentLesson(path, state.lessonResults);
  assert.equal(current.id, 'physics-speed-on-the-bridge');
  const html = mapMarkup(physics, path, state, current);
  assert.match(html, /data-map-node="physics-speed-on-the-bridge" aria-label="1.03 · Speed on the bridge · Current lesson" aria-current="step"/);
  assert.equal(html.match(/aria-current="step"/g).length, 1);
  assert.equal(html.match(/<line /g).length, 32);
  assert.equal(html.match(/stroke-width="2.5" transform/g).length, 4);
  const port = { clientHeight: 600, scrollTop: 100, getBoundingClientRect: () => ({ top: 40 }),
    querySelector(selector) {
      assert.equal(selector, '[aria-current="step"]');
      return { getBoundingClientRect: () => ({ top: 720, height: 80 }) };
    } };
  centerCurrentLesson(port);
  assert.equal(port.scrollTop, 520);
  const allDone = Object.fromEntries(path.flatMap(b => b.nodes.filter(numbers).map(n => [n.id, {}])));
  assert.equal(currentLesson(path, allDone), undefined);
});

test('a returning learner keeps the old next lesson without invented completions or rewards', () => {
  const saved = { subject: 'physics', onboarded: true, xp: 42, streak: 3,
    plans: { physics: { topicId: physics.starterTopic, levels: { [physics.starterTopic]: 'advanced' } } },
    lessonResults: { 'physics-speed-units': { attempts: 2, best: 5, bestOf: 6 } } };
  let record = JSON.stringify(saved);
  const storage = { getItem: key => key === PROGRESS_KEY ? record : null, setItem: (_, value) => { record = value; } };
  const state = loadProgress(storage);
  const start = state.roadmapStarts.physics;
  assert.equal(start, 'physics-speed-on-the-bridge');
  assert.equal(currentLesson(path, state.lessonResults, start).id, start);
  assert.deepEqual(loadProgress(storage), state);
  assert.deepEqual(state.lessonResults, saved.lessonResults);
  assert.deepEqual(state.plans, saved.plans);
  assert.equal(state.xp, 42);
  assert.equal(state.streak, 3);
  assert.equal(state.roadmapStarts.math, undefined);
  const done = { ...state.lessonResults, [start]: { attempts: 1 } };
  assert.equal(currentLesson(path, done, start).id, 'physics-trip-data');
  const remaining = Object.fromEntries(path.flatMap(b => b.nodes.filter(numbers).filter(n => n.number !== '1.00').map(n => [n.id, {}])));
  assert.equal(currentLesson(path, remaining, start).number, '1.00');
});

test('the deprecated game caption is absent from the Learn UI', async () => {
  const outdated = new RegExp(['optional', 'game'].join(' '), 'i');
  for (const file of ['../app.js', '../lumino-app/roadmap.mjs']) assert.doesNotMatch(await readFile(new URL(file, import.meta.url), 'utf8'), outdated);
});

test('a learner who finished the former topic resumes at topic two and can still take the first introduction', () => {
  const saved = { onboarded: true, subject: 'math', completed: ['math'], xp: 60, streak: 4 };
  const storage = { getItem: key => key === PROGRESS_KEY ? JSON.stringify(saved) : null, setItem() {} };
  const state = loadProgress(storage);
  const bands = roadmapBands(subjectById('math'));
  assert.equal(currentLesson(bands, state.lessonResults, state.roadmapStarts.math).number, '2.00');
  assert.deepEqual(Object.keys(state.lessonResults), ['math-starter']);
  assert.equal(state.xp, 60);
  assert.equal(state.streak, 4);
});
