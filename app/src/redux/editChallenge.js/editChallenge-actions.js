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
 
  return {
    type: actionTypes.SET_EDIT_CHALLENGE_VISIBILITY,
    payload: {
      visibility: visibility,
    },
  };
}
export function refreshChallengeChart() {
  
  return {
    type: actionTypes.REFRESH_CHALLENGE_CHART
    
  };
}



