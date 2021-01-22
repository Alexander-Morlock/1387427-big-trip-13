import Observer from '../utils/observer.js';
import {UpdateType} from '../const.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();
    this.notify(UpdateType.INIT);
  }

  getOffers() {
    return this._offers.slice();
  }
}
