export const DAY_LENGTH = 86400000;
export const WEEKDAYS_COUNT = 7;
export const HOUR = 60;
export const BOOLEANS = [false, true];

export const MAIN_BLOCK_MAX_CARDS = 7;
export const EXTRA_BLOCK_MAX_CARDS = 2;
export const MAX_RATE_NUMBER = 9;
export const MAX_FILMS_COUNT = 100;
export const MAX_SENTENCES_FOR_FILM_DESCRIPTION = 2;

export const EMOJIES = {
  "sleeping": `😴`,
  "neutral-face": `😐`,
  "grinning": `😀`,
};

export const FILTERS = [
  {
    name: `All movies`,
    link: `#all`,
    active: true,
  },
  {
    name: `Watchlist`,
    link: `#watchlist`,
    active: false,
  },
  {
    name: `History`,
    link: `#history`,
    active: false,
  },
  {
    name: `Favorites`,
    link: `#favorites`,
    active: false,
  },
];

export const FILM_DETAILS_CONTROLS = [
  {
    name: `Add to watchlist`,
    id: `watchlist`,
  },
  {
    name: `Already watched`,
    id: `watched`,
    checked: true,
  },
  {
    name: `Add to favorites`,
    id: `favorites`,
  },
];
