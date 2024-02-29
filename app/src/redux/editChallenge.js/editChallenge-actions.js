import * as actionTypes from "./editChallenge-types";

export function setChallenge(challenge) {
  return {
    type: actionTypes.SET_CHALLENGE,
    payload: {
     challenge:challenge
    },
  };
}

export function setEditChallengeVisibility(visibility) {
  console.log("changing edit challenge visibility:"+visibility)
  return {
    type: actionTypes.SET_EDIT_CHALLENGE_VISIBILITY,
    payload: {
      visibility: visibility,
    },
  };
}


