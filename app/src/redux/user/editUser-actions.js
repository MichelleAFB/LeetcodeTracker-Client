import * as actionTypes from "./editUser-types";

export function setUser(user) {
 
  return {
    type: actionTypes.SET_USER,
    payload: {
      user: user,
    },
  };
}

export function setHeaderVisibility(visibility) {
  
  return {
    type: actionTypes.SET_HEADER_VISIBILITY,
    payload: {
      visibility: visibility,
    },
  };
}


