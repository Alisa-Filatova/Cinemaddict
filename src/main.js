import FilmCard from './film-card';
import FilmPopup from './film-popup';
import Filter from './filter';
import {generateRandomNumber, createFilmCard} from './utils';
import {FILTERS, MAIN_BLOCK_MAX_CARDS, MAX_FILMS_COUNT, EXTRA_BLOCK_MAX_CARDS} from './constants';
import Statistic from './statistics';

const HIDDEN_CLASS = `visually-hidden`;
const mainNavigation = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films`);
const mainFilmsContainer = filmsContainer.querySelector(`.films-list .films-list__container`);
const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--most-commented .films-list__container`);
const statisticContainer = document.querySelector(`.statistic`);
const statisticButton = document.querySelector(`.main-navigation__item--additional`);

const filmsSections = [
  {
    container: mainFilmsContainer,
    maxCards: MAIN_BLOCK_MAX_CARDS,
    showControls: true,
  },
  {
    container: topRatedFilmsContainer,
    maxCards: EXTRA_BLOCK_MAX_CARDS,
    showControls: false,
  },
  {
    container: mostCommentedFilmsContainer,
    maxCards: EXTRA_BLOCK_MAX_CARDS,
    showControls: false,
  },
];

const renderFilmsList = (container, amount, showControls) => {
  Array.from({length: amount}).forEach(() => {
    const data = createFilmCard();
    const filmCard = new FilmCard(data, showControls);
    const filmPopup = new FilmPopup(data);

    container.appendChild(filmCard.render());

    filmCard.onCommentsClick = () => {
      document.body.appendChild(filmPopup.render());
    };

    filmCard.onAddToWatchList = () => {
      data.isInWatchlist = !data.isInWatchlist;
      filmCard.update(data);
      filmPopup.update(data);
    };

    filmCard.onMarkAsWatched = () => {
      data.isWatched = !data.isWatched;
      filmCard.update(data);
      filmPopup.update(data);
    };

    filmCard.onAddToFavorite = () => {
      data.isFavorite = !data.isFavorite;
      filmCard.update(data);
      filmPopup.update(data);
    };

    filmPopup.onSetComment = (newData) => {
      data.comments.push(newData.comments);
      filmCard.update(data);
      filmPopup.update(data);
    };

    filmPopup.onSetRating = (newData) => {
      data.score = newData.score;
      filmCard.update(data);
      filmPopup.update(data);
    };

    filmPopup.onAddToWatchList = () => {
      data.isInWatchlist = !data.isInWatchlist;
      filmCard.update(data);
      filmPopup.update(data);
    };

    filmPopup.onMarkAsWatched = () => {
      data.isWatched = !data.isWatched;
      filmCard.update(data);
      filmPopup.update(data);
    };

    filmPopup.onAddToFavorite = () => {
      data.isFavorite = !data.isFavorite;
      filmCard.update(data);
      filmPopup.update(data);
    };

    filmPopup.onClose = () => {
      filmCard.update(data);
      filmPopup.destroy();
    };
  });
};

filmsSections.forEach((section) =>
  renderFilmsList(section.container, section.maxCards, section.showControls)
);

const renderFilters = (container, filters) => {
  filters.reverse().forEach((item, idx) => {
    const filter = new Filter(item, idx === filters.length - 1 ? null : generateRandomNumber(MAX_FILMS_COUNT));
    container.insertAdjacentElement(`afterbegin`, filter.render());

    filter.onFilter = () => {
      const filmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
      filmCards.forEach((card) => card.remove());
      renderFilmsList(mainFilmsContainer, MAIN_BLOCK_MAX_CARDS);
    };
  });
};

renderFilters(mainNavigation, FILTERS);

const generateFilmsData = (amount) => {
  let filmsTemplate = [];
  for (let i = 0; i < amount; i++) {
    filmsTemplate.push(createFilmCard());
  }
  return filmsTemplate;
};

const filmsData = generateFilmsData(MAIN_BLOCK_MAX_CARDS);

const showStatistic = () => {
  statisticContainer.innerHTML = ``;
  filmsContainer.classList.add(HIDDEN_CLASS);
  const statisticComponent = new Statistic(filmsData);
  statisticContainer.appendChild(statisticComponent.render());
};

statisticButton.addEventListener(`click`, showStatistic);

const onFilterItemClick = (event) => {
  event.preventDefault();

  if (!event.currentTarget.classList.contains(`main-navigation__item--additional`)) {
    const filmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
    event.currentTarget.classList.add(`main-navigation__item--active`);
    const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);
    activeItem.classList.remove(`main-navigation__item--active`);

    filmCards.forEach((item) => item.remove());
    renderFilmsList(mainFilmsContainer, generateRandomNumber(MAIN_BLOCK_MAX_CARDS));
  }
};

mainNavigation
  .querySelectorAll(`.main-navigation__item`)
  .forEach((filterItem) => filterItem.addEventListener(`click`, onFilterItemClick));
