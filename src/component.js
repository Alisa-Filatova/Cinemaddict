import {createElement} from './utils';

class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
    this._state = {};
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = createElement(this.template);
    this.addEventListeners();
    return this._element;
  }

  addEventListeners() {}

  removeEventListeners() {}

  destroy() {
    this.removeEventListeners();
    this._element.remove();
    this._element = null;
  }
}

export default Component;
