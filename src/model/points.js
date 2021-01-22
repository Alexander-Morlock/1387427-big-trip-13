import dayjs from 'dayjs';
import Observer from '../utils/observer.js';
import {UserAction, UpdateType} from '../const.js';

const defaultTripType = `flight`;

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this.addPoint = this.addPoint.bind(this);
  }

  setPoints(points, updateType) {
    this._points = points.slice();
    if (updateType !== UpdateType.INIT) {
      this.notify();
    }
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
    this._points[this._points.indexOf(pointToUpdate)] = Object.assign({}, pointToUpdate, update);
    this.notify();
  }

  deletePointWithoutNotification(id) {
    this._points = this._points.filter((point) => point.id !== id);
  }

  _createEmptyPoint() {
    return {
      destinations: [],
      destination: {
        title: `Unknown`,
        pictures: [],
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
      price: 0
    };
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          price: point.base_price,
          time: {
            start: dayjs(point.date_from).format(`YYYY-MM-DDThh:mm`),
            end: dayjs(point.date_to).format(`YYYY-MM-DDThh:mm`)
          },
          isFavorite: point.is_favorite,
          tripType: point.type,
          destination: {
            title: point.destination.name,
            pictures: point.destination.pictures
          }
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.type;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "base_price": point.price,
          "date_from": new Date(point.time.start).toISOString(),
          "date_to": new Date(point.time.end).toISOString(),
          "is_favorite": point.isFavorite,
          "type": point.tripType
        }
    );

    delete adaptedPoint.price;
    delete adaptedPoint.time;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.tripType;

    return adaptedPoint;
  }
}
