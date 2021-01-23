export default class PickrsModel {
  constructor() {
    this._pickrs = [];
  }

  add(pickr) {
    this._pickrs.push(pickr);
  }

  clear() {
    this._pickrs.forEach((pickr) => {
      pickr.destroy();
      pickr = null;
    });
    this._pickrs = [];
  }
}
