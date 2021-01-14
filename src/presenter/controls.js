import ControlsView from '../view/controls.js';
import {renderAfter} from '../utils/render.js';

export default class Controls {
  constructor(renderAfterElement, controlsModel) {
    this._controlsComponent = new ControlsView();
    this._renderAfterElement = renderAfterElement;
    this._controlsModel = controlsModel;
    this._filtersChangeAction = this._filtersChangeAction.bind(this);
  }

  init() {
    renderAfter(this._renderAfterElement, this._controlsComponent.getElement());
    this._controlsComponent.setChangeHandler(this._filtersChangeAction);
  }

  _filtersChangeAction(evt) {
    this._controlsModel.setFilter(evt.target.value);
  }
}
