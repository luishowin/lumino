# Lumino project state

**Last updated 21 November 2026**

Lumino’s first public prototype is live. The learning loop is **Learn → Apply → Recall**, with **“Build your way through this”** as the direction for the exploration game. [Open the live prototype](https://luishowin.github.io/lumino/lumino-app/)

## What’s live

- Learners choose Linda or Charles, take a short confidence check and get a suggested starting point. The tutors use scripted explanations and hints.
- Mathematics, Physics, Chemistry, Biology and English each have one playable starter lesson. Subject roadmaps preview topics for future lessons.
- Six landscape trails include the Rice Fields bridge build and the canyon relay. Chemistry and Biology offer optional trail activities alongside their starter lessons.
- Progress, XP and streaks are saved on the learner’s device. The prototype can work offline after a successful first load. The public site runs on GitHub Pages from `main`.

The Physics and Chemistry gadget-building game, Biology Lab, Math Playground, English spaced practice and live AI tutoring are planned. Accounts, payments and full syllabus coverage are also future work.

## Curriculum progress

The five handpicked Cambridge IGCSE syllabuses guide what Lumino teaches. The private authoring workbook maps 1,466 entries to syllabus pages and links five current starters and six planned activities to objectives. Five one-page subject maps give authors a quick overview. The workbook, source PDFs and maps are kept in the local curriculum folder.

| Subject | Cambridge IGCSE syllabus | Exam years |
| --- | --- | --- |
| Mathematics | 0580 | 2025–2027 |
| Physics | 0625 | 2026–2028 |
| Chemistry | 0620 | 2026–2028 |
| Biology | 0610 | 2023–2025 |
| First Language English | 0500 | 2027–2029 |

## Proposed next milestone

Build one complete **Physics cart challenge** that connects a starter lesson to the exploration game. Teach average speed and friction, then let the learner assemble a cart, choose its grip, predict what will happen and run a measured test. The learner revises the cart, uses it to clear a trail section and explains the result from the measurements.

- Show distance, time, average speed and stopping distance. Keep the starting conditions consistent so learners can compare one change at a time.
- Treat roughly 80% realism as a design goal. Check that each relationship the lesson teaches matches a simple reference case and explain the simulation’s relevant simplifications.
- Have an educator review the model and prompts. In a small learner test, check whether learners can connect their changes to the result and explain what the evidence shows.

## Follow-on activities

| Subject | Planned experience |
| --- | --- |
| Chemistry | Build an insulated carrier, compare melting across materials, and use the revised carrier on a warm trail. |
| Biology | Run a virtual photosynthesis experiment. Change light intensity while holding other variables steady and interpret the results. |
| Mathematics | Change a line’s slope or intercept and see the equation, graph and value table update together. |
| First Language English | Read short and long stories, discuss texts with AI tutors, and practise gap-fills, sentence writing, rewriting and passage reconstruction through spaced review. Use text evidence in comprehension and analysis answers. |

## Release checks

The first release passed `npm run check`, `npm test` and browser checks covering desktop, mobile, saved progress and offline loading. Keep these checks in the release routine and verify the public prototype after GitHub Pages finishes publishing.
