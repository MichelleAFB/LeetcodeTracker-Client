import * as actionTypes from "./editUser-types";

const initialState = {
 user:null,
 visibility:false
};

export const editUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      console.log("REDUX:SETTING EDIT user");
      return {
        ...state,
        user: action.payload.user,
      };

    case actionTypes.SET_HEADER_VISIBILITY:
      console.log("REDUX:SETTING EDIT user",action.payload);
      
      return {
        ...state,
        visibility: action.payload.visibility,
      };
    

    default:
      return state;
  }
};
