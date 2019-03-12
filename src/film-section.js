import Component from './component';

class FilmSection extends Component {
  constructor(title, isExtra = false) {
    super();
    this._title = title;
    this._isExtra = isExtra;
  }

  get template() {
    return (
      `<section class="films-list${this._isExtra ? `--extra` : ``}">
        <h2 class="films-list__title ${this._isExtra ? `` : `visually-hidden`}">${this._title}</h2>
        <div class="films-list__container"></div>
        ${this._isExtra ? `` : `<button class="films-list__show-more">Show more</button>`}
      </section>`
    );
  }
}

export default FilmSection;
