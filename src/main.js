import drawFilter from './draw-filter';
import FilmCard from './film-card';
import FilmPopup from './film-popup';
import {generateRandomNumber, createFilmCard} from './utils';
import {FILTERS, MAIN_BLOCK_MAX_CARDS, MAX_FILMS_COUNT, EXTRA_BLOCK_MAX_CARDS} from './constants';

const mainNavigation = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films`);
const mainFilmsContainer = filmsContainer.querySelector(`.films-list .films-list__container`);
const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--most-commented .films-list__container`);

const renderFilmsList = (container, amount, showControls) => {
  Array.from({length: amount}).forEach(() => {
    const data = createFilmCard();
    const card = new FilmCard(data, showControls);
    const filmPopup = new FilmPopup(data);

    container.appendChild(card.render());

    card.onCommentsClick = () => document.body.appendChild(filmPopup.render());

    filmPopup.onSetComment = (newData) => {
      data.comments.push(newData.comments);
      filmPopup.update(data);
      card.update(data);
    };

    filmPopup.onSetRating = (newData) => {
      if (newData.comments.comment !== ``) {
        data.comments.push(newData.comments);
      }

      data.score = newData.score;
      filmPopup.update(data);
    };

    filmPopup.onClose = () => {
      card.update(data);
      filmPopup.destroy();
    };

  });
};

renderFilmsList(mainFilmsContainer, MAIN_BLOCK_MAX_CARDS, true);
renderFilmsList(topRatedFilmsContainer, EXTRA_BLOCK_MAX_CARDS, false);
renderFilmsList(mostCommentedFilmsContainer, EXTRA_BLOCK_MAX_CARDS, false);

FILTERS.reverse().forEach((filter, index) => {
  const filterItem = Object.assign({}, filter);

  filterItem.count = index === FILTERS.length - 1 ? null : generateRandomNumber(MAX_FILMS_COUNT);

  mainNavigation.insertAdjacentHTML(`afterbegin`, drawFilter(filterItem));
});

const onFilterItemClick = (event) => {
  event.preventDefault();

  if (!event.currentTarget.classList.contains(`main-navigation__item--additional`)) {
    const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);
    const filmCards = mainFilmsContainer.querySelectorAll(`.film-card`);

    activeItem.classList.remove(`main-navigation__item--active`);
    event.currentTarget.classList.add(`main-navigation__item--active`);

    filmCards.forEach((item) => item.remove());
    renderFilmsList(mainFilmsContainer, generateRandomNumber(MAIN_BLOCK_MAX_CARDS));
  }
};

mainNavigation
  .querySelectorAll(`.main-navigation__item`)
  .forEach((filterItem) => filterItem.addEventListener(`click`, onFilterItemClick));
