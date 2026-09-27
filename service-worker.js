const CACHE_NAME = "tf-rota-shell-v3";

const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./service-worker.js",
  "./offline.html",
  "./tf-fitness-logo.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(SHELL_FILES);
      })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(function(keys) {
        return Promise.all(
          keys
            .filter(function(key) {
              return key !== CACHE_NAME;
            })
            .map(function(key) {
              return caches.delete(key);
            })
        );
      })
  );

  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // The live Google Apps Script app stays online and uncached.
  if (url.origin !== self.location.origin) {
    return;
  }

  // Always try the latest page shell first so app updates
  // do not get stuck behind an old installed version.
  if (
    request.mode === "navigate" ||
    url.pathname.endsWith("/index.html")
  ) {
    event.respondWith(
      fetch(request)
        .then(function(response) {
          const copy = response.clone();

          caches
            .open(CACHE_NAME)
            .then(function(cache) {
              cache.put(request, copy);
            });

          return response;
        })
        .catch(function() {
          return (
            caches.match(request) ||
            caches.match("./offline.html")
          );
        })
    );

    return;
  }

  // Always try the latest config first so changing the Apps Script URL
  // does not get stuck behind an old cache.
  if (url.pathname.endsWith("/config.js")) {
    event.respondWith(
      fetch(request).catch(function() {
        return caches.match(request);
      })
    );
    return;
  }

  event.respondWith(
    caches
      .match(request)
      .then(function(cached) {
        return (
          cached ||
          fetch(request)
            .then(function(response) {
              const copy = response.clone();

              caches
                .open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(request, copy);
                });

              return response;
            })
            .catch(function() {
              return caches.match("./offline.html");
            })
        );
      })
  );
});
