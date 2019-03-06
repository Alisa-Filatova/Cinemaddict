import drawFilter from './draw-filter';
import FilmCard from './film-card';
import FilmSection from './film-section';
import {generateRandomNumber} from './utils/generate-random-number';
import {getFilmCard} from './utils/get-film-card';

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

const mainNavigation = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films`);

const renderFilmsSection = (container, title, extra = false) => {
  const section = new FilmSection(title, extra);
  section.render(container);
};

const renderFilmsList = (container, amount, showControls = true) => {
  Array.from({length: amount}).forEach(() => {
    const card = new FilmCard(getFilmCard(), showControls);
    card.render(container);
  });
};

renderFilmsSection(filmsContainer, `All movies. Upcoming`);
const mainFilmsList = filmsContainer.querySelector(`.films-list .films-list__container`);
renderFilmsList(mainFilmsList, MAIN_BLOCK_MAX_CARDS);

renderFilmsSection(filmsContainer, `Top rated`, true);
const topFilmsList = filmsContainer.querySelector(`.films-list--extra .films-list__container`);
renderFilmsList(topFilmsList, EXTRA_BLOCK_MAX_CARDS, false);

renderFilmsSection(filmsContainer, `Most Commented`, true);
const mostCommentedFilmsList = filmsContainer.querySelectorAll(`.films-list--extra .films-list__container`)[1];
renderFilmsList(mostCommentedFilmsList, EXTRA_BLOCK_MAX_CARDS, false);


// При помощи функции, описанной в пункте 3 отрисуйте все фильтры, предусмотренные макетом:
// «All movies», «Watchlist», «History», «Favorites». Не забудьте возле фильтров «Watchlist»,
// «History» и «Favorites» вывести произвольное число, которое будет притворяться количеством фильмов,
// пока у нас нет настоящих данных.

filters.reverse().forEach((filter, index) => {
  const filterItem = Object.assign({}, filter);

  filterItem.count = index === filters.length - 1 ? null : generateRandomNumber(MAX_FILMS_COUNT);

  mainNavigation.insertAdjacentHTML(`afterbegin`, drawFilter(filterItem));
});

// Добавьте обработчик для переключения фильтров. При их переключении удаляйте все
// ранее созданные фильмы и добавляйте случайное количество новых.

const onFilterItemClick = (event) => {
  event.preventDefault();

  if (!event.currentTarget.classList.contains(`main-navigation__item--additional`)) {
    const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);
    const filmCards = mainFilmsList.querySelectorAll(`.film-card`);

    activeItem.classList.remove(`main-navigation__item--active`);
    event.currentTarget.classList.add(`main-navigation__item--active`);

    filmCards.forEach((item) => item.remove());
    renderFilmsList(mainFilmsList, MAIN_BLOCK_MAX_CARDS);
  }
};

mainNavigation
  .querySelectorAll(`.main-navigation__item`)
  .forEach((filterItem) => filterItem.addEventListener(`click`, onFilterItemClick));
