import * as actionTypes from "./editUser-types";

export function setUser(user) {
  console.log("SETTING USER",user)
  return {
    type: actionTypes.SET_USER,
    payload: {
      user: user,
    },
  };
}

export function setHeaderVisibility(visibility) {
  console.log("changing edit modal visibility:"+visibility)
  return {
    type: actionTypes.SET_HEADER_VISIBILITY,
    payload: {
      visibility: visibility,
    },
  };
}


