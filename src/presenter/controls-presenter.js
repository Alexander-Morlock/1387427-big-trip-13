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

    document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, this._clickNewEvent);
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

  _filtersChangeAction(evt) {
    this._controlsModel.setFilter(evt.target.value, UserAction.FILTER_CHANGE);
  }

  _clickNewEvent(evt) {
    evt.preventDefault();
    this._statsContainer.classList.add(`visually-hidden`);
    this._pointsContainer.classList.remove(`visually-hidden`);
    this._addNewPointCallback();
  }
}
