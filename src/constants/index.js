export const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
export const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
export const MAIN_BLOCK_MAX_CARDS = 5;
export const EXTRA_BLOCK_MAX_CARDS = 2;
export const MAX_RATE_NUMBER = 9;
export const SHORT_DESCRIPTION_MAX_SYMBOLS = 140;
export const HIDDEN_CLASS = `visually-hidden`;

export const FILTERS_DATA = [
  {title: `All movies`, type: `all`, count: null, isActive: true},
  {title: `Watchlist`, type: `in_watchlist`, count: null, isActive: false},
  {title: `History`, type: `history`, count: null, isActive: false},
  {title: `Favorites`, type: `favorites`, count: null, isActive: false},
];

export const EMOJIES = {
  "sleeping": `😴`,
  "neutral-face": `😐`,
  "grinning": `😀`,
};
