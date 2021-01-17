import RouteInfoView from './view/route-info.js';
import EmptyListHeaderView from './view/empty-list-header.js';
import NoPointsView from './view/empty-trip-events.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import ControlsPresenter from './presenter/controls.js';
import ControlsModel from './model/controls.js';
import {getGeneratedPoint} from './mock/mockdata.js';
import {render, RenderPosition} from './utils/render.js';

const NUMBER_OF_LIST_ITEMS = 3;
const pointsData = new Array(NUMBER_OF_LIST_ITEMS).fill().map(getGeneratedPoint);
const headerContainer = document.querySelector(`.page-header`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const controlsModel = new ControlsModel();
const pointsModel = new PointsModel();
pointsModel.setPoints(pointsData);

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

const presenter = new TripPresenter(tripEventsContainer, updateRouteInfo, pointsModel, controlsModel);
presenter.init();
