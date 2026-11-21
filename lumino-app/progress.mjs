import { TROPHIES } from './content.mjs?v=24';
import { LEVELS, SUBJECTS, subjectById, topicById } from './curriculum.mjs?v=24';

export const PROGRESS_KEY = 'lumino.app.v4';
const ROADMAP_KEY = 'lumino.app.v3';
const DEMO_KEY = 'lumino.app.v2';
const LEGACY_KEY = 'lumino-v2';
const KEYS = [PROGRESS_KEY, ROADMAP_KEY, DEMO_KEY, LEGACY_KEY];

// The layout of the original numeric roadmaps, independent of the current picker order.
const legacyTopics = {
  math: [
    ['number-sense', 'add-and-subtract', 'multiply-and-divide', 'fractions'],
    ['letters-for-numbers', 'simple-equations', 'expressions', 'patterns-and-rules'],
    ['linear-equations', 'brackets-and-factorising', 'simultaneous-equations', 'quadratics'],
    ['gradients-from-tangents', 'derivatives', 'stationary-points', 'maxima-and-minima'],
  ],
  physics: [
    ['pushes-and-pulls', 'gravity', 'friction', 'balanced-forces'],
    ['speed-and-velocity', 'acceleration', 'kinetic-and-potential-energy', 'conservation-of-energy'],
    ['simple-circuits', 'current-and-voltage', 'ohms-law', 'sound-and-light-waves'],
    ['newtons-laws', 'momentum', 'work-and-power', 'circular-motion'],
  ],
  chemistry: [
    ['solids-liquids-and-gases', 'changing-state', 'the-particle-model', 'mixtures-and-separation'],
    ['atoms', 'the-periodic-table', 'elements-and-compounds', 'chemical-bonding'],
    ['physical-and-chemical-change', 'acids-and-bases', 'balancing-equations', 'rates-of-reaction'],
    ['moles', 'concentration', 'percentage-yield', 'gas-volumes'],
  ],
  biology: [
    ['characteristics-of-life', 'classification', 'plants-and-animals', 'habitats'],
    ['cell-structure', 'photosynthesis', 'transport-in-plants', 'plant-reproduction'],
    ['digestion', 'circulation', 'breathing-and-respiration', 'the-nervous-system'],
    ['food-webs', 'energy-flow', 'dna-and-inheritance', 'evolution'],
  ],
  english: [
    ['finding-the-main-idea', 'making-inferences', 'vocabulary-in-context', 'fact-and-opinion'],
    ['parts-of-speech', 'tenses', 'punctuation', 'sentence-structure'],
    ['paragraph-structure', 'narrative-writing', 'persuasive-writing', 'editing-and-proofreading'],
    ['figurative-language', 'tone-and-mood', 'analysing-an-authors-choices', 'comparing-texts'],
  ],
};

const validTutor = value => ['linda', 'charles'].includes(value) ? value : null;
const subjectId = value => {
  const id = value === 'mathematics' ? 'math' : value;
  return subjectById(id) ? id : null;
};
const count = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
const day = value => Number.isInteger(value) && value >= 0 ? value : null;
const subjectList = values => [...new Set(Array.isArray(values) ? values.map(subjectId).filter(Boolean) : [])];

export function freshProgress() {
  return {
    tutor: null, subject: null, plans: {}, completed: [], previous: [],
    onboarded: false, xp: 0, streak: 0, bestStreak: 0, lastDay: null,
    days: [], recharges: 0, rechargeGiven: false, commit: null,
  };
}

function read(storage, key) {
  try {
    const saved = JSON.parse(storage?.getItem(key));
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : null;
  } catch {
    return null;
  }
}

function validPlan(subject, value) {
  if (!topicById(subject, value?.topicId)) return null;
  const levels = Object.fromEntries(Object.entries(value.levels || {}).filter(([id, level]) =>
    topicById(subject, id) && LEVELS.some(item => item.id === level)));
  return { topicId: value.topicId, levels };
}

function migratePlan(subject, value) {
  if (!Number.isInteger(value?.level)) return null;
  const topics = legacyTopics[subject.id][value.level];
  if (!topics) return null;
  const topicId = topics[Math.min(count(value.start), topics.length - 1)];
  return validPlan(subject, { topicId });
}

function normalize(saved, readPlan = validPlan) {
  const state = freshProgress();
  state.tutor = validTutor(saved.tutor);
  state.subject = subjectId(saved.subject);
  for (const subject of SUBJECTS) {
    const plan = readPlan(subject, saved.plans?.[subject.id]);
    if (plan) state.plans[subject.id] = plan;
  }
  state.completed = subjectList(saved.completed);
  state.previous = subjectList(saved.previous);
  state.onboarded = saved.onboarded === true;
  state.xp = count(saved.xp);
  state.streak = count(saved.streak);
  state.bestStreak = Math.max(state.streak, count(saved.bestStreak));
  state.lastDay = day(saved.lastDay);
  state.days = Array.isArray(saved.days) ? [...new Set(saved.days.map(day).filter(value => value !== null))] : [];
  if (state.lastDay !== null && !state.days.includes(state.lastDay)) state.days.push(state.lastDay);
  state.recharges = count(saved.recharges);
  state.rechargeGiven = saved.rechargeGiven === true;
  state.commit = TROPHIES.some(trophy => trophy.d === saved.commit) ? saved.commit : null;
  return state;
}

export function loadProgress(storage) {
  const saved = read(storage, PROGRESS_KEY);
  if (saved) return normalize(saved);

  const roadmap = read(storage, ROADMAP_KEY);
  if (roadmap) {
    const state = normalize(roadmap, migratePlan);
    saveProgress(storage, state);
    return state;
  }

  const demo = read(storage, DEMO_KEY);
  const legacy = read(storage, LEGACY_KEY);
  const state = demo ? normalize(demo, migratePlan) : freshProgress();

  if (demo) {
    state.completed = SUBJECTS.filter(({ id }) => {
      const plan = demo.plans?.[id];
      return state.plans[id] && count(plan.next) > count(plan.start);
    }).map(({ id }) => id);
  }
  if (legacy) {
    state.tutor ||= validTutor(legacy.tutor) || (legacy.guide === 'male' ? 'charles' : 'linda');
    const id = subjectId(legacy.subject);
    state.subject ||= id;
    const subject = subjectById(id);
    if (subject && legacy.intro === true) {
      state.plans[id] ||= migratePlan(subject, { level: legacy.level }) || migratePlan(subject, { level: 0 });
    }
    state.onboarded ||= legacy.intro === true;
    state.previous = subjectList(legacy.complete);
  }
  if (demo || legacy) saveProgress(storage, state);
  return state;
}

export function saveProgress(storage, state) {
  if (!storage) return false;
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(storage) {
  if (!storage) return true;
  try {
    for (const key of KEYS) storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function localDay(date = new Date()) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 864e5;
}

export function currentStreak(state, today = localDay()) {
  if (state.lastDay === null) return 0;
  const gap = today - state.lastDay;
  return gap <= 1 || (gap === 2 && state.recharges > 0) ? state.streak : 0;
}

export function completeLesson(state, sid, correct, welcomeOffer, today = localDay()) {
  const firstEver = state.completed.length === 0;
  const before = state.xp;
  const gain = state.completed.includes(sid) ? 0 : 10 + 10 * correct;
  if (gain) state.completed.push(sid);
  state.xp += gain;
  if (state.lastDay === null || today > state.lastDay) {
    const gap = state.lastDay === null ? Infinity : today - state.lastDay;
    if (gap === 1) state.streak++;
    else if (gap === 2 && state.recharges > 0) {
      state.recharges--;
      state.streak++;
    } else state.streak = 1;
    state.lastDay = today;
    state.days = state.days.filter(date => date >= today - 6);
    state.days.push(today);
    state.bestStreak = Math.max(state.bestStreak, state.streak);
  }
  const claimed = welcomeOffer && !state.rechargeGiven;
  if (claimed) {
    state.recharges++;
    state.rechargeGiven = true;
  }
  state.onboarded = true;
  return { firstEver, before, gain, correct, claimed };
}
