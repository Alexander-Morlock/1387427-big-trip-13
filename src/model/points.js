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

  deletePoint(userAction, id, errorFormAnimationCallback) {
    this._api.deletePoint(id)
    .then(() => {
      this._points = this._points.filter((point) => point.id !== id);
      this.notify(userAction);
    }).catch((err) => errorFormAnimationCallback(err));
  }

  updatePoint(userAction, id, update, errorFormAnimationCallback, removeEscapeEventListener) {
    const index = this._points.findIndex((point) => point.id === id);

    const modelUpdateAndNotify = (newIdFromServer) => {
      if (newIdFromServer) {
        this._newPoint.id = newIdFromServer;
      }

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
        .then((response) => modelUpdateAndNotify(response.id))
        .then(() => removeEscapeEventListener())
        .catch((err) => {
          if (errorFormAnimationCallback) {
            errorFormAnimationCallback(err);
          }
        });
      } else {
        this._api.updatePoint(this._newPoint)
        .then(() => modelUpdateAndNotify())
        .then(() => removeEscapeEventListener())
        .catch((err) => {
          if (errorFormAnimationCallback) {
            errorFormAnimationCallback(err);
          }
        });
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
    this.notify(UserAction.RESTORE_POINT);
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
        start: new Date(Date.now()).toISOString(),
        end: new Date(Date.now()).toISOString()
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
            start: point.date_from,
            end: point.date_to
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
          "date_from": point.time.start,
          "date_to": point.time.end,
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
