export default class Observer {
  constructor() {
    this._subscribers = [];
  }

  subscribe(callback) {
    this._subscribers.push(callback);
  }

  emit(evt) {
    this._subscribers.forEach((callback) => {
      callback(evt);
    });
  }
}
