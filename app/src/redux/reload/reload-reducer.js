import * as actionTypes from "./reload-types";

const initialState = {
notificationReload:false
};

export const reloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_NOTIFICATION_RELOAD:
      console.log("REDUX:SETTING EDIT PROBLEM");
      return {
        ...state,
       notificationReload:action.payload.notificationReload
      };

    

    default:
      return state;
  }
};