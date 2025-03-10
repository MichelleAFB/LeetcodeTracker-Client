import * as actionTypes from "./streak-types";
import { io } from "socket.io-client";


const widths={
  "Sun":45,
  "Mon":90,
  "Tue":130,
  "Wed":190,
  "Thu":230,
  "Fri":275,
  "Sat":290
}
function getWidth(day){
  var w=widths[Object.keys(widths)[(day.getDay())]]
 
  return w
}
export function setPercent(percent) {
  var strAn=JSON.parse(sessionStorage.getItem("streakAnimation"))
if(strAn!=null){
  strAn.percent=percent
}else{
  console.log("ISSUE IN setstart")
}
sessionStorage.setItem("streakAnimation",JSON.stringify(strAn))
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
 
  return{
    type:actionTypes.UPON_LOGIN,
    payload:{
      uponLogin:obj
    }
  }
}

export function setDays(days){
  var strAn=JSON.parse(sessionStorage.getItem("streakAnimation"))

sessionStorage.setItem("streakAnimation",JSON.stringify(strAn))
  return{
    type:actionTypes.SET_DAYS,
    payload:{
      days:days
    }
  }
}
export function setStartingPoint(start){
var strAn=JSON.parse(sessionStorage.getItem("streakAnimation"))

sessionStorage.setItem("streakAnimation",JSON.stringify(strAn))
  return{
    type:actionTypes.SET_STARTING_POINT,
    payload:{
      start:start
    }
  }
}
export function setCompletedDays(days){
 
  var strAn=JSON.parse(sessionStorage.getItem("streakAnimation"))

sessionStorage.setItem("streakAnimation",JSON.stringify(strAn))
  return{
    type:actionTypes.SET_COMPLETED_DAYS,
    payload:{
      completedDays:days
    }
  }
}
export function setLastDate(date){

 
  var strAn=JSON.parse(sessionStorage.getItem("streakAnimation"))

sessionStorage.setItem("streakAnimation",JSON.stringify(strAn))
  return{
    type:actionTypes.SET_COMPLETED_DAYS,
    payload:{
      lastDate:date
    }
  }
}


