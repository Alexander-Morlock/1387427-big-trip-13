import Observer from '../utils/observer.js';
import {UserAction} from '../const.js';
import dayjs from 'dayjs';
import {generateId} from '../utils/common.js';

const defaultTripType = `Flight`;

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this.addPoint = this.addPoint.bind(this);
  }

  setPoints(points) {
    this._points = points.slice();
    this.notify();
  }

  getPoints() {
    return this._points.slice();
  }

  addPoint() {
    const newPoint = this._createEmptyPoint();
    this._points.unshift(newPoint);
    this.notify(UserAction.ADD_POINT, newPoint);
  }

  deletePoint(id) {
    this._points = this._points.filter((point) => point.id !== id);
    this.notify();
  }

  updatePoint(id, update) {
    const pointToUpdate = this._points.find((point) => point.id === id);
    this._points[this._points.indexOf(pointToUpdate)] = Object.assign({}, pointToUpdate, update, {unsaved: false});
    this.notify();
  }

  deletePointWithoutNotification(id) {
    this._points = this._points.filter((point) => point.id !== id);
  }

  _createEmptyPoint() {
    return {
      id: generateId(),
      destinations: [],
      destination: {
        title: `Unknown`,
        photoUrl: [],
        description: ``
      },
      stopType: ``,
      tripType: defaultTripType,
      time: {
        start: dayjs(),
        end: dayjs()
      },
      offers: [],
      isFavorite: ``,
      price: 0,
      unsaved: true
    };
  }
}
