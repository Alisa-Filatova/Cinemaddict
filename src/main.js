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

const getFilmsData = (amount) => {
  let data = [];
  Array.from({length: amount}).map(() => {
    data.push(createFilmCard());
  });
  return data;
};

const mainFilmsData = getFilmsData(MAIN_BLOCK_MAX_CARDS);

mainFilmsData.forEach((item) => {
  const filmCard = new FilmCard(item, true);
  const filmPopup = new FilmPopup(item);

  mainFilmsContainer.appendChild(filmCard.render());

  filmCard.onCommentsClick = () => {
    document.body.appendChild(filmPopup.render());
  };

  filmCard.onAddToWatchList = () => {
    item.isInWatchlist = !item.isInWatchlist;
    filmCard.update(item);
    filmPopup.update(item);
  };

  filmCard.onMarkAsWatched = () => {
    item.isWatched = !item.isWatched;
    filmCard.update(item);
    filmPopup.update(item);
  };

  filmCard.onAddToFavorite = () => {
    item.isFavorite = !item.isFavorite;
    filmCard.update(item);
    filmPopup.update(item);
  };

  filmPopup.onSetComment = (newData) => {
    item.comments.push(newData.comments);
    filmCard.update(item);
    filmPopup.update(item);
  };

  filmPopup.onSetRating = (newData) => {
    item.score = newData.score;
    filmCard.update(item);
    filmPopup.update(item);
  };

  filmPopup.onAddToWatchList = () => {
    item.isInWatchlist = !item.isInWatchlist;
    filmCard.update(item);
    filmPopup.update(item);
  };

  filmPopup.onMarkAsWatched = () => {
    item.isWatched = !item.isWatched;
    filmCard.update(item);
    filmPopup.update(item);
  };

  filmPopup.onAddToFavorite = () => {
    item.isFavorite = !item.isFavorite;
    filmCard.update(item);
    filmPopup.update(item);
  };

  filmPopup.onClose = () => {
    filmCard.update(item);
    filmPopup.destroy();
  };
});

const renderFilmsList = (films, container, amount, showControls) => {
  films.forEach(() => {
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
  renderFilmsList(getFilmsData(section.maxCards), section.container, section.showControls)
);

const renderFilters = (container, filters) => {
  filters.reverse().forEach((item, idx) => {
    const filter = new Filter(item, idx === filters.length - 1 ? null : generateRandomNumber(MAX_FILMS_COUNT));
    container.insertAdjacentElement(`afterbegin`, filter.render());

    filter.onFilter = () => {
      switch (filter.title) {
        case `Watchlist`:
          return mainFilmsData.filter((it) => it.isInWatchlist);
        case `History`:
          return mainFilmsData.filter((it) => it.isWatched);
        case `Favorite`:
          return mainFilmsData.filter((it) => it.isFavorite);
        default: return mainFilmsData;
      }
    };
  });
};

renderFilters(mainNavigation, FILTERS);

const showStatistic = () => {
  statisticContainer.innerHTML = ``;
  filmsContainer.classList.add(HIDDEN_CLASS);
  const statisticComponent = new Statistic(mainFilmsData);
  statisticContainer.appendChild(statisticComponent.render());
};

statisticButton.addEventListener(`click`, showStatistic);

// const onFilterItemClick = (event) => {
//   event.preventDefault();
//
//   if (!event.currentTarget.classList.contains(`main-navigation__item--additional`)) {
//     const filmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
//     event.currentTarget.classList.add(`main-navigation__item--active`);
//     const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);
//     activeItem.classList.remove(`main-navigation__item--active`);
//
//     filmCards.forEach((item) => item.remove());
//     renderFilmsList(mainFilmsContainer, generateRandomNumber(MAIN_BLOCK_MAX_CARDS));
//   }
// };
//
// mainNavigation
//   .querySelectorAll(`.main-navigation__item`)
//   .forEach((filterItem) => filterItem.addEventListener(`click`, onFilterItemClick));
