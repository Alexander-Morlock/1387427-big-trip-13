import ControlsView from '../view/controls-view.js';
import {render, RenderPosition} from '../utils/render.js';
import {Controls, UserAction} from '../const.js';
import {showStatistics} from '../stats.js';

export default class ControlsClass {
  constructor(controlsModel, pointModel) {
    this._points = pointModel.getPoints();
    this._controlsModel = controlsModel;
    this._addNewPointCallback = pointModel.addPoint;
    this._controlsComponent = new ControlsView(this._controlsModel.getFilter(), this._points);
    this._renderAfterElement = document.querySelector(`.trip-main__trip-info`);
    this._filtersChangeAction = this._filtersChangeAction.bind(this);
    this.resetControls = this.resetControls.bind(this);
    this._clickNewEvent = this._clickNewEvent.bind(this);
    this._handleControlsNotify = this._handleControlsNotify.bind(this);
    this._controlsModel.addObserver(this._handleControlsNotify);

    this._addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);
    this._addNewEventButton.addEventListener(`click`, this._clickNewEvent);
    if (!window.navigator.onLine) {
      this._switchToOffline();
    }
  }

  init() {
    render(this._renderAfterElement, this._controlsComponent.getElement(), RenderPosition.AFTER);
    this._controlsComponent.setChangeHandler(this._filtersChangeAction);
    this.setPageToggle();
  }

  resetControls() {
    this._controlsModel.setFilter(Controls.EVERYTHING, UserAction.TOGGLE);
  }

  setPageToggle() {
    this._pointsContainer = document.querySelector(`.trip-events`);
    this._statsContainer = document.querySelector(`.statistics`);
    const tableViewLink = this._controlsComponent.getElement().querySelectorAll(`.trip-tabs__btn`)[0];
    const statsViewLink = this._controlsComponent.getElement().querySelectorAll(`.trip-tabs__btn`)[1];
    const controls = this._controlsComponent.getElement().querySelectorAll(`.trip-filters__filter-input`);

    const onDocumentKeydown = (evt) => {
      if (evt.key === `Escape`) {
        document.removeEventListener(`keydown`, onDocumentKeydown);
        toggleToTable(evt);
      }
    };

    const toggleToStatistics = (evt) => {
      evt.preventDefault();
      this.resetControls();
      controls.forEach((input) => {
        input.disabled = true;
      });

      statsViewLink.removeEventListener(`click`, toggleToStatistics);
      tableViewLink.addEventListener(`click`, toggleToTable);
      statsViewLink.classList.add(`trip-tabs__btn--active`);
      tableViewLink.classList.remove(`trip-tabs__btn--active`);
      this._statsContainer.classList.remove(`visually-hidden`);
      this._pointsContainer.classList.add(`visually-hidden`);

      document.addEventListener(`keydown`, onDocumentKeydown);

      showStatistics(this._points);
    };

    const toggleToTable = (evt) => {
      evt.preventDefault();
      controls.forEach((input) => {
        input.disabled = false;
      });

      tableViewLink.removeEventListener(`click`, toggleToTable);
      statsViewLink.addEventListener(`click`, toggleToStatistics);
      tableViewLink.classList.add(`trip-tabs__btn--active`);
      statsViewLink.classList.remove(`trip-tabs__btn--active`);
      this._statsContainer.classList.add(`visually-hidden`);
      this._pointsContainer.classList.remove(`visually-hidden`);
    };

    statsViewLink.addEventListener(`click`, toggleToStatistics);
  }

  _handleControlsNotify(userAction) {
    if (userAction === UserAction.ONLINE) {
      this._switchToOnline();
    } else if (userAction === UserAction.OFFLINE) {
      this._switchToOffline();
    }
  }

  _switchToOffline() {
    this._addNewEventButton.textContent = `OFFLINE`;
    this._addNewEventButton.classList.add(`btn--red`);
    this._addNewEventButton.disabled = true;

    document.querySelectorAll(`.event__rollup-btn`)
      .forEach((e, i) => {
        e.disabled = i > 0 ? true : !document.querySelector(`.event__save-btn`);
      });

    const formEdit = document.querySelector(`.event--edit`);
    if (formEdit) {
      formEdit.classList.add(`form-error`);
      window.setTimeout(() => {
        formEdit.classList.remove(`form-error`);
      }, 500);
    }
  }

  _switchToOnline() {
    this._addNewEventButton.textContent = `New event`;
    this._addNewEventButton.classList.remove(`btn--red`);
    this._addNewEventButton.disabled = false;
    document.querySelectorAll(`.event__rollup-btn`)
      .forEach((e) => {
        e.disabled = false;
      });
  }

  _filtersChangeAction(evt) {
    this._controlsModel.setFilter(evt.target.value, UserAction.FILTER_CHANGE);
  }

  _clickNewEvent(evt) {
    evt.preventDefault();
    this._statsContainer.classList.add(`visually-hidden`);
    this._pointsContainer.classList.remove(`visually-hidden`);
    const sortForm = document.querySelector(`.trip-events__trip-sort`);
    if (sortForm) {
      sortForm.style = `display: flex`;
    }
    this._addNewPointCallback();
  }
}
