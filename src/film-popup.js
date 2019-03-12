import Component from './component';
import {EMOJIES, MAX_RATE_NUMBER, FILM_DETAILS_CONTROLS} from './constants';

class FilmPopup extends Component {

  constructor(data) {
    super();
    this._title = data.title;
    this._titleOriginal = data.titleOriginal;
    this._description = data.description;
    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;
    this._poster = data.poster;
    this._year = data.year;
    this._country = data.country;
    this._rating = data.rating;
    this._userRate = data.userRate;
    this._runtime = data.runtime;
    this._genres = data.genres;
    this._commentsCount = data.commentsCount;
    this._ageLimit = data.ageLimit;
    this._releaseDate = data.releaseDate;
    this._releaseCountry = data.releaseCountry;
    this._comments = data.comments;

    this._onClose = null;
    this._onCloseClick = this._onCloseClick.bind(this);
  }

  _onCloseClick(event) {
    event.preventDefault();

    if (typeof this._onClose === `function`) {
      this._onClose();
    }
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  get template() {

    const filmDetails = [
      {title: `Director`, value: this._director},
      {title: `Writers`, value: this._writers},
      {title: `Actors`, value: this._actors},
      {title: `Release Date`, value: this._releaseDate},
      {title: `Release Country`, value: this._releaseCountry},
      {title: `Runtime`, value: this._runtime},
      {title: `Country`, value: this._country},
      {title: `Genres`, value: this._genres},
    ];

    return (
      `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${this._poster}" alt="incredables-2">
      
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
                  <p class="film-details__user-rating">Your rate ${this._userRate}</p>
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
            ${FILM_DETAILS_CONTROLS.map((item) => `<input 
              type="checkbox" 
              class="film-details__control-input visually-hidden" 
              id="${item.id}" 
              name="${item.id}"
              ${item.checked ? `checked` : ``}
            >
            <label 
              for="${item.id}" 
              class="film-details__control-label film-details__control-label--${item.id}"
            >${item.name}</label>`).join(``)}
          </section>
      
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._commentsCount}</span></h3>
      
            <ul class="film-details__comments-list">
              ${this._comments.map((item) => `<li class="film-details__comment">
                <span class="film-details__comment-emoji">${item.emoji}</span>
                <div>
                  <p class="film-details__comment-text">${item.comment}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${item.userName}</span>
                    <span class="film-details__comment-day">${item.date}</span>
                  </p>
                </div>
              </li>`).join(``)}
            </ul>
      
            <div class="film-details__new-comment">
              <div>
                <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
                <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">
      
                <div class="film-details__emoji-list">
                  ${EMOJIES.map((item, idx) => `<input 
                    class="film-details__emoji-item visually-hidden" 
                    name="comment-emoji" 
                    type="radio" 
                    ${idx === 0 ? `checked` : ``}
                    id="emoji-${item.name}" 
                    value="${item.name}">
                    <label 
                      class="film-details__emoji-label" 
                      for="emoji-${item.name}">${item.emoji}</label>`).join(``)}
                </div>
              </div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
              </label>
            </div>
          </section>
      
          <section class="film-details__user-rating-wrap">
            <div class="film-details__user-rating-controls">
              <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
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
                    ${this._userRate === idx + 1 ? `checked` : ``}
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
  }

  removeEventListeners() {
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);
  }
}

export default FilmPopup;
