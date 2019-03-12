import drawFilter from './draw-filter';
import FilmCard from './film-card';
import FilmSection from './film-section';
import FilmPopup from './film-popup';
import {generateRandomNumber, createFilmCard} from './utils';
import {FILTERS, FILM_SECTIONS, MAIN_BLOCK_MAX_CARDS, MAX_FILMS_COUNT} from './constants';

const mainNavigation = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films`);

const renderFilmsSection = (container, title, isExtra) => {
  const section = new FilmSection(title, isExtra);
  container.appendChild(section.render());
};

const renderFilmsList = (container, amount, showControls) => {
  Array.from({length: amount}).forEach(() => {
    const data = createFilmCard();
    const card = new FilmCard(data, showControls);
    const filmPopup = new FilmPopup(data);

    container.appendChild(card.render());

    card.onCommentsClick = () => document.body.appendChild(filmPopup.render());
    filmPopup.onClose = () => filmPopup.destroy();
  });
};

FILM_SECTIONS.forEach((item) => {
  renderFilmsSection(filmsContainer, item.title, item.isExtra);
  renderFilmsList(document.querySelector(item.container), item.cardsCount, item.showControls);
});

FILTERS.reverse().forEach((filter, index) => {
  const filterItem = Object.assign({}, filter);

  filterItem.count = index === FILTERS.length - 1 ? null : generateRandomNumber(MAX_FILMS_COUNT);

  mainNavigation.insertAdjacentHTML(`afterbegin`, drawFilter(filterItem));
});

const onFilterItemClick = (event) => {
  event.preventDefault();

  if (!event.currentTarget.classList.contains(`main-navigation__item--additional`)) {
    const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);
    const mainFilmsList = document.querySelector(`.films-list .films-list__container`);
    const filmCards = mainFilmsList.querySelectorAll(`.film-card`);

    activeItem.classList.remove(`main-navigation__item--active`);
    event.currentTarget.classList.add(`main-navigation__item--active`);

    filmCards.forEach((item) => item.remove());
    renderFilmsList(mainFilmsList, generateRandomNumber(MAIN_BLOCK_MAX_CARDS));
  }
};

mainNavigation
  .querySelectorAll(`.main-navigation__item`)
  .forEach((filterItem) => filterItem.addEventListener(`click`, onFilterItemClick));
