const CACHE = "fg-app-v16";

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
        caches.open(CACHE).then(cache => {
            return cache.addAll(APP_FILES);
        })
    );

});

// Aktivierung
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

// Dateien abrufen
self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    // CSV IMMER aktuell vom Server laden
    if (url.pathname.endsWith("filpperguide_v1.csv")) {

        event.respondWith(

            fetch(event.request, {
                cache: "no-store"
            }).catch(() =>
                caches.match(event.request)
            )

        );

        return;

    }

    // Alle anderen Dateien aus Cache
    event.respondWith(

        caches.match(event.request).then(response => {

            if (response) {
                return response;
            }

            return fetch(event.request);

        })

    );

});
