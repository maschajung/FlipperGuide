const CACHE = "fg-app-v17";

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

    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    // CSV niemals cachen
    if (url.pathname.endsWith("filpperguide_v1.csv")) {
        event.respondWith(
            fetch(event.request, { cache: "no-store" })
        );
        return;
    }

    // HTML, CSS und JS immer zuerst vom Server holen
    if (
        event.request.mode === "navigate" ||
        url.pathname.endsWith(".html") ||
        url.pathname.endsWith(".js") ||
        url.pathname.endsWith(".css")
    ) {

        event.respondWith(

            fetch(event.request)
                .then(response => {

                    const copy = response.clone();

                    caches.open(CACHE).then(cache => {
                        cache.put(event.request, copy);
                    });

                    return response;

                })
                .catch(() => caches.match(event.request))

        );

        return;
    }

    // Bilder und andere Dateien aus Cache
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );

});
