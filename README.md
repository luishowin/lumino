# Lumino

Lumino is a STEAM learning adventure for learners, parents and guardians. Build your way through this. Learn an idea, apply it to a problem and see what you can recall.

See the [project state](PROJECT_STATE.md) for what’s live, curriculum progress and the proposed next milestone.

The planned learning resource center will help learners revisit concepts and find ways to practise, and give parents and guardians guidance for supporting learning at home.

## Learning direction

In the planned exploration game, learners will apply physics and chemistry by building gadgets, testing them in simplified simulations, and using them to get through the trails. The Biology Lab will let learners simulate living processes and run experiments. The Math Playground will let them change quantities and see how related values, graphs and equations respond. Planned English practice includes stories and other reading, spaced exercises, and conversations with AI tutors.

That practice also builds judgment for working with AI. Learners should be able to question a suggestion, check its assumptions and evidence, and decide how to improve it.

The prototype pairs learners with Linda or Charles, then uses a short confidence check to suggest a subject plan. Mathematics, physics, chemistry, biology, and English each offer one Learn, Apply, and Recall starter. The roadmap previews upcoming topics. XP and streaks are saved on this device, and Ranks compares local XP with sample scores.

## Run locally

Run `npm run check` and `npm test`, then `npm start` and open `http://localhost:4173`. The GitHub Pages entry point is a public introduction, and the interactive learning prototype is available at `lumino-app/`. The app uses browser-local storage and can work offline after its first successful load.

The Learn tab opens six landscape trails, including the bridge-building challenge in the Rice Fields. Chemistry and biology also offer optional trail activities before Apply. Move with the arrow keys or A and D, hold Shift to run, press Space to jump, and press E to use a trail tool. The desert relay uses four-direction movement on an isometric tile grid. On-screen controls are available.

The activities are early prototypes and need educational review. Accounts, payments, live AI, and full curricula are not implemented.

## Assets and contributions

The canonical Linda and Charles portraits are in `assets/`. The transparent expression sheets in `tutor/assets/` use four equal square cells. Read across each row, from thoughtful and speaking on the top row to encouraging and delighted on the bottom row. Use the canonical portraits for the neutral expression. Only add assets with verified rights for public distribution. Do not commit secrets, learner data, internal documents, or unlicensed artwork. Learning content should include an objective, an application challenge, and a retrieval check.

Released under the [MIT License](LICENSE).
