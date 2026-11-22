const CACHE = "lumino-v64";
const ASSETS = [
  "./", "./index.html", "./lumino-app/", "./lumino-app/index.html", "./learn.html", "./about.html",
  "./styles.css", "./landing.css", "./app.js?v=62", "./manifest.webmanifest", "./assets/lumino-icon-192.png?v=46", "./assets/lumino-icon-512.png", "./assets/lumino-maskable.png",
  "./assets/lumino-icon-192-white.png?v=64", "./assets/lumino-icon-512-white.png?v=64", "./assets/lumino-maskable-white.png?v=64", "./assets/lumino-apple-touch-white.png?v=64",
  "./assets/lumino-preview.png?v=47", "./assets/lumino-favicon.png?v=46", "./assets/lumino-fire-hydrant.webp", "./assets/lumino-grass-soil.webp",
  "./assets/lumino-linda.webp?v=19", "./assets/lumino-charles.webp?v=19",
  "./adventure/adventure.css?v=21", "./adventure/game.mjs?v=59", "./adventure/levels.mjs", "./adventure/art.mjs",
  "./assets/landscapes/wheat.webp", "./assets/landscapes/rice.webp", "./assets/landscapes/mountains.webp",
  "./assets/landscapes/city.webp", "./assets/landscapes/rainforest.webp", "./assets/landscapes/desert.webp",
  "./assets/roadmaps/jungle-canyon.webp",
  "./assets/roadmaps/mountain-forest.webp",
  "./assets/roadmaps/sunset-temple.webp",
  "./assets/roadmaps/sunset-valley.webp",
  "./assets/roadmaps/temple-ruins.webp",
  "./assets/roadmaps/terraced-valley.webp",
  "./assets/ui-icons/learn.webp", "./assets/ui-icons/streak.webp", "./assets/ui-icons/you.webp",
  "./assets/ui-icons/flame.webp", "./assets/ui-icons/bolt.webp", "./assets/ui-icons/star.webp", "./assets/ui-icons/trophy.webp",
  "./assets/ui-icons/math.webp", "./assets/ui-icons/physics.webp", "./assets/ui-icons/chemistry.webp",
  "./assets/ui-icons/biology.webp", "./assets/ui-icons/english.webp",
  "./assets/ui-icons/avatar-mint.webp", "./assets/ui-icons/avatar-banana.webp",
  "./assets/ui-icons/avatar-coral.webp", "./assets/ui-icons/avatar-sky.webp",
  "./lumino-app/onboarding.mjs?v=59", "./lumino-app/onboarding.css?v=44",
  "./tutor/assets/linda.webp", "./tutor/assets/charles.webp",
  "./lumino-app/app.css?v=62", "./lumino-app/practise.css?v=5", "./lumino-app/practise.mjs?v=59", "./lumino-app/tutor-client.mjs?v=59", "./lumino-app/content.mjs?v=59", "./lumino-app/curriculum.mjs?v=34",
  "./lumino-app/pixel-art.mjs?v=31", "./lumino-app/progress.mjs?v=60", "./lumino-app/shortcut.mjs?v=22",
  "./lumino-app/profile.mjs?v=60", "./lumino-app/guardian-preview.mjs?v=59",
  "./lumino-app/roadmap.mjs?v=62", "./lumino-app/physics-motion.mjs?v=59", "./lumino-app/cart-workshop.mjs?v=34",
  "./lumino-app/story-lesson.css",
  "./lumino-app/story-lesson.mjs",
  "./lumino-app/lessons/index.mjs",
  "./lumino-app/lessons/physics/physics-speed-and-velocity-intro.mjs",
  "./lumino-app/lessons/physics/physics-simple-circuits-intro.mjs",
  "./lumino-app/lessons/physics/physics-conservation-of-energy-intro.mjs",
  "./lumino-app/lessons/physics/physics-momentum-intro.mjs",
  "./lumino-app/lessons/math/math-simple-equations-intro.mjs",
  "./lumino-app/lessons/math/math-fractions-intro.mjs",
  "./lumino-app/lessons/math/math-patterns-and-rules-intro.mjs",
  "./lumino-app/lessons/math/math-quadratics-intro.mjs",
  "./lumino-app/lessons/chemistry/chemistry-physical-and-chemical-change-intro.mjs",
  "./lumino-app/lessons/chemistry/chemistry-the-periodic-table-intro.mjs",
  "./lumino-app/lessons/chemistry/chemistry-acids-and-bases-intro.mjs",
  "./lumino-app/lessons/chemistry/chemistry-rates-of-reaction-intro.mjs",
  "./lumino-app/lessons/biology/biology-photosynthesis-intro.mjs",
  "./lumino-app/lessons/biology/biology-cell-structure-intro.mjs",
  "./lumino-app/lessons/biology/biology-digestion-intro.mjs",
  "./lumino-app/lessons/biology/biology-dna-and-inheritance-intro.mjs",
  "./lumino-app/lessons/english/english-paragraph-structure-intro.mjs",
  "./lumino-app/lessons/english/english-making-inferences-intro.mjs",
  "./lumino-app/lessons/english/english-persuasive-writing-intro.mjs",
  "./lumino-app/lessons/english/english-analysing-an-authors-choices-intro.mjs",
  "./lumino-app/lessons/biology/biology-starter.mjs",
  "./lumino-app/lessons/chemistry/chemistry-starter.mjs",
  "./lumino-app/lessons/english/english-starter.mjs",
  "./lumino-app/lessons/math/math-starter.mjs",
  "./lumino-app/lessons/physics/physics-fair-cart-test.mjs",
  "./lumino-app/lessons/physics/physics-graph-gradient.mjs",
  "./lumino-app/lessons/physics/physics-graph-shapes.mjs",
  "./lumino-app/lessons/physics/physics-grip.mjs",
  "./lumino-app/lessons/physics/physics-speed-conversion.mjs",
  "./lumino-app/lessons/physics/physics-speed-on-the-bridge.mjs",
  "./lumino-app/lessons/physics/physics-speed-units.mjs",
  "./lumino-app/lessons/physics/physics-trip-data.mjs",
  "./tutor/assets/linda-expressions.webp", "./tutor/assets/charles-expressions.webp",
  "./tutor/assets/linda-poses.webp", "./tutor/assets/charles-poses.webp",
];

self.addEventListener("install", (event) => {
  const requests = ASSETS.map((url) => new Request(url, { cache: "reload" }));
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(requests)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => /^lumino-v\d+$/.test(key) && key !== CACHE).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate" || event.request.destination === "manifest") {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
