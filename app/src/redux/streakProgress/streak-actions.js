import * as actionTypes from "./streak-types";
import { io } from "socket.io-client";
export function setPercent(percent) {
 return{
  type:actionTypes.SET_PERCENT,
  payload:{
    percent:percent,
    //streaksObject:percent.streaksObject
  }
 
 }
}
export function fireOff(){

  return{
    type:actionTypes.FIRE_OFF,
   
  }
}
export function uponLogin(obj){
  console.log("\n\nSTREAKSSS ACTIONM PROGRESS")
  console.log(obj)
  return{
    type:actionTypes.UPON_LOGIN,
    payload:{
      uponLogin:obj
    }
  }
}

export function setDays(days){
  console.log("\n\nSET DAYS")
  console.log(days)
  return{
    type:actionTypes.SET_DAYS,
    payload:{
      days:days
    }
  }
}
export function setStartingPoint(start){

  return{
    type:actionTypes.SET_STARTING_POINT,
    payload:{
      start:start
    }
  }
}
export function setCompletedDays(days){
  console.log("\n\nSET DAYS")
  console.log(days)
  return{
    type:actionTypes.SET_COMPLETED_DAYS,
    payload:{
      completedDays:days
    }
  }
}



