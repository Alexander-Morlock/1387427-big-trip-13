import dayjs from 'dayjs';
import Observer from '../utils/observer.js';
import {UserAction} from '../const.js';

export default class Points extends Observer {
  constructor(api) {
    super();
    this._api = api;
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
    this._api.addPoint(newPoint)
      .then((response) => {
        newPoint.id = response.id;
        this._points.unshift(newPoint);
        this.notify(UserAction.ADD_POINT, newPoint);
      });

  }

  deletePoint(userAction, id) {
    this._points = this._points.filter((point) => point.id !== id);
    this.notify(userAction);
  }

  updatePoint(userAction, id, update) {
    this._pointToRestore = this._points.find((point) => point.id === id);
    const newPoint = Object.assign({}, this._pointToRestore, update);
    this._api.updatePoint(newPoint)
    .then(() => {
      newPoint.offers.forEach((offer) => {
        offer.isChecked = offer.isChecked !== false;
      });
      this._points[this._points.indexOf(this._pointToRestore)] = newPoint;
      this.notify(userAction, this._pointToRestore);
    });
  }

  restorePoint() {
    if (this._pointToRestore) {
      this._api.updatePoint(this._pointToRestore)
      .then(() => {
        this._points[this._points.indexOf(this._points.find((point) => point.id === this._pointToRestore.id))] = this._pointToRestore;
        this.notify();
      });
    }
  }

  deletePointWithoutNotification(id) {
    this._points = this._points.filter((point) => point.id !== id);
  }

  _createEmptyPoint() {
    return {
      destination: {
        title: `Unknown`,
        pictures: [],
        description: ``
      },
      tripType: `taxi`,
      time: {
        start: dayjs(),
        end: dayjs()
      },
      offers: [
        {
          title: `Choose meal`,
          price: 180
        }, {
          title: `Upgrade to comfort class`,
          price: 50
        }
      ],
      isFavorite: `false`,
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
            pictures: point.destination.pictures,
            description: point.destination.description
          },
          offers: point.offers.map((offer) => {
            return {
              title: offer.title,
              price: offer.price,
              isChecked: true
            };
          })
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
        },
        {
          destination: {
            name: point.destination.title,
            pictures: point.destination.pictures,
            description: point.destination.description
          },
          offers: point.offers.filter((offer) => offer.isChecked)
        }
    );
    adaptedPoint.offers.forEach((offer) => delete offer.isChecked);

    delete adaptedPoint.price;
    delete adaptedPoint.time;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.tripType;
    delete adaptedPoint.unsaved;
    return adaptedPoint;
  }
}
