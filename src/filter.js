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
    this._onChangeActive = this._onChangeActive.bind(this);
  }

  _onFilterClick(event) {
    event.preventDefault();

    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  _onChangeActive() {
    this._isActive = !this._isActive;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  update(data) {
    this._isActive = data.isActive;
    this._count = data.count;
    // this._element.querySelector(`.main-navigation__item-count`).textContent = `${this._count}`;
  }

  get template() {
    return `<a href="" class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``}">
      ${this._title} ${this._count === null ? `` : `<span class="main-navigation__item-count">${this._count}</span>`}
    </a>`;
  }

  addEventListeners() {
    this._element.addEventListener(`click`, this._onFilterClick);
    this._element.addEventListener(`click`, this._onChangeActive);
  }

  removeEventListeners() {
    this._element.removeEventListener(`click`, this._onFilterClick);
    this._element.removeEventListener(`click`, this._onChangeActive);
  }
}

export default Filter;

