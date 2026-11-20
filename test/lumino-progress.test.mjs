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

test('legacy progress becomes prior achievements and keeps the selected learning level', () => {
  const storage = storageWith({
    'lumino-v2': { intro: true, subject: 'mathematics', level: 2, guide: 'male', complete: ['physics', 'mathematics'] },
  });
  const state = loadProgress(storage);
  assert.equal(state.tutor, 'charles');
  assert.equal(state.subject, 'math');
  assert.equal(state.onboarded, true);
  assert.deepEqual(state.plans, { math: { level: 2, start: 0 } });
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
    physics: { level: 1, start: 0 },
    biology: { level: 1, start: 1 },
    english: { level: 2, start: 2 },
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

test('reset clears the replacement and both earlier save formats', () => {
  const storage = storageWith({ 'lumino.app.v2': {}, 'lumino-v2': {} });
  assert.equal(saveProgress(storage, freshProgress()), true);
  assert.equal(clearProgress(storage), true);
  for (const key of [PROGRESS_KEY, 'lumino.app.v2', 'lumino-v2']) assert.equal(storage.getItem(key), null);
});

test('unavailable or corrupted storage allows a fresh session', () => {
  const storage = storageWith();
  storage.setItem(PROGRESS_KEY, '{');
  assert.deepEqual(loadProgress(storage), freshProgress());
  const denied = { getItem() { throw new Error('Access denied'); }, setItem() { throw new Error('Access denied'); } };
  assert.deepEqual(loadProgress(denied), freshProgress());
  assert.equal(saveProgress(denied, freshProgress()), false);
});
