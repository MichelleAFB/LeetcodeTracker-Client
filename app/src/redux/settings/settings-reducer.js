import * as actionTypes from "./settings-types";

const initialState = {
 visibility:false,
 type:null,
 content:null,
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SETTINGS_VISIBILITY:
      console.log("REDUX:SETTING EDIT PROBLEM");
      return {
        ...state,
        visibility:action.payload.visibility,
      };

    case actionTypes.SET_SETTINGS_TYPE:
      
      return {
        ...state,
        type: action.payload.type,
      };

      case actionTypes.SET_SETTINGS_CONTENT:
      console.log("content for settings modal",action.payload.content)
      return {
        ...state,
        content: action.payload.content,
      };
    

    default:
      return state;
  }
};