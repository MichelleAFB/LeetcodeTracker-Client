import * as actionTypes from "./editFollowersAndFollowing-types";

export function setEditFFUser(user) {
  return {
    type: actionTypes.SET_EDIT_FF_USER,
    payload: {
      user: user,
    },
  };
}

export function setFFFollowing(value) {
  console.log("DISPATCH FF FOLLOWING")
  return {
    type: actionTypes.SET_FF_FOLLOWING,
    payload:{value:value}
  };
}

export function setFFFollowers(value) {
  console.log("DISPATCH FF FOLLOWERS")
 
  return {
    type: actionTypes.SET_FF_FOLLOWERS,
    payload:{value:value}
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
      value:value
    },
  };
}



