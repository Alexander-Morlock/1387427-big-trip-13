export default class Observer {
  constructor() {
    this._subscribers = [];
  }

  subscribe(callback) {
    this._subscribers.push(callback);
  }

  emit(index) {
    this._subscribers.forEach((callback) => {
      callback(index);
    });
  }
}
