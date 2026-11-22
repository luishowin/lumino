const CACHE = "lumino-v44";
const ASSETS = [
  "./", "./index.html", "./lumino-app/", "./lumino-app/index.html", "./learn.html", "./about.html",
  "./styles.css", "./landing.css", "./app.js?v=44", "./manifest.webmanifest", "./assets/lumino-icon-192.png",
  "./assets/lumino-preview.png", "./assets/lumino-favicon.png", "./assets/lumino-fire-hydrant.webp", "./assets/lumino-grass-soil.webp",
  "./assets/lumino-linda.webp?v=19", "./assets/lumino-charles.webp?v=19",
  "./adventure/adventure.css?v=21", "./adventure/game.mjs?v=30", "./adventure/levels.mjs", "./adventure/art.mjs",
  "./assets/landscapes/wheat.webp", "./assets/landscapes/rice.webp", "./assets/landscapes/mountains.webp",
  "./assets/landscapes/city.webp", "./assets/landscapes/rainforest.webp", "./assets/landscapes/desert.webp",
  "./assets/ui-icons/learn.webp", "./assets/ui-icons/streak.webp", "./assets/ui-icons/you.webp",
  "./assets/ui-icons/flame.webp", "./assets/ui-icons/bolt.webp", "./assets/ui-icons/star.webp", "./assets/ui-icons/trophy.webp",
  "./assets/ui-icons/math.webp", "./assets/ui-icons/physics.webp", "./assets/ui-icons/chemistry.webp",
  "./assets/ui-icons/biology.webp", "./assets/ui-icons/english.webp",
  "./assets/ui-icons/avatar-mint.webp", "./assets/ui-icons/avatar-banana.webp",
  "./assets/ui-icons/avatar-coral.webp", "./assets/ui-icons/avatar-sky.webp",
  "./lumino-app/onboarding.mjs?v=44", "./lumino-app/onboarding.css?v=44",
  "./tutor/assets/linda.webp", "./tutor/assets/charles.webp",
  "./lumino-app/app.css?v=42", "./lumino-app/content.mjs?v=24", "./lumino-app/curriculum.mjs?v=34",
  "./lumino-app/pixel-art.mjs?v=31", "./lumino-app/progress.mjs?v=34", "./lumino-app/shortcut.mjs?v=22",
  "./lumino-app/profile.mjs?v=34", "./lumino-app/guardian-preview.mjs?v=31",
  "./lumino-app/roadmap.mjs?v=39", "./lumino-app/physics-motion.mjs?v=34", "./lumino-app/cart-workshop.mjs?v=34",
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
