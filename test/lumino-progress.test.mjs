import assert from 'node:assert/strict';
import test from 'node:test';
import { cartTrial } from '../lumino-app/cart-workshop.mjs';
import { getPracticeSession, MOTION_LESSONS, MOTION_SKILLS } from '../lumino-app/physics-motion.mjs';
import {
  PROGRESS_KEY, boostRemaining, clearProgress, completeLesson, currentStreak,
  freshProgress, loadProgress, localDay, recordAnswer, saveProgress, startDailyBoost, starterLessonId, weakSkills,
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

test('profile preferences survive reload alongside existing progress', () => {
  const storage = storageWith({ [PROGRESS_KEY]: { xp: 50, onboarded: true, tutor: 'linda' } });
  const state = loadProgress(storage);
  assert.deepEqual(state.profile, freshProgress().profile);
  const profile = {
    name: 'Baraka', avatar: 'sky', since: 20100, goal: 15, remind: true, reminderTime: '08:45',
    hints: true, read: true, largeText: true, reduceMotion: true, league: false,
  };
  state.profile = profile;
  assert.equal(saveProgress(storage, state), true);
  assert.deepEqual(loadProgress(storage), state);
  assert.equal(loadProgress(storage).xp, 50);
});

test('malformed profile data keeps safe defaults without losing XP', () => {
  const storage = storageWith({ [PROGRESS_KEY]: {
    xp: 120, profile: { name: 7, avatar: 'bad', since: 100_000_001, goal: 42, remind: 'true', reminderTime: '25:99' },
  } });
  assert.deepEqual(loadProgress(storage).profile, freshProgress().profile);
  assert.equal(loadProgress(storage).xp, 120);
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

test('a v4 starter completion credits exactly one lesson and survives reload', () => {
  const storage = storageWith({ [PROGRESS_KEY]: { completed: ['physics'], xp: 30, lastDay: 20100, streak: 3 } });
  const state = loadProgress(storage);
  const starter = starterLessonId('physics');
  const next = MOTION_LESSONS.find(item => item.id !== starter);
  assert.deepEqual(state.lessonResults, { [starter]: { attempts: 1, best: null } });
  assert.equal(completeLesson(state, 'physics', 6, false, 20100, { lessonId: starter, multiplier: 2, questionCount: 6 }).gain, 0);
  assert.equal(completeLesson(state, 'physics', 6, false, 20100, { lessonId: next.id, multiplier: 2, questionCount: 6 }).gain, 60);
  saveProgress(storage, state);
  assert.equal(loadProgress(storage).xp, 90);
  assert.deepEqual(loadProgress(storage).lessonResults, state.lessonResults);
  assert.equal(loadProgress(storage).streak, 3);
});

test('daily boost persists, lasts 30 minutes, and starts once per local day', () => {
  const state = freshProgress();
  const start = new Date(2026, 10, 22, 23, 55);
  assert.equal(startDailyBoost(state, start), true);
  const storage = storageWith({ [PROGRESS_KEY]: state });
  const restored = loadProgress(storage);
  assert.equal(startDailyBoost(restored, start), false);
  assert.equal(boostRemaining(restored, new Date(2026, 10, 23, 0, 5)), 20 * 60_000);
  assert.equal(boostRemaining(restored, new Date(2026, 10, 23, 0, 25)), 0);
  assert.equal(startDailyBoost(restored, new Date(2026, 10, 23, 7)), true);
});

test('two distinct recent misses surface a skill and three distinct correct answers clear it', () => {
  const state = freshProgress();
  const now = new Date(2026, 10, 22, 14);
  const answer = {
    subject: 'physics', topicId: 'speed-and-velocity', subtopicId: 'average-speed',
    skillTag: 'average-speed', givenAnswer: '5 m/s',
  };
  const add = (questionId, right) => recordAnswer(state, { ...answer, questionId, right }, now.getTime());
  add('q-1', false);
  add('q-1', false);
  assert.deepEqual(weakSkills(state, 'physics', now.getTime()), []);
  add('q-2', false);
  assert.deepEqual(weakSkills(state, 'math', now.getTime()), []);
  assert.deepEqual(weakSkills(state, 'physics', now.getTime()), [{ id: 'average-speed', misses: 2 }]);
  assert.deepEqual(weakSkills(state, 'physics', now.getTime() + 14 * 86_400_000), []);
  add('review-1', true);
  add('review-1', true);
  add('review-2', true);
  assert.equal(weakSkills(state, 'physics', now.getTime()).length, 1);
  add('review-3', true);
  assert.deepEqual(weakSkills(state, 'physics', now.getTime()), []);
  const result = completeLesson(state, 'physics', 3, false, localDay(now), { lessonId: 'practice-average-speed', practice: true });
  assert.equal(result.gain, 0);
  assert.equal(state.streak, 1);
  assert.deepEqual(state.lessonResults, {});
});

test('each Physics review has distinct valid questions', () => {
  assert.equal(MOTION_LESSONS.length, 8);
  const taughtIds = new Set();
  for (const content of MOTION_LESSONS) {
    const graded = content.quiz.filter(q => q.type === 'mcq');
    assert.equal(graded.length, 6);
    for (const question of graded) {
      assert.ok(!taughtIds.has(question.id));
      taughtIds.add(question.id);
      assert.equal(new Set(question.options).size, 4, question.id);
      assert.ok(question.options[question.answer], question.id);
    }
  }
  for (const skill of MOTION_SKILLS) {
    const reviewedIds = new Set();
    for (let serial = 0; serial < 30; serial++) {
      const review = getPracticeSession(skill, serial);
      assert.equal(review.questions.length, 3);
      for (const question of review.questions) {
        assert.ok(!taughtIds.has(question.id) && !reviewedIds.has(question.id));
        reviewedIds.add(question.id);
        assert.equal(new Set(question.o).size, 3, question.id);
        assert.ok(question.o[question.a], question.id);
      }
    }
  }
});

test('tyre trials change braking distance while holding the approach constant', () => {
  const trials = ['smooth', 'tread', 'grippy'].map(cartTrial);
  assert.deepEqual(trials.map(trial => trial.brakingDistance), [10, 5, 3.2]);
  assert.deepEqual(trials.map(trial => trial.stopsInZone), [false, true, true]);
  for (const trial of trials) {
    assert.equal(trial.approachDistance, 12);
    assert.equal(trial.approachTime, 3);
    assert.equal(trial.brakeSpeed, 4);
  }
});
