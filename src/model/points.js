import dayjs from 'dayjs';
import Observer from '../utils/observer.js';
import {UserAction} from '../const.js';
const clearPointID = `_NeW_`;

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
    this._pointToRestore = null;
    const newPoint = this._createEmptyPoint();
    this._points.unshift(newPoint);
    this.notify(UserAction.ADD_POINT, newPoint);
  }

  deletePoint(userAction, id) {
    this._api.deletePoint(id)
    .then(() => {
      this._points = this._points.filter((point) => point.id !== id);
      this.notify(userAction);
    });
  }

  updatePoint(userAction, id, update) {
    const index = this._points.findIndex((point) => point.id === id);

    const modelUpdateAndNotify = () => {
      this._points[index] = this._newPoint;
      if (userAction === UserAction.SUBMIT_FORM) {
        this._pointToRestore = null;
      }
      this.notify(userAction, this._newPoint);
    };

    if (!this._pointToRestore && userAction !== UserAction.CHANGE_FAVORITE) {
      this._pointToRestore = this._points[index];
      this._newPoint = Object.assign({}, this._pointToRestore, update);
    } else {
      if (userAction === UserAction.CHANGE_FAVORITE) {
        this._newPoint = Object.assign({}, this._points[index], update);
      } else {
        this._newPoint = Object.assign({}, this._newPoint, update);
      }
    }

    if (userAction === UserAction.UPDATE_EDIT_POINT) {
      modelUpdateAndNotify();
    } else {
      if (userAction === UserAction.SUBMIT_FORM && this._newPoint.id === clearPointID) {
        this._api.addPoint(this._newPoint)
        .then(() => modelUpdateAndNotify());
      } else {
        this._api.updatePoint(this._newPoint)
        .then(() => modelUpdateAndNotify());
      }
    }
  }

  restorePoint() {
    if (this._pointToRestore && this._pointToRestore.id !== clearPointID) {
      this._points[this._points.findIndex((point) => point.id === this._pointToRestore.id)] = this._pointToRestore;
    } else {
      if (this._points[0].id === clearPointID) {
        this._points.shift();
      }
    }
    this._pointToRestore = null;
    this.notify();
  }

  _createEmptyPoint() {
    return {
      id: clearPointID,
      destination: {
        title: `To Dubrovka`,
        pictures: [],
        description: `Greetings to Mikhail Ivanovich`
      },
      tripType: `taxi`,
      time: {
        start: dayjs().format(`YYYY-MM-DDThh:mm`),
        end: dayjs().format(`YYYY-MM-DDThh:mm`)
      },
      offers: [],
      isFavorite: false,
      price: 100,
      unsaved: true
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
          "type": point.tripType,
          "offers": point.offers.filter((offer) => offer.isChecked).map((offer) => {
            return {
              title: offer.title,
              price: offer.price
            };
          }),
          "destination": {
            name: point.destination.title,
            pictures: point.destination.pictures,
            description: point.destination.description
          }
        }
    );
    if (adaptedPoint.id === clearPointID) {
      delete adaptedPoint.id;
    }
    delete adaptedPoint.price;
    delete adaptedPoint.time;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.tripType;
    delete adaptedPoint.unsaved;
    return adaptedPoint;
  }
}
