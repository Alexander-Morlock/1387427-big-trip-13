import dayjs from "dayjs";
import SortFormView from '../view/sort-form.js';
import EmptyListTemplate from '../view/empty-list-template.js';
import TripPointPresenter from './trip-point.js';
import {render, RenderPosition} from '../utils/render.js';
import {updateItem} from "../utils/common.js";

export default class Trip {
  constructor(mainContainer, updateRouteInfo) {
    this._mainContainer = mainContainer;
    this._tripEventsList = new EmptyListTemplate();
    this._sortComponent = new SortFormView();
    this._updateRouteInfo = updateRouteInfo;
    this._tripPresenter = {};
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleChangeSortMode = this._handleChangeSortMode.bind(this);
    this._sortPointList = this._sortPointList.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._pointsBeforeSort = points.slice();
    this._renderSort();
    render(this._mainContainer, this._tripEventsList.getElement(), RenderPosition.BEFOREEND);
    this._renderPoints();
    this._updateRouteInfo(this._points);
  }

  _handleChangeSortMode(evt) {
    this._sortPointList(evt.target.value);
  }

  _reRenderPointList() {
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPresenter = {};
    this._renderPoints();
    this._updateRouteInfo(this._points);
  }

  _getDurationOfTrip(point) {
    return dayjs(point.time.end) - dayjs(point.time.start);
  }

  _sortPointList(sortType) {
    switch (sortType) {
      case `sort-time`: {
        // sort by time
        this._points.sort((a, b) => this._getDurationOfTrip(a) - this._getDurationOfTrip(b));
        this._reRenderPointList();
        break;
      }
      case `sort-price`: {
        // sort by price
        this._points.sort((a, b) => a.price - b.price);
        this._reRenderPointList();
        break;
      }
      default: {
        // sort by days is default
        this._points = this._pointsBeforeSort.slice();
        this._reRenderPointList();
      }
    }
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    this._sortComponent.setChangeSortModeHandler(this._handleChangeSortMode);
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
