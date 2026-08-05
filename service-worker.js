const CACHE = "fg-app-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./flipper.png"
];

// Installation
self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(APP_FILES))
    );
});

// Alte Caches löschen
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    // CSV NIE cachen
    if (url.pathname.endsWith("FilpperGuide.csv")) {

        event.respondWith(
            fetch(event.request, {
                cache: "no-store"
            })
        );

        return;
    }

    // App-Dateien aus Cache
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );

});
