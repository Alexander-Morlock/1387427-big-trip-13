import RouteInfoView from './view/route-info.js';
import EmptyListHeaderView from './view/empty-list-header.js';
import NoPointsView from './view/empty-trip-events.js';
import TripPresenter from './presenter/trip.js';
import {getGeneratedPoint} from './mock/mockdata.js';
import {render, RenderPosition} from './utils/render.js';

const NUMBER_OF_LIST_ITEMS = 3;
const points = new Array(NUMBER_OF_LIST_ITEMS).fill().map(getGeneratedPoint);

const headerContainer = document.querySelector(`.page-header`);
const tripEventsContainer = document.querySelector(`.trip-events`);
const noPointsHeaderComponent = new EmptyListHeaderView().getElement();
const noPointsComponent = new NoPointsView().getElement();

const updateRouteInfo = () => {
  if (points.length) {
    render(headerContainer, new RouteInfoView(points).getElement(), RenderPosition.AFTERBEGIN);
  } else {
    render(headerContainer, noPointsHeaderComponent, RenderPosition.AFTERBEGIN);
    tripEventsContainer.append(noPointsComponent);
    tripEventsContainer.querySelector(`form`).remove();
  }
};

const presenter = new TripPresenter(tripEventsContainer, updateRouteInfo);
presenter.init(points);

