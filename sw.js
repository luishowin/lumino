const CACHE = "lumino-v19";
const ASSETS = [
  "./", "./index.html", "./lumino-app/", "./lumino-app/index.html", "./learn.html", "./about.html",
  "./styles.css", "./landing.css", "./app.js?v=15", "./manifest.webmanifest",
  "./assets/lumino-preview.png", "./assets/lumino-favicon.png", "./assets/lumino-fire-hydrant.webp",
  "./assets/lumino-linda.webp?v=19", "./assets/lumino-charles.webp?v=19",
  "./adventure/adventure.css", "./adventure/game.mjs", "./adventure/levels.mjs", "./adventure/art.mjs",
  "./assets/landscapes/wheat.webp", "./assets/landscapes/rice.webp", "./assets/landscapes/mountains.webp",
  "./assets/landscapes/city.webp", "./assets/landscapes/rainforest.webp", "./assets/landscapes/desert.webp",
  "./lumino-app/app.css?v=19", "./lumino-app/content.mjs", "./lumino-app/pixel-art.mjs", "./lumino-app/progress.mjs",
  "./tutor/assets/linda-expressions.webp", "./tutor/assets/charles-expressions.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => /^lumino-v\d+$/.test(key) && key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
