import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PROGRESS_KEY, clearProgress, completeLesson, currentStreak,
  freshProgress, loadProgress, saveProgress,
} from '../lumino-app/progress.mjs';

function storageWith(seeds = {}) {
  const records = new Map(Object.entries(seeds).map(([key, value]) => [key, JSON.stringify(value)]));
  return {
    getItem: key => records.get(key) ?? null,
    setItem: (key, value) => records.set(key, value),
    removeItem: key => records.delete(key),
  };
}

test('legacy progress becomes prior achievements and keeps the starting topic', () => {
  const storage = storageWith({
    'lumino-v2': { intro: true, subject: 'mathematics', level: 2, guide: 'male', complete: ['physics', 'mathematics'] },
  });
  const state = loadProgress(storage);
  assert.equal(state.tutor, 'charles');
  assert.equal(state.subject, 'math');
  assert.equal(state.onboarded, true);
  assert.deepEqual(state.plans, { math: { topicId: 'linear-equations', levels: {} } });
  assert.deepEqual(state.previous, ['physics', 'math']);
  assert.deepEqual(state.completed, []);
  assert.deepEqual(loadProgress(storage), state);
});

test('demo progress preserves XP and distinguishes roadmap suggestions from played lessons', () => {
  const storage = storageWith({
    'lumino.app.v2': {
      tutor: 'linda', subject: 'biology', onboarded: true, xp: 30, streak: 2,
      recharges: 1, rechargeGiven: true, commit: 10, lastDay: 20100,
      plans: { biology: { level: 1, start: 1, next: 2 }, english: { level: 2, start: 2, next: 2 } },
    },
    'lumino-v2': { intro: true, tutor: 'charles', subject: 'physics', level: 1, complete: ['physics'] },
  });
  const state = loadProgress(storage);
  assert.deepEqual(state.completed, ['biology']);
  assert.deepEqual(state.previous, ['physics']);
  assert.deepEqual(state.plans, {
    physics: { topicId: 'speed-and-velocity', levels: {} },
    biology: { topicId: 'photosynthesis', levels: {} },
    english: { topicId: 'persuasive-writing', levels: {} },
  });
  assert.equal(state.tutor, 'linda');
  assert.equal(state.xp, 30);
  assert.equal(state.commit, 10);
  assert.equal(state.recharges, 1);
  assert.equal(state.bestStreak, 2);
  assert.deepEqual(state.days, [20100]);
});

test('a completed starter earns XP and claims its welcome offer only once', () => {
  const state = freshProgress();
  assert.deepEqual(completeLesson(state, 'math', 1, true, 20100), {
    firstEver: true, before: 0, gain: 20, correct: 1, claimed: true,
  });
  assert.deepEqual(completeLesson(state, 'math', 2, true, 20100), {
    firstEver: false, before: 20, gain: 0, correct: 2, claimed: false,
  });
  assert.equal(state.xp, 20);
  assert.equal(state.recharges, 1);
  assert.equal(state.streak, 1);
  assert.deepEqual(state.days, [20100]);
});

test('practice can extend a streak across one missed day by using a recharge', () => {
  const state = freshProgress();
  completeLesson(state, 'math', 2, true, 20100);
  completeLesson(state, 'math', 2, false, 20102);
  assert.equal(state.recharges, 0);
  assert.equal(state.xp, 30);
  assert.equal(currentStreak(state, 20103), 2);
  assert.equal(currentStreak(state, 20104), 0);
  assert.deepEqual(state.days, [20100, 20102]);
  completeLesson(state, 'physics', 0, false, 20104);
  assert.equal(state.streak, 1);
  assert.equal(state.bestStreak, 2);
});

test('v3 roadmap positions migrate to topic IDs without assigning a difficulty', () => {
  const storage = storageWith({
    'lumino.app.v3': {
      tutor: 'charles', subject: 'physics', onboarded: true, xp: 60,
      completed: ['physics', 'math'], streak: 3, bestStreak: 4, lastDay: 20100,
      plans: { physics: { level: 0, start: 2 }, math: { level: 3, start: 3 } },
    },
  });
  const state = loadProgress(storage);
  assert.deepEqual(state.plans, {
    physics: { topicId: 'friction', levels: {} },
    math: { topicId: 'maxima-and-minima', levels: {} },
  });
  assert.equal(state.onboarded, true);
  assert.equal(state.tutor, 'charles');
  assert.equal(state.xp, 60);
  assert.equal(state.bestStreak, 4);
  assert.deepEqual(state.completed, ['physics', 'math']);
  assert.deepEqual(JSON.parse(storage.getItem(PROGRESS_KEY)), state);
});

test('each topic keeps its own playable level choice', () => {
  const state = freshProgress();
  state.plans.physics = {
    topicId: 'acceleration',
    levels: { friction: 'beginner', acceleration: 'advanced', momentum: 'senior', atoms: 'intermediate' },
  };
  const storage = storageWith();
  assert.equal(saveProgress(storage, state), true);
  assert.deepEqual(loadProgress(storage).plans, {
    physics: { topicId: 'acceleration', levels: { friction: 'beginner', acceleration: 'advanced' } },
  });
});

test('reset clears the current and all earlier save formats', () => {
  const storage = storageWith({ 'lumino.app.v3': {}, 'lumino.app.v2': {}, 'lumino-v2': {} });
  assert.equal(saveProgress(storage, freshProgress()), true);
  assert.equal(clearProgress(storage), true);
  for (const key of [PROGRESS_KEY, 'lumino.app.v3', 'lumino.app.v2', 'lumino-v2']) assert.equal(storage.getItem(key), null);
});

test('unavailable or corrupted storage allows a fresh session', () => {
  const storage = storageWith();
  storage.setItem(PROGRESS_KEY, '{');
  assert.deepEqual(loadProgress(storage), freshProgress());
  const denied = { getItem() { throw new Error('Access denied'); }, setItem() { throw new Error('Access denied'); } };
  assert.deepEqual(loadProgress(denied), freshProgress());
  assert.equal(saveProgress(denied, freshProgress()), false);
});
