const CACHE = "lumino-v15";
const ASSETS = [
  "./", "./index.html", "./lumino-app/", "./lumino-app/index.html", "./learn.html", "./about.html",
  "./styles.css", "./landing.css", "./app.js?v=12", "./manifest.webmanifest",
  "./assets/lumino-preview.png", "./assets/lumino-favicon.png", "./assets/lumino-fire-hydrant.webp",
  "./assets/lumino-linda.webp", "./assets/lumino-charles.webp",
  "./tutor/tutor.css", "./tutor/components.mjs", "./tutor/dialogue.mjs",
  "./tutor/assets/linda.webp", "./tutor/assets/charles.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
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
