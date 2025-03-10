import { socket } from "../../socket";
import * as actionTypes from "./streak-types";
import { io } from "socket.io-client";
const initialState = {
startingPercent:null,
 percent:null,
 fireOff:false,
 streaksObject:null,
 uponLogin:null,
 days:null,
 completedDays:null,
 startingPoint:null,
 lastDate:null,
};

export const streakReducer = (state = initialState, action) => {

  switch (action.type) {
    case actionTypes.SET_PERCENT:
      console.log("SETTING PERCENT",action.payload);
      return {
        ...state,
       percent:action.payload.percent,
       //streaksObject:action.payload.streakObject
      };
    
      case actionTypes.FIRE_OFF:
      return {
        ...state,
    
       fireOff:!state.fireOff
      };
      case actionTypes.UPON_LOGIN:
      
        return{
          ...state,
          uponLogin:action.payload.uponLogin,
          streaksObject:action.payload.uponLogin,
          fireOff:!state.fireOff,
          startingPercent:action.payload.percent
        }
        case actionTypes.SET_STARTING_POINT:
          
          return{
            ...state,
            startingPoint:action.payload.start
          }
        case actionTypes.SET_DAYS:
        
          return{
            ...state,
          days:action.payload.days
          }
          case actionTypes.SET_COMPLETED_DAYS:
         
          return{
            ...state,
          completedDays:action.payload.completedDays
          }
          case actionTypes.SET_LASTDATE:
        
          return{
            ...state,
            lastDate:action.payload.lastDate
          }
   

    

    default:
      return state;
  }
};