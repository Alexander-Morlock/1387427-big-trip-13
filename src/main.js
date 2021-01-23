import RouteInfoView from './view/route-info.js';
import EmptyListHeaderView from './view/empty-list-header.js';
import NoPointsView from './view/empty-trip-events.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import ControlsPresenter from './presenter/controls.js';
import ControlsModel from './model/controls.js';
import Api from './api.js';
import {render, RenderPosition} from './utils/render.js';
import {UpdateType} from './const.js';

const AUTHORIZATION = `Basic bQ3NRTa9a6jfYotQyR`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const api = new Api(END_POINT, AUTHORIZATION);

const headerContainer = document.querySelector(`.page-header`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const controlsModel = new ControlsModel();
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const updateRouteInfo = (points) => {
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
    routeInfoView = new RouteInfoView(points);
    render(headerContainer, routeInfoView.getElement(), RenderPosition.AFTERBEGIN);
    routeInfoView.setNewEventHandler(pointsModel.addPoint);
    const renderControlsAfterThisElement = document.querySelector(`.trip-main__trip-info`);
    const controlsPresenter = new ControlsPresenter(renderControlsAfterThisElement, controlsModel);
    controlsPresenter.init();

  } else {
    if (pointsModel.getPoints().length) {
      routeInfoView.showNoResults(controlsModel.getFilter());
    } else {
      headerContainer.children[0].remove();
      const emptyListHeaderView = new EmptyListHeaderView();
      render(headerContainer, emptyListHeaderView.getElement(), RenderPosition.AFTERBEGIN);
      emptyListHeaderView.setNewEventHandler(pointsModel.addPoint);
      noPointsView = new NoPointsView();
      tripEventsContainer.append(noPointsView.getElement());
      sortBar.style.display = `none`;
    }
  }
};

const presenter = new TripPresenter(
    tripEventsContainer,
    updateRouteInfo,
    pointsModel,
    controlsModel,
    offersModel,
    destinationsModel
);

headerContainer.innerHTML = `<h1 style="text-align: center">LOADING...</h1>`;

api.getOffers()
.then((offers) => offersModel.setOffers(offers))
.then(() => api.getDestinations())
.then((destinations) => destinationsModel.setDestinations(destinations))
.then(() => api.getPoints())
.then((points) => pointsModel.setPoints(points, UpdateType.INIT))
.then(() => presenter.init());

