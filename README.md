# Lumino

Lumino is a STEAM learning adventure for learners, parents and guardians. Build your way through this. Learn an idea, apply it to a problem and see what you can recall.

See the [project state](PROJECT_STATE.md) for what’s live, curriculum progress and the proposed next milestone.

The planned learning resource center will help learners revisit concepts and find ways to practise, and give parents and guardians guidance for supporting learning at home.

## Learning direction

In the planned exploration game, learners will apply physics and chemistry by building gadgets, testing them in simplified simulations, and using them to get through the trails. The Biology Lab will let learners simulate living processes and run experiments. The Math Playground will let them change quantities and see how related values, graphs and equations respond. Planned English practice includes stories and other reading, spaced exercises, and conversations with AI tutors.

That practice also builds judgment for working with AI. Learners should be able to question a suggestion, check its assumptions and evidence, and decide how to improve it.

The prototype pairs learners with Linda or Charles. A short, optional confidence check can suggest a starting level. Each subject has a four-level Learn roadmap with tappable previews and a button for the next playable lesson. Physics has eight Motion lessons. Mathematics, Chemistry, Biology and English each have a starter lesson. Progress, XP and streaks are saved on this device. Ranks shows the streak calendar, goals, trophies and sample league.

The first new lesson started each day activates a 30-minute double-XP boost. In Practise, learners can review skills they missed on two different questions in the past 14 days. Three consecutive correct answers on distinct questions clear the skill from the review list. Physics review generates fresh questions. The other four subjects revisit their starter quizzes.

The **You** tab shows your learning summary, selected subjects and tutor. You can edit your display name, choose from four pixel-art avatars, and manage your daily goal, reminders, lesson hints, read-aloud, text size, motion and sample-league visibility. These settings stay in the current browser. Reminders appear in Learn while Lumino is open, and read-aloud uses the browser’s speech support. The guardian preview walks through a demo PIN and a read-only dashboard using sample learner data.

## Story lessons

Each of the 12 playable lessons moves through Introduction, Goal, Definitions, Concept, Examples, Test, Summary and Sandbox. Learners tap the card edges, use the arrow keys or choose Back and Next. Six multiple-choice questions contribute to the score. A seventh question invites a typed or dictated explanation and shows a model answer for comparison. The Sandbox button reads “Coming soon”. Activities in Examples return to the same card.

### Add a lesson

1. Copy a lesson module from `lumino-app/lessons/<subject>/` and give the file and its exported record the same permanent lesson ID. Set its subject, roadmap level, title and estimated minutes.
2. Supply the hook, two or three goals, three to five definitions, two to five concepts with alternate explanations, and two to four examples including a worked problem and a real-world application. Give each example and concept a tutor line.
3. Write seven to ten quiz items, including one or two explanations with model answers. Give each graded question four distinct choices, a zero-based correct index and feedback. Use permanent question IDs and a registered skill with at least two distinct graded questions per lesson. The skill registry uses Motion skill IDs for Physics and starter curriculum topic IDs for the other four subjects.
4. Add three to five takeaways and a key rule or formula. Set `sandbox` to `null`. Register the module in `lumino-app/lessons/index.mjs` and link it from the appropriate roadmap. Physics uses the skill groups and ordered list in `physics-motion.mjs`.
5. Add its URL to `sw.js`, bump the cache, update the migration checklist and request educational review. Run `npm run check` for schema and catalogue checks and `npm test` for behaviour.

## Run locally

Run `npm run check` and `npm test`, then `npm start` and open `http://localhost:4173`. The GitHub Pages entry point is a public introduction, and the interactive learning prototype is available at `lumino-app/`. The app uses browser-local storage and can work offline after its first successful load.

Open Cart Workshop from the Physics roadmap to predict a stopping distance and compare tyre grip across two runs. Landscape game nodes open the existing trail explorer, including the Rice Fields bridge-building challenge and the desert relay. Move with the arrow keys or A and D, hold Shift to run, press Space to jump, and press E to use a trail tool. The desert relay uses four-direction movement on an isometric tile grid. On-screen controls are available.

The activities are early prototypes and need educational review. Accounts, payments, live AI, and full curricula are not implemented.

## Assets and contributions

The canonical Linda and Charles portraits are in `assets/`. The `*-poses.webp` dialogue sheets in `tutor/assets/` have four square cells. The top row is greeting and explaining. The bottom row is thinking and encouraging. Only add assets with verified rights for public distribution. Do not commit secrets, learner data, internal documents, or unlicensed artwork. Learning content should include an objective, an application challenge, and a retrieval check.

Navigation, subject, reward and avatar artwork is in `assets/ui-icons/`. When adding or replacing UI assets, keep the application’s asset URLs and the offline cache in `sw.js` in sync.

Released under the [MIT License](LICENSE).
