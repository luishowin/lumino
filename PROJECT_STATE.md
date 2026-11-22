# Lumino project state

**Last updated 22 November 2026**

Lumino’s first public prototype is live. The learning loop is **Learn → Apply → Recall**, with **“Build your way through this”** as the direction for the exploration game. [Open the live prototype](https://luishowin.github.io/lumino/lumino-app/)

## Current prototype

- Learners choose Linda or Charles, take a short confidence check and get a suggested starting point. The tutors use scripted explanations and hints.
- Mathematics, Physics, Chemistry, Biology and English each have one playable starter lesson. Subject roadmaps preview topics for future lessons.
- Six landscape trails include the Rice Fields bridge build and the canyon relay. Chemistry and Biology offer optional trail activities alongside their starter lessons.
- Profile shows the learner’s actual XP, streak, completed starters and trophies, with editable name and avatar, subject plans and tutor selection. Settings cover local goals, reminders, lesson help, display preferences and the sample league.
- The read-only guardian preview uses two sample learners. Guardian invitations, household accounts, enforcement of limits, and sound and music are future work.
- Progress, XP and streaks are saved on the learner’s device. The prototype can work offline after a successful first load. The public site runs on GitHub Pages from `main`.

The Physics and Chemistry gadget-building game, Biology Lab, Math Playground, English spaced practice and live AI tutoring are planned. Accounts, payments and full syllabus coverage are also future work.

## Interface update · 22 November 2026

- Added pixel-art navigation, subject and reward icons, plus four hoodie avatars. The subject artwork appears in onboarding, Learn and Profile. Trophy tiers and inactive reward states remain visually distinct.
- Added a progressive blur below scrolling content and kept the dock controls sharp. The active starter lesson keeps the yellow outline, and the learning-plan card uses a muted `#2E4353` outline.
- Added the Profile and Settings views without a new progress storage key. Existing progress and tutor choices carry over. New artwork and modules are included in the offline cache.

## Curriculum progress

The five handpicked Cambridge IGCSE syllabuses guide what Lumino teaches. The private authoring workbook maps 1,466 entries to syllabus pages and links five current starters and six planned activities to objectives. Five one-page subject maps give authors a quick overview. The workbook, source PDFs and maps are kept in the local curriculum folder.

| Subject | Cambridge IGCSE syllabus | Exam years |
| --- | --- | --- |
| Mathematics | 0580 | 2025–2027 |
| Physics | 0625 | 2026–2028 |
| Chemistry | 0620 | 2026–2028 |
| Biology | 0610 | 2023–2025 |
| First Language English | 0500 | 2027–2029 |

## Roadmap milestone in the local build

Learn now opens a four-level roadmap for each subject. It offers a next-lesson button, tappable previews and game nodes that open the existing trail explorer. Physics Motion has eight lessons and a separate Cart Workshop. Learners fit tyres, predict where the cart will stop, compare at least two runs and choose an explanation supported by the measurements.

- Each run shows approach distance, time, average speed and braking distance. The simplified model holds the cart, track and braking speed constant while learners change the tyres.
- Practise uses tagged Physics answers to find skills for review and offers fresh questions in the lesson interface. The other subjects offer starter review. Lesson-level saves preserve existing starter completions, XP and streaks.
- Ranks includes the streak calendar, goals and trophies. The first eligible lesson each day activates a 30-minute double-XP boost.
- Next, have an educator review the model and prompts. In a small learner test, check whether learners can connect their changes to the result and explain what the evidence shows.

## Follow-on activities

| Subject | Planned experience |
| --- | --- |
| Chemistry | Build an insulated carrier, compare melting across materials, and use the revised carrier on a warm trail. |
| Biology | Run a virtual photosynthesis experiment. Change light intensity while holding other variables steady and interpret the results. |
| Mathematics | Change a line’s slope or intercept and see the equation, graph and value table update together. |
| First Language English | Read short and long stories, discuss texts with AI tutors, and practise gap-fills, sentence writing, rewriting and passage reconstruction through spaced review. Use text evidence in comprehension and analysis answers. |

## Release checks

The 22 November update passed syntax checks and all 10 progress tests. Local browser checks covered desktop and mobile layout, profile persistence, the guardian preview, reward states, dock behaviour and avatar selection. The service-worker asset list was checked against the repository files. Verify the public prototype after GitHub Pages finishes publishing.
