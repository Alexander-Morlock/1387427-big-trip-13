import AbstractView from "./abstract-view.js";

export default class EmptyListTemplate extends AbstractView {

  getTemplate() {
    return `<ul class="trip-events__list"></ul>`;
  }
}

