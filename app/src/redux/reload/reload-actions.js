import * as actionTypes from "./reload-types";

export function setNotificationReload(value) {
  return {
    type: actionTypes.SET_NOTIFICATION_RELOAD,
    payload: {
      notificationReload:value
    },
  };
}

