import {createElement} from '../utils.js';

export default class EmptyTripEvents {
  constructor() {
    this._template = `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }

  getTemplate() {
    return createElement(this._template);
  }
}
