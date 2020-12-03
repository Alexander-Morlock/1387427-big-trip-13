import FormEdit from './view/form-edit.js';
import RouteInfo from './view/route-info.js';
import RoutePoint from './view/route-point.js';
import SortForm from './view/sort-form.js';
import {renderElement, RenderPosition} from "./utils.js";
import {getGeneratedPoint} from './mock/mockdata.js';

const NUMBER_OF_LIST_ITEMS = 3;

const points = new Array(NUMBER_OF_LIST_ITEMS).fill().map(getGeneratedPoint);

const header = document.querySelector(`.page-header`);
renderElement(header, new RouteInfo(points).getElement(), RenderPosition.AFTERBEGIN);

const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, new SortForm().getElement(), RenderPosition.BEFOREEND);

const tripEventsList = new RoutePoint().getListTemplate();
renderElement(tripEvents, tripEventsList, RenderPosition.BEFOREEND);

renderElement(tripEventsList, new FormEdit(points[0]).getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < NUMBER_OF_LIST_ITEMS; i++) {
  renderElement(tripEventsList, new RoutePoint(points[i]).getElement(), RenderPosition.BEFOREEND);
}
