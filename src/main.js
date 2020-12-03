import FormEdit from './view/form-edit.js';
import RouteInfo from './view/route-info.js';
import RoutePoint from './view/route-point.js';
import SortForm from './view/sort-form.js';
import {renderElement, RenderPosition} from "./utils.js";
import {getGeneratedPoint} from './mock/mockdata.js';

const NUMBER_OF_LIST_ITEMS = 3;
const NUMBER_OF_ELEMENTS_TO_REMOVE = 1;
const points = new Array(NUMBER_OF_LIST_ITEMS).fill().map(getGeneratedPoint);
const header = document.querySelector(`.page-header`);

const updateRouteInfo = () => {
  header.firstChild.remove();
  renderElement(header, new RouteInfo(points).getElement(), RenderPosition.AFTERBEGIN);
}; updateRouteInfo();

const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, new SortForm().getElement(), RenderPosition.BEFOREEND);

const tripEventsList = new RoutePoint().getListTemplate();
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

  const buttonMinimize = pointEdit.querySelector(`.event__rollup-btn`);
  buttonMinimize.addEventListener(`click`, () => {
    switchToNormal(pointEdit);
  });

  const buttonSave = pointEdit.querySelector(`.event__save-btn`);
  buttonSave.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    switchToNormal(pointEdit);
  });

  const buttonDelete = pointEdit.querySelector(`.event__reset-btn`);
  buttonDelete.addEventListener(`click`, () => {
    points.splice(index, NUMBER_OF_ELEMENTS_TO_REMOVE);
    route.splice(index, NUMBER_OF_ELEMENTS_TO_REMOVE);
    pointEdit.remove();
    updateRouteInfo(points);
  });
  route[route.indexOf(point)] = pointEdit;
  tripEventsList.replaceChild(pointEdit, point);
};

const route = [];
for (let i = 0; i < points.length; i++) {
  const newPoint = new RoutePoint(points[i]).getElement();
  buttonHandler(newPoint);
  renderElement(tripEventsList, newPoint, RenderPosition.BEFOREEND);
  route.push(newPoint);
}
