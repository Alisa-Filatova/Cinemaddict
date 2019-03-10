// PROJECT
export const MAIN_BLOCK_MAX_CARDS = 7;
export const EXTRA_BLOCK_MAX_CARDS = 2;
export const MAX_RATE_NUMBER = 9;
export const MAX_FILMS_COUNT = 100;
export const MAX_SENTENCES_FOR_FILM_DESCRIPTION = 2;

export const EMOJIES = [
  {emoji: `😴`, name: `sleeping`},
  {emoji: `😐`, name: `neutral-face`},
  {emoji: `😀`, name: `grinning`},
];

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

export const FILM_SECTIONS = [
  {
    title: `All movies. Upcoming`,
    isExtra: false,
    cardsCount: MAIN_BLOCK_MAX_CARDS,
    container: `.films-list .films-list__container`,
    showControls: true,
  },
  {
    title: `Top rated`,
    isExtra: true,
    cardsCount: EXTRA_BLOCK_MAX_CARDS,
    container: `.films-list--extra:nth-child(2) .films-list__container`,
    showControls: false,
  },
  {
    title: `Most Commented`,
    isExtra: true,
    cardsCount: EXTRA_BLOCK_MAX_CARDS,
    container: `.films-list--extra:nth-child(3) .films-list__container`,
    showControls: false,
  },
];
