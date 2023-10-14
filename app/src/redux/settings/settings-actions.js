import * as actionTypes from "./settings-types";

export function setSettingsVisibility(value) {
  return {
    type: actionTypes.SET_SETTINGS_VISIBILITY,
    payload: {
      visibility:value,
    },
  };
}

export function setSettingsType(type) {
  //console.log("changing edit modal visibility:"+visibility)
  return {
    type: actionTypes.SET_SETTINGS_TYPE,
    payload: {
      type: type,
    },
  };
}

export function setSettingsContent(content) {
  //console.log("changing edit modal visibility:"+visibility)
  return {
    type: actionTypes.SET_SETTINGS_CONTENT,
    payload: {
      content:content,
    },
  };
}