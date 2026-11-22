import assert from 'node:assert/strict';
import test from 'node:test';
import { SUBJECTS } from '../lumino-app/curriculum.mjs';
import {
  PRACTISE_KEY, clearSessions, loadSessions, newSession, sanitizeSessions, saveSessions,
  sessionProgress, sessionTitle, suggestionsFor,
} from '../lumino-app/practise.mjs';
import { cleanQuestion, createMockTutor, parseEvent } from '../lumino-app/tutor-client.mjs';

const instant = () => createMockTutor({ wordDelay: 0, startDelay: 0 });

async function collect(iterable) {
  const events = [];
  for await (const event of iterable) events.push(event);
  return events;
}

function storageWith(value) {
  const records = new Map(value === undefined ? [] : [[PRACTISE_KEY, value]]);
  return {
    getItem: key => records.get(key) ?? null,
    setItem: (key, next) => records.set(key, next),
    removeItem: key => records.delete(key),
  };
}

const goodQuestion = { id: 'q1', topicId: 'gravity', stem: 'Pick one', options: ['a', 'b', 'c'], answer: 1, explanation: 'Because b.' };

test('the first message gets a streamed reply, a native question and a done event', async () => {
  const events = await collect(instant().send({
    tutorId: 'charles', subjectId: 'physics', messages: [{ role: 'user', text: 'Quiz me on speed' }],
  }));
  assert.equal(events.at(-1).type, 'done');
  assert.ok(events.some(event => event.type === 'text' && event.delta.length > 0));
  const question = events.find(event => event.type === 'question')?.question;
  assert.ok(question, 'expected a question');
  assert.equal(cleanQuestion(question) !== null, true);
  assert.ok(SUBJECTS.find(item => item.id === 'physics'));
});

test('asking for an explanation does not force a question', async () => {
  const events = await collect(instant().send({
    tutorId: 'linda', subjectId: 'math',
    messages: [{ role: 'user', text: 'Quiz me' }, { role: 'tutor', text: 'ok' }, { role: 'user', text: 'Explain it differently' }],
  }));
  assert.equal(events.some(event => event.type === 'question'), false);
  assert.ok(events.some(event => event.type === 'text'));
});

test('another question does not repeat one already asked', async () => {
  const first = await collect(instant().send({ tutorId: 'charles', subjectId: 'chemistry', messages: [{ role: 'user', text: 'Quiz me' }] }));
  const asked = first.find(event => event.type === 'question').question;
  const second = await collect(instant().send({
    tutorId: 'charles', subjectId: 'chemistry',
    messages: [{ role: 'user', text: 'Quiz me' }, { role: 'tutor', text: 'Try this', question: asked }, { role: 'user', text: 'Another question' }],
  }));
  assert.notEqual(second.find(event => event.type === 'question').question.key, asked.key);
});

test('a reply can be aborted mid-stream', async () => {
  const controller = new AbortController();
  const stream = createMockTutor({ wordDelay: 5, startDelay: 0 }).send({
    tutorId: 'charles', subjectId: 'physics', messages: [{ role: 'user', text: 'Explain gravity' }], signal: controller.signal,
  });
  const iterator = stream[Symbol.asyncIterator]();
  await iterator.next();
  controller.abort();
  await assert.rejects(iterator.next(), { name: 'AbortError' });
});

test('untrusted model events are validated before the UI sees them', () => {
  assert.deepEqual(parseEvent('{"type":"text","delta":"Hi"}'), { type: 'text', delta: 'Hi' });
  assert.deepEqual(parseEvent('{"type":"done"}'), { type: 'done' });
  assert.throws(() => parseEvent('not json'), /unreadable/);
  assert.throws(() => parseEvent('{"type":"eval","code":"x"}'), /unknown/);
  assert.throws(() => parseEvent(JSON.stringify({ type: 'question', question: { ...goodQuestion, answer: 7 } })), /could not read/);
  assert.throws(() => parseEvent(JSON.stringify({ type: 'question', question: { ...goodQuestion, options: ['only one'] } })), /could not read/);
  assert.equal(parseEvent(JSON.stringify({ type: 'text', delta: 'x'.repeat(5000) })).delta.length, 2000);
  assert.equal(parseEvent(JSON.stringify({ type: 'question', question: goodQuestion })).question.answer, 1);
});

test('stored sessions are sanitised and capped', () => {
  const good = { id: 's1', subject: 'physics', tutor: 'charles', title: 'Speed', updated: 5,
    messages: [{ role: 'user', text: 'hi' }, { role: 'tutor', text: 'yo', question: goodQuestion, picked: 1 }] };
  const sessions = sanitizeSessions([
    good,
    { ...good, id: 's2', subject: 'nope' },
    { ...good, id: 's3', tutor: 'mallory' },
    { ...good, id: 's4', messages: [] },
    { ...good, id: 's5', messages: [{ role: 'tutor', text: 'x', question: { ...goodQuestion, answer: 99 }, picked: 0 }], updated: 9 },
    null, 'junk', 42,
  ]);
  assert.deepEqual(sessions.map(item => item.id), ['s5', 's1']);
  assert.equal(sessions[0].messages[0].question, undefined);
  assert.equal(sessions[1].messages[1].picked, 1);
  const many = Array.from({ length: 20 }, (_, index) => ({ ...good, id: `m${index}`, updated: index }));
  assert.equal(sanitizeSessions(many).length, 8);
});

test('session storage survives corrupt data and can be cleared', () => {
  assert.deepEqual(loadSessions(storageWith('{broken')), []);
  assert.deepEqual(loadSessions(undefined), []);
  const storage = storageWith();
  const session = { ...newSession({ subject: 'math', tutor: 'linda' }), messages: [{ role: 'user', text: 'hello' }] };
  assert.equal(saveSessions(storage, [session]), true);
  assert.equal(loadSessions(storage).length, 1);
  assert.equal(clearSessions(storage), true);
  assert.deepEqual(loadSessions(storage), []);
});

test('session progress counts answered and correct questions', () => {
  const session = { messages: [
    { role: 'tutor', text: '', question: goodQuestion, picked: 1 },
    { role: 'tutor', text: '', question: { ...goodQuestion, id: 'q2' }, picked: 0 },
    { role: 'tutor', text: '', question: { ...goodQuestion, id: 'q3' } },
  ] };
  assert.deepEqual(sessionProgress(session), { answered: 2, correct: 1, pct: 40 });
});

test('titles are tidy and suggestions are subject-specific', () => {
  assert.equal(sessionTitle('  hello   world '), 'hello world');
  assert.ok(sessionTitle('x'.repeat(200)).length <= 48);
  assert.equal(sessionTitle('   '), 'Practice');
  for (const subject of SUBJECTS) {
    const prompts = suggestionsFor(subject);
    assert.equal(prompts.length, 3);
    assert.ok(prompts[0].startsWith('Quiz me on '));
  }
});
