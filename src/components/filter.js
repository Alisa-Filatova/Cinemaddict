import Component from './component';

class Filter extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._count = data.count;
    this._isActive = data.isActive;
    this._type = data.type;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onFilterClick(event) {
    event.preventDefault();

    if (typeof this._onFilter === `function`) {
      this._onFilter();
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
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  removeEventListeners() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}

export default Filter;
