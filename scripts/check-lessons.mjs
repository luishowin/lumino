import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { stories, starters } from '../lumino-app/lessons/index.mjs';
import { LEVELS, subjectById, topicById } from '../lumino-app/curriculum.mjs';
import { MOTION_SKILLS } from '../lumino-app/physics-motion.mjs';
import { trails } from '../adventure/levels.mjs';

const activityIds = new Set(['cart-workshop', ...trails.map(({ id }) => id)]);
const text = value => typeof value === 'string' && Boolean(value.trim());
const range = (value, min, max) => Array.isArray(value) && value.length >= min && value.length <= max;
const stable = id => typeof id === 'string' && /^[a-z0-9-]{1,80}$/.test(id);

export function validateLessons(lessons) {
  const lessonIds = new Set();
  const questionIds = new Set();
  for (const l of lessons) {
    const check = (ok, message) => assert.ok(ok, l.id + ': ' + message);
    const subject = subjectById(l.subject);
    check(subject && stable(l.id) && !lessonIds.has(l.id), 'unknown subject or invalid/duplicate lesson id');
    lessonIds.add(l.id);
    const intro = l.kind === 'introduction';
    if (intro) check(topicById(subject, l.topicId) && l.estimatedMinutes >= 3 && l.estimatedMinutes <= 5, 'intro topic and length');
    const skills = new Set(intro ? [l.topicId] : l.subject === 'physics' ? MOTION_SKILLS.map(s => s.id) : [subject.starterTopic]);
    check(text(l.title) && LEVELS.some(level => level.id === l.level) && Number.isInteger(l.estimatedMinutes) && l.estimatedMinutes > 0, 'metadata');
    check(text(l.intro?.hook) && text(l.intro.tutorLine), 'intro');
    check(range(l.goal, 2, 3) && l.goal.every(text), 'goals');
    check(range(l.definitions, 3, 5) && l.definitions.every(d => text(d.term) && text(d.meaning)), 'definitions');
    check(range(l.concept, intro ? 1 : 2, 5) && l.concept.every(c => [c.title,c.body,c.alt,c.tutorLine].every(text) && c.alt !== c.body), 'concept or alternate explanation');
    check(range(l.examples, 2, 4) && ['problem','real-world'].every(k => l.examples.some(e => e.kind === k)), 'worked and real-world examples');
    for (const e of l.examples) {
      check(text(e.title) && text(e.tutorLine), 'example title or tutor line');
      if (e.kind === 'activity') check(activityIds.has(e.activityId), 'unknown activity');
      else check(['problem','real-world'].includes(e.kind) && range(e.steps, 2, Infinity) && e.steps.every(text), 'example steps');
    }
    check((intro ? range(l.quiz, 4, 4) : range(l.quiz, 7, 10)), 'quiz length');
    const counts = new Map();
    let open = 0;
    for (const q of l.quiz) {
      check(stable(q.id) && !questionIds.has(q.id), 'invalid or duplicate question id ' + q.id);
      questionIds.add(q.id);
      check(skills.has(q.skillId) && text(q.q), 'skill or prompt on ' + q.id);
      counts.set(q.skillId, counts.get(q.skillId) ?? 0);
      if (q.type === 'mcq') {
        check(range(q.options, 4, 4) && q.options.every(text) && new Set(q.options.map(o => o.trim().toLowerCase())).size === 4, 'four distinct options on ' + q.id);
        check(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4 && text(q.why), 'answer or why on ' + q.id);
        counts.set(q.skillId, counts.get(q.skillId) + 1);
      } else {
        check(q.type === 'explain' && text(q.model) && ['type','speech'].every(mode => q.input?.includes(mode)), 'open response');
        open++;
      }
    }
    check(open >= 1 && open <= 2 && [...counts.values()].every(n => n >= 2), 'open count or insufficient graded questions per skill');
    check(range(l.summary?.takeaways, 3, 5) && l.summary.takeaways.every(text) && text(l.summary.formula), 'summary');
    check(l.sandbox === null, 'sandbox');
  }
}

export async function checkCatalogue() {
  validateLessons(stories);
  const folder = new URL('../lumino-app/lessons/', import.meta.url);
  const worker = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  const paths = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (entry.isDirectory()) for (const file of await readdir(new URL(entry.name + '/', folder))) {
      if (file.endsWith('.mjs')) paths.push(entry.name + '/' + file);
    }
  }
  assert.deepEqual(paths.sort(), stories.map(l => l.subject + '/' + l.id + '.mjs').sort());
  for (const file of ['index.mjs', ...paths]) assert.ok(worker.includes('"./lumino-app/lessons/' + file + '"'), 'Missing offline lesson file ' + file);
  for (const l of Object.values(starters)) assert.ok(stories.includes(l));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await checkCatalogue();
  console.log('Validated ' + stories.length + ' stories and their offline entries.');
}
