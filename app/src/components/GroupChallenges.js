import axios from 'axios'
import React from 'react'
import {useState,useEffect} from 'react'
import FullCalendar from "@fullcalendar/react";
//import interactionPlugin from "@fullcalendar/core/"
import dayGridPlugin from "@fullcalendar/daygrid";
import * as bootstrap from "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { getDatasetAtEvent } from 'react-chartjs-2';
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
function GroupChallenges() {

    const[isLoading,setIsLoading]=useState(true)
    const[challenges,setChallenges]=useState()
    const[events,setEvents]=useState()

    useEffect(()=>{
        const arr=[]
        var challengeArr=[]
        const us=JSON.parse(sessionStorage.getItem("user"))
        const prom=new Promise((resolve,reject)=>{
            axios.post("http://localhost:3022/sort-group-challenges/"+us.userId).then((response)=>{
                console.log("ALLL:",response.data.challenges)
                if(response.data.challenges.length>0){
                    var i=0
                    setChallenges(response.data.challenges)
                    response.data.challenges.map((c)=>{
                        console.log(c)
                        arr.push({
                            id: c.challenge.challengeId,
                            challenge:c.challenge,
                            title:  c.challenge.title,
                             
                            start: new Date(c.challenge.startDate),
                            end: new Date(c.challenge.endDate),
                            allDay: true,
                            type:"challenge",
                            editable: false,
                            clickable: true,
                            overlap: true,
                            color:  !c.hasFailures?"#009900":"#FF0000",
                            dayMaxEventRows:true,
                            extendedProps: {
                              description:c.challenge.title,
                              challenge:c.challenge
                            }
                        })
                        c.streaks.map((s)=>{
                            var message="<ul class=' list-disc '>"
                            s.streak.problems.map((p)=>{
                              message=message+"<li><p class='font-bold'>"+p.title+"</p></li>"
                            })
                            message=message+"</ul>"
                            setTimeout(async()=>{
                                console.log(s)
                                arr.push({
                                  id: s.streak.day,
                                  challenge:c.challenge,
                                  title:  s.streak.problems.length +" problems", 
                                  start: new Date(s.day),
                                  end: new Date(s.day),
                                  allDay: true,
                                  streak:s.streak,
                                  editable: false,
                                  clickable: true,
                                  problems:s.streak.problems,
                                  titles: message,
                                  overlap: true,
                                  color:  s.streak.problems.length>=c.challenge.no_questions?"#009900":"#FF0000",
                                  dayMaxEventRows:true,
                                  extendedProps: {
                                    description:s.streak.problems.length,
                                  }
                                })
                                console.log({
                                    id: s.streak._id,
                                    challenge:c.challenge,
                                    title:  s.streak.username+" ("+s.streak.firstname+" "+ s.streak.lastname+") | "+s.streak.problems.length +" problems", 
                                    start: new Date(s.day),
                                    end: new Date(s.day),
                                    allDay: true,
                                    editable: false,
                                    clickable: true,
                                    problems:s.streak.problems,
                                    titles: message,
                                    overlap: true,
                                    color:  s.streak.problems.length>=c.challenge.no_questions?"#009900":"#FF0000",
                                    dayMaxEventRows:true,
                                  })
                              },20)
                        })
                       i++
                       if(i>=response.data.challenges.length){
                        setTimeout(()=>{
                            resolve()
                        },100)
                    }
                    })
                 
                } 
            })
        })

        prom.then(()=>{
            //setIsLoading(false)
            setEvents(arr)
            setTimeout(()=>{
                setIsLoading(false)
            },100)
        
        })
    },[])
/*


*/

if(!isLoading){
 if(events.length>0){
    
    return (
        <div class="flex w-full">
                   <FullCalendar
                       plugins={[dayGridPlugin]}
                       handleMouseEnter={()=>{
                        console.log("hello")
                       }}
                       events={events}
                       onClick={(e)=>{
                        console.log(e.target.value)
                       }}
                       eventDidMount={(event)=>{
                        try{
                        console.log(event)
                       // console.log(event.event.extendedProps)
                        const cha=event.event.extendedProps.challenge
                        //console.log(cha)
                        const ev=event.event.extendedProps.titles
                       // console.log(event.event.extendedProps)
                       // console.log("\n\n")

                        if(ev!=null){
                          console.log(ev)
                        return new bootstrap.Popover(event.el,{
                          placement:"top",
                          trigger:"hover",
                          customClass:"popoverStyle",
                          content:`<div class="flex-col bg-gray-300 rounded-md p-3">
                          ${ev}
                          </div>`,
                          html:true
                        })
                      }else if(event.event.extendedProps.challenge!=null){
                        var challenge=event.event.extendedProps.challenge
                        return new bootstrap.Popover(event.el,{
                            placement:"top",
                            trigger:"hover",
                            customClass:"popoverStyle",
                            content:`<div class="flex-col bg-gray-300 rounded-md p-3">
                                <p><span class="font-bold" >no questions: ${challenge.title}</p>
                                <p><span class="font-bold" >passes: ${challenge.initialPasses}</p>

                                </div>`,
                            html:true
                          })
                      }
                      else{
                        
                        const popoverRight = (
                          <Popover id="popover-positioned-scrolling-top" title="Popover right">
                            <strong>Holy guacamole!</strong> Check this info.
                            <button class="btn btn-danger" onClick={()=>{console.log("hi")}}>
                              Hi
                            </button>
                          </Popover>
                        );
                 
                         // console.log(Object.keys(event.event.extendedProps))
                          const cha=event.event.extendedProps
                          console.log(cha)
                          const start=new Date(cha.challenge.startDate)
                          const today=new Date()
                          //console.log(event)
                         /* console.log(new bootstrap.Popover(event.el,{
                            trigger:"click",
                            container:"body"
                          }))*/
                          function trigger(){console.log("hi")}
                          //console.log(cha)
                       return new bootstrap.Popover(event.el,{
                          placement:"top",
                          trigger:"hover",
                          popover:trigger(),
                          title:"Challenge Stats",
                          container:'body',
                                  customClass:"popoverStyle",
                          content:`<div class="flex-col"><p class="font-bold">Success:<span class="font-normal">${cha.challenge.success}</span></p>
                          <p class="font-bold">initial # of passes:<span class="font-normal"> ${cha.passes}</span></p>
                          <p class="font-bold">remaining passes:<span class="font-normal"> ${cha.challenge.usedPasses}</span></p>
                          <div class="body">
                            <input tabindex="0" class="btn btn-danger" onclick="trigger()">
                            <p class="text-white">Delete</p></input>
                          </body>

                            </div>
                          </div>`,
                          html:true
                        })
                      }
                    }catch(err){
                        console.log(err)
                    }
                       }}

                       
                       contentHeight="300px"
                       aspectRatio={2}
    
    
  />
        </div>
      )
 }else{
    return (
        <div>No GroupChallenges</div>
      )
 }
}else{
    return (
        <div>No GroupChallenges</div>
      )
}
}

export default GroupChallenges