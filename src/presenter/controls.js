import ControlsView from '../view/controls.js';
import {render, RenderPosition} from '../utils/render.js';

export default class Controls {
  constructor(renderAfterElement, controlsModel) {
    this._controlsModel = controlsModel;
    this._controlsComponent = new ControlsView(this._controlsModel.getFilter());
    this._renderAfterElement = renderAfterElement;
    this._filtersChangeAction = this._filtersChangeAction.bind(this);
  }

  init() {
    render(this._renderAfterElement, this._controlsComponent.getElement(), RenderPosition.AFTER);
    this._controlsComponent.setChangeHandler(this._filtersChangeAction);
  }

  _filtersChangeAction(evt) {
    this._controlsModel.setFilter(evt.target.value);
  }
}
