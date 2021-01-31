import Observer from "../utils/observer.js";
import {Controls, UserAction} from '../const.js';
export default class ControlsModel extends Observer {
  constructor() {
    super();
    this._selectedFilter = Controls.EVERYTHING;
    this.switchToOnline = this.switchToOnline.bind(this);
    this.switchToOffline = this.switchToOffline.bind(this);
  }

  setFilter(selectedFilter, userAction) {
    this._selectedFilter = selectedFilter;
    this.notify(userAction);
  }

  getFilter() {
    return this._selectedFilter;
  }

  switchToOnline() {
    this.notify(UserAction.ONLINE);
  }

  switchToOffline() {
    this.notify(UserAction.OFFLINE);
  }
}
