import SortFormView from '../view/sort-form.js';
import EmptyListTemplate from '../view/empty-list-template.js';
import TripPointPresenter from './trip-point.js';
import {render, RenderPosition} from '../utils/render.js';
import {updateItem} from "../utils/common.js";

export default class Trip {
  constructor(mainContainer, updateRouteInfo) {
    this._mainContainer = mainContainer;
    this._tripEventsList = new EmptyListTemplate().getElement();
    this._sortFormComponent = new SortFormView().getElement();
    this._updateRouteInfo = updateRouteInfo;
    this._tripPresenter = {};
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    // this._pointsSorted = points.slice();
    render(this._mainContainer, this._sortFormComponent, RenderPosition.BEFOREEND);
    render(this._mainContainer, this._tripEventsList, RenderPosition.BEFOREEND);
    this._updateRouteInfo();
    this._renderPoints();
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const pointPresenter = new TripPointPresenter(this._tripEventsList, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._tripPresenter[point.id] = pointPresenter;
  }

  _handleModeChange() {
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._tripPresenter[updatedPoint.id].init(updatedPoint);
  }
}
