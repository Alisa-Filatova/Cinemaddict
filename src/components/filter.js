import Component from './component';

class Filter extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._count = data.count;
    this._isActive = data.isActive;
    this._type = data.type;

    this._onClick = null;
    this._onClickEvent = this._onClickEvent.bind(this);
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  _onClickEvent(event) {
    event.preventDefault();

    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  update(data) {
    this._isActive = data.isActive;
    this._count = data.count;
    if (this._count !== null) {
      this._element.querySelector(`.main-navigation__item-count`).textContent = this._count;
    }
  }

  get template() {
    return `<a id="${this._type}" href="" class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``}">
        ${this._title} ${this._count === null ? `` : `<span class="main-navigation__item-count">${this._count}</span>`}
      </a>`;
  }

  addEventListeners() {
    this._element.addEventListener(`click`, this._onClickEvent);
  }

  removeEventListeners() {
    this._element.removeEventListener(`click`, this._onClickEvent);
  }
}

export default Filter;
