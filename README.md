# Lumino

Lumino is a STEAM learning adventure for learners, parents and guardians. Build your way through this. Learn an idea, apply it to a problem and see what you can recall.

See the [project state](PROJECT_STATE.md) for what’s live, curriculum progress and the proposed next milestone.

The planned learning resource center will help learners revisit concepts and find ways to practise, and give parents and guardians guidance for supporting learning at home.

## Learning direction

In the planned exploration game, learners will apply physics and chemistry by building gadgets, testing them in simplified simulations, and using them to get through the trails. The Biology Lab will let learners simulate living processes and run experiments. The Math Playground will let them change quantities and see how related values, graphs and equations respond. Planned English practice includes stories and other reading, spaced exercises, and conversations with AI tutors.

That practice also builds judgment for working with AI. Learners should be able to question a suggestion, check its assumptions and evidence, and decide how to improve it.

The prototype pairs learners with Linda or Charles. A short, optional confidence check can suggest a starting level. Each subject has a four-level Learn roadmap with tappable previews and a button for the next playable lesson. Physics has eight Motion lessons. Mathematics, Chemistry, Biology and English each have a starter lesson. Progress, XP and streaks are saved on this device. Ranks shows the streak calendar, goals, trophies and sample league.

The first new lesson started each day activates a 30-minute double-XP boost. In Practise, Physics learners can review skills they missed on two different questions in the past 14 days. Three consecutive correct answers on distinct questions clear the skill from the review list. The other subjects offer starter review.

The **You** tab shows your learning summary, selected subjects and tutor. You can edit your display name, choose from four pixel-art avatars, and manage your daily goal, reminders, lesson hints, read-aloud, text size, motion and sample-league visibility. These settings stay in the current browser. Reminders appear in Learn while Lumino is open, and read-aloud uses the browser’s speech support. The guardian preview walks through a demo PIN and a read-only dashboard using sample learner data.

## Run locally

Run `npm run check` and `npm test`, then `npm start` and open `http://localhost:4173`. The GitHub Pages entry point is a public introduction, and the interactive learning prototype is available at `lumino-app/`. The app uses browser-local storage and can work offline after its first successful load.

Open Cart Workshop from the Physics roadmap to predict a stopping distance and compare tyre grip across two runs. Landscape game nodes open the existing trail explorer, including the Rice Fields bridge-building challenge and the desert relay. Move with the arrow keys or A and D, hold Shift to run, press Space to jump, and press E to use a trail tool. The desert relay uses four-direction movement on an isometric tile grid. On-screen controls are available.

The activities are early prototypes and need educational review. Accounts, payments, live AI, and full curricula are not implemented.

## Assets and contributions

The canonical Linda and Charles portraits are in `assets/`. The `*-poses.webp` dialogue sheets in `tutor/assets/` have four square cells. The top row is greeting and explaining. The bottom row is thinking and encouraging. Only add assets with verified rights for public distribution. Do not commit secrets, learner data, internal documents, or unlicensed artwork. Learning content should include an objective, an application challenge, and a retrieval check.

Navigation, subject, reward and avatar artwork is in `assets/ui-icons/`. When adding or replacing UI assets, keep the application’s asset URLs and the offline cache in `sw.js` in sync.

Released under the [MIT License](LICENSE).
