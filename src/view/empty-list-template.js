import {createElement} from '../utils.js';

export default class EmptyListTemplate {

  getTemplate() {
    return createElement(`<ul class="trip-events__list"></ul>`);
  }
}
