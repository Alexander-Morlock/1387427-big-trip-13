import {createElement} from '../utils.js';

export default class EmptyTripEvents {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyTripEventsTemplate();
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

const createEmptyTripEventsTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};
