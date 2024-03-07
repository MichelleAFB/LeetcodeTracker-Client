import * as actionTypes from "./addOtherUsersProblem-types";

export function setOtherUsersProblem(problem) {
  return {
    type: actionTypes.SET_OTHER_USERS_PROBLEM,
    payload: {
      problem: problem,
    },
  };
}

export function setOtherUsersProblemVisibility(visibility) {

  return {
    type: actionTypes.SET_OTHER_USERS_PROBLEM_VISIBILITY,
    payload: {
      visibility: visibility,
    },
  };
}


export function addOtherUsersProblemReload() {
  return {
    type: actionTypes.ADD_OTHER_USERS_PROBLEM_RELOAD,
    
  };
}

export function setCurrentUser(user){
  return{
    type:actionTypes.SET_USER,
    payload:{
      user:user
    }
  }
}

export function setOtherUser(otherUser){
  return{
    type:actionTypes.SET_OTHER_USER,
    payload:{
      otherUser:otherUser
    }
  }
}