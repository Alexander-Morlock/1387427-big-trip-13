export default class Observer {
  constructor() {
    this._subscribers = {};
  }

  subscribe(index, callback) {
    this._subscribers[index] = callback;
  }

  emit(index) {
    Object.keys(this._subscribers).forEach((key) => this._subscribers[key](index));
  }
}
