import Observer from '../utils/observer.js';
import {UpdateType} from '../const.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
    this.notify(UpdateType.INIT);
  }

  getDestinations() {
    return this._destinations.slice();
  }

  static adaptToClient(destination) {
    const adaptedDestination = Object.assign(
        {},
        destination,
        {
          title: destination.name
        }
    );
    delete adaptedDestination.name;
    return adaptedDestination;
  }

  static adaptToServer(destination) {
    const adaptedDestination = Object.assign(
        {},
        destination,
        {
          name: destination.title
        }
    );
    delete adaptedDestination.title;
    return adaptedDestination;
  }
}
