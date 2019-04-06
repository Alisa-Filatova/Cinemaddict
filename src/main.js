import FilmCard from './film-card';
import FilmPopup from './film-popup';
import Filter from './filter';
import Statistic from './statistics';
import API from './api.js';
import {MAIN_BLOCK_MAX_CARDS, HIDDEN_CLASS, EXTRA_BLOCK_MAX_CARDS} from './constants';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const filtersData = [
  {title: `All movies`, type: `all`, count: null, isActive: true},
  {title: `Watchlist`, type: `watchlist`, count: null, isActive: false},
  {title: `History`, type: `history`, count: null, isActive: false},
  {title: `Favorites`, type: `favorites`, count: null, isActive: false},
];

const mainNavigation = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films`);
const mainFilmsContainer = filmsContainer.querySelector(`.films-list .films-list__container`);
const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--most-commented .films-list__container`);
const statisticContainer = document.querySelector(`.statistic`);
const statisticButton = document.querySelector(`.main-navigation__item--additional`);
const placeholderContainer = document.querySelector(`.films-list__title`);

// Сортировка дополнительных блоков

const compareRating = (a, b) => b.rating - a.rating;
const compareCommentsCount = (a, b) => b.comments.length - a.comments.length;

// Отрисовка списка фильмов

const renderFilmsList = (films, container, showControls) => {
  films.forEach((data) => {
    const filmCard = new FilmCard(data, showControls);
    const filmPopup = new FilmPopup(data);

    container.appendChild(filmCard.render());

    filmCard.onCommentsClick = () => {
      document.body.appendChild(filmPopup.render());
    };

    filmCard.onAddToWatchList = () => {
      filmCard._isInWatchlist = !filmCard.isInWatchlist;
      data.isInWatchlist = filmCard._isInWatchlist;
      filmPopup._isInWatchlist = data.isInWatchlist;

      api.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => filmCard.update(newData));
    };

    filmCard.onMarkAsWatched = () => {
      filmCard._isWatched = !filmCard._isWatched;
      data.isWatched = filmCard._isWatched;
      filmPopup._isWatched = data.isWatched;

      api.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => filmCard.update(newData));
    };

    filmCard.onAddToFavorite = () => {
      filmCard._isFavorite = !filmCard._isFavorite;
      data.isFavorite = filmCard._isFavorite;
      filmPopup._isFavorite = data.isFavorite;

      api.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => filmCard.update(newData));
    };

    filmPopup.onSetComment = (newData) => {
      data.comments.push(newData.comments);
      filmPopup._comments = data.comments;
      filmCard._comments = data.comments;
      filmPopup.disableComments();

      api.updateFilm({id: data.id, data: data.toRAW()})
        .then((newComment) => {
          filmPopup.unblockComments();
          filmCard.update(newComment);
          filmPopup.update(newComment);
        })
        .catch(() => {
          filmPopup.shake();
          filmPopup.showCommentsError();
        });
    };

    filmPopup.onSetRating = (newData) => {
      data.score = newData.score;
      filmPopup.disableRating();

      api.updateFilm({id: data.id, data: data.toRAW()})
        .then((newScore) => {
          filmPopup.unblockRating();
          filmPopup.update(newScore);
          filmCard.update(newScore);
        })
        .catch(() => {
          filmPopup.shake();
          filmPopup.showRatingError();
        });
    };

    filmPopup.onAddToWatchList = () => {
      filmPopup._isInWatchlist = !filmPopup._isInWatchlist;
      data.isInWatchlist = filmPopup._isInWatchlist;
      filmCard._isInWatchlist = data.isInWatchlist;

      api.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
        });
    };

    filmPopup.onMarkAsWatched = () => {
      filmPopup._isWatched = !filmPopup._isWatched;
      data.isWatched = filmPopup._isWatched;
      filmCard._isWatched = data.isWatched;

      api.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
        });
    };

    filmPopup.onAddToFavorite = () => {
      filmPopup._isFavorite = !filmPopup._isFavorite;
      data.isFavorite = filmPopup._isFavorite;
      filmCard._isFavorite = data.isFavorite;

      api.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
        });
    };

    filmPopup.onClose = () => {
      filmCard.update(data);
      filmPopup.destroy();
    };
  });
};

// Отрисовка фильтров

const countFilmsWithStatus = (films, status) => films.filter((film) => film[status]).length;
const filterMainFilmsByType = (films, type) =>
  renderFilmsList(films.filter((film) => film[type]).slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer);

const renderFilters = (container, filters, films) => {
  filters.reverse().forEach((filterItem) => {
    const filterData = Object.assign(filterItem);

    if (filterData.type === `watchlist`) {
      filterData.count = countFilmsWithStatus(films, `isInWatchlist`);
    } else if (filterData.type === `history`) {
      filterData.count = countFilmsWithStatus(films, `isWatched`);
    } else if (filterData.type === `favorites`) {
      filterData.count = countFilmsWithStatus(films, `isFavorite`);
    }

    const filter = new Filter(filterData);

    container.insertAdjacentElement(`afterbegin`, filter.render());

    filter.onFilter = () => {
      const filmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
      const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);

      filmCards.forEach((card) => card.remove());
      filterData.isActive = !filterData.isActive;
      activeItem.classList.remove(`main-navigation__item--active`);
      filter.element.classList.add(`main-navigation__item--active`);
      filter.update(filterData);

      if (filterItem.type === `watchlist`) {
        filterMainFilmsByType(films, `isInWatchlist`);
      } else if (filterItem.type === `history`) {
        filterMainFilmsByType(films, `isWatched`);
      } else if (filterItem.type === `favorites`) {
        filterMainFilmsByType(films, `isFavorite`);
      } else {
        renderFilmsList(films.slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer, MAIN_BLOCK_MAX_CARDS);
      }
    };
  });
};

// Плейсхолдер для загрузки

const showPlaceholder = (message) => {
  placeholderContainer.textContent = message;
  placeholderContainer.classList.remove(HIDDEN_CLASS);
};

const removePlaceholder = () => {
  placeholderContainer.classList.add(HIDDEN_CLASS);
};

showPlaceholder(`🎬 Loading movies...`);

// Загрузка данных с сервера

api.getFilms()
  .then((films) => {
    removePlaceholder();
    renderFilmsList(films
      .slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer);
    renderFilmsList(films
      .sort(compareRating)
      .slice(0, EXTRA_BLOCK_MAX_CARDS), topRatedFilmsContainer, false);
    renderFilmsList(films
      .sort(compareCommentsCount)
      .slice(0, EXTRA_BLOCK_MAX_CARDS), mostCommentedFilmsContainer, false);
    renderFilters(mainNavigation, filtersData, films);

    // Отрисовка статистики

    statisticButton.addEventListener(`click`, () => {
      const statisticComponent = new Statistic(films);

      if (statisticButton.classList.contains(`main-navigation__item--active`)) {
        statisticButton.classList.remove(`main-navigation__item--active`);
        statisticContainer.innerHTML = ``;
        filmsContainer.classList.remove(HIDDEN_CLASS);
        statisticComponent.destroy();
      } else if (!statisticButton.classList.contains(`main-navigation__item--active`)) {
        statisticButton.classList.add(`main-navigation__item--active`);
        statisticContainer.innerHTML = ``;
        filmsContainer.classList.add(HIDDEN_CLASS);
        statisticContainer.appendChild(statisticComponent.render());
      }
    });
  })
  .catch(() => {
    showPlaceholder(`Something went wrong while loading movies. Check your connection or try again later 😓`);
  });
