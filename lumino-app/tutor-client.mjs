// Tutor client: the single seam between the Practise UI and whatever answers the learner.
//
// The UI only ever consumes an async iterable of events:
//   { type: 'text', delta }                       a chunk of the tutor's reply
//   { type: 'question', question }                a structured question the UI renders natively
//   { type: 'done' }                              the turn is complete
//
// question = { id, topicId, stem, options: string[], answer: number, explanation }
//
// Phase 1 ships a scripted stand-in (createMockTutor) that speaks this protocol.
// Phase 2 swaps in createLiveTutor, which reads the same events from a Worker endpoint.
// Nothing in practise.mjs changes when that happens.

import { LESSONS, TUTOR_HELP } from './content.mjs?v=24';
import { SUBJECTS, subjectById, topicById } from './curriculum.mjs?v=34';

const sleep = (ms, signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
  const timer = setTimeout(resolve, ms);
  signal?.addEventListener('abort', () => {
    clearTimeout(timer);
    reject(new DOMException('Aborted', 'AbortError'));
  }, { once: true });
});

// Extra questions per subject so "Another one" does not repeat the starter lesson straight away.
// Each is tagged with a real curriculum topic id so mistake tracking lines up with the roadmap.
const BANK = {
  math: [
    { topicId: 'simple-equations', stem: 'Solve 5x − 3 = 22.', options: ['x = 4', 'x = 5', 'x = 19'], answer: 1, explanation: 'Add 3 to both sides to get 5x = 25, then divide by 5.' },
    { topicId: 'fractions', stem: 'Which fraction is equal to 2/4?', options: ['1/2', '2/8', '4/2'], answer: 0, explanation: 'Divide the top and bottom by 2 and you get 1/2.' },
    { topicId: 'multiply-and-divide', stem: 'A pack holds 12 bolts. How many bolts are in 7 packs?', options: ['19', '84', '72'], answer: 1, explanation: '7 equal groups of 12 is 7 × 12 = 84.' },
  ],
  physics: [
    { topicId: 'speed-and-velocity', stem: 'A robot travels 90 m in 15 s. What is its average speed?', options: ['6 m/s', '75 m/s', '1350 m/s'], answer: 0, explanation: 'Average speed is distance ÷ time: 90 ÷ 15 = 6 m/s.' },
    { topicId: 'gravity', stem: 'Which force pulls a dropped spanner towards the ground?', options: ['Friction', 'Gravity', 'Magnetism'], answer: 1, explanation: 'Gravity pulls objects towards Earth.' },
    { topicId: 'friction', stem: 'What does friction do to a sliding crate?', options: ['Speeds it up', 'Slows it down', 'Has no effect'], answer: 1, explanation: 'Friction acts against the motion, so the crate slows down.' },
  ],
  chemistry: [
    { topicId: 'physical-and-chemical-change', stem: 'Which one is a chemical change?', options: ['Water boiling', 'Iron rusting', 'Sugar dissolving'], answer: 1, explanation: 'Rust is a new substance. The other two keep the same substance.' },
    { topicId: 'changing-state', stem: 'What is it called when a liquid becomes a gas?', options: ['Melting', 'Freezing', 'Evaporating'], answer: 2, explanation: 'A liquid turning into a gas is evaporation (or boiling).' },
    { topicId: 'atoms', stem: 'Which particle has a positive charge?', options: ['Electron', 'Proton', 'Neutron'], answer: 1, explanation: 'Protons are positive, electrons negative, neutrons neutral.' },
  ],
  biology: [
    { topicId: 'photosynthesis', stem: 'Where in a plant cell does photosynthesis happen?', options: ['Nucleus', 'Chloroplast', 'Cell wall'], answer: 1, explanation: 'Chloroplasts contain the chlorophyll that captures light.' },
    { topicId: 'cell-structure', stem: 'Which part controls what enters and leaves a cell?', options: ['Cell membrane', 'Nucleus', 'Vacuole'], answer: 0, explanation: 'The membrane is the cell’s gatekeeper.' },
    { topicId: 'food-webs', stem: 'In a food chain, what do we call an organism that makes its own food?', options: ['Consumer', 'Producer', 'Decomposer'], answer: 1, explanation: 'Producers, such as plants, make food using light energy.' },
  ],
  english: [
    { topicId: 'parts-of-speech', stem: 'Which word is the verb in “The engine roars loudly”?', options: ['engine', 'roars', 'loudly'], answer: 1, explanation: 'A verb names the action. Here that is “roars”.' },
    { topicId: 'punctuation', stem: 'Which sentence is punctuated correctly?', options: ['Its a long road.', 'It’s a long road.', 'Its’ a long road.'], answer: 1, explanation: 'It’s is the short form of “it is”, so it needs the apostrophe.' },
    { topicId: 'paragraph-structure', stem: 'What does the last sentence of a paragraph usually do?', options: ['Starts a new topic', 'Wraps up the point', 'Lists sources'], answer: 1, explanation: 'A closing sentence ties the paragraph’s point together.' },
  ],
};

function bankFor(subjectId) {
  const subject = subjectById(subjectId) ?? SUBJECTS[0];
  const starter = LESSONS[subject.id];
  const starterQuestions = [starter.apply, starter.recall].map((item, index) => ({
    topicId: subject.starterTopic,
    stem: item.q, options: item.o, answer: item.a, explanation: item.why, key: `${subject.id}-starter-${index}`,
  }));
  const extras = (BANK[subject.id] ?? []).map((item, index) => ({ ...item, key: `${subject.id}-bank-${index}` }));
  return [...extras, ...starterQuestions];
}

const lastUserText = messages => [...messages].reverse().find(message => message.role === 'user')?.text ?? '';
const askedKeys = messages => new Set(messages.filter(message => message.question).map(message => message.question.key));

function pickQuestion(subjectId, messages, { harder = false } = {}) {
  const bank = bankFor(subjectId);
  const asked = askedKeys(messages);
  const fresh = bank.filter(item => !asked.has(item.key));
  const pool = fresh.length ? fresh : bank;
  const chosen = harder ? pool[pool.length - 1] : pool[0];
  const subject = subjectById(subjectId) ?? SUBJECTS[0];
  return { ...chosen, id: `ai-${chosen.key}-${asked.size}`, subject: subject.id };
}

function voice(tutorId) {
  return tutorId === 'linda'
    ? {
        open: 'Let’s take this one step at a time.',
        quiz: 'Here is a question to check the idea.',
        next: 'Good. Here is another.',
        harder: 'Let’s raise the difficulty a little.',
        nudge: 'Tell me what you would like to work on, or ask for a question.',
        wrongCue: 'Check each option against the idea before you choose.',
      }
    : {
        open: 'Sure, let’s dig in.',
        quiz: 'Try this one.',
        next: 'Nice. Here’s another one.',
        harder: 'Alright, let’s turn it up a notch.',
        nudge: 'Tell me what you’d like to work on, or just ask for a question.',
        wrongCue: 'Picture it in the workshop before you pick.',
      };
}

function planReply({ tutorId, subjectId, messages }) {
  const text = lastUserText(messages).toLowerCase();
  const subject = subjectById(subjectId) ?? SUBJECTS[0];
  const talk = voice(tutorId);
  const help = TUTOR_HELP[subject.id]?.[tutorId] ?? [];
  const wantsQuestion = /(quiz|question|test me|another|next|practi[sc]e|mistake|again)/.test(text);
  const wantsHarder = /(harder|difficult|challenge)/.test(text);
  const wantsExplain = /(explain|why|how|what is|what’s|what's|differently|simply|stuck|help)/.test(text);
  const isFirst = messages.filter(message => message.role === 'user').length <= 1;

  if (wantsExplain && !wantsHarder) {
    // Only general material here: the per-question hints in TUTOR_HELP refer to a specific lesson question.
    const lesson = LESSONS[subject.id];
    const framing = help[0];
    return {
      text: `${talk.open} ${lesson.learn} ${framing ? framing + ' ' : ''}For example: ${lesson.ex}. Want a question to try it out?`,
      question: null,
    };
  }
  if (wantsHarder) {
    return { text: talk.harder, question: pickQuestion(subject.id, messages, { harder: true }) };
  }
  if (wantsQuestion || isFirst) {
    return { text: isFirst ? `${talk.open} ${talk.quiz}` : talk.next, question: pickQuestion(subject.id, messages) };
  }
  return { text: talk.nudge, question: null };
}

// Splits text into word-sized deltas so the UI can stream them.
function* chunks(text) {
  for (const part of text.match(/\S+\s*/g) ?? []) yield part;
}

export function createMockTutor({ wordDelay = 28, startDelay = 450 } = {}) {
  return {
    kind: 'mock',
    async *send({ tutorId, subjectId, messages, signal }) {
      const plan = planReply({ tutorId, subjectId, messages });
      if (startDelay) await sleep(startDelay, signal);
      for (const delta of chunks(plan.text)) {
        yield { type: 'text', delta };
        if (wordDelay) await sleep(wordDelay, signal);
      }
      if (plan.question) {
        if (startDelay) await sleep(Math.min(startDelay, 250), signal);
        yield { type: 'question', question: plan.question };
      }
      yield { type: 'done' };
    },
  };
}

// Phase 2 will implement this against a Worker endpoint that streams newline-delimited JSON
// events in the same shape. It is written now so the contract is explicit and testable.
export function createLiveTutor({ endpoint, fetchImpl = globalThis.fetch } = {}) {
  return {
    kind: 'live',
    async *send({ tutorId, subjectId, messages, signal }) {
      const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tutorId, subjectId,
          messages: messages.map(({ role, text, question, picked }) => ({
            role, text, ...(question ? { question: { id: question.id, stem: question.stem }, picked } : {}),
          })),
        }),
        signal,
      });
      if (!response.ok || !response.body) throw new Error(`Tutor unavailable (${response.status})`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newline;
        while ((newline = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, newline).trim();
          buffer = buffer.slice(newline + 1);
          if (line) yield parseEvent(line);
        }
      }
      if (buffer.trim()) yield parseEvent(buffer.trim());
    },
  };
}

// The model is not trusted: every event is validated before the UI sees it.
export function parseEvent(line) {
  let event;
  try { event = JSON.parse(line); } catch { throw new Error('Tutor sent an unreadable reply'); }
  if (event?.type === 'text' && typeof event.delta === 'string') return { type: 'text', delta: event.delta.slice(0, 2000) };
  if (event?.type === 'done') return { type: 'done' };
  if (event?.type === 'question') {
    const question = cleanQuestion(event.question);
    if (!question) throw new Error('Tutor sent a question the app could not read');
    return { type: 'question', question };
  }
  throw new Error('Tutor sent an unknown event');
}

// Returns a trimmed, well-formed question, or null. Used for live model output and for saved sessions.
export function cleanQuestion(q) {
  const ok = q && typeof q.stem === 'string' && q.stem.trim() && Array.isArray(q.options)
    && q.options.length >= 2 && q.options.length <= 5 && q.options.every(option => typeof option === 'string' && option.trim())
    && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length
    && typeof q.explanation === 'string';
  if (!ok) return null;
  return {
    id: String(q.id ?? `ai-${Date.now()}`).slice(0, 80),
    key: typeof q.key === 'string' ? q.key.slice(0, 80) : undefined,
    topicId: typeof q.topicId === 'string' ? q.topicId.slice(0, 60) : 'general',
    stem: q.stem.slice(0, 600), options: q.options.map(option => option.slice(0, 200)),
    answer: q.answer, explanation: q.explanation.slice(0, 800),
  };
}

export function tutorTopicName(subjectId, topicId) {
  const subject = subjectById(subjectId);
  return (subject && topicById(subject, topicId)?.name) || null;
}
