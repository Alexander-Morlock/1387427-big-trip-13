import dayjs from "dayjs";
import {createElement} from '../utils.js';

const getDuration = (timeStart, timeEnd) => {
  const start = new Date(timeStart).getTime();
  const end = new Date(timeEnd).getTime();
  const durationMinutes = Math.floor(Math.abs(end - start) / 60000); // in minutes
  const days = Math.floor(durationMinutes / 60 / 24);
  const hours = Math.floor((durationMinutes - days * 24 * 60) / 60);
  const minutes = durationMinutes - days * 24 * 60 - hours * 60;
  let duration = ``;

  if (days) {
    if (days < 10) {
      duration += `0`;
    }
    duration += days + `D `;
  }

  if (days || hours) {
    if (hours < 10) {
      duration += `0`;
    }
    duration += hours + `H `;
  }

  if (minutes < 10) {
    duration += `0`;
  }
  duration += minutes + `M`;

  return duration;
};

const createTripEventsListItemTemplate = ({
  destination,
  tripType,
  time,
  offers,
  isFavorite,
  price
}) => {

  const generateOfferList = () => {
    let markup = ``;
    if (!offers) {
      markup += `<li class="event__offer"></li>`;
    } else {
      for (let i = 0; i < offers.length; i++) {
        markup += `<li class="event__offer">
        <span class="event__offer-title">` + offers[i].title + `</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">` + offers[i].price + `</span>
        </li>`;
      }
    }

    return markup;
  };

  const addCssClassIsFavorite = () => {
    return isFavorite
      ? ` event__favorite-btn--active`
      : ``;
  };

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dayjs(time.start).format(`YYYY-MM-DD`)}">${dayjs(time.start).format(`MMM DD`)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${tripType}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${tripType} ${destination.title}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${time.start}">${dayjs(time.start).format(`hh:mm`)}</time>
        &mdash;
        <time class="event__end-time" datetime="${time.end}">${dayjs(time.end).format(`hh:mm`)}</time>
      </p>
      <p class="event__durationMinutes">${getDuration(time.start, time.end)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${generateOfferList()}
    </ul>
    <button class="event__favorite-btn${addCssClassIsFavorite()}" type="button">
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
};

export default class RoutePoint {
  constructor(point) {
    this._element = null;
    this._point = point;
  }

  getTemplate() {
    return createTripEventsListItemTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getListTemplate() {
    return createElement(`<ul class="trip-events__list"></ul>`);
  }

  removeElement() {
    this._element = null;
    this._point = null;
  }
}
