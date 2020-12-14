import RouteInfo from '../view/route-info.js';
import EmptyListHeader from '../view/empty-list-header.js';
import EmptyTripEvents from '../view/empty-trip-events.js';
import EmptyListTemplate from '../view/empty-list-template.js';
import TripPoint from './trip-point.js';
import {renderElement, RenderPosition} from '../utils.js';

export default class Trip {
  constructor(pointsData, headerContainer, tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._headerContainer = headerContainer;
    this._pointsData = pointsData;
    this._tripEventsList = new EmptyListTemplate().getElement();
  }

  updateRouteInfo() {
    if (this._pointsData.length) {
      renderElement(this._headerContainer, new RouteInfo(this._pointsData).getElement(),
          RenderPosition.AFTERBEGIN);
    } else {
      renderElement(this._headerContainer, new EmptyListHeader().getElement(),
          RenderPosition.AFTERBEGIN);
      this._tripEventsContainer.append(new EmptyTripEvents().getElement());
      this._tripEventsContainer.querySelector(`form`).remove();
    }
  }

  renderPoints() {
    renderElement(this._tripEventsContainer, this._tripEventsList, RenderPosition.BEFOREEND);
    this._pointsData.forEach((point, index) => {
      const newPoint = new TripPoint(index, this._pointsData).createNewPoint(`initialization`);
      renderElement(this._tripEventsList, newPoint.getElement(), RenderPosition.BEFOREEND);
    });

    this.updateRouteInfo();
  }
}
