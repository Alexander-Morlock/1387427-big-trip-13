import dayjs from "dayjs";
import SortFormView from '../view/sort-form.js';
import EmptyListTemplate from '../view/empty-list-template.js';
import TripPointPresenter from './trip-point.js';
import PickrsModel from '../model/pickrs.js';
import {render, RenderPosition} from '../utils/render.js';
import {SortType, Controls, UserAction} from '../const.js';

export default class Trip {
  constructor(mainContainer, updateRouteInfo, pointsModel, controlsModel, offersModel, destinationsModel) {
    this._pointsModel = pointsModel;
    this._controlsModel = controlsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._mainContainer = mainContainer;
    this._tripEventsList = new EmptyListTemplate();
    this._sortComponent = new SortFormView();
    this._updateRouteInfo = updateRouteInfo;
    this._tripPresenters = {};
    this._currentSortType = SortType.DAY;
    this._pickrsModel = new PickrsModel();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleChangeSortMode = this._handleChangeSortMode.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._reRenderPointList = this._reRenderPointList.bind(this);
    this._handleFiltersChange = this._handleFiltersChange.bind(this);

    this._pointsModel.addObserver(this._reRenderPointList);
    this._controlsModel.addObserver(this._handleFiltersChange);
  }

  init() {
    if (this._getPoints().length) {
      this._renderSort();
    }
    render(this._mainContainer, this._tripEventsList.getElement(), RenderPosition.BEFOREEND);
  }

  _handleFiltersChange(userAction) {
    this._pointsModel.restorePoint();
    this._resetSort();
    if (userAction !== UserAction.TOGGLE) {
      this._reRenderPointList();
    }
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
    this._pointsModel.restorePoint();
  }

  _handleModeChange() {
    Object
      .values(this._tripPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleModelUpdate(userAction, pointId, update) {
    switch (userAction) {
      case UserAction.DELETE_POINT: {
        this._pointsModel.deletePoint(userAction, pointId);
        break;
      }
      case UserAction.RESTORE_POINT: {
        this._pointsModel.restorePoint();
        break;
      }
      default: {
        this._pointsModel.updatePoint(userAction, pointId, update);
      }
    }
  }

  _getDurationOfTrip(point) {
    return dayjs(point.time.end) - dayjs(point.time.start);
  }

  _reRenderPointList(userAction, newPoint) {
    this._pickrsModel.clear();
    Object
      .values(this._tripPresenters)
      .forEach((presenter) => presenter.destroy());

    this._tripPresenters = {};
    this._points = this._getPoints();

    if (this._points.length) {
      this._renderPoints();
    }

    switch (userAction) {
      case UserAction.UPDATE_EDIT_POINT: {
        this._tripPresenters[newPoint.id]._replacePointToEdit();
        break;
      }
      case UserAction.ADD_POINT: {
        this._resetSort();
        this._controlsModel.setFilter(Controls.EVERYTHING);
        this._tripPresenters[newPoint.id]._replacePointToEdit();
        break;
      }
    }
    this._updateRouteInfo(this._getPoints());
  }

  _renderSort() {
    render(this._mainContainer, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    this._sortComponent.setChangeSortModeHandler(this._handleChangeSortMode);
  }

  _resetSort() {
    this._currentSortType = SortType.DAY;
    this._sortComponent.getElement()
      .querySelectorAll(`input`)
      .forEach((input, index) => {
        input.checked = index === 0;
      });
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderPoint(point) {
    const pointPresenter = new TripPointPresenter(
        this._tripEventsList,
        this._handleModeChange,
        this._handleModelUpdate,
        this._offersModel.getOffers(),
        this._destinationsModel.getDestinations(),
        this._pickrsModel
    );
    pointPresenter.init(point);
    this._tripPresenters[point.id] = pointPresenter;
  }
}

