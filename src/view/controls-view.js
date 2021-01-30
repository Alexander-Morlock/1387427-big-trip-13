import dayjs from "dayjs";
import AbstractView from "./abstract-view.js";
import {Controls} from '../const.js';

export default class ControlsView extends AbstractView {

  constructor(selectedFilter, points) {
    super();
    this._points = points;
    this._changeHandler = this._changeHandler.bind(this);
    this._selectedFilter = selectedFilter;
  }

  getTemplate() {
    const isFuturePoints = this._points.some((point) => dayjs(point.time.start) - dayjs() > 0);
    const isPastPoints = this._points.some((point) => dayjs(point.time.end) - dayjs() < 0);

    return `<div class="trip-main__trip-controls  trip-controls">
              <h2 class="visually-hidden">Switch trip view</h2>
              <nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
                <a class="trip-tabs__btn" href="#">Stats</a>
              </nav>

              <h2 class="visually-hidden">Filter events</h2>
              <form class="trip-filters" action="#" method="get">
                <div class="trip-filters__filter">
                  <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${this._selectedFilter === Controls.EVERYTHING ? `checked` : ``}>
                  <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
                </div>

                <div class="trip-filters__filter">
                  <input ${isFuturePoints ? `` : `disabled`} id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${this._selectedFilter === Controls.FUTURE ? `checked` : ``}>
                  <label class="trip-filters__filter-label" for="filter-future">Future</label>
                </div>

                <div class="trip-filters__filter">
                  <input ${isPastPoints ? `` : `disabled`} id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${this._selectedFilter === Controls.PAST ? `checked` : ``}>
                  <label class="trip-filters__filter-label" for="filter-past">Past</label>
                </div>

                <button class="visually-hidden" type="submit">totaleppriceter</button>
              </form>
            </div>`;
  }

  setChangeHandler(callback) {
    this._callback.change = callback;
    this.getElement().querySelector(`form`).addEventListener(`change`, this._changeHandler);
  }

  setToggleHandler(callback) {
    this._callback.toggle = callback;
  }

  _changeHandler(evt) {
    evt.preventDefault();
    this._callback.change(evt);
  }
}
