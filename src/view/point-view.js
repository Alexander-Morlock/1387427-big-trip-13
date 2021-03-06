import dayjs from "dayjs";
import {getDuration} from '../utils/render.js';
import AbstractView from "./abstract-view.js";

export default class RoutePoint extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._destination = point.destination;
    this._tripType = point.tripType;
    this._time = point.time;
    this._isFavorite = point.isFavorite;
    this._price = point.price;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this.getElement().querySelector(`.event__rollup-btn`).disabled = !window.navigator.onLine;
  }

  getTemplate() {
    return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dayjs(this._time.start).format(`YYYY-MM-DD`)}">${dayjs(this._time.start).format(`MMM DD`)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${this._tripType}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${this._tripType} ${this._destination.title}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${this._time.start}">${dayjs(this._time.start).format(`hh:mm`)}</time>
        &mdash;
        <time class="event__end-time" datetime="${this._time.end}">${dayjs(this._time.end).format(`hh:mm`)}</time>
      </p>
      <p class="event__durationMinutes">${getDuration(this._time.start, this._time.end)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${this._price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${this._generateOfferList()}
    </ul>
    <button class="event__favorite-btn${this._addCssClassIsFavorite()}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.clickFavorite = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._clickFavoriteHandler);
  }

  removeElement() {
    this._element = null;
    this._point = null;
  }

  _generateOfferList() {
    let markup = ``;
    const offersToDisplay = this._point.offers.filter((offer) => offer.isChecked);
    if (!offersToDisplay) {
      markup += `<li class="event__offer"></li>`;
    } else {
      for (const offer of offersToDisplay) {
        markup += `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
        </li>`;
      }
    }

    return markup;
  }

  _addCssClassIsFavorite() {
    return this._isFavorite
      ? ` event__favorite-btn--active`
      : ``;
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _clickFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.clickFavorite();
  }
}
