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
  if (points.length) {
    if (headerContainer.children[0]) {
      headerContainer.children[0].remove();
    }
    render(headerContainer, new RouteInfoView(points).getElement(), RenderPosition.AFTERBEGIN);
    const renderControlsAfterThisElement = document.querySelector(`.trip-main__trip-info`);
    const controlsPresenter = new ControlsPresenter(renderControlsAfterThisElement, controlsModel);
    controlsPresenter.init();
  } else {
    if (pointsModel.getPoints().length) {
      document.querySelector(`.trip-info__title`).textContent = `No results for «${controlsModel.getFilter()}» filter`.toUpperCase();
      document.querySelector(`.trip-info__dates`).textContent = `No dates to display`;
      document.querySelector(`.trip-info__cost-value`).textContent = `0`;
    } else {
      headerContainer.children[0].remove();
      render(headerContainer, new EmptyListHeaderView().getElement(), RenderPosition.AFTERBEGIN);
      tripEventsContainer.append(new NoPointsView().getElement());
      tripEventsContainer.querySelector(`form`).remove();
    }
  }
};

const presenter = new TripPresenter(tripEventsContainer, updateRouteInfo, pointsModel, controlsModel);
presenter.init();
