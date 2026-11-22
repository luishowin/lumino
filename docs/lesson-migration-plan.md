# Story lesson migration

The current player builds a teaching screen followed by three-choice questions. Starter records carry learn/ex/apply/recall fields. Motion groups lessons and six questions under four skills. The mock Practise tutor also consumes starter material. The v4 save contains completions, raw best scores, dated answer events, boosts and rewards. The current card is local to a session.

Use one ES module per lesson with stable id, subject, level, title and estimatedMinutes, then intro, goal, definitions, concept, examples, quiz, summary and a null sandbox. Store alternate explanations and activity links on the relevant cards. Give each question a permanent ID and registered skill. Flatten the sections for a shared player. Keep answers and drafts in the session so backtracking and activity returns preserve them. Grade only multiple choice. Keep historical completions and XP, handle earlier score scales and starter review tags, and avoid duplicate answer events. Reuse tutor portraits, accessibility settings, reward flow, confidence check, roadmap and activity entry points. Keep the short generated Physics practice sessions available.

## Migration checklist

| Lesson | Subject | Quiz | Open | Status |
| --- | --- | ---: | ---: | --- |
| Read a speed and its units | Physics | 7 | 1 | needs educational review |
| Speed on the bridge | Physics | 7 | 1 | needs educational review |
| Convert m/s and km/h | Physics | 7 | 1 | needs educational review |
| Work with journeys in parts | Physics | 7 | 1 | needs educational review |
| Read the shape of a journey | Physics | 7 | 1 | needs educational review |
| Calculate speed from a graph | Physics | 7 | 1 | needs educational review |
| Compare grip under braking | Physics | 7 | 1 | needs educational review |
| Plan a fair cart test | Physics | 7 | 1 | needs educational review |
| Balancing equations | Mathematics | 7 | 1 | needs educational review |
| Change that lasts | Chemistry | 7 | 1 | needs educational review |
| Power from light | Biology | 7 | 1 | needs educational review |
| Open with a topic sentence | English | 7 | 1 | needs educational review |

Check quiz locking, review thresholds, score migration, speech fallback and the offline module graph. Verify completion through the roadmap for every subject.

## Verification

All 12 lessons passed schema validation and completed through the local browser player. The checks covered small-screen and desktop layouts, quiz locking, answer retention, both tutor portraits and optional activity returns. Biology completed offline after the service worker took control. Typed explanations worked with speech recognition unavailable. A simulated transcript exercised the dictation callback. Live microphone capture still needs a device check.

The 29 automated tests passed. The existing v4 key carries forward. Saved results without a denominator use their original scale (six questions for Motion and two for the other starters). Replays compare fractions, and the first-completion reward still applies once.
