import {createElement} from './utils/create-element';

class FilmSection {
  constructor(title, isExtra = false) {
    this._title = title;
    this._isExtra = isExtra;

    this._element = null;
  }

  get template() {
    return (
      ` <section class="films-list${this._isExtra ? `--extra` : ``}">
          <h2 class="films-list__title ${this._isExtra ? `` : `visually-hidden`}">${this._title}</h2>
          <div class="films-list__container"></div>
          ${this._isExtra ? `` : `<button class="films-list__show-more">Show more</button>`}
        </section>`.trim()
    );
  }

  render(container) {
    if (this._element) {
      container.removeChild(this._element);
      this._element = null;
    }

    this._element = createElement(this.template);
    container.appendChild(this._element);
  }
}

export default FilmSection;
