import Observer from "../utils/observer.js";
import {Controls} from '../const.js';
export default class ControlsModel extends Observer {
  constructor() {
    super();
    this._selectedFilter = Controls.EVERYTHING;
  }

  setFilter(selectedFilter, userAction) {
    this._selectedFilter = selectedFilter;
    this.notify(userAction);
  }

  getFilter() {
    return this._selectedFilter;
  }
}
