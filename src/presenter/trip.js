import RouteInfo from '../view/route-info.js';
import EmptyListHeader from '../view/empty-list-header.js';
import EmptyTripEvents from '../view/empty-trip-events.js';
import EmptyListTemplate from '../view/empty-list-template.js';
import FormEdit from '../view/form-edit.js';
import RoutePoint from '../view/route-point.js';
import {renderElement, RenderPosition} from '../utils.js';

export default class Trip {
  constructor(points, header, tripEvents) {
    this._points = points;
    this._header = header;
    this._tripEvents = tripEvents;
    this.renderPoints();
  }

  updateRouteInfo() {
    if (this._points.length) {
      renderElement(this._header, new RouteInfo(this._points).getElement(), RenderPosition.AFTERBEGIN);
    } else {
      renderElement(this._header, new EmptyListHeader().getElement(), RenderPosition.AFTERBEGIN);
      this._tripEvents.append(new EmptyTripEvents().getElement());
      this._tripEvents.querySelector(`form`).remove();
    }
  }

  renderPoints() {
    this._tripEventsList = new EmptyListTemplate().getElement();
    renderElement(this._tripEvents, this._tripEventsList, RenderPosition.BEFOREEND);
    this._route = [];
    this._points.forEach((point, index) => {
      const newPoint = this.createNewPoint(index);
      renderElement(this._tripEventsList, newPoint.getElement(), RenderPosition.BEFOREEND);
      this._route.push(newPoint);
    });
  }

  createNewPoint(index) {
    const newPoint = new RoutePoint(this._points[index]);
    newPoint.setEditClickHandler(() => {
      this.switchToEdit(newPoint);
    });
    newPoint.setFavoriteButtonHandler(() => {
      this.toggleFavorite(index);
    });
    return newPoint;
  }

  toggleFavorite(index) {
    this._points[index].isFavorite = !this._points[index].isFavorite;
    this._tripEventsList.replaceChild(this.createNewPoint(index).getElement(), this._tripEventsList.children[index]);
  }

  switchToEdit(point) {
    const index = this._route.indexOf(point);
    const pointEdit = new FormEdit(this._points[index]);

    const onEscapeHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        document.removeEventListener(`keydown`, onEscapeHandler);
        this.switchToNormal(pointEdit);
      }
    };

    document.addEventListener(`keydown`, onEscapeHandler);
    pointEdit.setMinimizeClickHandler(() => {
      this.switchToNormal(pointEdit);
    });

    pointEdit.setSaveClickHandler(() => {
      this.switchToNormal(pointEdit);
    });

    this._route[this._route.indexOf(point)] = pointEdit;
    this._tripEventsList.replaceChild(pointEdit.getElement(), point.getElement());
  }

  switchToNormal(pointEdit) {
    const index = this._route.indexOf(pointEdit);
    const point = new RoutePoint(this._points[index]);
    point.setEditClickHandler(() => {
      this.switchToEdit(point);
    });
    this._tripEventsList.replaceChild(point.getElement(), pointEdit.getElement());
    this._route[this._route.indexOf(pointEdit)] = point;
  }
}
