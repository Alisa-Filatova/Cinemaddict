import Component from './component';

class Search extends Component {
  constructor(data) {
    super(data);
    this._onSearch = null;
    this._onChange = this._onChange.bind(this);
  }

  _onChange(event) {
    event.preventDefault();

    if (typeof this._onSearch === `function`) {
      this._onSearch(event.target.value);
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
    if (this._element) {
      this._element.querySelector(`input`).addEventListener(`input`, this._onChange);
    }
  }

  removeEventListeners() {
    if (this._element) {
      this._element.querySelector(`input`).removeEventListener(`input`, this._onChange);
    }
  }
}

export default Search;
