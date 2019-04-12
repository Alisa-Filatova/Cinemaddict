import FilmCard from './components/film-card';
import FilmPopup from './components/film-popup';
import Filter from './components/filter';
import Statistic from './components/statistics';
import Search from './components/search';
import {Keycode, UserRank, FilmState, FilterType} from './enums';
import API from './api.js';
import Provider from './provider.js';
import Store from './store.js';
import {
  AUTHORIZATION,
  END_POINT,
  FILMS_STORE_KEY,
  MAIN_BLOCK_MAX_CARDS,
  EXTRA_BLOCK_MAX_CARDS,
  HIDDEN_CLASS,
  FILTERS_DATA,
} from './constants';

const ACTIVE_MENU_ITEM_CLASS = `main-navigation__item--active`;
const LOADING_MESSAGE = `🎬 Loading movies...`;
const ERROR_MESSAGE = `Something went wrong while loading movies. Check your connection or try again later 😓`;
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
const profileRatingContainer = document.querySelector(`.profile__rating`);
const headerLogo = document.querySelector(`.header__logo`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: FILMS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, generateId: () => String(Date.now())});

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncFilms();
});

// Сортировка дополнительных блоков

const compareRating = (a, b) => b.rating - a.rating;
const compareCommentsCount = (a, b) => b.comments.length - a.comments.length;

// Отрисовка списка фильмов
/**
 * @param {Array} films
 * @param {Element} container
 * @param {Boolean} showControls
 */
const renderFilmsList = (films, container, showControls = true) => {
  films.forEach((data) => {
    const filmCard = new FilmCard(data, showControls);
    const filmPopup = new FilmPopup(data);

    container.appendChild(filmCard.render());

    // Открытие попапа с деталями фильма

    filmCard.onCommentsClick = () => {
      document.body.appendChild(filmPopup.render());
    };

    // Добавление фильма в watchlist через карточку

    filmCard.onAddToWatchList = () => {
      filmCard._isInWatchlist = !filmCard._isInWatchlist;
      data.isInWatchlist = filmCard._isInWatchlist;
      filmPopup._isInWatchlist = data.isInWatchlist;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmCard.update(newData);
        });
    };

    // Добавление фильма в watched через карточку

    filmCard.onMarkAsWatched = () => {
      filmCard._isWatched = !filmCard._isWatched;
      data.isWatched = filmCard._isWatched;
      filmPopup._isWatched = data.isWatched;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => filmCard.update(newData));
    };

    // Добавление фильма в favorite через карточку

    filmCard.onAddToFavorite = () => {
      filmCard._isFavorite = !filmCard._isFavorite;
      data.isFavorite = filmCard._isFavorite;
      filmPopup._isFavorite = data.isFavorite;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => filmCard.update(newData));
    };

    // Добавление комментария через popup

    filmPopup.onAddComment = (newData) => {
      data.comments.push(newData.comments);
      filmPopup._comments = data.comments;
      filmCard._comments = data.comments;
      filmPopup.disableComments();

      provider.updateFilm({id: data.id, data: data.toRAW()})
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

    filmPopup.onDeleteComment = () => {
      data.comments.pop();
      filmPopup._comments = data.comments;
      filmCard._comments = data.comments;
      filmPopup.deleteComment();

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newComment) => {
          filmCard.update(newComment);
          filmPopup.update(newComment);
        })
        .catch(() => {
          filmPopup.shake();
        });
    };

    // Установка оценки фильма пользователем через popup

    filmPopup.onSetRating = (newData) => {
      data.score = newData.score;
      filmPopup.disableRating();

      provider.updateFilm({id: data.id, data: data.toRAW()})
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

    // Добавление фильма в watchlist через popup

    filmPopup.onAddToWatchList = () => {
      filmPopup._isInWatchlist = !filmPopup._isInWatchlist;
      data.isInWatchlist = filmPopup._isInWatchlist;
      filmCard._isInWatchlist = data.isInWatchlist;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
        });
    };

    // Добавление фильма в watched через popup

    filmPopup.onMarkAsWatched = () => {
      filmPopup._isWatched = !filmPopup._isWatched;
      data.isWatched = filmPopup._isWatched;
      filmCard._isWatched = data.isWatched;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
        });
    };

    // Добавление фильма в favorite через popup

    filmPopup.onAddToFavorite = () => {
      filmPopup._isFavorite = !filmPopup._isFavorite;
      data.isFavorite = filmPopup._isFavorite;
      filmCard._isFavorite = data.isFavorite;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
        });
    };

    // Закрытие popup

    filmPopup.onClose = () => {
      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
          filmPopup.destroy();
        });
    };

    document.addEventListener(`keydown`, (event) => {
      if (event.keyCode === Keycode.ESC) {
        provider.updateFilm({id: data.id, data: data.toRAW()})
          .then((newData) => {
            filmPopup.update(newData);
            filmCard.update(newData);
            filmPopup.destroy();
          });
      }
    });
  });
};

// Подсчет кол-ва фильмов по статусу

/**
 * @param {Array} films
 * @param {String} status
 * @return {Number}
 */
const countFilmsWithStatus = (films, status) => films.filter((film) => film[status]).length;

// Сортировка и отрисовка фильмов по типу и отрисовка списка фильмов
/**
 * @param {Array} films
 * @param {String} type
 * @param {Number} endAmount
 * @param {Number} startAmount
 * @return {Element}
 */
const filterMainFilmsByType = (films, type, endAmount, startAmount = 0) =>
  renderFilmsList(films
    .filter((film) => film[type])
    .slice(startAmount, endAmount), mainFilmsContainer
  );

// Переключение отображения кнопки ShowMore
/**
 * @param {Array} filmsData
 * @param {NodeListOf<Element>} currentTypeFilms
 * @param {String} state
 */
const toggleShowMoreButton = (filmsData, currentTypeFilms, state) => {
  if (countFilmsWithStatus(filmsData, state) === currentTypeFilms.length || currentTypeFilms.length === 0) {
    showMoreButton.classList.add(HIDDEN_CLASS);
  } else if (countFilmsWithStatus(filmsData, state) > currentTypeFilms.length) {
    showMoreButton.classList.remove(HIDDEN_CLASS);
  }
};

// Отрисовка фильтров
/**
 * @param {Element} container
 * @param {Array} filters
 * @param {Array} films
 */
const renderFilters = (container, filters, films) => {
  filters.reverse().forEach((filterItem) => {
    const filterData = Object.assign(filterItem);

    if (filterData.type === FilterType.WATCHLIST) {
      filterData.count = countFilmsWithStatus(films, FilmState.IN_WATCHLIST);
    } else if (filterData.type === FilterType.HISTORY) {
      filterData.count = countFilmsWithStatus(films, FilmState.WATCHED);
    } else if (filterData.type === FilterType.FAVORITES) {
      filterData.count = countFilmsWithStatus(films, FilmState.FAVORITE);
    }

    const filterComponent = new Filter(filterData);

    container.insertAdjacentElement(`afterbegin`, filterComponent.render());

    // Сортировка фильмов по фильтру

    filterComponent.onFilter = () => {
      const filmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
      const activeItem = mainNavigation.querySelector(`.${ACTIVE_MENU_ITEM_CLASS}`);

      if (filmsContainer.classList.contains(HIDDEN_CLASS)) {
        filmsContainer.classList.remove(HIDDEN_CLASS);
        statisticButton.classList.remove(ACTIVE_MENU_ITEM_CLASS);
        statisticContainer.innerHTML = ``;
      }

      filmCards.forEach((card) => card.remove());
      filterData.isActive = !filterData.isActive;
      activeItem.classList.remove(ACTIVE_MENU_ITEM_CLASS);
      filterComponent.element.classList.add(ACTIVE_MENU_ITEM_CLASS);
      filterComponent.update(filterData);

      const checkCurrentFilter = (type) => {
        filterMainFilmsByType(films, type, MAIN_BLOCK_MAX_CARDS);
        const filterTypeFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
        toggleShowMoreButton(films, filterTypeFilmCards, type);
      };

      switch (filterItem.type) {
        case FilterType.WATCHLIST: checkCurrentFilter(FilmState.IN_WATCHLIST);
          break;
        case FilterType.HISTORY: checkCurrentFilter(FilmState.WATCHED);
          break;
        case FilterType.FAVORITES: checkCurrentFilter(FilmState.FAVORITE);
          break;
        default:
          renderFilmsList(films.slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer);
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

// Отрисовка поиска фильмов
/**
 * @param {Array} films
 */
const renderSearch = (films) => {
  const searchComponent = new Search();
  headerLogo.insertAdjacentElement(`afterend`, searchComponent.render());

  searchComponent.onChange = (value) => {
    const searchedItems = films.filter((item) => item.title.toLowerCase().includes(value));
    mainFilmsContainer.innerHTML = ``;

    if (value === ``) {
      renderFilmsList(films.slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer);
      const allFilmsCards = mainFilmsContainer.querySelectorAll(`.film-card`);

      if (allFilmsCards.length === films.length) {
        showMoreButton.classList.add(HIDDEN_CLASS);
      } else {
        showMoreButton.classList.remove(HIDDEN_CLASS);
      }
    } else {
      renderFilmsList(searchedItems.slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer);
      const searchedFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);

      if (searchedFilmCards.length < MAIN_BLOCK_MAX_CARDS) {
        showMoreButton.classList.add(HIDDEN_CLASS);
      } else {
        showMoreButton.classList.remove(HIDDEN_CLASS);
      }
    }
  };
};

// Рассчет звания пользователя
/**
 * @param {Array} films
 * @return {String}
 */
const getProfileRating = (films) => {
  const count = countFilmsWithStatus(films, FilmState.WATCHED);

  if (count <= 10 && count !== 0) {
    return UserRank.NOVICE;
  } else if (count >= 11 && count <= 20) {
    return UserRank.FAN;
  } else if (count >= 21) {
    return UserRank.MOVIE_BUFF;
  } else {
    return null;
  }
};

// Плейсхолдер для загрузки
/**
 * @param {String} message
 */
const showPlaceholder = (message) => {
  placeholderContainer.textContent = message;
  placeholderContainer.classList.remove(HIDDEN_CLASS);
};

const removePlaceholder = () => {
  placeholderContainer.classList.add(HIDDEN_CLASS);
};

showPlaceholder(LOADING_MESSAGE);

// Загрузка данных с сервера
/**
 * @param {Array} films
 */
provider.getFilms()
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
    renderSearch(films);

    // Отрисовка статистики

    statisticButton.addEventListener(`click`, () => {
      const statisticComponent = new Statistic(films);
      statisticComponent.render();

      if (statisticButton.classList.contains(ACTIVE_MENU_ITEM_CLASS)) {
        statisticButton.classList.remove(ACTIVE_MENU_ITEM_CLASS);
        statisticContainer.innerHTML = ``;
        filmsContainer.classList.remove(HIDDEN_CLASS);
        statisticComponent.destroy();
      } else if (!statisticButton.classList.contains(ACTIVE_MENU_ITEM_CLASS)) {
        statisticButton.classList.add(ACTIVE_MENU_ITEM_CLASS);
        statisticContainer.innerHTML = ``;
        filmsContainer.classList.add(HIDDEN_CLASS);
        statisticContainer.appendChild(statisticComponent.element);
      }
    });

    footerStatisticContainer.innerHTML = `<p>${films.length} movies inside</p>`;
    profileRatingContainer.textContent = getProfileRating(films);

    // Показать больше карточек showMoreButton

    showMoreButton.addEventListener(`click`, () => {
      const visibleFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
      const activeItem = mainNavigation.querySelector(`.${ACTIVE_MENU_ITEM_CLASS}`);

      const checkFilterType = (type) => {
        filterMainFilmsByType(films, type, visibleFilmCards.length + MAIN_BLOCK_MAX_CARDS, visibleFilmCards.length);
        const allInTypeFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);

        if (allInTypeFilmCards.length === countFilmsWithStatus(films, type)) {
          showMoreButton.classList.add(HIDDEN_CLASS);
        }
      };

      switch (activeItem.id) {
        case FilterType.WATCHLIST: checkFilterType(FilmState.IN_WATCHLIST);
          break;
        case FilterType.HISTORY: checkFilterType(FilmState.WATCHED);
          break;
        case FilterType.FAVORITES: checkFilterType(FilmState.FAVORITE);
          break;
        default:
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
    showPlaceholder(ERROR_MESSAGE);
  });
