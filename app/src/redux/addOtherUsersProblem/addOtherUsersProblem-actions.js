import * as actionTypes from "./addOtherUsersProblem-types";

const initialState = {
  user:null,
  otherUser:null,
  problem:null,
  visibility:false,
  reload:false
};

export const addOtherUsersProblemReducer = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.SET_OTHER_USERS_PROBLEM:
          return {
            ...state,
            problem: action.payload.problem,
          };

    case actionTypes.SET_OTHER_USERS_PROBLEM_VISIBILITY: 
          return {
            ...state,
            visibility: action.payload.visibility,
          };

    case actionTypes.ADD_OTHER_USERS_PROBLEM_RELOAD:    
          return {
            ...state,
            reload: !state.reload,
          };

    case actionTypes.SET_USER:
          return {
            ...state,
            user: action.payload.user,
          };

    case actionTypes.SET_OTHER_USER:
          return {
            ...state,
            otherUser: action.payload.otherUser,
          };
        
    

    default:
      return state;
  }
};