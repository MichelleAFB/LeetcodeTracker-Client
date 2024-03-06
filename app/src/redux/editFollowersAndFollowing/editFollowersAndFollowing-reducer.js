import * as actionTypes from "./editFollowersAndFollowing-types";

const initialState = {
  user:null,
  setFollowers:false,
  setFollowing:false,
  ffCount:null,
  ffVisibility:false
};

export const editFollowersAndFollowingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_EDIT_FF_USER:
    
      return {
        ...state,
        user: action.payload.user,
      };

    case actionTypes.SET_FF_FOLLOWERS:
      console.log(action.payload)
      return {
        ...state,
        setFollowers: action.payload.value,
       
      };

      case actionTypes.SET_FF_FOLLOWING:
        console.log(action.payload)
      return {
        ...state,
        setFollowing:action.payload.value,
      };

      case actionTypes.SET_FF_COUNT:
        return {
          ...state,
         ffCount:action.payload.ffCount
        };

     case actionTypes.SET_FF_VISIBILITY:
        return {
          ...state,
         ffVisibility:action.payload.value
        };

    default:
      return state;
  }
};
