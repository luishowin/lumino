import { TROPHIES } from './content.mjs?v=59';
import { LEVELS, SUBJECTS, subjectById, topicById } from './curriculum.mjs?v=34';
import { byId, stories } from './lessons/index.mjs';
import { MOTION_LESSONS, PHYSICS_STARTER } from './physics-motion.mjs?v=59';

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
const id = value => typeof value === 'string' && /^[a-z0-9-]{1,80}$/.test(value);
const BOOST_LENGTH = 30 * 60_000;
const ANSWER_WINDOW = 14 * 86_400_000;
const ANSWER_LIMIT = 400;

export const starterLessonId = subject => subject === 'physics' ? PHYSICS_STARTER : `${subject}-starter`;
export const AVATARS = ['mint', 'banana', 'coral', 'sky'];
export const DAILY_GOALS = [5, 10, 15, 20];
export const NAME_LIMIT = 16;

function normalizeProfile(saved) {
  return {
    name: typeof saved?.name === 'string' ? saved.name.slice(0, NAME_LIMIT) : '',
    avatar: AVATARS.includes(saved?.avatar) ? saved.avatar : 'mint',
    since: saved?.since <= 100_000_000 ? day(saved.since) : null,
    goal: DAILY_GOALS.includes(saved?.goal) ? saved.goal : 10,
    remind: saved?.remind === true,
    reminderTime: typeof saved?.reminderTime === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(saved.reminderTime)
      ? saved.reminderTime : '17:30',
    hints: saved?.hints === true,
    read: saved?.read === true,
    largeText: saved?.largeText === true,
    reduceMotion: saved?.reduceMotion === true,
    league: saved?.league !== false,
  };
}

export function freshProgress() {
  return {
    tutor: null, subject: null, plans: {}, completed: [], previous: [],
    onboarded: false, xp: 0, streak: 0, bestStreak: 0, lastDay: null,
    days: [], recharges: 0, rechargeGiven: false, commit: null,
    roadmapStarts: {}, lessonResults: {}, gameResults: {}, answerHistory: [], practiceSerial: 0,
    boostDay: null, boostUntil: 0,
    profile: normalizeProfile(),
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

function creditStarters(state) {
  for (const subject of state.completed) {
    state.lessonResults[starterLessonId(subject)] ??= { attempts: 1, best: null };
  }
}

function recentAnswers(history, now) {
  return history.filter(item => item.timestamp > now - ANSWER_WINDOW && item.timestamp <= now).slice(-ANSWER_LIMIT);
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
  for (const [lessonId, result] of Object.entries(saved.lessonResults ?? {})) {
    if (!id(lessonId) || !count(result?.attempts)) continue;
    state.lessonResults[lessonId] = { attempts: count(result.attempts), best: result.best == null ? null : count(result.best) };
    if (result.best != null) {
      state.lessonResults[lessonId].bestOf = count(result.bestOf) || (lessonId.startsWith('physics-') ? 6 : 2);
    }
  }
  for (const [gameId, result] of Object.entries(saved.gameResults ?? {})) {
    if (id(gameId) && ['completed', 'skipped'].includes(result)) state.gameResults[gameId] = result;
  }
  if (Array.isArray(saved.answerHistory)) {
    state.answerHistory = saved.answerHistory.filter(item => item &&
      subjectById(item.subject) && [item.questionId, item.topicId, item.subtopicId, item.skillTag].every(id) &&
      typeof item.right === 'boolean' && typeof item.givenAnswer === 'string' && count(item.timestamp)).slice(-ANSWER_LIMIT);
  }
  state.answerHistory = state.answerHistory.map(event => {
    if (event.subtopicId !== 'starter') return event;
    const skill = subjectById(event.subject).starterTopic;
    return { ...event, subtopicId: skill, skillTag: skill };
  });
  state.practiceSerial = count(saved.practiceSerial);
  state.boostDay = day(saved.boostDay);
  state.boostUntil = count(saved.boostUntil);
  creditStarters(state);
  state.profile = normalizeProfile(saved.profile);
  return state;
}

// The previous daily button used a different order from the skill-group menu.
function restoreRoadmapStarts(state, savedStarts) {
  for (const { id: sid } of SUBJECTS) {
    if (savedStarts && typeof savedStarts === 'object') {
      const saved = byId.get(savedStarts[sid]);
      if (saved?.subject === sid) state.roadmapStarts[sid] = saved.id;
      continue;
    }
    const previous = sid === 'physics' ? MOTION_LESSONS : [byId.get(starterLessonId(sid))];
    const used = previous.some(l => state.lessonResults[l.id]) || state.plans[sid] || (state.onboarded && state.subject === sid);
    if (!used) continue;
    const next = previous.find(l => !state.lessonResults[l.id]) ??
      stories.find(l => l.subject === sid && l.kind === 'introduction' && l.level === 'beginner-plus');
    state.roadmapStarts[sid] = next.id;
  }
}

export function loadProgress(storage) {
  const saved = read(storage, PROGRESS_KEY);
  if (saved) {
    const state = normalize(saved);
    restoreRoadmapStarts(state, saved.roadmapStarts);
    if (!saved.roadmapStarts) saveProgress(storage, state);
    return state;
  }

  const roadmap = read(storage, ROADMAP_KEY);
  if (roadmap) {
    const state = normalize(roadmap, migratePlan);
    restoreRoadmapStarts(state);
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
    creditStarters(state);
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
  if (demo || legacy) {
    restoreRoadmapStarts(state);
    saveProgress(storage, state);
  }
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

export function startDailyBoost(state, now = new Date()) {
  const today = localDay(now);
  if (state.boostDay !== null && today <= state.boostDay) return false;
  state.boostDay = today;
  state.boostUntil = now.getTime() + BOOST_LENGTH;
  return true;
}

export function boostRemaining(state, now = new Date()) {
  if (state.boostDay === null) return 0;
  return Math.max(0, Math.min(BOOST_LENGTH, state.boostUntil - now.getTime()));
}

export function recordAnswer(state, answer, timestamp = Date.now()) {
  state.answerHistory = recentAnswers([...state.answerHistory, { ...answer, timestamp }], timestamp);
}

export function weakSkills(state, subject, now = Date.now()) {
  const skills = new Map();
  for (const answer of recentAnswers(state.answerHistory, now)) {
    if (answer.subject !== subject) continue;
    const skill = skills.get(answer.subtopicId) ?? { missed: new Set(), correct: new Set(), latest: 0 };
    skills.set(answer.subtopicId, skill);
    if (answer.right) {
      skill.correct.add(answer.questionId);
      if (skill.correct.size >= 3) skill.missed.clear();
    } else {
      skill.correct.clear();
      skill.missed.add(answer.questionId);
      skill.latest = answer.timestamp;
    }
  }
  return [...skills.entries()]
    .filter(([, skill]) => skill.missed.size >= 2)
    .sort(([, a], [, b]) => b.missed.size - a.missed.size || b.latest - a.latest)
    .map(([id, skill]) => ({ id, misses: skill.missed.size }));
}

export function completeLesson(state, sid, correct, welcomeOffer, today = localDay(), {
  lessonId = starterLessonId(sid), multiplier = 1, practice = false, questionCount = 2,
} = {}) {
  const firstEver = !practice && Object.keys(state.lessonResults).length === 0;
  const before = state.xp;
  const previousResult = state.lessonResults[lessonId];
  const gain = practice || previousResult ? 0 : (10 + Math.round(20 * correct / questionCount)) * multiplier;
  if (!practice) {
    const keepBest = previousResult?.best != null &&
      previousResult.best / previousResult.bestOf > correct / questionCount;
    state.lessonResults[lessonId] = {
      attempts: (previousResult?.attempts ?? 0) + 1,
      best: keepBest ? previousResult.best : correct,
      bestOf: keepBest ? previousResult.bestOf : questionCount,
    };
    if (lessonId === starterLessonId(sid) && !state.completed.includes(sid)) state.completed.push(sid);
  }
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
  if (!state.onboarded) state.profile.since ??= today;
  state.onboarded = true;
  return { firstEver, before, gain, correct, claimed };
}
