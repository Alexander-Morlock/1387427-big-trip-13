import {createElement} from '../utils.js';

export default class EmptyListTemplate {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

const createEmptyListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};
