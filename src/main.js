import RouteInfoView from './view/route-info-view.js';
import EmptyListHeaderView from './view/empty-list-header-view.js';
import NoPointsView from './view/no-points-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import ControlsPresenter from './presenter/controls-presenter.js';
import ControlsModel from './model/controls-model.js';
import Api from './api/api.js';
import {render, RenderPosition} from './utils/render.js';
import {UpdateType} from './const.js';

const AUTHORIZATION = `Basic bQ3NRTa9a6jfYotQyR_8`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const api = new Api(END_POINT, AUTHORIZATION);

const headerContainer = document.querySelector(`.page-header`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const controlsModel = new ControlsModel();
const pointsModel = new PointsModel(api);
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const updateRouteInfo = (points, resetCallback) => {
  let routeInfoView = null;
  let noPointsView = null;
  const sortBar = tripEventsContainer.querySelector(`form`);

  if (points.length) {
    if (headerContainer.children[0]) {
      headerContainer.children[0].remove();
    }
    if (noPointsView) {
      noPointsView.getElement().remove();
      noPointsView = null;
      sortBar.style.display = `flex`;
    }
    routeInfoView = new RouteInfoView(points, resetCallback);
    render(headerContainer, routeInfoView.getElement(), RenderPosition.AFTERBEGIN);
    const controlsPresenter = new ControlsPresenter(controlsModel, pointsModel);
    controlsPresenter.init();

  } else {
    headerContainer.children[0].remove();
    const sortForm = document.querySelector(`.trip-events__trip-sort`);
    if (sortForm) {
      sortForm.remove();
    }
    const emptyListHeaderView = new EmptyListHeaderView(controlsModel);
    render(headerContainer, emptyListHeaderView.getElement(), RenderPosition.AFTERBEGIN);
    emptyListHeaderView.setNewEventHandler(pointsModel.addPoint);
    noPointsView = new NoPointsView();
    tripEventsContainer.append(noPointsView.getElement());
  }
};

window.addEventListener(`online`, controlsModel.switchToOnline);
window.addEventListener(`offline`, controlsModel.switchToOffline);

const presenter = new TripPresenter(
    tripEventsContainer,
    updateRouteInfo,
    pointsModel,
    controlsModel,
    offersModel,
    destinationsModel
);

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getPoints()
]).then((responses) => {
  offersModel.setOffers(responses[0]);
  destinationsModel.setDestinations(responses[1]);
  pointsModel.setPoints(responses[2], UpdateType.INIT);
  presenter.init();
});
