import * as actionTypes from "./groupChallenge-types";

export function setChallengeRequest(challenge) {
  console.log("SETTING CHALLENGE")
  return {
    type: actionTypes.SET_CHALLENGE_REQUEST,
    payload: {
     challenge:challenge
    },
  };
}

export function setChallengeRequestModalVisibility(visibility) {
  console.log("changing edit modal visibility:"+visibility)
  return {
    type: actionTypes.SET_CHALLENGE_REQUEST_MODAL_VISIBILITY,
    payload: {
      visibility: visibility,
    },
  };
}

export function setChallengeRequesDiabled(disabled) {
  return {
    type: actionTypes.SET_CHALLENGE_REQUEST_DISABLED,
    payload: {
      diabled:disabled
    },
  };
}


export function addChallengeRequestReload() {
  return {
    type: actionTypes.SET_CHALLENGE_REQUEST_RELOAD,
    
  };
}