import React from 'react'
import {useEffect,useState} from "react"
import * as bootstrap from "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { getDatasetAtEvent } from 'react-chartjs-2';
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

function ChallengePopOver({event,visible}) {
    const[show,setShow]=useState(false)
    const[type,setType]=useState()
    const [customClass,setCustomClass]=useState()
    const[isLoading,setIsLoading]=useState(true)
    const[content,setContent]=useState()
    const[title,setTitle]=useState()
    useEffect(()=>{
        const prom=new Promise((resolve,reject)=>{

            const challengeTitle=event.event.extendedProps.challengeTitle

        if(event.event.extendedProps.challenge!=null){
        const cha=event.event.extendedProps.challenge
        //console.log(cha)
        const type=event.event.extendedProps.type
        const ev=event.event.extendedProps.titles
    
       // console.log("\n\n")
   
        if(type=="challenge"){
          const ev=event.event.extendedProps.titles
            setCustomClass("popoverStyle")
            setTitle("Challenge:"+challengeTitle)
            setContent(`<div  class="flex-col bg-gray-300 rounded-md p-3">
            <p class="font-bold">${new Date(cha.startDate).toString().substring(0,15)}-${new Date(cha.endDate).toString().substring(0,15)}</p>
  
            <p class="font-bold">Status:${cha.success==false? "<span class=' text-green-500'>Success</span>":"<span class=' text-red-500'>Failed</span>"}</p>
            </div>`)
            setTimeout(()=>{
                resolve()
            },100)
            
      }
    }else if(event.event.extendedProps.streak){ if(type=="streak"){
       const streak=event.event.extendedProps.streak
       const no_questions=event.event.extendedProps.no_questions
        const message=event.event.extendedProps.message
        
          const cha=event.event.extendedProps
        
          const challenge=event.event.extendedProps.challenge
         // const challengeTitle=event.event.extendedProps.challengeTitle
     
          const start=new Date(cha.challenge.startDate)
          const today=new Date()
          function trigger(){console.log("hi")}
        
        if(message!=null){
            setCustomClass(`popoverStyle-${streak.streak.problems.length>=no_questions?" bg-success":" bg-danger"}`)
            setContent(`<div class="flex-col ">
            <div class="body">
                  <p class="font-bold text-white">${streak.user.firstname} ${streak.user.lastname}</p>
            </body>
            <div class="text-white">
            ${message}</div>
              <div><p class="text-white">${"last Added: "+(streak.streak.timeLastAdded!=null?  Number(new Date(streak.streak.timeLastAdded).toString().substring(16,18))>12? Number(new Date(streak.streak.timeLastAdded).toString().substring(16,18))-12 +new Date(streak.streak.timeLastAdded).toString().substring(18,24)+"PM":new Date(streak.streak.timeLastAdded).toString().substring(16,24)+" AM":"")}</div>
              </p>
              </div>
            </div>`)
            setTimeout(()=>{
                resolve()
            },100)
        
      }
      }
    }
    })
    prom.then(()=>{
        if(visible){
            setIsLoading(false)
        }
    })

    },[visible])
    if(!isLoading){
    
        return new bootstrap.Popover(event.el,{
            placement:"top",
            trigger:"hover",
           // popover:trigger(),
            title:title,
            container:'body',
            customClass:customClass,
            content:content,
            html:true
          })
    }else{
        return(<div></div>)
    }
}

export default ChallengePopOver