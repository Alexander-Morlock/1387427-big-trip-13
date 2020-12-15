import FormEdit from '../view/form-edit.js';
import RoutePoint from '../view/route-point.js';
import {replace} from '../utils.js';

export default class TripPoint {
  constructor(index, pointDatabase, observer) {
    this._pointDatabase = pointDatabase;
    this._pointData = this._pointDatabase[index];
    this._observer = observer;
    this._index = index;
    this._point = null;
    this._editPoint = null;
  }

  toggleFavorite() {
    this._pointDatabase[this._index].isFavorite = !this._pointDatabase[this._index].isFavorite;
    const newPoint = this.createNewPoint();
    replace(newPoint.getElement(), this._point.getElement());
    this._point = newPoint;
  }

  observerClickHandler(index) {
    if (index === this._index) {
      this.switchToEdit(this._point);
    } else {
      this.switchToNormal();
    }
  }

  createNewPoint(initFlag) {
    const newPoint = new RoutePoint(this._pointData);
    newPoint.setFavoriteButtonHandler(() => this.toggleFavorite());

    this._observer.subscribe(this._index, (index) => this.observerClickHandler(index));
    newPoint.setEditClickHandler(() => this._observer.emit(this._index));

    if (initFlag) {
      this._point = newPoint;
    }

    return newPoint;
  }

  switchToEdit(point) {
    this._editPoint = new FormEdit(this._pointData);
    replace(this._editPoint.getElement(), point.getElement());

    const onEscapeHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        document.removeEventListener(`keydown`, onEscapeHandler);
        this.switchToNormal(this._editPoint);
      }
    };

    document.addEventListener(`keydown`, onEscapeHandler);
    this._editPoint.setMinimizeClickHandler(() => {
      this.switchToNormal(this._editPoint);
      document.removeEventListener(`keydown`, onEscapeHandler);
    });

    this._editPoint.setSaveClickHandler(() => {
      this.switchToNormal();
      document.removeEventListener(`keydown`, onEscapeHandler);
    });
  }

  switchToNormal() {
    if (this._editPoint) {
      replace(this._point.getElement(), this._editPoint.getElement());
      this._editPoint = null;
    }
  }
}
