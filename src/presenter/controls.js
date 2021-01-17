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
    if (!document.querySelector(`.trip-main__event-add-btn`).disabled) {
      this._controlsComponent.setChangeHandler(this._filtersChangeAction);
    } else {
      this._controlsComponent.setFiltersDisabled();
    }
  }

  _filtersChangeAction(evt) {
    this._controlsModel.setFilter(evt.target.value);
  }
}
