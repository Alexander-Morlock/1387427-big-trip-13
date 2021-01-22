import dayjs from "dayjs";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

export default class FormEdit extends SmartView {
  constructor(point, offers, destinations) {
    super();
    this._data = this.parsePointToData(point, offers, destinations);
    this._datePeakerStart = null;
    this._datePeakerEnd = null;
    this._clickSubmitHandler = this._clickSubmitHandler.bind(this);
    this._clickMinimizeHandler = this._clickMinimizeHandler.bind(this);
    this._clickDeleteHandler = this._clickDeleteHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._setInnerHandlers();
    this._setDatepickers();
  }

  _setDatepickers() {
    if (this._datePeakerStart) {
      this._datePeakerStart.destroy();
      this._datePeakerStart = null;
      this._datePeakerEnd.destroy();
      this._datePeakerEnd = null;
    }

    this._datePeakerStart = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          defaultDate: dayjs(this._data.time.start).format(`DD/MM/YY hh:mm`),
          onChange: this._startDateChangeHandler
        }
    );
    this._datePeakerEnd = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          defaultDate: dayjs(this._data.time.end).format(`DD/MM/YY hh:mm`),
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler() {
    const newStartDate = dayjs(
        this.getElement().querySelector(`#event-start-time-1`).value
    ).format(`YYYY-MM-DDThh:mm`);
    const endDate = this._data.time.end;
    this.updateData(
        {
          time: {
            start: newStartDate,
            end: endDate
          }
        });
  }

  _endDateChangeHandler() {
    const newEndDate = dayjs(
        this.getElement().querySelector(`#event-end-time-1`).value
    ).format(`YYYY-MM-DDThh:mm`);
    const startDate = this._data.time.start;
    this.updateData(
        {
          time: {
            start: startDate,
            end: newEndDate
          }
        });
  }

  _generateOfferList() {
    if (!this._data.offers) {
      return ``;
    } else {
      return `<div class="event__available-offers">`
      + this._data.offers.map((offer, index) => {
        return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-${index + 1}" type="checkbox" name="event-offer-${offer.type}">
      <label class="event__offer-label" for="event-offer-${offer.type}-${index + 1}">
        <span class="event__offer-title">${offer.title} </span>&plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
      }).join(``);
    }
  }

  _generatePhotos() {
    return this._data.destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join(``);
  }

  _generateDataList() {
    return `<datalist id="destination-list-1">
    ${this._data.destinations.reduce((acc, destination) => {
    return acc + `<option value="` + destination.title + `"></option>`;
  }, ``)}
    </datalist>`;
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._data.tripType}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${this._data.tripType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._data.destination.title}" list="destination-list-1">
          ${this._generateDataList()}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(this._data.time.start).format(`DD/MM/YY hh:mm`)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(this._data.time.end).format(`DD/MM/YY hh:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${this._data.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            ${this._generateOfferList()}
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._data.destination.description}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${this._generatePhotos()}
            </div>
        </section>
      </section>
    </form>
  </li>`;
  }

  _clickSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, this._clickSubmitHandler);
  }

  _clickMinimizeHandler(evt) {
    evt.preventDefault();
    this._callback.minimize();
  }

  setMinimizeClickHandler(callback) {
    this._callback.minimize = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickMinimizeHandler);
  }

  _clickDeleteHandler(evt) {
    evt.preventDefault();
    this._callback.delete();
  }

  setDeleteClickHandler(callback) {
    this._callback.delete = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._clickDeleteHandler);
  }

  setDestinationInputHandler() {
    const inputDestination = this.getElement().querySelector(`.event__input--destination`);
    const valueBeforeChange = inputDestination.value;
    inputDestination.addEventListener(`change`, () => {
      if (this._data.destinations.some((destination) => destination.title === inputDestination.value)) {
        const newDestination = this._data.destinations.find((destination) => destination.title === inputDestination.value);
        this.updateData(
            {
              destination: newDestination
            }
        );
      } else {
        inputDestination.value = valueBeforeChange;
      }
    });
  }

  parsePointToData(point, offers, destinations) {
    return Object.assign(
        {},
        point,
        {
          destinations,
          offers,
          destination: {
            description: destinations.find((destination) => destination.name === point.destination.title),
            title: point.destination.title,
            pictures: point.destination.pictures
          }
        }
    );
  }

  _setInnerHandlers() {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setMinimizeClickHandler(this._callback.minimize);
    this.setDestinationInputHandler();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
  }

  removeElement() {
    this._element = null;
  }

}
