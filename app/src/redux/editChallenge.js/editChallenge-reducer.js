import * as actionTypes from "./editChallenge-types";

const initialState = {
 challenge:null,
 visibility:false,
 refresh:false
};

export const editChallengeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CHALLENGE:
      console.log("REDUX:SETTING EDIT PROBLEM");
      return {
        ...state,
        challenge: action.payload.challenge,
      };

    case actionTypes.SET_EDIT_CHALLENGE_VISIBILITY:
      console.log("REDUX:SETTING EDIT PROBLEM");
      
      return {
        ...state,
        visibility: action.payload.visibility,
      };
      case actionTypes.REFRESH_CHALLENGE_CHART:
      console.log("REDUX:SETTING EDIT PROBLEM");
      
      return {
        ...state,
        refresh: !state.refresh,
      };
    

    default:
      return state;
  }
};
