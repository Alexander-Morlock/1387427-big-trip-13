import Observer from "../utils/observer.js";
const Controls = {
  TABLE: `Table`,
  STATS: `Stats`,
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

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
