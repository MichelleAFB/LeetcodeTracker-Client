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
import { useNavigate } from 'react-router-dom';
function GroupChallenges({allChallenges,setAllGroupChallenges}) {

    const[isLoading,setIsLoading]=useState(true)
    const[challenges,setChallenges]=useState()
    const[events,setEvents]=useState()
    const navigate=useNavigate()
  const [selectedChallenge,setSelectedChallenge]=useState()
  const [useSelectedChallenge,setUseSelectedChallenge]=useState(false)
  const [allEvents,setAllEvents]=useState()
  const[challengesSelectors,setChallengeSelecters]=useState()
    function renderChallengeColor(){
     /* var letters = '0123456789ABCDEF';
      //  r = 255*((R/255.0)^ (1/1.5));
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    */
      function random_rgb() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgb(' + o(r()*s*.5) + ',' + o(r()*s*.5) + ',' + o(r()*s*.5) + ')';
    }
    return random_rgb()
    }
    function showChallenge(cha){
      console.log("SETTING SELECTION CHALLENGE",cha.event.extendedProps.challenge.challengeId)
      setIsLoading(true)
      if(useSelectedChallenge){
        setEvents(allEvents)
        setUseSelectedChallenge(false)
       setTimeout(()=>{
        setIsLoading(false)
       },200)
      }else{
        setSelectedChallenge(cha.event.extendedProps.challenge.challengeId)
        const newEvents=events.filter((e)=>{
        
          if(cha.event.extendedProps.challenge.challengeId==e.challengeId  ){
           
            return e
          }
         
        })
        setTimeout(()=>{
          console.log("newEvents:",newEvents.length,newEvents)
          setEvents(newEvents)
          setTimeout(()=>{
            setUseSelectedChallenge(true)
            setTimeout(()=>{
              setIsLoading(false)
             },200)
          },200)
        },500)
      }
    }
    useEffect(()=>{
      if(allChallenges==null){
        const arr=[]
        var cha=[]
        var challengeArr=[]
        const us=JSON.parse(sessionStorage.getItem("user"))
        const groupCha=[]
        const ourUser=JSON.parse(sessionStorage.getItem("user"))
        const allCha=[]
        const challengeButtons=[]
        const prom=new Promise((resolve,reject)=>{
          axios.get("http://localhost:3022/group-challenges-2-2/"+ourUser.userId).then(async(response1)=>{
          var i=0
          console.log(response1)
          response1.data.challenges.map((gg)=>{
            const color=renderChallengeColor()
            const g=gg.challenge
            const title=g.title
            console.log(g)
            if(!allCha.includes(g.challengeId)){
              allCha.push(g.challengeId)
            const allDays=[]
            const allUsers=[]
              challengeButtons.push({
                text:g.title,
                click:function(g,setUseSelectedChallenge,setSelectedChallenge){
                  if(useSelectedChallenge){
                    setUseSelectedChallenge(false)
                  }else{
                    setSelectedChallenge(gg)
                    setTimeout(()=>{
                      setUseSelectedChallenge(true)
                    },200)
                  }
                }
              })
              function showChallenge(cha){
                console.log("SETTING SELECTION CHALLENGE")
                if(useSelectedChallenge){
                  setUseSelectedChallenge(false)
                }else{
                  setSelectedChallenge(cha)
                  setTimeout(()=>{
                    setUseSelectedChallenge(true)
                  },200)
                }
              }
            groupCha.push({
              id: g._id,
              challengeId:g.challengeId,
              title:  g.title +" ( "+g.no_questions+" problems per day)",
              start: new Date(g.startDate),
              end: new Date(g.endDate),
              allDay: true,
              challenge:g,
              
              editable: false,
              clickable: true,
              overlap: true,
              current:g.current,
              color: color,
  
              extendedProps: {
                description: g.title +" ( "+g.no_questions+" problems per day)",
                type:"challenge",
                challenge:g
              }
            })
            gg.streaks.map((c)=>{
              var start=new Date()
              var message="<ul class='list-disc'>"
              c.streak.problems.map((p)=>{
                message=message+"<li><p class='font-bold'>"+p.title+"</p></li>"
              })
              message=message+"</ul>"
            
        
              groupCha.push({
                id: c.day,
                challengeId:g.challengeId,
                title:  c.user.username +" ( "+c.streak.problems.length+" problems)",
                start: new Date(c.date),
                end: new Date(c.date),
                allDay: true,
                challenge:c,
                editable: false,
                clickable: true,
                overlap: true,
                current:c.current,
                color: color/*"319E2E":"D4160F"*/,
  
        
                extendedProps: {
                  description:c.user.username +"("+c.streak.problems.length+" problems)",
                  type:"streak",
                  streak:c,
                  message:message,
                  no_questions:g.no_questions,
                  challengeTitle:gg.challenge.title
                }
              })

         
             
            
            
  
            })
          }
            i++
            if(i>=response1.data.challenges.length){
              resolve()
            }
          })
        })
        })

        prom.then(()=>{
            //setIsLoading(false)
        
            const prom=new Promise((resolve,reject)=>{
                var i=0
                console.log(challenges)
                if(groupCha.length>0){
                  setChallengeSelecters(challengeButtons)
                  setEvents(groupCha)
                  setAllEvents(groupCha)
            }
            setTimeout(()=>{
              resolve()
            },300)

            })

            prom.then(()=>{
                const prom=new Promise((resolve,reject)=>{
                
                    setTimeout(()=>{
                        resolve()
                    },100)
                })
             
                prom.then(()=>{
                    setTimeout(()=>{
                        setIsLoading(false)
                    },100)
                })
            })
      
        
        })
      }else{
       setEvents(allChallenges)
       setAllEvents(allChallenges)
        setTimeout(()=>{
          setIsLoading(false)
        },400)
      }
    },[])
/*


*/

if(!isLoading){
 // console.log(events)

 if(events.length>0){
    setAllGroupChallenges(allEvents)
    return (
      
                  <FullCalendar
               plugins={[dayGridPlugin]}
              eventClick={(ev)=>showChallenge(ev)}
               handleMouseEnter={()=>{
                console.log("hello")
               }}
               events={events}
    
               customButtons={challengesSelectors}
               eventDidMount={(event)=>{
               // console.log(event.event.extendedProps)
                const cha=event.event.extendedProps.challenge
                //console.log(cha)
                const type=event.event.extendedProps.type
                const ev=event.event.extendedProps.titles
            
               // console.log("\n\n")
           
                if(type=="challenge"){
                  const ev=event.event.extendedProps.titles
           
                  try{
                return new bootstrap.Popover(event.el,{
                  placement:"top",
                  trigger:"hover",
                  click:showChallenge(cha),
                  customClass:"popoverStyle",
                  content:`<div class="flex-col bg-gray-300 rounded-md p-3">
                  <p class="font-bold">${new Date(cha.startDate).toString().substring(0,15)}-${new Date(cha.endDate).toString().substring(0,15)}</p>

                  <p class="font-bold">Status:${cha.success==false? "<span class=' text-green-500'>Success</span>":"<span class=' text-red-500'>Failed</span>"}</p>
                  </div>`,
                  html:true
                })
              }catch(err){
                console.log(err)
              }
              }else if(type=="streak"){
               const streak=event.event.extendedProps.streak
               const no_questions=event.event.extendedProps.no_questions
                const message=event.event.extendedProps.message
                
                  const cha=event.event.extendedProps
                
                  const challenge=event.event.extendedProps.challenge
                  const challengeTitle=event.event.extendedProps.challengeTitle
             
                  const start=new Date(cha.challenge.startDate)
                  const today=new Date()
                  function trigger(){console.log("hi")}
                
                if(message!=null){
                  return new bootstrap.Popover(event.el,{
                  placement:"top",
                  trigger:"hover",
                 // popover:trigger(),
                  title:"Challenge:"+challengeTitle,
                  container:'body',
                  customClass:`popoverStyle-${streak.streak.problems.length>=no_questions?" bg-success":" bg-danger"}`,
                  content:`<div class="flex-col ">
               
                  <div class="body">
                        <p class="font-bold text-white">${streak.user.firstname} ${streak.user.lastname}</p>
                  </body>
                  <div class="text-white">${message}</div>

                    </div>
                  </div>`,
                  html:true
                })
              }
              }
               }}

               
               contentHeight="300px"
               width="300px"
               aspectRatio={3}

/>
     
      )
 }else{
    return (
        <div>No GroupChallenges</div>
      )
 }
}else{
    return (
      <div class="loading-spinner"/>
      )
}
}

export default GroupChallenges