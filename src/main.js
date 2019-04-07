import FilmCard from './components/film-card';
import FilmPopup from './components/film-popup';
import Filter from './components/filter';
import Statistic from './components/statistics';
import {Keycode} from './enums';
import API from './api.js';
import {
  AUTHORIZATION,
  END_POINT,
  MAIN_BLOCK_MAX_CARDS,
  EXTRA_BLOCK_MAX_CARDS,
  HIDDEN_CLASS,
  FILTERS_DATA,
} from './constants';

const mainNavigation = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films`);
const mainFilmsContainer = filmsContainer.querySelector(`.films-list .films-list__container`);
const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--most-commented .films-list__container`);
const statisticContainer = document.querySelector(`.statistic`);
const statisticButton = document.querySelector(`.main-navigation__item--additional`);
const placeholderContainer = document.querySelector(`.films-list__title`);
const footerStatisticContainer = document.querySelector(`.footer__statistics`);
const showMoreButton = document.querySelector(`.films-list__show-more`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

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

    document.addEventListener(`keydown`, (event) => {
      event.preventDefault();
      if (event.keyCode === Keycode.ESC) {
        filmCard.update(data);
        filmPopup.destroy();
      }
    });
  });
};

// Подсчет кол-ва фильмов по статусу

const countFilmsWithStatus = (films, status) => films.filter((film) => film[status]).length;

// Сортировка и отрисовка фильмов по типу

const filterMainFilmsByType = (films, type, endAmount, startAmount = 0) =>
  renderFilmsList(films.filter((film) => film[type]).slice(startAmount, endAmount), mainFilmsContainer);

// Отображение кнопки ShowMore

const toggleShowMoreButton = (filmsData, currentTypeFilms, state) => {
  if (countFilmsWithStatus(filmsData, state) === currentTypeFilms.length || currentTypeFilms.length === 0) {
    showMoreButton.classList.add(HIDDEN_CLASS);
  } else if (countFilmsWithStatus(filmsData, state) > currentTypeFilms.length) {
    showMoreButton.classList.remove(HIDDEN_CLASS);
  }
};

// Отрисовка фильтров

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

    // Сортировка фильмов по фильтру

    filter.onFilter = () => {
      const filmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
      const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);

      if (filmsContainer.classList.contains(HIDDEN_CLASS)) {
        filmsContainer.classList.remove(HIDDEN_CLASS);
        statisticButton.classList.remove(`main-navigation__item--active`);
        statisticContainer.innerHTML = ``;
      }

      filmCards.forEach((card) => card.remove());
      filterData.isActive = !filterData.isActive;
      activeItem.classList.remove(`main-navigation__item--active`);
      filter.element.classList.add(`main-navigation__item--active`);
      filter.update(filterData);

      if (filterItem.type === `watchlist`) {
        filterMainFilmsByType(films, `isInWatchlist`, MAIN_BLOCK_MAX_CARDS);
        const watchlistFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
        toggleShowMoreButton(films, watchlistFilmCards, `isInWatchlist`);
      } else if (filterItem.type === `history`) {
        filterMainFilmsByType(films, `isWatched`, MAIN_BLOCK_MAX_CARDS);
        const historyFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
        toggleShowMoreButton(films, historyFilmCards, `isWatched`);
      } else if (filterItem.type === `favorites`) {
        filterMainFilmsByType(films, `isFavorite`, MAIN_BLOCK_MAX_CARDS);
        const favoriteFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
        toggleShowMoreButton(films, favoriteFilmCards, `isFavorite`);
      } else {
        renderFilmsList(films.slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer, MAIN_BLOCK_MAX_CARDS);
        const allFilmsCards = mainFilmsContainer.querySelectorAll(`.film-card`);

        if (allFilmsCards.length === films.length) {
          showMoreButton.classList.add(HIDDEN_CLASS);
        } else {
          showMoreButton.classList.remove(HIDDEN_CLASS);
        }
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
    renderFilters(mainNavigation, FILTERS_DATA, films);

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

    footerStatisticContainer.innerHTML = `<p>${films.length} movies inside</p>`;

    // Показать больше карточек по клику на showMoreButton

    showMoreButton.addEventListener(`click`, () => {
      const visibleFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
      const activeItem = mainNavigation.querySelector(`.main-navigation__item--active`);

      if (activeItem.id === `watchlist`) {
        filterMainFilmsByType(films, `isInWatchlist`, visibleFilmCards.length + MAIN_BLOCK_MAX_CARDS, visibleFilmCards.length);
        const allInWatchlistFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);

        if (allInWatchlistFilmCards.length === countFilmsWithStatus(films, `isInWatchlist`)) {
          showMoreButton.classList.add(HIDDEN_CLASS);
        }
      } else if (activeItem.id === `history`) {
        filterMainFilmsByType(films, `isWatched`, visibleFilmCards.length + MAIN_BLOCK_MAX_CARDS, visibleFilmCards.length);
        const allIsWatchedFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);

        if (allIsWatchedFilmCards.length === countFilmsWithStatus(films, `isWatched`)) {
          showMoreButton.classList.add(HIDDEN_CLASS);
        }
      } else if (activeItem.id === `favorites`) {
        filterMainFilmsByType(films, `isFavorite`, visibleFilmCards.length + MAIN_BLOCK_MAX_CARDS, visibleFilmCards.length);
        const allIsFavoriteFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);

        if (allIsFavoriteFilmCards.length === countFilmsWithStatus(films, `isFavorite`)) {
          showMoreButton.classList.add(HIDDEN_CLASS);
        }
      } else if (activeItem.id === `all`) {
        renderFilmsList(films
          .slice(visibleFilmCards.length, visibleFilmCards.length + MAIN_BLOCK_MAX_CARDS), mainFilmsContainer);
        const allFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);

        if (allFilmCards.length === films.length) {
          showMoreButton.classList.add(HIDDEN_CLASS);
        }
      }
    });
  })
  .catch(() => {
    showPlaceholder(`Something went wrong while loading movies. Check your connection or try again later 😓`);
  });
