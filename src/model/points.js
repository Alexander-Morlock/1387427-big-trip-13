import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
    this.notify();
  }

  getPoints() {
    return this._points.slice();
  }

  addPoint(point) {
    this._points.push(point);
    this.notify();
  }

  deletePoint(pointToDelete) {
    this._points = this._points.filter((point) => point !== pointToDelete);
    this.notify();
  }
}
