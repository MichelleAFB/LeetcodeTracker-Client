import * as actionTypes from "./editFollowersAndFollowing-types";

export function setEditFFUser(user) {
  return {
    type: actionTypes.SET_EDIT_FF_USER,
    payload: {
      user: user,
    },
  };
}

export function setFollowing() {

  return {
    type: actionTypes.SET_FOLLOWING,
  
  };
}

export function setFollowers() {
 
  return {
    type: actionTypes.SET_FOLLOWING,
 
  };
}

export function setFFCount(count) {
  
  return {
    type: actionTypes.SET_FF_COUNT,
    payload: {
      ffCount:count
    },
  };
}
export function setFFVisibility(value) {
  
  return {
    type: actionTypes.SET_FF_VISIBILITY,
    payload: {
      ffVisibility:value
    },
  };
}



