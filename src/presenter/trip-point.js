import PointEditView from '../view/form-edit.js';
import PointView from '../view/route-point.js';
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction} from '../const.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class TripPoint {
  constructor(pointListContainer, changeData, changeMode, modelUpdate) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._modelUpdate = modelUpdate;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleSubmitForm = this._handleSubmitForm.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleReplaceEditToPoint = this._handleReplaceEditToPoint.bind(this);
    this._handleDeletePoint = this._handleDeletePoint.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleSubmitForm);
    this._pointEditComponent.setMinimizeClickHandler(this._handleReplaceEditToPoint);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeletePoint);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replacePointToEdit() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToEdit();
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign({}, this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _handleSubmitForm() {
    this._changeData(this._point);
    this._replaceEditToPoint();
  }

  _handleReplaceEditToPoint() {
    this._replaceEditToPoint();
  }

  _handleDeletePoint() {
    this._modelUpdate(UserAction.DELETE_POINT, this._point);
  }
}
