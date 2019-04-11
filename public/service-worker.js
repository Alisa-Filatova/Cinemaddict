const CACHE_NAME = `MOOWLE_V1`;

self.addEventListener(`install`, (event) => {
  const openCache = caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./bundle.js`,
        `./css/`,
        `./css/main.css`,
        `./images/background.png`,
        `./images/icon-favorite.png`,
        `./images/icon-favorite.svg`,
        `./images/icon-watched.png`,
        `./images/icon-watched.svg`,
        `./images/icon-watchlist.png`,
        `./images/icon-watchlist.svg`,
        `./images/posters/accused.jpg`,
        `./images/posters/blackmail.jpg`,
        `./images/posters/blue-blazes.jpg`,
        `./images/posters/fuga-da-new-york.jpg`,
        `./images/posters/moonrise.jpg`,
        `./images/posters/three-friends.jpg`,
      ])
    })

    event.waitUntil(openCache);
});

self.addEventListener(`activate`, () => {
  console.log(`Service worker is activated!`);
});

self.addEventListener(`fetch`, (event) => {
  event.respondWith(
    fetch(event.request)
    .then(function (response) {
      caches.open(CACHE_NAME)
      .then((cache) => cache.put(event.request, response.clone()));

      return response.clone();
    })
    .catch(() => {
      caches.match(event.request)
      .then((response) => {
        console.log(`Find in cache`, {response});
        return response;
      });
    })
    .catch((error) => console.error(error))
  );
});
