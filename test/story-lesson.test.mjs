import test from 'node:test';
import assert from 'node:assert/strict';
import { checkCatalogue, validateLessons } from '../scripts/check-lessons.mjs';
import { starters, stories } from '../lumino-app/lessons/index.mjs';
import { fills, move, storySession } from '../lumino-app/story-lesson.mjs';
import { completeLesson, freshProgress, loadProgress, PROGRESS_KEY, recordAnswer, weakSkills } from '../lumino-app/progress.mjs';

test('all story files, sections and offline entries agree', checkCatalogue);
test('invalid stories fail validation', () => {
  for (const corrupt of [
    l => delete l.summary, l => l.quiz.splice(0, 2), l => l.quiz.push(...l.quiz),
    l => l.quiz[0].answer = [0, 1], l => l.quiz[0].answer = -1,
    l => l.quiz[0].why = ' ', l => delete l.concept[0].alt,
    l => l.quiz[0].skillId = 'unknown', l => l.quiz[0].options.fill('same'),
    l => l.quiz[1].id = l.quiz[0].id,
  ]) {
    const lesson = structuredClone(starters.math);
    corrupt(lesson);
    assert.throws(() => validateLessons([lesson]));
  }
});
test('section bars and quiz locks follow the card; revisits retain answers', () => {
  const session = storySession(starters.math);
  for (const [i, card] of session.cards.entries()) {
    assert.equal(session.position, i);
    assert.deepEqual(fills(card), Array(card.section).fill(1).concat((card.index + 1) / card.count, Array(7 - card.section).fill(0)));
    if (card.section === 5) {
      assert.equal(move(session, 1), 'locked');
      const value = card.item.type === 'explain' ? 'My explanation' : 0;
      session.answers.set(card.item.id, value);
      move(session, -1);
      move(session, 1);
      assert.equal(session.answers.get(card.item.id), value);
    }
    assert.equal(move(session, 1), i === session.cards.length - 1 ? 'finished' : 'moved');
  }
});
test('each taught skill can enter and clear review on distinct questions', () => {
  for (const l of stories) {
    const state = freshProgress();
    const q = l.quiz.filter(q => q.type === 'mcq');
    const time = Date.now();
    const log = (i, right, timestamp = time) => recordAnswer(state, {
      subject: l.subject, questionId: q[i].id, subtopicId: q[i].skillId, right,
    }, timestamp);
    const active = () => weakSkills(state, l.subject, time).map(s => s.id);
    log(1, false, time - 15 * 86400000);
    log(0, false); log(0, false);
    assert.deepEqual(active(), []);
    log(1, false);
    assert.deepEqual(active(), [q[1].skillId]);
    log(2, true); log(2, true); log(3, true);
    assert.equal(active().length, 1);
    log(4, true);
    assert.deepEqual(active(), []);
  }
});
test('a v4 two-question starter keeps its best fraction, XP, boost and recent review evidence', () => {
  const now = Date.now();
  const s = { ...freshProgress(), xp: 60, boostUntil: now + 60000, boostDay: 20200, lastDay: 20200, streak: 3,
    completed: ['math'], lessonResults: { 'math-starter': { attempts: 1, best: 2 } },
    answerHistory: starters.math.quiz.slice(0, 2).map(q => ({
      subject: 'math', questionId: q.id, topicId: 'simple-equations', subtopicId: 'starter', skillTag: 'starter',
      right: false, givenAnswer: '8', timestamp: now,
    })),
  };
  const restore = saved => loadProgress({ getItem: k => k === PROGRESS_KEY ? JSON.stringify(saved) : null });
  const migrated = restore(s);
  assert.equal(migrated.streak, 3);
  assert.equal(migrated.boostUntil, s.boostUntil);
  assert.deepEqual(weakSkills(migrated, 'math', now), [{ id: 'simple-equations', misses: 2 }]);
  completeLesson(migrated, 'math', 4, false, 20200, { questionCount: 6 });
  assert.deepEqual(migrated.lessonResults['math-starter'], { attempts: 2, best: 2, bestOf: 2 });
  assert.equal(migrated.xp, 60);
  assert.deepEqual(restore(migrated), migrated);
});
