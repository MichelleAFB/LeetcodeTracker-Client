import React, { useEffect,useState } from 'react'
import * as bootstrap from "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
function GroupChallengeStreakPopOver({streak,event,challengeTitle,no_questions,message}) {
    const[show,setShow]=useState(false)
    const[pop,setPop]=useState()
    console.log(event)
    console.log(streak)
    useEffect(()=>{
        const p =new bootstrap.Popover(event.el,{
            placement:"top",
            trigger:"hover",
           // popover:trigger(),
            title:"Challenge:"+challengeTitle,
            container:'body',
            customClass:`popoverStyle-${streak.streak.problems.length>=no_questions?" bg-success":" bg-danger"}`,
            content:`<div class="flex-col ">
         <div class="flex w-full justify-end">
         <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ><p class="text-white">x</p></button>
         </div>
            <div class="body">
                  <p class="font-bold text-white">${streak.user.firstname} ${streak.user.lastname}</p>
            </body>
            <div class="text-white">
            ${message}</div>
              <div><p class="text-white">${"last Added: "+(streak.streak.timeLastAdded!=null?  Number(new Date(streak.streak.timeLastAdded).toString().substring(16,18))>12? Number(new Date(streak.streak.timeLastAdded).toString().substring(16,18))-12 +new Date(streak.streak.timeLastAdded).toString().substring(18,24)+"PM":new Date(streak.streak.timeLastAdded).toString().substring(16,24)+" AM":"")}</div>
              </p>
              </div>
            </div>`,
            html:true
          })
        setPop(p).then(()=>{
            setShow(true)
        })
    },[])
    if(show){
        <div>{pop}</div>
    }else{
        return(<div>{pop}</div>)
    }
}

export default GroupChallengeStreakPopOver