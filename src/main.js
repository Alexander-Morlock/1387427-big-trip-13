import SortForm from './view/sort-form.js';
import TripPresenter from './presenter/trip.js';
import {getGeneratedPoint} from './mock/mockdata.js';
import {renderElement, RenderPosition} from './utils.js';

const NUMBER_OF_LIST_ITEMS = 3;
const points = new Array(NUMBER_OF_LIST_ITEMS).fill().map(getGeneratedPoint);
const header = document.querySelector(`.page-header`);
const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, new SortForm().getElement(), RenderPosition.BEFOREEND);

const presenter = new TripPresenter(points, header, tripEvents);
presenter.renderPoints();
