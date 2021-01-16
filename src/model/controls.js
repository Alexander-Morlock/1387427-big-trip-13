import Observer from "../utils/observer.js";
import {Controls} from '../const.js';
export default class ControlsModel extends Observer {
  constructor() {
    super();
    this._selectedFilter = Controls.EVERYTHING;
  }

  setFilter(selectedFilter) {
    this._selectedFilter = selectedFilter;
    this.notify();
  }

  getFilter() {
    return this._selectedFilter;
  }
}
