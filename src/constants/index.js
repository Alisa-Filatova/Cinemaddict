import {FilterType} from '../enums';

export const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
export const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
export const FILMS_STORE_KEY = `films-store-key`;
export const MAIN_BLOCK_MAX_CARDS = 5;
export const EXTRA_BLOCK_MAX_CARDS = 2;
export const MAX_RATE_NUMBER = 9;
export const SHORT_DESCRIPTION_MAX_SYMBOLS = 140;
export const HIDDEN_CLASS = `visually-hidden`;

export const EMOJIES = {
  "sleeping": `😴`,
  "neutral-face": `😐`,
  "grinning": `😀`,
};

export const FILTERS_DATA = [
  {
    title: `All movies`,
    type: FilterType.ALL,
    count: null,
    isActive: true,
  },
  {
    title: `Watchlist`,
    type: FilterType.WATCHLIST,
    count: null,
    isActive: false,
  },
  {
    title: `History`,
    type: FilterType.HISTORY,
    count: null,
    isActive: false,
  },
  {
    title: `Favorites`,
    type: FilterType.FAVORITES,
    count: null,
    isActive: false,
  },
];
