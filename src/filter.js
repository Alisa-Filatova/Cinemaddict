import Component from './component';

class Filter extends Component {
  constructor(title, count = 0) {
    super();
    this._title = title;
    this._count = count;

    this._state = {
      active: false,
    };

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  _onFilterClick(event) {
    event.preventDefault();

    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  set onFilter(fn) {
    this._onFilterClick = fn;
  }

  get template() {
    return `<a href="" class="main-navigation__item ${this._state.active ? `main-navigation__item--active` : ``}">
      ${this._title} ${this._count === null ? `` : `<span class="main-navigation__item-count"> ${this._count}</span>`}</a>`;
  }

  // addEventListeners() {
  //   this._element.querySelector(`.main-navigation__item`)
  //     .addEventListener(`click`, this._onFilterClick);
  // }
	//
  // removeEventListeners() {
  //   this._element.querySelector(`.main-navigation__item`)
  //     .removeEventListener(`click`, this._onFilterClick);
  // }
}

export default Filter;

