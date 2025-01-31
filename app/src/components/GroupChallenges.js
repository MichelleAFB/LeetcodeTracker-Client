import axios from 'axios'
import React from 'react'
import {useState,useEffect,useRef} from 'react'
import FullCalendar from "@fullcalendar/react";
//import interactionPlugin from "@fullcalendar/core/"
import dayGridPlugin from "@fullcalendar/daygrid";
import * as bootstrap from "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from 'react';
import {
  Container,
  Popover,
  OverlayTrigger,
  Button,
  Row,
  Col
} from "react-bootstrap";
import { getDatasetAtEvent } from 'react-chartjs-2';
//import {  Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { useNavigate } from 'react-router-dom';
import Overlay from 'react-bootstrap';
import ChallengePopOver from './ChallengePopOver';
import GroupChallengeStreakPopOver from './GroupChallengeSteakPopOver';
import { useDispatch, useSelector } from 'react-redux';
import { setGroupChallenges } from '../redux/socket/socket-actions';
import GroupChallengeList from './GroupChallengeList';
function GroupChallenges({groupChallengeView,setGroupChallengeView,allChallenges,setAllGroupChallenges}) {
/*
http://localhost:3022/update-group-challenge-data/17462:
  repairs group challenge data object


*/
    const[isLoading,setIsLoading]=useState(true)
    const[challenges,setChallenges]=useState()
    const[events,setEvents]=useState()
    const navigate=useNavigate()
  const [selectedChallenge,setSelectedChallenge]=useState()
  const [useSelectedChallenge,setUseSelectedChallenge]=useState(false)
  const [allEvents,setAllEvents]=useState()
  const[challengesSelectors,setChallengeSelecters]=useState()
  const[showModal,setShowModal]=useState(false)
  const[finalevents,setFinalEvents]=useState()
  const[challengeList,setChallengeList]=useState()
  const dispatch=useDispatch()
  const finalEvents=useMemo((allEvents)=>{
    console.log("in memo:",allEvents)
    setFinalEvents(allEvents)
  },[allEvents])
    function renderChallengeColor(){
 
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
        setGroupChallengeView(null)
       setTimeout(()=>{
        setIsLoading(false)
       },200)
      }else{
        console.log("setting group challenge view",cha)
        setSelectedChallenge(cha.event.extendedProps.challenge.challengeId)
        setGroupChallengeView(cha.event.extendedProps.challenge)
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
    const reduxGc=useSelector((state)=>
      state.socket.groupChallenges
    )
    
    useEffect(()=>{
      if(reduxGc==null){
      if(allChallenges==null){
        const arr=[]
        var cha=[]
        var challengeArr=[]
        const us=JSON.parse(sessionStorage.getItem("user"))
        const groupCha=[]
        const ourUser=JSON.parse(sessionStorage.getItem("user"))
        const allCha=[]
        const allChaAndAllDay=[]
        const colors=[]
        const allDays=[]
        const streakTimes=[]
        const streakUsers=[]
        const allUsers=[]
        const challengeButtons=[]
        const checkGroupChallenges=JSON.parse(sessionStorage.getItem("groupChallengeData"))
        const prom=new Promise((resolve,reject)=>{
         
          axios.get("http://localhost:3022/get-group-challenge-data/"+ourUser.userId).then(async(response1)=>{
          var i=0
          console.log(response1)
          const data=response1.data
          data.lastFetched=new Date()
          //sessionStorage.setItem("groupChallengesData",JSON.stringify(data))
          function getString(g){
            return g.challenge.challengeId
          }
          setChallengeList(response1.data.challenges)
          var chaId=0
          var i=0
          while(i<response1.data.challenges.length){
            const gg=response1.data.challenges[i]
            const g=gg.challenge
            g.problemCounter=gg.problemCounter
            var color=allCha.includes(g.challengeId)? colors[g.challengeId]:renderChallengeColor()
         
            const title=g.title
           
            if(!allCha.includes(g.challengeId)){
              allCha.push(g.challengeId)
              const cId=g.challegeId
              colors [g.challengeId]=color
            const allDays=[]
            const allUsers=[]
            const streakTimes=[]
              challengeButtons.push({
                text:g.title,
                click:function(g,gg,setUseSelectedChallenge,setSelectedChallenge){
                  console.log(gg.problemCounter)
                  if(useSelectedChallenge){
                    setUseSelectedChallenge(false)
                  }else{
                    setSelectedChallenge({challenge:g,problemCounter:gg.problemCounter})
                    setTimeout(()=>{
                      setUseSelectedChallenge(true)
                    },200)
                  }
                }
              })
              function showChallenge(cha){
                //console.log("SETTING SELECTION CHALLENGE")
                if(useSelectedChallenge){
                  setUseSelectedChallenge(false)
                }else{
                  setSelectedChallenge(g)
                  setTimeout(()=>{
                    setUseSelectedChallenge(true)
                  },200)
                }
              }
              var lastDay=new Date(g.endDate)
              lastDay.setDate(new Date(g.endDate).getDate()+1)
              console.log(g)
            groupCha.push({
              id: g._id,
              challengeId:g.challengeId,
              title:  g.title +" ( "+g.no_questions+" problems per day)",
              start: new Date(g.startDate),
              end: lastDay,
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
                challenge:g,
                problemCounter:gg.problemCounter
              }
            })
      
          }
          if(gg.streaks!=null){
            if(gg.streaks.length>0){
              var ii=0
              
          if(allUsers.includes(gg.streaks[0].streak.userId) && allDays.includes(gg.streaks[0].streak.day ) && allChaAndAllDay.includes(gg.challengeId+gg.streaks[0].streak.day)){

          }else{
            allChaAndAllDay.push(gg.challengeId+gg.streaks[0].streak.day)
           // allUsers.push(gg.streaks[0].streak.userId)
            try{
            allDays.push(gg.streaks[0].streak.day)
            }catch(err){
              
            }
            while(ii<gg.streaks.length){
             var c=gg.streaks[ii]
            allUsers.push(c.streak.userId)
              allDays.push(c.streak.day)
              allUsers.push(c.streak.userId)
            var start=new Date()
            var message="<ul class='list-disc'>"
            c.streak.problems.map((p)=>{
              message=message+"<li><p class='font-bold'>"+p.title+"</p></li>"
            })
            message=message+"</ul>"
        
            if(!streakTimes.includes(c.streak.timeLastAdded)){
              streakTimes.push(c.streak.timeLastAdded)
            groupCha.push({
              id: c.day,
              challengeId:g.challengeId,
              title:  c.user.username +" ( "+c.streak.problems.length+" problems)",
              start: new Date(c.date),
              end:new Date(c.date) ,
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
            ii++
            if(ii>=gg.streaks.length){
              console.log(g.title, " i",i +" ii"+gg.streaks.length)
              i++
              
                if(i>=response1.data.challenges.length){
              setTimeout(()=>{
                resolve()
              },200)
              
            }             
            }
          }else{
            ii++
            if(ii>=gg.streaks.length){
              console.log(g.title, " i",i +" ii"+gg.streaks.length)
              i++
             
             
            
                if(i>=response1.data.challenges.length){
              setTimeout(()=>{
                resolve()
              },200)
              
            }
            
            }
          }
          
            
         
             
            
            
  
            }
          }
        }
        }
           // i++
          
          
          }
        })
        })

        prom.then(()=>{
            //setIsLoading(false)
        
            const prom=new Promise((resolve,reject)=>{
                var i=0
                
                if(groupCha.length>0){
                  setChallengeSelecters(challengeButtons)
                  setEvents(groupCha)
                  setAllEvents(groupCha)
                  if(reduxGc==null){
                  dispatch(setGroupChallenges(groupCha))
                  }
            }
            setTimeout(()=>{
              resolve()
            },200)

            })

            prom.then(()=>{
                const prom=new Promise((resolve,reject)=>{
                
                    setTimeout(()=>{
                        resolve()
                    },400)
                })
             
                prom.then(()=>{
                    setTimeout(()=>{
                        setIsLoading(false)
                    },100)
                })
            })
      
        
        })
    }else{
      const prom=new Promise((resolve,reject)=>{
        setAllEvents(reduxGc)
        setAllGroupChallenges(reduxGc)
        setTimeout(()=>{
          resolve()
        },300)
      })
      prom.then(()=>{
        setIsLoading(false)
      })
    }}/*else if(events==null && allChallenges!=null){
        const prom=new Promise((resolve,reject)=>{
          setEvents(allChallenges)
         
          setAllEvents(allChallenges)
          setTimeout(()=>{
            resolve()
          },300)
        })
        prom.then(()=>{
          setIsLoading(false)
        })
      }*/
     
    },[])
/*


*/
const ref=useRef(null)
function remove(e){

 }
 var noChange=0
if(!isLoading){

if(events!=null){
 if(events.length>0){

    setAllGroupChallenges(allEvents)
    
    const days=[]
    const users=[]
    console.log("noChange",noChange)  
    noChange++
    return (
      <div class="w-full flex-col">
            <button class="bg-purple-600" onClick={()=>{
              
                setUseSelectedChallenge(!useSelectedChallenge)
              
            }}>
              <p class="text-white">
              Reset
              </p></button>
                  <FullCalendar
               plugins={[dayGridPlugin]}
               eventClick={(ev)=>showChallenge(ev)}
             
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
                 
                
               
                    console.log("popover element:",new bootstrap.Popover())
                return new bootstrap.Popover(event.el,{
                  placement:"top",
                  trigger:"hover",
                  //hover:setShowModal(!showModal),
               
                  show:false,
                  customClass:"popoverStyle",
                  title:cha.title+" ("+cha.challengeId+")",
                  content:`<div  class="flex-col bg-gray-300 rounded-md p-3 hover:bg-yellow-400">
                  <div class="flex w-full justify-end">
                  <Button
                     type="button"
                     class="btn-close"
                     data-bs-dismiss="modal"
                     aria-label="Close"
                   ><p class="text-white">x</p></Button>
                  </div>
                  <p class="font-bold">${cha.title} (${cha.no_questions} Questions)</p>
                   <p class="font-bold">$ (${cha.passes} Passes)</p>

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
                  function trigger(){console.log("hi")}
              
                try{
                if(message!=null){
                  return (new bootstrap.Popover(event.el,{
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
                      <div><p class="text-white">${"last Added: "+(streak.streak.timeLastAdded!=null?  Number(new Date(streak.streak.timeLastAdded).toString().substring(16,18))>12? Number(new Date(streak.streak.timeLastAdded).toString().substring(16,18))-12 +new Date(streak.streak.timeLastAdded).toString().substring(18,24)+"PM":new Date(streak.streak.timeLastAdded).toString().substring(16,24)+" AM":"")+ streak.streak.day}</div>
                      </p>
                      </div>
                    </div>`,
                    html:true
                  })
                  )
                }
              }catch(err){
                console.log(err)
              }
              }
            
               }}

               
               contentHeight="350px"
               width="350px"
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
  return(<div></div>)
}
}else{
    return (
      <div class="loading-spinner"/>
      )
}
}

export default GroupChallenges