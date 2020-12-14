import FormEdit from '../view/form-edit.js';
import RoutePoint from '../view/route-point.js';
import {replace} from '../utils.js';

export default class TripPoint {
  constructor(index, pointDatabase) {
    this._pointDatabase = pointDatabase;
    this._pointData = this._pointDatabase[index];
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

  createNewPoint(flag) {
    const newPoint = new RoutePoint(this._pointData);
    newPoint.setEditClickHandler(() => {
      this.switchToEdit(newPoint);
    });

    newPoint.setFavoriteButtonHandler(() => {
      this.toggleFavorite();
    });

    if (flag) {
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
    replace(this._point.getElement(), this._editPoint.getElement());
  }
}
