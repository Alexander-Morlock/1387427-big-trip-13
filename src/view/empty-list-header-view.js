import AbstractView from "./abstract-view.js";
import {UserAction} from '../const.js';

export default class EmptyListHeaderView extends AbstractView {
  constructor(controlsModel) {
    super();
    this._controlsModel = controlsModel;
    this._clickNewEvent = this._clickNewEvent.bind(this);
  }

  getTemplate() {
    return `<div class="page-body__container  page-header__container">
    <img class="page-header__logo" src="img/logo.png" width="42" height="42" alt="Trip logo">

    <div class="trip-main">
      <div class="trip-main__trip-controls  trip-controls">
        <h2 class="visually-hidden">Switch trip view</h2>
        <nav class="trip-controls__trip-tabs  trip-tabs">
          <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
          <a class="trip-tabs__btn" href="#">Stats</a>
        </nav>

        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
          <div class="trip-filters__filter">
            <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
            <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" disabled>
            <label class="trip-filters__filter-label" for="filter-future">Future</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" disabled>
            <label class="trip-filters__filter-label" for="filter-past">Past</label>
          </div>

          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </div>

      <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
    </div>
    </div>`;
  }

  setNewEventHandler(callback) {
    this._callback.newEvent = callback;
    this.getElement().querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, this._clickNewEvent);
    this._handleControlsNotify = this._handleControlsNotify.bind(this);
    this._controlsModel.addObserver(this._handleControlsNotify);
  }

  _handleControlsNotify(userAction) {
    if (userAction === UserAction.ONLINE) {
      this._switchToOnline();
    } else if (userAction === UserAction.OFFLINE) {
      this._switchToOffline();
    }
  }

  _clickNewEvent(evt) {
    evt.preventDefault();
    document.querySelector(`.trip-events__msg`).remove();
    this._callback.newEvent(UserAction.ADD_FIRST_POINT);
  }

  _switchToOffline() {
    const addNewEventButton = this.getElement().querySelector(`.trip-main__event-add-btn`);
    addNewEventButton.textContent = `OFFLINE`;
    addNewEventButton.classList.add(`btn--red`);
    addNewEventButton.disabled = true;
  }

  _switchToOnline() {
    const addNewEventButton = this.getElement().querySelector(`.trip-main__event-add-btn`);
    addNewEventButton.textContent = `New event`;
    addNewEventButton.classList.remove(`btn--red`);
    addNewEventButton.disabled = false;
  }
}
