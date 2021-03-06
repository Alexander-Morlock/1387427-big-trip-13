const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

const SortType = {
  DAY: `sort-day`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  UPDATE_EDIT_POINT: `UPDATE_EDIT_POINT`,
  ADD_POINT: `ADD_POINT`,
  ADD_FIRST_POINT: `ADD_FIRST_POINT`,
  DELETE_POINT: `DELETE_POINT`,
  RESTORE_POINT: `RESTORE_POINT`,
  FILTER_CHANGE: `FILTER_CHANGE`,
  SUBMIT_FORM: `SUBMIT_FORM`,
  TOGGLE: `TOGGLE`,
  CHANGE_FAVORITE: `CHANGE_FAVORITE`,
  ONLINE: `ONLINE`,
  OFFLINE: `OFFLINE`
};

const Controls = {
  TABLE: `Table`,
  STATS: `Stats`,
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const clearPointID = `_NeW_`;

export {UpdateType, SortType, UserAction, Controls, clearPointID};
