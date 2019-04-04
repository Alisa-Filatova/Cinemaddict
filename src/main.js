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

// Генерация списка карточек фильмов из случайных данных

// const getFilmsData = (amount) =>
//   Array.from({length: amount}).map(() => createFilmCard());

// Сортировка дополнительных блоков

const compareRating = (a, b) => b.rating - a.rating;
const compareCommentsCount = (a, b) => b.comments.length - a.comments.length;

// Данные карточек фильмов
const filmsData = api.getFilms();

let data = [];
filmsData.then((films) => films.map((item) => data.push(item)));
console.log(data);

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

filmsData.then((films) =>
  renderFilmsList(films
    .slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer
  )
);

filmsData.then((films) =>
  renderFilmsList(films
    .sort(compareRating)
    .slice(0, EXTRA_BLOCK_MAX_CARDS), topRatedFilmsContainer, false
  )
);

filmsData.then((films) =>
  renderFilmsList(films
    .sort(compareCommentsCount)
    .slice(0, EXTRA_BLOCK_MAX_CARDS), mostCommentedFilmsContainer, false
  )
);

// Отрисовка фильтров
//
// const countFilmsWithStatus = (films, status) => films.filter((film) => film[status]).length;
const filterMainFilmsByType = (type) =>
  filmsData.then((films) => renderFilmsList(films
    .filter((film) => film[type])
    .slice(0, EXTRA_BLOCK_MAX_CARDS), mainFilmsContainer
  ));

const renderFilters = (container, filters) => {
  filters.reverse().forEach((filterItem) => {
    const filterData = Object.assign(filterItem);

    // if (filterData.type === `watchlist`) {
    //   filterData.count = countFilmsWithStatus(filmsData, `isInWatchList`);
    // } else if (filterData.type === `history`) {
    //   filterData.count = countFilmsWithStatus(filmsData, `isWatched`);
    // } else if (filterData.type === `favorites`) {
    //   filterData.count = countFilmsWithStatus(filmsData, `isFavorite`);
    // }

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
        filterMainFilmsByType(`isInWatchlist`);
      } else if (filterItem.type === `history`) {
        filterMainFilmsByType(`isWatched`);
      } else if (filterItem.type === `favorites`) {
        filterMainFilmsByType(`isFavorite`);
      } else {
        filmsData.then((films) => renderFilmsList(films
          .slice(0, MAIN_BLOCK_MAX_CARDS), mainFilmsContainer, MAIN_BLOCK_MAX_CARDS)
        );
      }
    };
  });
};

renderFilters(mainNavigation, filtersData);

// TODO Отрисовка статистики

const showStatistic = () => {
  const statisticComponent = new Statistic(filmsData);

  statisticContainer.innerHTML = ``;
  filmsContainer.classList.add(HIDDEN_CLASS);
  statisticContainer.appendChild(statisticComponent.render());
  statisticButton.classList.add(`main-navigation__item--active`);
};

statisticButton.addEventListener(`click`, showStatistic);
