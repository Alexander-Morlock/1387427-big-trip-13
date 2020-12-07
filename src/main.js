import FormEdit from './view/form-edit.js';
import RouteInfo from './view/route-info.js';
import RoutePoint from './view/route-point.js';
import SortForm from './view/sort-form.js';
import EmptyListTemplate from './view/empty-list-template.js';
import EmptyListHeader from './view/empty-list-header.js';
import EmptyTripEvents from './view/empty-trip-events.js';
import {renderElement, RenderPosition} from "./utils.js";
import {getGeneratedPoint} from './mock/mockdata.js';

const NUMBER_OF_LIST_ITEMS = 0;
const points = new Array(NUMBER_OF_LIST_ITEMS).fill().map(getGeneratedPoint);
const header = document.querySelector(`.page-header`);

const updateRouteInfo = () => {
  header.firstChild.remove();
  if (points.length) {
    renderElement(header, new RouteInfo(points).getElement(), RenderPosition.AFTERBEGIN);
  } else {
    renderElement(header, new EmptyListHeader().getElement(), RenderPosition.AFTERBEGIN);
    tripEvents.append(new EmptyTripEvents().getElement());
    tripEvents.querySelector(`form`).remove();
  }
};

const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, new SortForm().getElement(), RenderPosition.BEFOREEND);

updateRouteInfo();

const tripEventsList = new EmptyListTemplate().getElement();
renderElement(tripEvents, tripEventsList, RenderPosition.BEFOREEND);

const buttonHandler = (point) => {
  const button = point.querySelector(`.event__rollup-btn`);
  button.addEventListener(`click`, () => {
    switchToEdit(point);
  });
};

const switchToNormal = (pointEdit) => {
  const index = route.indexOf(pointEdit);
  const point = new RoutePoint(points[index]).getElement();
  buttonHandler(point);
  tripEventsList.replaceChild(point, pointEdit);
  route[route.indexOf(pointEdit)] = point;
};

const switchToEdit = (point) => {
  const index = route.indexOf(point);
  const pointEdit = new FormEdit(points[index]).getElement();

  const onEscapeHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      document.removeEventListener(`keydown`, onEscapeHandler);
      switchToNormal(pointEdit);
    }
  };

  const buttonMinimize = pointEdit.querySelector(`.event__rollup-btn`);
  document.addEventListener(`keydown`, onEscapeHandler);
  buttonMinimize.addEventListener(`click`, () => {
    switchToNormal(pointEdit);
  });

  const buttonSave = pointEdit.querySelector(`.event__save-btn`);
  buttonSave.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    switchToNormal(pointEdit);
  });

  route[route.indexOf(point)] = pointEdit;
  tripEventsList.replaceChild(pointEdit, point);
};

const route = [];
points.forEach((point) => {
  const newPoint = new RoutePoint(point).getElement();
  buttonHandler(newPoint);
  renderElement(tripEventsList, newPoint, RenderPosition.BEFOREEND);
  route.push(newPoint);
});
