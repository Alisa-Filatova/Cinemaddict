import moment from 'moment';
import Component from './component';

class FilmCard extends Component {
  constructor(data, showControls = true) {
    super();
    this._title = data.title;
    this._description = data.description;
    this._poster = data.poster;
    this._date = data.date;
    this._rating = data.rating;
    this._duration = data.duration;
    this._genre = data.genre;
    this._comments = data.comments;

    this._showControls = showControls;
    this._onCommentsClick = null;
  }

  _onCommentsBtnClick(event) {
    event.preventDefault();

    if (typeof this._onCommentsClick === `function`) {
      this._onCommentsClick();
    }
  }

  set onCommentsClick(fn) {
    this._onCommentsClick = fn;
  }

  update(data) {
    this._comments = data.comments;
    this._element.querySelector(`.film-card__comments`).textContent = `${this._comments.length} comments`;
  }

  get template() {
    return (
      `<article class="film-card ${this._showControls ? `` : `film-card--no-controls`}">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${moment(this._date).format(`YYYY`)}</span>
          <span class="film-card__duration">1h&nbsp;${this._duration.getMinutes() ? `${Number(moment(this._duration).format(`mm`))}m` : ``}</span>
          <span class="film-card__genre">${this._genre}</span>
        </p>
        <img src="${this._poster}" alt="${this._title}" class="film-card__poster">
        <p class="film-card__description">${this._description}</p>
        <button class="film-card__comments">${this._comments.length} comments</button>
        ${this._showControls ? `<form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
        </form>` : ``}
      </article>`
    );
  }

  addEventListeners() {
    this._element.querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onCommentsBtnClick.bind(this));
  }
}

export default FilmCard;
