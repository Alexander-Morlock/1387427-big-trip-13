import FormEdit from './view/form-edit.js';
import RouteInfo from './view/route-info.js';
import RoutePoint from './view/route-point.js';
import SortForm from './view/sort-form.js';
import {renderElement, RenderPosition} from "./utils.js";
import {getGeneratedPoint} from './mock/mockdata.js';

const NUMBER_OF_LIST_ITEMS = 3;

const points = new Array(NUMBER_OF_LIST_ITEMS).fill().map(getGeneratedPoint);

const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);

renderElement(tripMain, new RouteInfo(points).getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripEvents, new SortForm().getElement(), RenderPosition.BEFOREEND);
renderElement(tripEvents, RoutePoint.getListTemplate(), RenderPosition.BEFOREEND);
const tripEventsList = document.querySelector(`.trip-events__list`);
renderElement(tripEventsList, new FormEdit(points[0]).getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < NUMBER_OF_LIST_ITEMS; i++) {
  renderElement(tripEventsList, new RoutePoint(points[i]).getElement(), RenderPosition.BEFOREEND);
}
