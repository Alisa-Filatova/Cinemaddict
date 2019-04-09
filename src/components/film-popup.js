import moment from 'moment';
import 'moment-duration-format';
import Component from './component';
import {EMOJIES, MAX_RATE_NUMBER} from '../constants/index';
import {Keycode} from '../enums/index';

class FilmPopup extends Component {

  constructor(data) {
    super();
    this._id = data.id;
    this._title = data.title;
    this._titleOriginal = data.titleOriginal;
    this._description = data.description;
    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;
    this._poster = data.poster;
    this._releaseDate = data.releaseDate;
    this._country = data.country;
    this._rating = data.rating;
    this._score = data.score;
    this._genres = data.genres;
    this._ageLimit = data.ageLimit;
    this._comments = data.comments;
    this._duration = data.duration;

    this._isInWatchlist = data.isInWatchlist;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;

    this._onAddComment = null;
    this._onDeleteComment = null;
    this._onSetRating = null;
    this._onClose = null;

    this._onAddToWatchList = null;
    this._onMarkAsWatched = null;
    this._onAddToFavorite = null;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onAddNewComment = this._onAddNewComment.bind(this);
    this._onDeleteLastComment = this._onDeleteLastComment.bind(this);
    this._onEmojiChange = this._onEmojiChange.bind(this);
    this._onRatingChange = this._onRatingChange.bind(this);

    this._onAddToWatchListClick = this._onAddToWatchListClick.bind(this);
    this._onMarkAsWatchedClick = this._onMarkAsWatchedClick.bind(this);
    this._onAddToFavoriteClick = this._onAddToFavoriteClick.bind(this);
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set onAddComment(fn) {
    this._onAddComment = fn;
  }

  set onDeleteComment(fn) {
    this._onDeleteComment = fn;
  }

  set onSetRating(fn) {
    this._onSetRating = fn;
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  set onAddToFavorite(fn) {
    this._onAddToFavorite = fn;
  }

  _onCloseClick(event) {
    event.preventDefault();

    if (typeof this._onClose === `function`) {
      this._onClose();
    }
  }

  _onAddNewComment(event) {
    if (event.ctrlKey && event.keyCode === Keycode.ENTER
      && document.querySelector(`.film-details__comment-input`).value.trim() !== ``
    ) {
      const formData = new FormData(this._element.querySelector(`form`));
      const newData = this._processForm(formData);
      this._element.querySelector(`.film-details__user-rating-controls`).classList.remove(`visually-hidden`);

      if (typeof this._onAddComment === `function` && this._onAddComment(newData)) {
        this.update(newData);
      }
    }
  }

  // TODO
  _onDeleteLastComment() {
    if (typeof this._onDeleteComment === `function`) {
      this._onDeleteComment();
    }
  }

  _onEmojiChange(event) {
    if (event.target.name === `comment-emoji`) {
      const emoji = this._element.querySelector(`.film-details__add-emoji-label`);

      emoji.textContent = event.target.nextElementSibling.textContent;
      emoji.nextElementSibling.checked = false;
    }
  }

  _onRatingChange(event) {
    if (event.target.name === `score`) {
      const formData = new FormData(this._element.querySelector(`form`));
      const newData = this._processForm(formData);

      if (typeof this._onSetRating === `function` && this._onSetRating(newData)) {
        this.update(newData);
      }
    }
  }

  _onAddToWatchListClick(event) {
    event.preventDefault();

    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList();
    }
  }

  _onMarkAsWatchedClick(event) {
    event.preventDefault();

    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched();
    }
  }

  _onAddToFavoriteClick(event) {
    event.preventDefault();

    if (typeof this._onAddToFavorite === `function`) {
      this._onAddToFavorite();
    }
  }

  static _onAddNewComment(comments) {
    return comments.map((item) => `<li class="film-details__comment">
      <span class="film-details__comment-emoji">${EMOJIES[item.emotion]}</span>
      <div>
        <p class="film-details__comment-text">${item.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.author}</span>
          <span class="film-details__comment-day">${moment(item.date).fromNow()}</span>
        </p>
      </div>
    </li>`).join(``);
  }

  static _createMapper(target) {
    return {
      "comment-emoji": (value) => {
        target.comments.emotion = value;
      },
      "comment": (value) => (target.comments.comment = value),
      "score": (value) => (target.score = value),
    };
  }

  _processForm(formData) {
    const entry = {
      comments: {
        emotion: EMOJIES[`neutral-face`],
        comment: ``,
        author: `New user`,
        date: Date.now(),
      },
      score: 0,
    };

    const filmEditMapper = FilmPopup._createMapper(entry);

    Array.from(formData.entries())
      .forEach(([property, value]) =>
        filmEditMapper[property] && filmEditMapper[property](value));
    return entry;
  }

  update(data) {
    this._isInWatchlist = data.isInWatchlist;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
    this._comments = data.comments;
    this._score = data.score;
    this._element.querySelector(`.film-details__comments-list`).innerHTML = FilmPopup._onAddNewComment(this._comments);
    this._element.querySelector(`.film-details__comment-input`).value = ``;
    this._element.querySelector(`.film-details__comments-count`).textContent = this._comments.length;
    this._element.querySelector(`.film-details__user-rating-count`).textContent = this._score;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.querySelector(`.film-details__inner`).classList.add(`shake`);

    setTimeout(() => {
      this._element.querySelector(`.film-details__inner`).classList.remove(`shake`);
    }, ANIMATION_TIMEOUT);
  }

  disableComments() {
    this._element.querySelectorAll(`.film-details__add-emoji`).disabled = true;
    this._element.querySelectorAll(`.film-details__comment-input`).disabled = true;
  }

  disableRating() {
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((item) => {
      item.disabled = true;
    });
  }

  unblockComments() {
    this._element.querySelectorAll(`.film-details__add-emoji`).disabled = false;
    this._element.querySelectorAll(`.film-details__comment-input`).disabled = false;
  }

  unblockRating() {
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((item) => {
      item.disabled = false;
    });
  }

  showCommentsError() {
    this._element.querySelector(`.film-details__comment-input`).style.border = `solid 3px #ff0000`;
    this.unblockComments();
  }

  showRatingError() {
    this._element.querySelector(`.film-details__user-rating-input:checked + label`).style.backgroundColor = `#ff0000`;
    this.unblockRating();
  }

  get template() {

    const filmDetails = [
      {title: `Director`, value: this._director},
      {title: `Writers`, value: this._writers.join(`, `)},
      {title: `Actors`, value: this._actors.join(`, `)},
      {title: `Release Date`, value: `${moment(this._releaseDate).format(`DD MMMM YYYY`)} (${this._country})`},
      {title: `Runtime`, value: `${moment.duration(this._duration, `minutes`).format(`m [min]`)}`},
      {title: `Country`, value: this._country},
      {title: `Genres`, value: this._genres.join(`, `)},
    ];

    return (
      `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${this._poster}" alt="${this._title}">
      
              <p class="film-details__age">${this._ageLimit}+</p>
            </div>
      
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._title}</h3>
                  <p class="film-details__title-original">Original: ${this._titleOriginal}</p>
                </div>
      
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._rating}</p>
                  <p class="film-details__user-rating">Your rate <span class="film-details__user-rating-count">${this._score}</span></p>
                </div>
              </div>
              <table class="film-details__table">
                ${filmDetails.map((item) => `<tr class="film-details__row">
                  <td class="film-details__term">${item.title}</td>
                <td class="film-details__cell">${item.value}</td>
                </tr>`).join(``)}
              </table>
              <p class="film-details__film-description">${this._description}</p>
            </div>
          </div>
      
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isInWatchlist && `checked`}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched && `checked`}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite && `checked`}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
      
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
      
            <ul class="film-details__comments-list">
              <ul class="film-details__comments-list">
                ${FilmPopup._onAddNewComment(this._comments)}
              </ul>
            </ul>
      
            <div class="film-details__new-comment">
              <div>
                <label for="add-emoji" class="film-details__add-emoji-label">${EMOJIES[`neutral-face`]}</label>
                <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">
      
                <div class="film-details__emoji-list">
                  ${Object.keys(EMOJIES).map((item, idx) => `<input 
                    class="film-details__emoji-item visually-hidden" 
                    name="comment-emoji" 
                    type="radio" 
                    ${idx === 0 ? `checked` : ``}
                    id="emoji-${item}" 
                    value="${item}">
                    <label 
                      class="film-details__emoji-label" 
                      for="emoji-${item}">${EMOJIES[item]}</label>`).join(``)}
                </div>
              </div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
              </label>
            </div>
          </section>
      
          <section class="film-details__user-rating-wrap">
            <div class="film-details__user-rating-controls visually-hidden">
              <span class="film-details__watched-status ${this._isWatched && `film-details__watched-status--active`}">${this._isWatched ? `Already watched` : `Will watch`}</span>
              <button class="film-details__watched-reset" type="button">undo</button>
            </div>
      
            <div class="film-details__user-score">
              <div class="film-details__user-rating-poster">
                <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
              </div>
      
              <section class="film-details__user-rating-inner">
                <h3 class="film-details__user-rating-title">${this._title}</h3>
      
                <p class="film-details__user-rating-feelings">How you feel it?</p>
      
                <div class="film-details__user-rating-score">
                  ${Array.from(Array(MAX_RATE_NUMBER).keys()).map((idx) => `<input 
                    type="radio" name="score" 
                    class="film-details__user-rating-input visually-hidden" 
                    value="${idx + 1}" 
                    id="rating-${idx + 1}" 
                    ${this._score === idx + 1 && `checked`}
                  ><label class="film-details__user-rating-label" for="rating-${idx + 1}">${idx + 1}</label>`).join(``)}
                </div>
              </section>
            </div>
          </section>
        </form>
      </section>`
    );
  }

  addEventListeners() {
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseClick);
    this._element.querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._onAddNewComment);
    this._element.querySelector(`.film-details__watched-reset`)
      .addEventListener(`keydown`, this._onDeleteLastComment);
    this._element.querySelector(`form`)
      .addEventListener(`change`, this._onEmojiChange);
    this._element.querySelector(`form`)
      .addEventListener(`change`, this._onRatingChange);
    this._element.querySelector(`#watchlist`)
      .addEventListener(`change`, this._onAddToWatchListClick);
    this._element.querySelector(`#watched`)
      .addEventListener(`change`, this._onMarkAsWatchedClick);
    this._element.querySelector(`#favorite`)
      .addEventListener(`change`, this._onAddToFavoriteClick);
  }

  removeEventListeners() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);
    this._element.querySelector(`.film-details__comment-input`)
      .removeEventListener(`keydown`, this._onAddNewComment);
    this._element.querySelector(`.film-details__watched-reset`)
      .removeEventListener(`keydown`, this._onDeleteLastComment);
    this._element.querySelector(`form`)
      .removeEventListener(`change`, this._onEmojiChange);
    this._element.querySelector(`form`)
      .removeEventListener(`change`, this._onRatingChange);
    this._element.querySelector(`#watchlist`)
      .removeEventListener(`change`, this._onAddToWatchListClick);
    this._element.querySelector(`#watched`)
      .removeEventListener(`change`, this._onMarkAsWatchedClick);
    this._element.querySelector(`#favorite`)
      .removeEventListener(`change`, this._onAddToFavoriteClick);
  }
}

export default FilmPopup;
