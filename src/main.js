import FilmCard from './components/film-card';
import FilmPopup from './components/film-popup';
import Filter from './components/filter';
import Statistic from './components/statistics';
import Search from './components/search';
import API from './api';
import Provider from './provider';
import Store from './store';
import {getUserRank, calcCountFilmsWithStatus} from './utils';
import {FilmState, FilterType} from './enums';
import {
  AUTHORIZATION,
  END_POINT,
  FILMS_STORE_KEY,
  MAIN_BLOCK_MAX_CARDS,
  EXTRA_BLOCK_MAX_CARDS,
  HIDDEN_CLASS,
} from './constants';

const FILTERS_DATA = [
  {
    title: `All movies`,
    type: FilterType.ALL,
    count: null,
    isActive: true,
  },
  {
    title: `Watchlist`,
    type: FilterType.WATCHLIST,
    count: null,
    isActive: false,
  },
  {
    title: `History`,
    type: FilterType.HISTORY,
    count: null,
    isActive: false,
  },
  {
    title: `Favorites`,
    type: FilterType.FAVORITES,
    count: null,
    isActive: false,
  },
];

const ACTIVE_MENU_ITEM_CLASS = `main-navigation__item--active`;
const LOADING_MESSAGE = `🎬 Loading movies...`;
const ERROR_MESSAGE = `Something went wrong while loading movies. Check your connection or try again later 😓`;

const mainNavContainer = document.querySelector(`.main-navigation`);
const filmsContainer = document.querySelector(`.films`);
const mainFilmsContainer = filmsContainer.querySelector(`.films-list .films-list__container`);
const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--top-rated .films-list__container`);
const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--most-commented .films-list__container`);
const statisticContainer = document.querySelector(`.statistic`);
const statisticButton = document.querySelector(`.main-navigation__item--additional`);
const placeholderContainer = document.querySelector(`.films-list__title`);
const footerStatisticContainer = document.querySelector(`.footer__statistics`);
const showMoreButton = document.querySelector(`.films-list__show-more`);
const userRankContainer = document.querySelector(`.profile__rating`);
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

/**
 * Отрисовка списка фильмов
 *
 * @param {Array} films
 * @param {Element} container
 * @param {Boolean} showControls
 */
const renderFilmsList = (films, container, showControls = true) => {
  films.forEach((data) => {
    const filmCard = new FilmCard(data, showControls);
    const filmPopup = new FilmPopup(data);

    container.appendChild(filmCard.render());

    filmCard.onCommentsClick = () => {
      if (document.body.querySelector(`.film-details`)) {
        filmPopup.destroy();
      }

      filmPopup.render();
      document.body.appendChild(filmPopup.render());
    };

    filmCard.onAddToWatchList = () => {
      data.isInWatchlist = !data.isInWatchlist;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmCard.update(newData);
          filmPopup.partialUpdate(newData);
          updateFilmsFilterCount(newData.isInWatchlist, FilterType.WATCHLIST);
        });
    };

    filmCard.onMarkAsWatched = () => {
      data.isWatched = !data.isWatched;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmCard.update(newData);
          filmPopup.partialUpdate(newData);
          updateFilmsFilterCount(newData.isWatched, FilterType.HISTORY);
        });
    };

    filmCard.onAddToFavorite = () => {
      data.isFavorite = !data.isFavorite;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmCard.update(newData);
          filmPopup.partialUpdate(newData);
          updateFilmsFilterCount(newData.isFavorite, FilterType.FAVORITES);
        });
    };

    filmPopup.onAddComment = (newData) => {
      data.comments.push(newData.comments);
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
      filmPopup.deleteComment();

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newComment) => {
          filmCard.update(newComment);
          filmPopup.update(newComment);
        })
        .catch(() => filmPopup.shake());
    };

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

    filmPopup.onAddToWatchList = () => {
      data.isInWatchlist = !data.isInWatchlist;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
          updateFilmsFilterCount(newData.isInWatchlist, FilterType.WATCHLIST);
        })
        .catch(() => filmPopup.shake());
    };

    filmPopup.onMarkAsWatched = () => {
      data.isWatched = !data.isWatched;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
          updateFilmsFilterCount(newData.isWatched, FilterType.HISTORY);
        })
        .catch(() => filmPopup.shake());
    };

    filmPopup.onAddToFavorite = () => {
      data.isFavorite = !data.isFavorite;

      provider.updateFilm({id: data.id, data: data.toRAW()})
        .then((newData) => {
          filmPopup.update(newData);
          filmCard.update(newData);
          updateFilmsFilterCount(newData.isFavorite, FilterType.FAVORITES);
        })
        .catch(() => filmPopup.shake());
    };

    filmPopup.onClose = () => filmPopup.destroy();
    filmPopup.onEsc = () => filmPopup.destroy();
  });
};

/**
 * Обновление кол-ва отфильтрованных фильмов в верстке
 *
 * @param {Boolean} filter
 * @param {String} filterId
 */
const updateFilmsFilterCount = (filter, filterId) => {
  const filterComponent = document.querySelector(`#${filterId} .main-navigation__item-count`);

  if (filter) {
    filterComponent.textContent = `${+filterComponent.textContent + 1}`;
  } else {
    filterComponent.textContent = `${+filterComponent.textContent - 1}`;
  }
};

/**
 * Сортировка и отрисовка фильмов по типу
 *
 * @param {Array} films
 * @param {String} type
 * @param {Number} endAmount
 * @param {Number} startAmount
 */
const filterFilmsByType = (films, type, endAmount, startAmount = 0) => {
  const filmsArray = films
    .filter((film) => film[type])
    .slice(startAmount, endAmount);

  renderFilmsList(filmsArray, mainFilmsContainer);
};

/**
 * Переключение отображения кнопки ShowMore
 *
 * @param {Array} filmsData
 * @param {NodeListOf<Element>} currentTypeFilms
 * @param {String} state
 */
const toggleShowMoreButton = (filmsData, currentTypeFilms, state) => {
  if (calcCountFilmsWithStatus(filmsData, state) === currentTypeFilms.length
    || currentTypeFilms.length === 0
  ) {
    showMoreButton.classList.add(HIDDEN_CLASS);
  } else if (calcCountFilmsWithStatus(filmsData, state) > currentTypeFilms.length) {
    showMoreButton.classList.remove(HIDDEN_CLASS);
  }
};

/**
 * Отрисовка фильтров
 *
 * @param {Element} container
 * @param {Array} filters
 * @param {Array} films
 */
const renderFilters = (container, filters, films) => {
  filters.reverse().forEach((filterItem) => {
    const filterData = Object.assign(filterItem);

    /**
     * Вычисление кол-ва фильмов по типу фильтра
     *
     * @param {Object} filter
     * @param {Array} filmsData
     */
    const calcTypeOfFilmsCount = (filter, filmsData) => {
      if (filter.type === FilterType.WATCHLIST) {
        filter.count = calcCountFilmsWithStatus(filmsData, FilmState.IN_WATCHLIST);
      } else if (filter.type === FilterType.HISTORY) {
        filter.count = calcCountFilmsWithStatus(filmsData, FilmState.WATCHED);
      } else if (filter.type === FilterType.FAVORITES) {
        filter.count = calcCountFilmsWithStatus(filmsData, FilmState.FAVORITE);
      }
    };

    calcTypeOfFilmsCount(filterData, films);

    const filterComponent = new Filter(filterData);
    container.insertAdjacentElement(`afterbegin`, filterComponent.render());

    filterComponent.onFilter = () => {
      const filmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
      const activeMenuItem = mainNavContainer.querySelector(`.${ACTIVE_MENU_ITEM_CLASS}`);

      if (filmsContainer.classList.contains(HIDDEN_CLASS)) {
        filmsContainer.classList.remove(HIDDEN_CLASS);
        statisticButton.classList.remove(ACTIVE_MENU_ITEM_CLASS);
        statisticContainer.innerHTML = ``;
      }

      filmCards.forEach((card) => card.remove());
      filterData.isActive = !filterData.isActive;
      activeMenuItem.classList.remove(ACTIVE_MENU_ITEM_CLASS);
      filterComponent.element.classList.add(ACTIVE_MENU_ITEM_CLASS);

      // Обновляем статус пользователя в хедере
      userRankContainer.textContent = getUserRank(films);

      /**
       * Отрисовка кнопки showMore в зависимости от кол-ва карточек в фильтре
       *
       * @param {String} filterType
       */
      const checkShowMoreButtonView = (filterType) => {
        filterFilmsByType(films, filterType, MAIN_BLOCK_MAX_CARDS);
        const filterTypeFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
        toggleShowMoreButton(films, filterTypeFilmCards, filterType);
      };

      switch (filterItem.type) {
        case FilterType.WATCHLIST:
          checkShowMoreButtonView(FilmState.IN_WATCHLIST);
          break;

        case FilterType.HISTORY:
          checkShowMoreButtonView(FilmState.WATCHED);
          break;

        case FilterType.FAVORITES:
          checkShowMoreButtonView(FilmState.FAVORITE);
          break;

        default: {
          renderFilmsList(films.slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer);
          const allFilmsCards = mainFilmsContainer.querySelectorAll(`.film-card`);

          if (allFilmsCards.length === films.length) {
            showMoreButton.classList.add(HIDDEN_CLASS);
          } else {
            showMoreButton.classList.remove(HIDDEN_CLASS);
          }
        }
      }
    };
  });
};

/**
 * Отрисовка поиска фильмов
 *
 * @param {Array} films
 */
const renderSearch = (films) => {
  const searchInput = new Search();
  headerLogo.insertAdjacentElement(`afterend`, searchInput.render());

  searchInput.onChange = (value) => {
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

/**
 * Отрисовка статистики
 *
 * @param {Array} films
 */
const renderStatistic = (films) => {
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
  // Обновляем статус пользователя в хедере
  userRankContainer.textContent = getUserRank(films);
};

/**
 * Показать больше карточкек
 *
 * @param {Array} films
 */
const showMore = (films) => {
  const visibleFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);
  const activeMenuItem = mainNavContainer.querySelector(`.${ACTIVE_MENU_ITEM_CLASS}`);

  /**
   * Отрисовка следующего ряда карточек по типу фильтра
   *
   * @param {String} type
   */
  const renderSecondRowOfFilms = (type) => {
    filterFilmsByType(films, type, visibleFilmCards.length + MAIN_BLOCK_MAX_CARDS, visibleFilmCards.length);
    const allInTypeFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);

    if (allInTypeFilmCards.length === calcCountFilmsWithStatus(films, type)) {
      showMoreButton.classList.add(HIDDEN_CLASS);
    }
  };

  switch (activeMenuItem.id) {
    case FilterType.WATCHLIST:
      renderSecondRowOfFilms(FilmState.IN_WATCHLIST);
      break;

    case FilterType.HISTORY:
      renderSecondRowOfFilms(FilmState.WATCHED);
      break;

    case FilterType.FAVORITES:
      renderSecondRowOfFilms(FilmState.FAVORITE);
      break;

    default: {
      const filmsArray = films.slice(visibleFilmCards.length, visibleFilmCards.length + MAIN_BLOCK_MAX_CARDS);

      renderFilmsList(filmsArray, mainFilmsContainer);

      const allFilmCards = mainFilmsContainer.querySelectorAll(`.film-card`);

      if (allFilmCards.length === films.length) {
        showMoreButton.classList.add(HIDDEN_CLASS);
      }
    }
  }
};

/**
 * Плейсхолдер для загрузки
 *
 * @param {String} message
 */
const showPlaceholder = (message) => {
  placeholderContainer.textContent = message;
  placeholderContainer.classList.remove(HIDDEN_CLASS);
};

const removePlaceholder = () => {
  placeholderContainer.classList.add(HIDDEN_CLASS);
};

const compareCommentsCount = (min, max) => max.comments.length - min.comments.length;
const compareRating = (min, max) => max.rating - min.rating;

showPlaceholder(LOADING_MESSAGE);

provider.getFilms()
  .then((films) => {
    removePlaceholder();
    renderFilters(mainNavContainer, FILTERS_DATA, films);
    renderSearch(films);
    renderFilmsList(films
      .slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer);
    renderFilmsList(films
      .sort(compareRating)
      .slice(0, EXTRA_BLOCK_MAX_CARDS), topRatedFilmsContainer, false);
    renderFilmsList(films
      .sort(compareCommentsCount)
      .slice(0, EXTRA_BLOCK_MAX_CARDS), mostCommentedFilmsContainer, false);

    // Отрисовка статистики
    statisticButton.addEventListener(`click`, () => renderStatistic(films));
    footerStatisticContainer.innerHTML = `<p>${films.length} movies inside</p>`;

    // Вывести уровень пользователя
    userRankContainer.textContent = getUserRank(films);

    // Показать больше карточек
    showMoreButton.addEventListener(`click`, () => showMore(films));
  })
  .catch(() => {
    showPlaceholder(ERROR_MESSAGE);
  });
