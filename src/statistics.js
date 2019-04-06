import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Component from './component';
import {createElement, isNumeric} from './utils';

class Statistic extends Component {
  constructor(films) {
    super();
    this._films = films;
    this._watchedFilms = this._films.filter((film) => film.isWatched);
    this._filteredFilms = this._watchedFilms;
    this._chart = null;

    this._filterByPeriod = this._filterByPeriod.bind(this);
  }

  _filterByPeriod() {
    const filter = this._element.querySelector(`.statistic__filters-input:checked`).value;

    switch (filter) {
      case `all-time`:
        this._filteredFilms = this._watchedFilms;
        break;
      case `today`:
        this._filteredFilms = this._watchedFilms.filter((film) =>
          moment(film.watchDate).format(`D MMMM YYYY`) === moment().format(`D MMMM YYYY`));
        break;
      case `week`:
        this._filteredFilms = this._watchedFilms
          .filter((film) => moment(film.watchDate) > moment()
          .subtract(1, `w`));
        break;
      case `month`:
        this._filteredFilms = this._watchedFilms
          .filter((film) => moment(film.watchDate) > moment()
          .subtract(1, `months`));
        break;
      case `year`:
        this._filteredFilms = this._watchedFilms
          .filter((film) => moment(film.watchDate) > moment()
          .subtract(1, `y`));
        break;
    }

    this._onUpdateDate();
  }

  _filterByGenre() {
    let filteredFilms = {};

    this._filteredFilms.forEach((film) => {
      film.genres.map((genre) => {
        filteredFilms[genre] = isNumeric(filteredFilms[genre]) ? filteredFilms[genre] + 1 : 1;
      });
    });

    const genres = Object.keys(filteredFilms);
    const genresCount = Object.values(filteredFilms);

    return [genres, genresCount];
  }

  _generateCharts() {
    const BAR_HEIGHT = 50;
    const statisticWrapper = this._element.querySelector(`.statistic__chart`);
    const [genreLabels, genreAmounts] = this._filterByGenre();
    statisticWrapper.height = BAR_HEIGHT * genreLabels.length;

    this._chart = new Chart(statisticWrapper, this._getChart());

    this._chart.data = {
      labels: genreLabels,
      datasets: [{
        data: genreAmounts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    };

    this._chart.update();
  }

  _getChart() {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      options: {
        plugins: {
          datalabels: {
            font: {size: 20},
            color: `#fff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#fff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {display: false},
        tooltips: {enabled: false}
      }
    };
  }

  _getFilmsRuntimeTemplate() {
    const totalDuration = this._filteredFilms.reduce((duration, film) => duration + film.duration, 0);
    return (
      `${moment.duration(totalDuration).hours()} 
       <span class="statistic__item-description">h</span> 
       ${moment.duration(totalDuration).minutes()} 
       <span class="statistic__item-description">m</span>`
    );
  }

  _getTopGenresTemplate() {
    const [genreLabels, genreAmounts] = this._filterByGenre();
    const max = Math.max(...genreAmounts);
    const maxID = genreAmounts.indexOf(max);

    return `${genreLabels[maxID] ? genreLabels[maxID] : ``}`;
  }

  _getWatchedFilmsTemplate() {
    return (
      `${this._filteredFilms.length} 
      <span class="statistic__item-description">
        movie${this._filteredFilms.length === 1 ? `` : `s`}
      </span>`
    );
  }

  _onUpdateDate() {
    this._chart.destroy();
    this._generateCharts();
    this._element.querySelector(`.statistic__item-text--watched`).innerHTML = this._getWatchedFilmsTemplate();
    this._element.querySelector(`.statistic__item-text--duration`).innerHTML = this._getFilmsRuntimeTemplate();
    this._element.querySelector(`.statistic__item-text--genres`).innerHTML = this._getTopGenresTemplate();
  }

  get template() {
    return (`<div>
      <p class="statistic__rank">Your rank <span class="statistic__rank-label">Sci-Fighter</span></p>
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>
    
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
    
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text statistic__item-text--watched">${this._getWatchedFilmsTemplate()}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text statistic__item-text--duration">${this._getFilmsRuntimeTemplate()}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text statistic__item-text--genres">${this._getTopGenresTemplate()}</p>
        </li>
      </ul>
    
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    
    </div>`);
  }

  addEventListeners() {
    this._element.querySelectorAll(`.statistic__filters-input`).forEach((element) => {
      element.addEventListener(`click`, this._filterByPeriod);
    });
  }

  render() {
    this._element = createElement(this.template);
    this.addEventListeners();
    this._generateCharts();
    return this._element;
  }

  removeEventListeners() {
    this._element.querySelectorAll(`.statistic__filters-input`).forEach((element) => {
      element.removeEventListener(`click`, this._filterByPeriod);
    });
  }
}

export default Statistic;
