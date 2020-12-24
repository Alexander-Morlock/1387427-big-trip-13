import RouteInfoView from './view/route-info.js';
import EmptyListHeaderView from './view/empty-list-header.js';
import NoPointsView from './view/empty-trip-events.js';
import TripPresenter from './presenter/trip.js';
import {getGeneratedPoint} from './mock/mockdata.js';
import {render, RenderPosition} from './utils/render.js';

const NUMBER_OF_LIST_ITEMS = 3;
const pointsData = new Array(NUMBER_OF_LIST_ITEMS).fill().map(getGeneratedPoint);
const headerContainer = document.querySelector(`.page-header`);
const tripEventsContainer = document.querySelector(`.trip-events`);

const updateRouteInfo = (points) => {
  if (points.length) {
    if (headerContainer.children[0]) {
      headerContainer.children[0].remove();
    }
    render(headerContainer, new RouteInfoView(points).getElement(), RenderPosition.AFTERBEGIN);
  } else {
    render(headerContainer, new EmptyListHeaderView().getElement(), RenderPosition.AFTERBEGIN);
    tripEventsContainer.append(new NoPointsView().getElement());
    tripEventsContainer.querySelector(`form`).remove();
  }
};

const presenter = new TripPresenter(tripEventsContainer, updateRouteInfo);
presenter.init(pointsData);

