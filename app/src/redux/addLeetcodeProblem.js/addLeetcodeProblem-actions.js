import * as actionTypes from "./addLeetcodeProblem-types";

const initialState = {
 problem:null,
 visibility:false
};

export const leetcodeProblemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_LEETCODE_PROBLEM:
      console.log("REDUX:SETTING EDIT PROBLEM");
      return {
        ...state,
        problem: action.payload.problem,
      };

    case actionTypes.SET_LEETCODE_PROBLEM_VISIBILITY:
      console.log("REDUX:SETTING EDIT PROBLEM");
      
      return {
        ...state,
        visibility: action.payload.visibility,
      };
    

    default:
      return state;
  }
};