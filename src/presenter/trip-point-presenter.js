import PointEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction} from '../const.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class TripPoint {
  constructor(pointListContainer, changeMode, modelUpdate, offers, destinations, pickrsModel) {
    this._pointListContainer = pointListContainer;
    this._changeMode = changeMode;
    this._modelUpdate = modelUpdate;
    this._offers = offers;
    this._destinations = destinations;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._pickrsModel = pickrsModel;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleSubmitForm = this._handleSubmitForm.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleReplaceEditToPoint = this._handleReplaceEditToPoint.bind(this);
    this._handleDeletePoint = this._handleDeletePoint.bind(this);
    this._replaceEditToPoint = this._replaceEditToPoint.bind(this);
    this._replacePointToEdit = this._replacePointToEdit.bind(this);
    this._handleEventTypeChange = this._handleEventTypeChange.bind(this);
    this._removeEscapeEventListener = this._removeEscapeEventListener.bind(this);
  }

  init(point) {
    this._point = point;
    this._offersForThisPoint = this._offers.find((offer) => offer.type === this._point.tripType).offers;
    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;
    this._reCreatePointView();
    this._reCreatePointEditView();

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

  _reCreatePointView() {
    this._pointComponent = new PointView(this._point);
    this._pointComponent.setEditClickHandler(this._replacePointToEdit);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _reCreatePointEditView() {
    this._pointEditComponent = new PointEditView(
        this._point,
        this._offersForThisPoint,
        this._destinations,
        this._pickrsModel
    );

    this._pointEditComponent.setFormSubmitHandler(this._handleSubmitForm);
    this._pointEditComponent.setMinimizeClickHandler(this._handleReplaceEditToPoint);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeletePoint);
    this._pointEditComponent.setEventTypeChangeHandler(this._handleEventTypeChange);
  }

  _replacePointToEdit(userAction) {
    const addNewPointMessage = document.querySelector(`.trip-events__msg`);
    if (addNewPointMessage) {
      addNewPointMessage.remove();
    }
    this._reCreatePointEditView();
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
    if (userAction) {
      document.querySelector(`.trip-main__event-add-btn`).disabled = true;
    }
  }

  _replaceEditToPoint() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = !window.navigator.onLine;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    if (this._point.unsaved) {
      this._modelUpdate(UserAction.RESTORE_POINT);
    }
    if (this._point.id) {
      this._reCreatePointView();
      if (document.querySelector(`.trip-events__item`)) {
        replace(this._pointComponent, this._pointEditComponent);
      }
      this._mode = Mode.DEFAULT;
    } else {
      this.destroy();
      this._handleDeletePoint();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditToPoint();
    }
  }

  _handleReplaceEditToPoint() {
    this._replaceEditToPoint();
  }

  _handleDeletePoint(errorFormAnimationCallback) {
    this._modelUpdate(UserAction.DELETE_POINT, this._point.id, errorFormAnimationCallback);
  }

  _handleFavoriteClick() {
    this._modelUpdate(UserAction.CHANGE_FAVORITE, this._point.id, {isFavorite: !this._point.isFavorite});
  }

  _removeEscapeEventListener() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleSubmitForm(updatedPoint, errorFormAnimationCallback) {
    this._modelUpdate(UserAction.SUBMIT_FORM, updatedPoint.id, updatedPoint, errorFormAnimationCallback, this._removeEscapeEventListener);
  }

  _handleEventTypeChange(newTripType) {
    this._modelUpdate(UserAction.UPDATE_EDIT_POINT, this._point.id, {tripType: newTripType, unsaved: true});
  }
}
