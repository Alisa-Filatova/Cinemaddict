import drawFilter from './draw-filter';
import drawFilmCard from './draw-film-card';
import drawFilmSection from './draw-film-section';
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

const drawFilmCards = (amount, withControls) => (
  new Array(amount).fill(``).map(() => drawFilmCard(getFilmCard(), withControls)).join(``));

const renderFilmsSection = (title, cardsCount, extra, withControls = false) =>
  filmsContainer.insertAdjacentHTML(`beforeend`, drawFilmSection(title, drawFilmCards(cardsCount, withControls), extra));

renderFilmsSection(`All movies. Upcoming`, MAIN_BLOCK_MAX_CARDS, false, true);
renderFilmsSection(`Top rated`, EXTRA_BLOCK_MAX_CARDS, true);
renderFilmsSection(`Most commented`, EXTRA_BLOCK_MAX_CARDS, true);

// Добавьте обработчик для переключения фильтров. При их переключении удаляйте все
// ранее созданные фильмы и добавляйте случайное количество новых.

const onFilterItemClick = (event) => {
  event.preventDefault();

  if (!event.currentTarget.classList.contains(`main-navigation__item--additional`)) {
    const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);
    const mainFilmsList = document.querySelector(`.films-list .films-list__container`);
    const filmCards = mainFilmsList.querySelectorAll(`.film-card`);

    activeItem.classList.remove(`main-navigation__item--active`);
    event.currentTarget.classList.add(`main-navigation__item--active`);

    filmCards.forEach((item) => item.remove());
    mainFilmsList.insertAdjacentHTML(`afterbegin`, drawFilmCards(generateRandomNumber(MAIN_BLOCK_MAX_CARDS), true));
  }
};

mainNavigation
  .querySelectorAll(`.main-navigation__item`)
  .forEach((filterItem) => filterItem.addEventListener(`click`, onFilterItemClick));
