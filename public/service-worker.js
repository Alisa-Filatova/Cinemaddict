const CACHE_NAME = `MOOWLE_V1`;

self.addEventListener(`install`, (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./bundle.js`,
        `./css/normalize.css`,
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
    .catch((error) => {console.error(error)})
  );
});

self.addEventListener(`activate`, () => {
  console.log(`Service worker is activated!`);
});

self.addEventListener(`fetch`, (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
      return response ? response : fetch(event.request);
    })
    .catch((error) => {console.error(error)})
  );
});
