import dayjs from "dayjs";
import AbstractView from "./abstract.js";

export default class RouteInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
    this._clickNewEvent = this._clickNewEvent.bind(this);
  }

  _generateRouteTitle() {
    const cities = [];
    cities.push(this._points[0].destination.title);
    if (this._points.length > 1) {
      for (let i = 1; i < this._points.length; i++) {
        if (this._points[i].destination.title !== this._points[i - 1].destination.title) {
          cities.push(this._points[i].destination.title);
        }
      }
    }
    return cities.join(` — `);
  }

  _getTotalPrice() {
    return this._points.reduce((total, point) => {
      return total + point.price
        + point.offers.reduce((totalOffers, offer) => {
          return offer.isChecked
            ? totalOffers + offer.price
            : totalOffers;
        }, 0);
    }, 0);
  }

  showNoResults(selectedFilter) {
    this.getElement().querySelector(`.trip-info__title`).textContent = `No results for «${selectedFilter}» filter`.toUpperCase();
    this.getElement().querySelector(`.trip-info__dates`).textContent = `No dates to display`;
    this.getElement().querySelector(`.trip-info__cost-value`).textContent = `0`;
  }

  getTemplate() {
    return `<div class="page-body__container  page-header__container">
              <img class="page-header__logo" src="img/logo.png" width="42" height="42" alt="Trip logo">

              <div class="trip-main">
                <section class="trip-main__trip-info  trip-info">
                  <div class="trip-info__main">
                    <h1 class="trip-info__title">${this._generateRouteTitle()}</h1>

                    <p class="trip-info__dates">${dayjs(this._points[0].time.start).format(`MMM
                      DD`)}&nbsp;—&nbsp;${dayjs(this._points[0].time.end).format(`DD`)}</p>
                  </div>

                  <p class="trip-info__cost">
                    Total: €&nbsp;<span class="trip-info__cost-value">${this._getTotalPrice()}</span>
                  </p>
                </section>

                <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${this._points.some((point) => !point.id) ? `disabled` : ``}>New event</button>
              </div>
            </div>`;
  }

  removeElement() {
    this._element = null;
    this._points = null;
  }

  _clickNewEvent(evt) {
    evt.preventDefault();
    this._callback.newEvent();
  }

  setNewEventHandler(callback) {
    this._callback.newEvent = callback;
    this.getElement().querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, this._clickNewEvent);
  }

}
