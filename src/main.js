import drawFilter from './draw-filter';
import drawFilmCard from './draw-film-card';
import {generateRandomNumber} from './utils';

const MAX_FILMS_COUNT = 100;
const MAIN_BLOCK_MAX_CARDS = 7;
const EXTRA_BLOCK_MAX_CARDS = 2;

const filters = [
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

const film = {
  title: `Incredibles 2`,
  rating: 8.7,
  year: 2018,
  duration: `1h 30m`,
  genre: `Comedy`,
  poster: `./images/posters/moonrise.jpg`,
  desc: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
  commentsCount: 8,
  controls: true,
};

const extraFilm = {
  title: `Incredibles`,
  rating: 7.7,
  year: 2017,
  duration: `3h 30m`,
  genre: `Comedy`,
  poster: `./images/posters/accused.jpg`,
  desc: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
  commentsCount: 10,
  controls: false,
};

const mainNavigation = document.querySelector(`.main-navigation`);
const mainFilmsList = document.querySelector(`.films-list .films-list__container`);
const [topRatedFilmsList, mostCommentedFilmsList] = document.querySelectorAll(`.films-list--extra .films-list__container`);

// При помощи функции, описанной в пункте 3 отрисуйте все фильтры, предусмотренные макетом:
// «All movies», «Watchlist», «History», «Favorites». Не забудьте возле фильтров «Watchlist»,
// «History» и «Favorites» вывести произвольное число, которое будет притворяться количеством фильмов,
// пока у нас нет настоящих данных.

filters.reverse().forEach((filter, index) => {
  const filterItem = Object.assign({}, filter);

  filterItem.count = index === filters.length - 1 ? null : generateRandomNumber(MAX_FILMS_COUNT);

  mainNavigation.insertAdjacentHTML(`afterbegin`, drawFilter(filterItem));
});

// Используя функцию из пункта 4 отрисуйте семь одинаковых карточек фильмов.
// Ещё по две карточки отрисуйте в блоки «Top rated» и «Most commented»

const drawFilmCards = (container, card, count) => {
  container.insertAdjacentHTML(`afterbegin`, Array.from({length: count}).map(() => drawFilmCard(card)).join(``));
};

drawFilmCards(mainFilmsList, film, MAIN_BLOCK_MAX_CARDS);
drawFilmCards(topRatedFilmsList, extraFilm, EXTRA_BLOCK_MAX_CARDS);
drawFilmCards(mostCommentedFilmsList, extraFilm, EXTRA_BLOCK_MAX_CARDS);

// Добавьте обработчик для переключения фильтров. При их переключении удаляйте все
// ранее созданные фильмы и добавляйте случайное количество новых.

const onFilterItemClick = (event) => {
  event.preventDefault();

  if (!event.currentTarget.classList.contains(`main-navigation__item--additional`)) {
    const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);
    activeItem.classList.remove(`main-navigation__item--active`);

    event.currentTarget.classList.add(`main-navigation__item--active`);

    const filmCards = mainFilmsList.querySelectorAll(`.film-card`);
    filmCards.forEach((item) => item.remove());

    drawFilmCards(mainFilmsList, film, generateRandomNumber(MAIN_BLOCK_MAX_CARDS));
  }
};

mainNavigation
  .querySelectorAll(`.main-navigation__item`)
  .forEach((filterItem) => filterItem.addEventListener(`click`, onFilterItemClick));
