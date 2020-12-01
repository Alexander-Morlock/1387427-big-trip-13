import {createRouteInfoTemplate} from './view/rout-info.js';
import {createSortFormTemplate} from './view/sort-form.js';
import {
  createTripEventsListTemplate,
  createTripEventsListItemTemplate
} from './view/route-point.js';
import {createFormEditTemplate} from './view/form-edit.js';
import {getGeneratedPoint} from './mock/mockdata.js';

const NUMBER_OF_LIST_ITEMS = 3;

const points = new Array(NUMBER_OF_LIST_ITEMS).fill().map(getGeneratedPoint);

const tripMain = document.querySelector(`.trip-main`);
const tripEvents = document.querySelector(`.trip-events`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMain, createRouteInfoTemplate(points), `afterbegin`);
render(tripEvents, createSortFormTemplate(), `beforeend`);
render(tripEvents, createTripEventsListTemplate(), `beforeend`);
const tripEventsList = document.querySelector(`.trip-events__list`);
render(tripEventsList, createFormEditTemplate(points[0]), `beforeend`);

for (let i = 0; i < NUMBER_OF_LIST_ITEMS; i++) {
  render(tripEventsList, createTripEventsListItemTemplate(points[i]), `beforeend`);
}
