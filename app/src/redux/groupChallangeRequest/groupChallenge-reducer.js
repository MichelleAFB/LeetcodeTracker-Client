import * as actionTypes from "./groupChallenge-types";

const initialState = {
 challenge:null,
 visibility:false,
 reload:false
};

export const groupChallengeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CHALLENGE_REQUEST:
      console.log("REDUX:SETTING EDIT PROBLEM");
      return {
        ...state,
        challenge: action.payload.problem,
      };

    case actionTypes.SET_CHALLENGE_REQUEST_MODAL_VISIBILITY:
      console.log("REDUX:SETTING EDIT PROBLEM");
      
      return {
        ...state,
        visibility: action.payload.visibility,
      };
      case actionTypes.SET_CHALLENGE_REQUEST_RELOAD:
        console.log("ADD LEETCODE RELOAD");
        
        return {
          ...state,
          reload: !state.reload,
        };
    

    default:
      return state;
  }
};