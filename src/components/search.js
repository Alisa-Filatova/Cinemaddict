import Component from './component';

class Search extends Component {
  constructor() {
    super();
    this._onSearch = null;
    this._onChange = this._onChange.bind(this);
  }

  _onChange(event) {
    event.preventDefault();

    if (typeof this._onSearch === `function`) {
      this._onSearch();
    }
  }

  set onSearch(fn) {
    this._onSearch = fn;
  }

  get template() {
    return (
      `<form class="header__search search">
        <input type="text" name="search" class="search__field" placeholder="Search">
        <button type="submit" class="visually-hidden">Search</button>
      </form>`
    );
  }

  addEventListeners() {
    this._element.addEventListener(`change`, this._onChange);
  }

  removeEventListeners() {
    this._element.removeEventListener(`change`, this._onChange);
  }
}

export default Search;
