import Component from './component';

class Search extends Component {
  constructor() {
    super();
    this._onChange = null;
    this._onChangeValue = this._onChangeValue.bind(this);
  }

  set onChange(fn) {
    this._onChange = fn;
  }

  _onChangeValue(event) {
    if (typeof this._onChange === `function`) {
      this._onChange(event.target.value);
    }
  }

  get template() {
    return `<form class="header__search search">
      <input type="text" name="search" class="search__field" placeholder="Search">
      <button type="submit" class="visually-hidden">Search</button>
    </form>`;
  }

  addEventListeners() {
    this._element.querySelector(`.search__field`)
      .addEventListener(`keyup`, this._onChangeValue);
  }

  removeEventListeners() {
    this._element.querySelector(`.search__field`)
      .removeEventListener(`keydown`, this._onChangeValue);
  }
}

export default Search;
