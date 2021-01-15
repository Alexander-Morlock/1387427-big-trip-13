import dayjs from "dayjs";
import SortFormView from '../view/sort-form.js';
import EmptyListTemplate from '../view/empty-list-template.js';
import TripPointPresenter from './trip-point.js';
import {render, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {SortType, Controls} from '../const.js';

export default class Trip {
  constructor(mainContainer, updateRouteInfo, pointsModel, controlsModel) {
    this._pointsModel = pointsModel;
    this._controlsModel = controlsModel;
    this._mainContainer = mainContainer;
    this._tripEventsList = new EmptyListTemplate();
    this._sortComponent = new SortFormView();
    this._updateRouteInfo = updateRouteInfo;
    this._tripPresenters = {};
    this._currentSortType = SortType.DAY;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleChangeSortMode = this._handleChangeSortMode.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._handleFiltersChange = this._handleFiltersChange.bind(this);

    this._pointsModel.addObserver(this._handleModelUpdate);
    this._controlsModel.addObserver(this._handleFiltersChange);
  }

  init() {
    this._points = this._getPoints();
    this._renderSort();
    render(this._mainContainer, this._tripEventsList.getElement(), RenderPosition.BEFOREEND);
    this._renderPoints();
    this._updateRouteInfo(this._points);
  }

  _handleModelUpdate() {
    //
  }

  _handleFiltersChange() {
    this._currentSortType = SortType.DAY;
    this._reRenderPointList();
    this._resetSort();
  }

  _getPoints() {
    const filterHandle = (point) => {
      switch (this._controlsModel.getFilter()) {
        case Controls.FUTURE: {
          return dayjs(point.time.start) - dayjs() > 0;
        }
        case Controls.PAST: {
          return dayjs(point.time.end) - dayjs() < 0;
        }
        default: return true;
      }
    };

    const filteredPoints = this._pointsModel.getPoints().filter(filterHandle);

    switch (this._currentSortType) {
      case SortType.TIME: {
        return filteredPoints.sort((a, b) => this._getDurationOfTrip(b) - this._getDurationOfTrip(a));
      }
      case SortType.PRICE: {
        return filteredPoints.sort((a, b) => b.price - a.price);
      }
      default: {
        return filteredPoints;
      }
    }
  }

  _handleChangeSortMode(evt) {
    this._currentSortType = evt.target.value;
    this._reRenderPointList();
  }

  _handleModeChange() {
    Object
      .values(this._tripPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._tripPresenters[updatedPoint.id].init(updatedPoint);
  }

  _getDurationOfTrip(point) {
    return dayjs(point.time.end) - dayjs(point.time.start);
  }

  _reRenderPointList() {
    Object
      .values(this._tripPresenters)
      .forEach((presenter) => presenter.destroy());
    this._tripPresenters = {};
    this._points = this._getPoints();
    if (this._points.length) {
      this._renderPoints();
      this._updateRouteInfo(this._points);
    }
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    this._sortComponent.setChangeSortModeHandler(this._handleChangeSortMode);
  }

  _resetSort() {
    this._sortComponent.getElement()
      .querySelectorAll(`input`)
      .forEach((input, index) => {
        input.checked = index === 0 ? true : false;
      });
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const pointPresenter = new TripPointPresenter(this._tripEventsList, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._tripPresenters[point.id] = pointPresenter;
  }
}

