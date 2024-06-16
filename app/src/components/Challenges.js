import React from 'react'
import {useState,useEffect} from 'react'
import { db} from '../firebase/firebase'

import { collection,getDocs,doc, updateDoc ,getDoc} from 'firebase/firestore' 
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { setDoc } from 'firebase/firestore';
import IonIcon from '@reacticons/ionicons';
import FullCalendar from "@fullcalendar/react";
//import interactionPlugin from "@fullcalendar/core/"
import dayGridPlugin from "@fullcalendar/daygrid";
import * as bootstrap from "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import { getDatasetAtEvent } from 'react-chartjs-2';
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import DeleteChallengeComponent from './DeleteChallengeComponent';
import { createDispatchHook, useDispatch } from 'react-redux';
import { setEditChallengeVisibility,setChallenge, refreshChallengeChart } from '../redux/editChallenge.js/editChallenge-actions';
import { connect } from 'react-redux';
import ChallengesSelectedContestants from './ChallengesSelectedContestants';
import GroupChallenges from './GroupChallenges';
import GroupChallengeViewer from './GroupChallengeViewer';
function Challenges({refresh}) {

  const usersCollectionRef=collection(db,"users")
  //const data=await getDocs(usersCollectionRef)

  const[isLoading,setIsLoading]=useState()
  const[show,setShow]=useState(false)
  const[showDelete,setShowDelete]=useState(false)
  const[ourUser,setOurUser]=useState(JSON.parse(sessionStorage.getItem("user")))
  const [showCurrentChallenge,setShowCurrentChallenge]=useState(true)
  const[challenges,setChallenges]=useState()
  const[name,setName]=useState()
  const[currentChallenge,setCurrentChallenge]=useState()
  const[numberOfQuestions,setNumberOfQuestions]=useState(0) 
  const[passes,setPasses]=useState(0)
  const[initialPasses,setInitialPasses]=useState(passes)
  const[startDate,setStartDate]=useState(new Date())
  const [endDate,setEndDate]=useState(new Date()) 
  const[startDateGroup,setStartDateGroup]=useState(new Date())
  const [endDateGroup,setEndDateGroup]=useState(new Date()) 
  const[updateChallenge,setUpdateChallenge]=useState("NOT DONE")
  const[streaks,setStreaks]=useState()
  const[isOpen,setIsOpen]=useState(false)
  const[editChallenge,setEditChallenge]=useState()
  const[showCreateGroupChallenge,setShowCreateGroupChallenge]=useState(false)
  const[createGroupChallenge,setCreateGroupChallenge]=useState({userId:ourUser.userId,failedDays:0,current:true,lastUpdated:new Date(),success:true,key:'selection',startDate:new Date(),endDate:new Date()})
  const [selectedContestants,setSelectedContestants]=useState([])
  const[contestantsChanged,setContestantsChanged]=useState(false)
  const[showGroupChallenges,setShowGroupChallenges]=useState(false)
  const[allGroupChallenges,setAllGroupChallenges]=useState()
  const[displayGroupChallenges,setDisplayGroupChallenges]=useState(false)
  const[showGroupChallengesCalender,setShowGroupChallengesCalender]=useState(false)
  const[groupChallengeView,setGroupChallengeView]=useState()
  const dispatch=useDispatch()
  const selectionRange={
    startDate:startDate,
    endDate:endDate,
    key:"selection"
  }
  const selectionGroupRange={
    startDate:startDateGroup,
    endDate:endDateGroup,
    key:"selection"
  }

  const toggle=()=>{
    setIsOpen(!isOpen)
  }
  useEffect(()=>{
    const arr=[]
   // const streaks=[]
    var ourStreaks
    const newStreaks=[]
    var cha
    const chall=[]
    var groupCha=[]
   
    const prom=new Promise(async(resolve,reject)=>{

        //setChallenges(response.data.challenges)

        axios.get("http://localhost:3022/get-current-challenge-2/"+ourUser.userId).then(async(response)=>{
       

  
      const u=collection(db,"users")
      const d=await getDocs(u)
      const user=d.docs.filter((f)=>{
        if(f.data().userId==ourUser.userId){
        
          
          return f.data()
        }
      })
      
      sessionStorage.setItem("user",JSON.stringify(user[0].data()))
      
        if(response.data.currentChallenge!=null){
          setCurrentChallenge(response.data.currentChallenge)

         checkStatus2(response.data.streaks,response.data.currentChallenge,response.data.challenges)
            setCurrentChallenge(response.data.currentChallenge)
        }

        
          cha=response.data.currentChallenge
      
          
          setStreaks(response.data.streaks)
          ourStreaks=response.data.streaks
          //setChallenges(response.data.challenges)       
          response.data.challenges.map((c)=>{
            arr.push({
              id: c._id,
              title:  c.title +" ( "+c.no_questions+" questions per day)",
              start: new Date(c.startDate),
              end: new Date(c.endDate),
              allDay: true,
              challenge:c,
              editable: false,
              clickable: true,
              overlap: true,
              current:c.current,
              color: renderChallenge(c),

      
              extendedProps: {
                description:c.title +"("+c.no_questions+" questions per day)"
              }
            })
            chall.push({
              id: c._id,
              title:  c.title +" ( "+c.no_questions+" questions per day)",
              start: new Date(c.startDate),
              end: new Date(c.endDate),
              allDay: true,
              challenge:c,
              editable: false,
              clickable: true,
              overlap: true,
              current:c.current,
              color: renderChallenge(c),

      
              extendedProps: {
                description:c.title +"("+c.no_questions+" questions per day)"
              }
            })
          })
    

          setTimeout(()=>{
            setOurUser(JSON.parse(sessionStorage.getItem("user")))
            setTimeout(()=>{
              resolve()
            },500)
          },800)
         
        })
     

    })

    prom.then(()=>{

      const prom1=new Promise((resolve1,reject1)=>{
      
        if(ourStreaks!=null && ourStreaks.length>0 &&arr.length>0){
          var length=arr.length
          var i=1
          ourStreaks.map(async(s)=>{
           
            var message="<ul class=' list-disc '>"
            s.problems.map((p)=>{
              message=message+"<li><p class='font-bold'>"+p.title+"</p></li>"
            })
            message=message+"</ul>"
            setTimeout(async()=>{
              arr.push({
                id: s.streak._id,
                title:  s.problems.length +" problems", 
                start: new Date(s.day),
                end: new Date(s.day),
                allDay: true,
                editable: false,
                clickable: true,
                problems:s.problems,
                titles: message,
                overlap: true,
                color:  s.passed?"#009900":"#FF0000",
                dayMaxEventRows:true,
                extendedProps: {
                  description:s.problems.length,
                }
              })
              i++

            
              setTimeout(()=>{
                setChallenges(arr)
      
                setTimeout(()=>{
                  resolve1()
                },200)
              },800)
            

            },50)
          })
        }else  {
          console.log(chall)
          setChallenges(chall)
         
          setTimeout(()=>{
            resolve1()
          },600) 
        }
      })

      prom1.then(()=>{
        const prom=new Promise((resolve,reject)=>{

       resolve()
      })

      prom.then(()=>{
        setIsLoading(false)
      })

      })

    })

  },[refresh,selectedContestants])

  function handleSelectedContestants(p){
    setSelectedContestants(p)
  }
  function handleSelect(selection){
    console.log(selection)
    setStartDate(selection.selection.startDate)
    setEndDate(selection.selection.endDate)

  }

 

  function getDatesArray(start, end) {
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(dt.toString().substring(0,15));
    }
    return arr;
};

  function findCommonElement(array1, array2) {
  
    // Loop for array1
    for (let i = 0; i < array1.length; i++) {
  
        // Loop for array2
        for (let j = 0; j < array2.length; j++) {
  
            // Compare the element of each and
            // every element from both of the
            // arrays
            if (array1[i] === array2[j]) {
  
                // Return if common element found
                return true;
            }
        }
    }
  
    // Return if no common element exist
    return false;
}

async function checkCurrent(){
  const data=await getDocs(usersCollectionRef)
  data.docs.map((u)=>{
    if(u.id==ourUser.userId){
    
      const us=u.data()
      console.log(us)
      if(us.challenges!=null){
      const chall=us.challenges
     // console.log(chall)
     console.log(chall)
      Object.keys(chall).map((c)=>{
        try{
        
        if(chall[c]!=null){
        var start=chall[c].startDate
        var end=chall[c].endDate
       
        start=new Date(start.seconds*1000 +start.nanoseconds/1000000)
        end=new Date(end.seconds*1000 +end.nanoseconds/1000000)
       
        //en.seconds * 1000 + en.nanoseconds / 1000000
        const dates=getDatesArray(start,end)
        console.log(dates)
        const today=new Date()
        if(dates.includes(today.toString().substring(0,15))){
          setCurrentChallenge(chall[c])
        }
          }
        }catch(err){
         // console.log(err)
        }
      })
    }
    }

  })
}  function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

async function submitGroupChallenge(e){
  e.preventDefault()
  console.log(createGroupChallenge)
  console.log(selectedContestants)
  const collectionRef=collection(db,"users")
  
  const length=getDatesArray(startDateGroup,endDateGroup).length
  const d=await getDocs(collectionRef)
  const challengeId=Math.floor(randomNumber(0,60000))
  const allusers=[]
  const allUsers=d.docs.map((f)=>{
    if(selectedContestants.includes(f.data().username)){
     
     
     
      const u={challengeId:challengeId,userId:f.data().userId,success:true,passes:Number(createGroupChallenge.no_passes),initialPasses:Number(createGroupChallenge.no_passes),username:f.data().username,firstname:f.data().firstname,lastname:f.data().lastname,createdBy:ourUser.userId,approved:false,denied:false}
      
      return u
    }
  })
  console.log(allUsers.length+" before")
  var i=0
 allUsers.map(( element )=> {
    if(element!=null){
      allusers.push(element)
    }
 });
 // allusers.splice(allusers.length-1,1)


  
  d.docs.map(async(d)=>{
  
    if(d.data().userId==ourUser.userId){
      
   
      if(selectedContestants.length<1){
        alert("Please select contestants!")
      }
      if(length>1){
        alert("Please select a valid date range")
      }
      if(createGroupChallenge.name==null || Number(createGroupChallenge.no_questions)<=0 || Number(createGroupChallenge.no_passes)<=0 || length==0){
        alert("please fill out all fields")
      }
   
      if( createGroupChallenge.name!=null && Number(createGroupChallenge.no_questions)>0 && Number(createGroupChallenge.no_passes)>=0 && length>0){
        const ids=allusers.map((c)=>{
          return c.userId
        })
        setTimeout(()=>{
      
      
        const newChallenge=createGroupChallenge
        newChallenge.no_questions=Number(createGroupChallenge.no_questions)
        newChallenge.challengeId=challengeId
        newChallenge.startDate=startDateGroup
        newChallenge.usedPasses=0
        newChallenge.title=createGroupChallenge.name
        newChallenge.endDate=endDateGroup
        newChallenge.length=length
        newChallenge.passes=Number(createGroupChallenge.no_passes)
        newChallenge.initialPasses=Number(createGroupChallenge.no_passes)
        newChallenge.selectedContestants=allusers
        newChallenge.allUserIds=ids
        newChallenge.createdBy=ourUser.userId
   
       

        const  refer=doc(db,"users",d._key.path.segments[d._key.path.segments.length-1])
      
        try{
          setTimeout(async()=>{
          console.log("newChallenge",newChallenge)
        if(d.data().groupChallenges==null || d.data().groupChallenges.length==0){
         
          const updateGroup=await updateDoc(refer,{
            "groupChallenges":[newChallenge]
          })
          const  updatedRefer=await getDoc(refer)
          setTimeout(()=>{
            axios.post("http://localhost:3022/update-group-challenge-contestant/"+ourUser.userId,{createdBy:ourUser.userId,case:"CREATE_GROUP_CHALLENGE_FOR_CREATOR",user:updatedRefer.data(),challenge:newChallenge}).then((response)=>{
              console.log(response)
              if(response.data.success){
                alert("SUCCESS: sent out requests for group challenge, "+newChallenge.name)
                setCreateGroupChallenge(false)
              }
            })

          },1000)

        }else{
          const cha=d.data().groupChallenges
          cha.push(newChallenge)
          const updateGroup=await updateDoc(refer,{
            "groupChallenges":cha
          })
          const  updatedRefer=await getDoc(refer)
          setTimeout(()=>{
            axios.post("http://localhost:3022/update-group-challenge-contestant/"+ourUser.userId,{createdBy:ourUser.userId,case:"CREATE_GROUP_CHALLENGE_FOR_CREATOR",user:updatedRefer.data(),challenge:newChallenge}).then((response)=>{
              console.log(response)
              if(response.data.success){
                alert("SUCCESS: sent out requests for group challenge, "+newChallenge.name)
              }
            })

          },1000)
        

        }
      },1200)
      }catch(err){
        console.log(err)
      }
        allusers.map(async(p)=>{
          if(p!=null){
          
          const refer=doc(db,"users",p.userId)
          
          const userData=await getDoc(refer)
          console.log(userData.data())
            var n
            var an
            var gr
            const allNots=refer.notifications!=null? refer.notifications:null
            const  nots=refer.allNotifications!=null?refer.allNotifications:null
            const groupChallengeRequests=refer.groupChallengeRequests!=null?refer.groupChallengeRequests:null
            var message={time:new Date(),type:"GROUP_CHALLENGE_REQUEST",challengeId:challengeId,message:ourUser.username +"("+ourUser.firstname +" "+ourUser.lastname+") has request you to join a group challenge,"+newChallenge.title+", with "+ (allusers.length-1).toString()+" other users.",acknowledged:false}
            const newNotif=[message]
            const newAllNotifs=[message]
            const newGR=[p]

            if(allNots==null){
              an=newAllNotifs
            }else{
              allNots.push(message)
            }

            if(nots==null){
              n=newNotif
            }else{
              nots.push(message)
            }
            if(groupChallengeRequests==null){
              gr=newGR
            }else{
              groupChallengeRequests.push(message)
            }

        try{
          setTimeout(async()=>{
            const updateContestant=await updateDoc(refer,{
              hasNewNotifications:true,
              notifications:n==null?nots:n,
              allNotifications:an==null?allNots:an,
              groupChallengeRequests: gr==null?groupChallengeRequests:gr
            })
            setTimeout(async()=>{
              const updateData=await getDoc(refer)
             axios.post("http://localhost:3022/update-group-challenge-contestant/"+p.userId,{user:updateData.data(),case:"CREATE_GROUP_CHALLENGE_REQUEST"}).then((response)=>{
              console.log(response)
             })
            },500)
           
           },1000)
          

        }catch(err){
          console.log(err)
        }

        }
        })
      },2000)
      }
    }
  })

  
}

async function checkStatusForStreak(streak,challenge){
  console.log("\nCHECK STATUS For Streak:"+streak.day)
  var value=false
  const today=new Date()
  const day=new Date(streak.day)
  console.log("today:" ,today)
  console.log("day:",day)
  const prom=new Promise((resolve,reject)=>{
    if(challenge!=null){
      if(challenge.no_questions> streak.problems.length && today<day){
        console.log("FAIL: today",today.toString(),"    day:",day.toString())
        streak.pass=false
        
      }else{
        console.log("STREAK PASS")
        streak.pass=true
        value= true
      }
      }
      setTimeout(()=>{
        resolve()
      },100)

  })
  
  prom.then(()=>{
    console.log("value for streak",streak)
    return streak
  })
}
//console.log(challenge)



const checkStatus2=async(streaks,challenge,challenges)=>{
  var fail=false
 // var today=new Date()
  var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
  "Aug","Sep","Oct","Nov","Dec"];
  var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
  var changePasses=false
 
  const challengeDates=getDatesArray(new Date(challenge.startDate),new Date(challenge.endDate))
  
  var today=new Date()
  if(challenge.success && challenge.lastUpdated.toString().substring(0,15)!=today.toString().substring(0,15)){
   

    const indexToday=challengeDates.indexOf(today.toString().substring(0,15))
    const prevStreaks=streaks.filter((s)=>{
    
      if(challengeDates.indexOf(s.streak.day)<indexToday && s.challenge_id==challenge._id){
        return s
      }
    })
    var streaksLess=streaks.filter((s)=>{
      var day=new Date(s.day)
      //console.log("streak",s,"challenge",challenge)
      if(s.challenge_id==challenge._id && s.problems.length<challenge.no_questions && day<today){
          return s
      }
    })
  
    if(challenge.passes=streaksLess.length>=0){
      challenge.passes=challenge.passes-streaksLess.length
      challenge.usedPasses=streaksLess.length
      challenge.failedDays=streaksLess.length
    }else{
      challenge.passes=0;
      challenge.usedPasses=challenge.initialPasses
      challenge.failedDays=streaksLess.length
      challenge.success=false
    }

   
    if(prevStreaks.length>0){

      if((prevStreaks.length+challenge.initialPasses+1)<challengeDates.length){
        const failedStreaks=prevStreaks.filter((s)=>{
          console.log(s.streak.day," success?",s.passed)
          if(s.passed==false){
            return s
          }
        })
 
          const index=challenges.filter((c)=>{
            if(c.title==challenge.title){
              return challenges.indexOf(c)
            }
          })
        setTimeout(()=>{
          challenges[index]=challenge
          const userRef=doc(db,"users",ourUser.userId)

          
      axios.post("https://leetcodetracker.onrender.com/update-challenge/"+ourUser.userId,{challenge:challenge}).then(async(response)=>{
    
        if(response.data.success){
          const update=await updateDoc(userRef,{
          currentChallenge:challenge,
          challenges:challenges
      }) 
   
      const chall=response.data.challenge
      alert(
        chall.title+"\nprevious challenge status:\n passes"+challenge.passes+"\nused passes:"+challenge.usedPasses+"\n challenge success status:"+challenge.success+
        "\nChallenge update: "+" passes:"+ chall.passes+ "\n challenge success:"+chall.success+"\n used passes:"+chall.usedPasses)
        }
      })
        },200)


      }else{
        console.log("check Problems length for all streak")
        const failedStreaks=prevStreaks.filter((s)=>{
        
          if(s.passed==false){
            return s
          }
        })
      
        if(failedStreaks.length<challenge.initialPasses){
        
        }else{
         
          const index=challenges.filter((c)=>{
            if(c.title==challenge.title){
              return challenges.indexOf(c)
            }
          })
          if(challenge.failedDays!=failedStreaks.length){
            
            
            if(challenge.passes==0){
             
              challenge.lastUpdated=new Date()
              setTimeout(()=>{
                challenges[index]=challenge
                const userRef=doc(db,"users",ourUser.userId)

                
            axios.post("https://leetcodetracker.onrender.com/update-challenge/"+ourUser.userId,{challenge:challenge}).then(async(response)=>{
              console.log(response)
              if(response.data.success){
                const update=await updateDoc(userRef,{
                currentChallenge:challenge,
                challenges:challenges
            }) 
            console.log(update)
            const chall=response.data.challenge
            alert(
              chall.title+"\nprevious challenge status:\n passes"+challenge.passes+"\nused passes:"+challenge.usedPasses+"\n challenge success status:"+challenge.success+
              "\nChallenge update: "+" passes:"+ chall.passes+ "\n challenge success:"+chall.success+"\n used passes:"+chall.usedPasses)
              }
            })
              },200)
            }else{
              challenge.failedDays++
              challenge.usedPasses++
              challenge.passes--
              challenge.lastUpdated=new Date()

              setTimeout(()=>{
                challenges[index]=challenge
                const userRef=doc(db,"users",ourUser.userId)

                
            axios.post("https://leetcodetracker.onrender.com/update-challenge/"+ourUser.userId,{challenge:challenge}).then(async(response)=>{
              console.log(response)
              if(response.data.success){
                const update=await updateDoc(userRef,{
                currentChallenge:challenge,
                challenges:challenges
            }) 
            console.log(update)
            const chall=response.data.challenge
            alert(
              chall.title+"\nprevious challenge status:\n passes"+challenge.passes+"\nused passes:"+challenge.usedPasses+"\n challenge success status:"+challenge.success+
              "\nChallenge update: "+" passes:"+ chall.passes+ "\n challenge success:"+chall.success+"\n used passes:"+chall.usedpasses)
              }
            })
              },200)
              
            }
          }
        }
      }
    }else{
      console.log("NO STREAKS TO CHECK, CHALLENGE JUST STARTED")
    }
  }else{
    console.log("CHALLENGE NOT SUCCESS")
  }
}
function renderChallengeColor(){
  let maxVal = 0xFFFFFF; // 16777215
let randomNumber = Math.random() * maxVal; 
randomNumber = Math.floor(randomNumber);
let randColor = randomNumber.toString(16);
return randColor
}

const renderChallenge=(challenge)=>{
  var today=new Date()
  const dates=getDatesArray(new Date(challenge.startDate),new Date(challenge.endDate))
  if(challenge.success && dates.includes(today.toString().substring(0,15))){
    return "#009900"
  }
  if(!challenge.success && dates.includes(today.toString().substring(0,15))){
    return "#E81B1B"
  }
  if(!challenge.success && !dates.includes(today.toString().substring(0,15))){
    return "#EF3A3A"
  }
  if(new Date(challenge.startDate) >today){
    return "#A0A0A0"
  }
}


 const checkStatus=async(streaks,challenge,challenges)=>{
  const prom=new Promise(async(resolve,reject)=>{
    
  console.log("CHECK STATUS")
  console.log(challenge)
  const dates=getDatesArray(new Date(challenge.startDate),new Date(challenge.endDate))
  console.log(dates)
  const today=new Date() 
  console.log("today",today)
  const index=dates.indexOf(today.toString().substring(0,15))
  console.log("index",index)
  
  var yesterday=new Date(today)
  yesterday=new Date(yesterday.setDate(yesterday.getDate()-1))
  
  const containsStreak=streaks.filter((s)=> s.streak.day==yesterday.toString().substring(0,15))
  
  const userRef=doc(db,"users",ourUser.userId)

  
  const indexOf=Object.keys(challenges).filter((ch)=>{
    if(challenges[ch].title==challenge.title){
      return ch
    }
  })
  const indexOfChallenges=parseInt(indexOf[0])
  
  console.log("index of challenges",indexOfChallenges)
 
  
  var coolChallenges=challenges
  var foundStreak=false


  
  if(containsStreak.length>0  && new Date(challenge.startDate)<=today){

    
    
  if(streaks!=null){
    var i=0
  streaks.map(async(s)=>{
    var day=new Date(s.day)
    
    
    if(dates.indexOf(day.toString().substring(0,15))<index && index!=null && day.toString().substring(0,15)!=today.toString().substring(0,15) && foundStreak==false ){
      foundStreak=true
      console.log("index",index,"passes:",challenge.initialPasses)
      if(index+1>challenge.intialPasses){
      if(s.problems.length<challenge.no_questions){
        
  
        console.log(day.toString().substring(0,15),"   ",today.toString().substring(0,15))

        console.log("FAIL",day.toString().substring(0,15)," ",today.toString().substring(0,15))
        console.log("\n\n")
        const usersRef=collection(db,"users",ourUser.userId)
        if(challenge.passes>0 && challenge.success==true){
          challenge.passes--
          challenge.usedPasses++
          coolChallenges[indexOfChallenges].passes--
          coolChallenges[indexOfChallenges].usedPasses++
          console.log(indexOfChallenges)
          
            
            setTimeout((userRef)=>{

            axios.post("https://leetcodetracker.onrender.com/update-challenge/"+ourUser.userId,{challenge:challenge}).then(async(response)=>{
              console.log(response)
              if(response.data.success){
                const update=await updateDoc(userRef,{
                currentChallenge:challenge,
                challenges:coolChallenges
            }) 
            console.log(update)
            const chall=response.data.challenge
            alert(
              "previous challenge status:\n passes"+challenge.passes+"\nused passes:"+challenge.usedPasses+"\n challenge success status:"+challenge.success+
              "\nChallenge update: "+" passes:"+ chall.passes+ "\n challenge success:"+chall.success+"\n used passes:"+chall.usedpasses)
              }
            })
          },300)

            

          

        }else if(challenge.passes==0 && challenge.success==true){
          challenge.success=false;
        
        coolChallenges[indexOfChallenges].success=false
        
                  
            setTimeout(()=>{

            axios.post("https://leetcodetracker.onrender.com/update-challenge/"+ourUser.userId,{challenge:challenge}).then(async(response)=>{
              console.log(response)
              if(response.data.success){
                const update=await updateDoc(userRef,{
                currentChallenge:challenge,
                challenges:coolChallenges
            }) 
            console.log(update)
            const chall=response.data.challenge
            alert(
              "previous challenge status:\n passes"+challenge.passes+"\nused passes:"+challenge.usedPasses+"\n challenge success status:"+challenge.success+
              "\nChallenge update: "+"\npasses:"+ chall.passes+ "\n challenge success:"+chall.success+"\n used passes:"+chall.usedPasses)
              }
            })
          },300)
        } 
      }else if(s.problems.length>=challenge.no_questions){
        console.log("GOING STRONG")
      }
    }
    }
  })

}
  }
    else if(new Date(challenge.startDate)<=today && containsStreak.length==0){

      
      
      console.log("index of challenges",indexOfChallenges)
      console.log("FAIL")

      console.log(userRef)
      
 if(challenge.passes>0 && challenge.success==true){
  var oldChallenge=challenge
  challenge.passes=challenge.passes-1
  challenge.usedPasses=challenge.usedPasses+1
  coolChallenges[indexOfChallenges].passes=coolChallenges[indexOfChallenges].passes-1
  coolChallenges[indexOfChallenges].usedPasses=coolChallenges[indexOfChallenges].usedPasses+1
      
          
            
            
            setTimeout(()=>{

              console.log("Challenges changed:",coolChallenges)
              console.log("Challenge changed:",challenge)


            axios.post("https://leetcodetracker.onrender.com/update-challenge/"+ourUser.userId,{challenge:challenge}).then(async(response)=>{
              console.log(response)
              if(response.data.success){
                const userRef=doc(db,"users",ourUser.userId)

         const update=await updateDoc(userRef,{
              currentChallenge:response.data.challenge,
              challenges:coolChallenges
            }) 
          
           
           
            const chall=response.data.challenge
            alert(
              "previous challenge status:\n passes:"+oldChallenge.passes+"\nused passes:"+oldChallenge.usedPasses+"\n challenge success status:"+oldChallenge.success+
              "\n\nChallenge update: "+"\npasses:"+ chall.passes+"\nused passes:"+chall.usedPasses +"\nchallenge success:"+chall.success)
              }
            })
          },300)

            

         

        }else if(challenge.passes==0 && challenge.success==true){
          var oldChallenge=challenge

          coolChallenges[indexOfChallenges].success=false
          challenge.success=false;
          
            
              setTimeout(()=>{
                console.log("Challenges changed:",coolChallenges)
                console.log("challengechanged:",challenge)


            axios.post("https://leetcodetracker.onrender.com/update-challenge/"+ourUser.userId,{challenge:challenge}).then(async(response)=>{
              console.log(response)
              if(response.data.success){
                const userRef=doc(db,"users",ourUser.userId)

                const update=await updateDoc(userRef,{
              currentChallenge:response.data.challenge,
              challenges:coolChallenges
            }) 
            console.log(update)
            const chall=response.data.challenge
            alert(
              "previous challenge status:\n passes:"+oldChallenge.passes+"\nused passes:"+oldChallenge.usedPasses+"\nchallenge success status:"+oldChallenge.success+
              "\n\nChallenge update: "+"\npasses:"+ chall.passes+ "\nused passes:"+chall.usedPasses +"\nchallenge success:"+chall.success)
              }
            })
          },300) 
    }
  }
  
setTimeout(()=>{
  resolve()
},400)

  })

  prom.then(()=>{
    return challenge
  })

}
//checkStatus() 
//checkCurrent()
  
 const submit=async(e)=>{
  e.preventDefault()
  /* console.log(name)
   console.log(numberOfQuestions+ " questions")
   console.log("startDate:",startDate)
   console.log("endDate:",endDate)*/
   const user=JSON.parse(sessionStorage.getItem("user"))
   const  users=collection(db,"users")
   const data=await getDocs(users)
   const length=getDatesArray(startDate,endDate).length

   if(name!=null){
   const newChallenge={
     title:name,
     no_questions:numberOfQuestions,
     startDate:startDate,
     endDate:endDate,
     current:true,
     success:true,
     initialPasses:parseInt(passes),
     passes:parseInt(passes),
     length:length,
     usedPasses:0,
     failedDays:0,
     lastUpdated:new Date()
   }
   const userRef=doc(db,"users",user.userId)
   data.docs.map(async(u)=>{
     if(u.id==user.userId && numberOfQuestions>0){
     
       if(!Object.keys(u.data()).includes("challenges")){
         console.log("CREATE NEW CHALLENGES ARRAY")
         try{
         /*const update=await updateDoc(userRef,{
           challenges:{0:"null",1:newChallenge},
           currentChallenge:newChallenge
         }) 
         */
        const curr=new Date;
        console.log(startDate instanceof Date)
         const ourDates=getDatesArray(startDate,endDate)
         currentChallenge.length=ourDates.length
         setTimeout(()=>{
           axios.post("https://leetcodetracker.onrender.com/create-new-challenge",{challenge:newChallenge,userId:user.userId,current: startDate.toString().substring(0,15)==curr.toString().substring(0,15)? true:false}).then(async(response)=>{
             console.log("RESPONSE",response)
             if(response.data.challenge!=null){
              newChallenge.challenge_id=response.data.challenge._id
                var today=new Date()
              u.data().challenges[useDispatch.data().challenges.length]=newChallenge
              setTimeout(async()=>{
                const update=await updateDoc(userRef,{
                  challenges:u.data().challenges,
                  currentChallenge: today.toString().substring(0.15)==startDate.toString().substring(0,15)? newChallenge:null
                }) 
                     checkCurrent()
             alert("New challenge successfully added! starting on"+ startDate.toString().substring(0,15)+"  through "+ endDate.toString().substring(0,15)+" must complete "+ numberOfQuestions+ " each day!")
                dispatch(refreshChallengeChart())
              },300)
        
          }
        })
         },500)
       }catch(err){
         console.log("UPDATE FAILED:",err)
       }

       }else{
         var oldChallenges=u.data().challenges
         const max = Object.keys(oldChallenges).reduce(function (a, b) { return a > b ? a : b; });
         var message=""
         const ind=Number(max)+1
         const index=ind
         
           //console.log(duplicate)

         const duplicate = Object.keys(oldChallenges).filter((a)=>{
           if(a.title==name){
             return a
           }
         })
         if(oldChallenges.length>0){
         const duplicateTime = oldChallenges.map((a)=>{
           if(a!=null){
           // console.log()
           
           const st=new Date(a.startDate)
           const en= new Date(a.endDate)
           console.log(st)
           const newStart=startDate
           const newEnd=endDate
           try{
               
             var start = new Date(
             st.seconds * 1000 + st.nanoseconds / 1000000,
           );
           var end = new Date(
             en.seconds * 1000 + en.nanoseconds / 1000000,
           );
           //console.log(start)
           const dates=getDatesArray(st,en)
           console.log("dates",dates)
           const ourDates=getDatesArray(startDate,endDate)
           console.log("ourDates",ourDates)
           console.log(findCommonElement(dates,ourDates))
           if(findCommonElement(dates,ourDates)){
             message=message+" Challenge must not overlap in time."
           }if(a.title==name){
             console.log("SAME:"+a.name+ " "+ name)
             message=message+" Challenge must have unique name."
           }
         }catch(err){
             console.log(err)
           }
          }
         })
        }
        try{
          if(oldChallenges.length>0){
         oldChallenges.push(newChallenge)
          }else if(oldChallenges.length==0){
            oldChallenges=[newChallenge]
          }
        }catch(err){

        }

          setTimeout(async()=>{
           if(message.length>1){
             alert(message)
           }else{

          try{
           var curr=new Date()
           if(startDate.toString().substring(0,15)==curr.toString().substring(0,15)){
         
             const ourDates=getDatesArray(startDate,endDate)
             console.log(currentChallenge)

              newChallenge.length=ourDates.length
              console.log(currentChallenge)
              setTimeout(()=>{
                axios.post("http://localhost:3022/create-new-challenge",{challenge:newChallenge,userId:user.userId,current:true}).then(async(response)=>{
                  console.log(response)
                  if(response.data.challenge!=null){
                    newChallenge.challengeId=response.data.challenge._id
                    setTimeout(async()=>{

                      const update=await updateDoc(userRef,{
                        challenges:oldChallenges,
                        currentChallenge:newChallenge
                      })
                      checkCurrent()
                      
               alert("New challenge successfully added! starting on"+ startDate.toString().substring(0,15)+"  through "+ endDate.toString().substring(0,15)+" must complete "+ numberOfQuestions+ " each day!")
               dispatch(refreshChallengeChart())

              },300)
              
              
                  }
                 })

              },500)
              
            


           }else{

           /*  const update=await updateDoc(userRef,{
               challenges:oldChallenges
             })
             */

             const ourDates=getDatesArray(startDate,endDate)
             newChallenge.length=ourDates.length
  
             setTimeout(()=>{
               axios.post("https://leetcodetracker.onrender.com/create-new-challenge",{challenge:newChallenge,userId:user.userId,current:false}).then(async(response)=>{
                 console.log(response)
                 if(response.data.success){
                 if(response.data.challenge!=null){

                  newChallenge.challenge_id=response.data.challenge._id

                  setTimeout(async()=>{

                const update=await updateDoc(userRef,{
                  challenges:oldChallenges,
                })
                  checkCurrent()
                
             alert("New challenge successfully added! starting on"+ startDate.toString().substring(0,15)+"  through "+ endDate.toString().substring(0,15)+" must complete "+ numberOfQuestions+ " each day!")
             
             setShow(false)
             dispatch(refreshChallengeChart())
      

            },300)

               
                 }
                }else{
                  alert(response.data.err)
                }
                })

             },500)

           }
          
           }catch(err){
             console.log("UPDATE FAILED:",err)
           }
           
         }
          },500) 
       }
     }
   })
  }
 }


function findEvent(ev){
  return challenges.filter((e)=> e.title==ev.event._def.title )
}
if(!isLoading && challenges!=null){

 if(challenges!=null){
   function renderEventContent(event) {

  return (
    <>
      <b>{"hi"}</b>
      <i>{event.title}</i>
    </>
  )
}

    //console.log("allgroupchallenges",allGroupChallenges)
    return(
      <div class="flex-col  rounded-md p-3 w-full  ">
        <div class="flex-col w-full">
          <div class="flex-col w-full">
          
            <p class="font-bold text-2xl">Your Challenges</p>
            <button class="bg-green-400 p-2 rounded-md" onClick={()=>{
              setShowGroupChallenges(!showGroupChallenges)
            }}>
              <p class="text-white">See Group Challenges</p>
            </button>
          </div>
          <div>
        
          
          </div>
          {
            showCurrentChallenge && !showGroupChallenges && !showGroupChallengesCalender?
            <div>
                <div class="bg-gray-200 rounded-md p-2 flex-col m-2">
                  <div class="flex w-full justify-between">
                  <p class="text-xl font-bold">Current Challenge:{currentChallenge!=null ? 
                  <span class="text-green-500">{currentChallenge.title}</span>:<span>No current Challenge</span>}</p>
                 {currentChallenge!=null?
                  <button class="p-2 rounded-sm bg-gray-400 m-2" onClick={()=>{
                    console.log(currentChallenge)
                    const prom=new Promise((resolve,reject)=>{
                      dispatch(setChallenge(currentChallenge))
                      setTimeout(()=>{
                        resolve()
                      },500)
                    })

                    prom.then(()=>{
                      dispatch(setEditChallengeVisibility(true))
                    })
                  }}>
                    <p class="text-white font-bold">Edit</p>
                  </button>
                  :<div></div>
                  }
                  </div>
                  <FullCalendar
                       plugins={[dayGridPlugin]}
                       handleMouseEnter={()=>{
                        console.log("hello")
                       }}
                       events={challenges}
                       onClick={(e)=>{
                        console.log(e.target.value)
                       }}
                       eventDidMount={(event)=>{
                        console.log(event.event.extendedProps)
                        const cha=event.event.extendedProps.challenge
                        //console.log(cha)
                        const ev=event.event.extendedProps.titles
                    
                      

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
                      }else{
                        
                   
                 
                         // console.log(Object.keys(event.event.extendedProps))
                          const cha=event.event.extendedProps
                         // console.log(cha)
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
                       }}

                       
                       contentHeight="300px"
                       aspectRatio={2}
    
    
  />
                </div>
            </div>:
          <div>
          <div class="bg-gray-200 rounded-md p-2 flex-col m-2">
              <div class="flex w-full justify-center w-[100vw]">
              <GroupChallenges groupChallengeView={groupChallengeView} setGroupChallengeView={setGroupChallengeView} setAllGroupChallenges={setAllGroupChallenges} allChallenges={allGroupChallenges}/>
              
              <GroupChallengeViewer challenge={groupChallengeView} problemCounter={groupChallengeView} setGroupChallengeView={setGroupChallengeView}/>

              </div>

            </div>
          </div>
          }
       
          
      </div>
    
      
      <div class="flex w-full">
     
      </div>
      <div class="flex w-full">
      {show && !showDelete && !showCreateGroupChallenge ?
      <div class="flex w-full">
      <div class="flex-col w-2/3  bg-yellow-400 rounded-l-[5px]  rounded-md p-1 ">
        <div class="flex w-full">
        <div class="flex w-1/2 justify-start">
          <p class="font-bold text-xl">Create New Challenge</p>
        </div>
        <div class="flex w-full justify-end">
        <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
          setCreateGroupChallenge(false)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>
      </div>

      <div class="flex-col m-3">
        <form onSubmit={submit} >
        <input type="text" class="flex w-full rounded-sm bg-white p-2 mb-2" placeholder="Title" onChange={(e)=>{
          setName(e.target.value)
        }}/>
        <input type="number" class="flex w-1/2 rounded-sm bg-white p-2 mb-2"  default={5} placeholder="# of Questions" onChange={(e)=>{
          setNumberOfQuestions(e.target.value)
        }}/>
         <input type="number" class="flex w-1/2 rounded-sm bg-white p-2 mb-2"  default={0} placeholder="# of forgiveness passes" onChange={(e)=>{
          setPasses(e.target.value)
          setInitialPasses(e.target.value)
        }}/>
        <div class="flex-col">
          <p class="text-xl font-bold">Start Date/End Date</p>
          <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} 
             minDates={new Date()} 
             />

        </div>
        <div class="flex w-full mt-2 justify-center">
          <button class="bg-green-500 rounded-md flex p-2" type="submit">
            <p class="text-white font-bold">Submit</p>
          </button>
          </div>
        </form>
        
      
      </div>
      </div>
      <div class="flex-col w-1/8  bg-purple-400  rounded-l-[5px] ]rounded-md p-1 ">
          <div class="flex"></div>

          <div class="flex w-full justify-between">
          <p class="font-bold text-xl text-start">Create Group Challenge</p>
        </div>
        <button class="bg-purple-700 rounded-md p-2" onClick={()=>{
            setShow(false)
            setShowDelete(false)
            setShowCreateGroupChallenge(!showCreateGroupChallenge)
          }}>
            <IonIcon name="people-outline" style={{color:"white",font:"bold"}}/>
          </button>
      </div>
      <div class="flex-col w-1/8  bg-orange-400 rounded-l-[5px]  rounded-md p-3 ">
        <div class="flex"><p class="font-bold text-xl">Delete Challenge</p></div>
        <button class="bg-red-500 rounded-md p-2" onClick={()=>{
          setShowDelete(!showDelete)
          setShow(false)
          setCreateGroupChallenge(false)

        }}>
          <p class="text-white">-</p>
        </button>
      </div>
      </div>
      :
      <div></div>
  }
      {showCreateGroupChallenge && !showDelete && !show ?
      <div class="flex w-full">
        <div class="flex-col w-1/4  bg-yellow-400  rounded-l-[5px] ]rounded-md p-1 ">
        <div class="flex"></div>

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create  New Challenge</p>
      </div>
      <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
          setShowCreateGroupChallenge(false)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>
      <div class="flex-col w-3/4  bg-purple-400 rounded-l-[5px]  rounded-md p-1 ">
        <div class="flex w-full ">
          <div class="flex w-1/2 justify-start">
          <p class="font-bold text-xl text-start">Create Group Challenge</p>
          </div>
          <div class="flex w-1/2 justify-end">
        <button class="bg-purple-700 rounded-md p-2" onClick={()=>{
            setShow(false)
            setShowDelete(false)
            setShowCreateGroupChallenge(!showCreateGroupChallenge)
          }}>
           <IonIcon name="people-outline" style={{color:"white",font:"bold"}}/>
          </button>
          </div>
        </div>
    

      <div class="flex-col m-3">
        <form onSubmit={submitGroupChallenge} >
        <input type="text" name="name" class="flex w-full rounded-sm bg-white p-2 mb-2" placeholder="Title" onChange={(e)=>{
        
          const name=e.target.name
          const value=e.target.value
        
          console.log(value,createGroupChallenge)
          setCreateGroupChallenge((prev)=> {return ({...prev,name:value})})
        }}/>
        <input type="number" name="no_questions" class="flex w-1/2 rounded-sm bg-white p-2 mb-2"  default={5} placeholder="# of Questions" onChange={(e)=>{
               const name=e.target.name
               const value=e.target.value
             
               console.log(value,createGroupChallenge)
               setCreateGroupChallenge((prev)=> {return ({...prev,no_questions:value})})
        }}/>
         <input type="number" name="no_passes"  class="flex w-1/2 rounded-sm bg-white p-2 mb-2"  default={0} placeholder="# of forgiveness passes" onChange={(e)=>{
              const name=e.target.name
              const value=e.target.value
            
              console.log({name:value},createGroupChallenge)
              setCreateGroupChallenge(prev=> {return({...prev,no_passes:value,initialPasses:value})})
        }}/>
      <p class="font-bold text-xl">
        Contestants
      </p>
    
     <ChallengesSelectedContestants setSelectedContestants={setSelectedContestants} selectedContestants={selectedContestants} contestantsChanged={contestantsChanged}/>
     
 
         <select name="cars" class=" flex p-2 rounded-md w-full" id="cars" onChange={(e)=>{
         console.log(selectedContestants)
          
        
          if(selectedContestants.length>0){
            const exists=selectedContestants.filter((c)=>{
              console.log(e.target.value,c)
              if( c==e.target.value){
                 return true
              }
             })
             console.log(exists)
          if(!exists.includes(true)){
           const ppl=selectedContestants
           ppl.push(e.target.value)
            setTimeout(()=>{
              console.log(ppl)
              setSelectedContestants(ppl)
              setContestantsChanged(!contestantsChanged)
          },500)
          }
          
          }else{
            const ppl=selectedContestants
            ppl.push(e.target.value)

            setTimeout(()=>{
              setSelectedContestants(ppl)
              setContestantsChanged(!contestantsChanged)

            },1500)

          }
         }}>
              {
                ourUser.followers.map((f)=>{
                  return(<option class="flex-col p-2 border-b-2 border-gray-300 ">
                    <p class="font-bold" value={f}>
                      {f.username}
                      </p></option>)
                })
              } 
            </select>
        <div class="flex-col">
          <p class="text-xl font-bold">Start Date/End Date</p>
          <DateRangePicker min={new Date()} ranges={[selectionGroupRange]}onChange={(selection)=>{
            console.log(selection.selection.startDate)
            console.log(selectionGroupRange)
         
            setStartDateGroup(selection.selection.startDate)
            setEndDateGroup(selection.selection.endDate)
            setCreateGroupChallenge(prev=> {return({...prev,key:"selection",startDate:startDate,endDate:endDate})})

          }} 
             minDates={new Date()} 
             />
          

        </div>
        <div class="flex w-full mt-2 justify-center">
          <button class="bg-green-500 rounded-md flex p-2" type="submit">
            <p class="text-white font-bold">Submit</p>
          </button>
          </div>
        </form>
        
      
      </div>
      </div>
      <div class="flex-col w-full  bg-orange-400  rounded-l-[5px] p-1">
              <div class="flex"></div>

              <div class="flex w-full justify-between">
            <p class="font-bold text-xl text-start">Delete Challenge</p>
         
           </div>
           <button class="bg-red-500 rounded-md p-2" onClick={()=>{
                setShowDelete(!showDelete)
                setShowCreateGroupChallenge(false)
                setShow(false)
              }}>
             <p class="text-white">-</p>
             </button>
          </div>
      </div>
      :
      <div></div>
  }
     
{!show && showDelete && !showCreateGroupChallenge?
<div class="flex w-full">
<div class="flex-col w-1/8  bg-yellow-400  rounded-l-[5px] ]rounded-md p-1 ">
        <div class="flex"></div>

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create  New Challenge</p>
      </div>
      <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
          setShowCreateGroupChallenge(false)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>
      <div class="flex-col w-1/8  bg-purple-400  rounded-l-[5px] ]rounded-md p-1 ">
            <div class="flex"></div>

            <div class="flex w-full justify-between">
            <p class="font-bold text-xl text-start">Create Group Challenge</p>
          </div>
          <button class="bg-purple-700 rounded-md p-2" onClick={()=>{
              setShow(false)
              setShowDelete(false)
              setShowCreateGroupChallenge(!showCreateGroupChallenge)
            }}>
            <IonIcon name="people-outline" style={{color:"white",font:"bold"}}/>
            </button> 
      </div>

      <div class="flex-col w-3/4  bg-orange-400  rounded-r-[5px] p-3 ">

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Delete Challenge</p>
        <button class="bg-red-500 rounded-md p-2" onClick={()=>{
          setShowDelete(!showDelete)
          setShow(false)
          setShowCreateGroupChallenge(false)
        }}>
          <p class="text-white">-</p>
        </button>
      </div>

      <div class="flex-col m-3">
       
        <div class="h-[20vh] overflow-y-scroll overflow-hidden w-full bg-white">
          {
            challenges.map((c)=>{
              if(c.challenge!=null){
                console.log()
              return(
                <DeleteChallengeComponent challenge={c.challenge}/>
              )
              }
            })
          }
        </div>
        
      
      </div>
      </div>

        
      </div>
      :
      <div></div>
  }
   
  </div>
  {!show && !showDelete && !showCreateGroupChallenge ?
  <div class="flex w-full">
      <div class="flex-col  bg-yellow-400 rounded-l-[5px] p-1 w-full ">
        <div class="flex"></div>

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create New Challenge</p>
        <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
          setShowCreateGroupChallenge(false)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>
    </div>
    <div class="flex-col w-full  bg-purple-400  rounded-l-[5px] p-1">
              <div class="flex"></div>

              <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create Group Challenge</p>
        <button class="bg-purple-700 rounded-md p-2" onClick={()=>{
          setShowCreateGroupChallenge(!showCreateGroupChallenge)
          setShow(false)
          setShowDelete(false)
        }}> 
      <IonIcon name="people-outline" style={{color:"white"}}/>       
        </button>
        </div>
      </div>
      <div class="flex-col w-full  bg-orange-400  rounded-l-[5px] p-1">
              <div class="flex"></div>

              <div class="flex w-full justify-between">
            <p class="font-bold text-xl text-start">Delete Challenge</p>
            <button class="bg-red-500 rounded-md p-2" onClick={()=>{
                setShowDelete(!showDelete)
              }}>
             <p class="text-white">-</p>
             </button>
           </div>
          </div>
  </div>
      :
      <div></div>
  }
    </div>
    )
  }
}else if(!isLoading && challenges==null){
  return (
    <div class="flex-col  rounded-md p-3 w-full border-t-2 border-gray-400">
      <div class="flex w-full bg-gray-300 m-2 rounded-md p-3">
        <p class="font-bold">No Challenges</p>
        

      </div>
      <div class="w-full flex">
        
      
      </div>
      <div>
        <button class="bg-green-500 rounded-sm p-2 m-2" onClick={()=>{
          setShowGroupChallenges(!showGroupChallenges)
        }}>
          <p class="text-white">See GroupChallenges</p>
        </button>
      <div class="flex w-full">
        {
          showGroupChallenges?
          <div class="bg-gray-200 rounded-md p-2 flex-col m-2 w-full">
          <div class="flex w-full justify-between">
            <p class="text-xl font-bold">Group Challenges</p>
          </div>
          <div class="flex w-full justify-center">
          <GroupChallenges groupChallengeView={groupChallengeView} setGroupChallengeView={setGroupChallengeView} setAllGroupChallenges={setAllGroupChallenges} allChallenges={allGroupChallenges}/>
          <GroupChallengeViewer challenge={groupChallengeView} setGroupChallengeView={setGroupChallengeView}/>
          </div>
        </div>
        :
        <div></div>
        }
      </div>
      
      <div class="flex w-full">
      {show && !showDelete && !showCreateGroupChallenge ?
      <div class="flex w-full">
      <div class="flex-col w-2/3  bg-yellow-400 rounded-l-[5px]  rounded-md p-1 ">
        <div class="flex w-full">
        <div class="flex w-1/2 justify-start">
          <p class="font-bold text-xl">Create New Challenge</p>
        </div>
        <div class="flex w-full justify-end">
        <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
          setCreateGroupChallenge(false)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>
      </div>

      <div class="flex-col m-3">
        <form onSubmit={submit} >
        <input type="text" class="flex w-full rounded-sm bg-white p-2 mb-2" placeholder="Title" onChange={(e)=>{
          setName(e.target.value)
        }}/>
        <input type="number" class="flex w-1/2 rounded-sm bg-white p-2 mb-2"  default={5} placeholder="# of Questions" onChange={(e)=>{
          setNumberOfQuestions(e.target.value)
        }}/>
         <input type="number" class="flex w-1/2 rounded-sm bg-white p-2 mb-2"  default={0} placeholder="# of forgiveness passes" onChange={(e)=>{
          setPasses(e.target.value)
          setInitialPasses(e.target.value)
        }}/>
        <div class="flex-col">
          <p class="text-xl font-bold">Start Date/End Date</p>
          <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} 
             minDates={new Date()} 
             />

        </div>
        <div class="flex w-full mt-2 justify-center">
          <button class="bg-green-500 rounded-md flex p-2" type="submit">
            <p class="text-white font-bold">Submit</p>
          </button>
          </div>
        </form>
        
      
      </div>
      </div>
      <div class="flex-col w-1/8  bg-purple-400  rounded-l-[5px] ]rounded-md p-1 ">
          <div class="flex"></div>

          <div class="flex w-full justify-between">
          <p class="font-bold text-xl text-start">Create Group Challenge</p>
        </div>
        <button class="bg-purple-700 rounded-md p-2" onClick={()=>{
            setShow(false)
            setShowDelete(false)
            setShowCreateGroupChallenge(!showCreateGroupChallenge)
          }}>
            <IonIcon name="people-outline" style={{color:"white",font:"bold"}}/>
          </button>
      </div>
      <div class="flex-col w-1/8  bg-orange-400 rounded-l-[5px]  rounded-md p-3 ">
        <div class="flex"><p class="font-bold text-xl">Delete Challenge</p></div>
        <button class="bg-red-500 rounded-md p-2" onClick={()=>{
          setShowDelete(!showDelete)
          setShow(false)
          setCreateGroupChallenge(false)

        }}>
          <p class="text-white">-</p>
        </button>
      </div>
      </div>
      :
      <div></div>
  }
      {showCreateGroupChallenge && !showDelete && !show ?
      <div class="flex w-full">
        <div class="flex-col w-1/4  bg-yellow-400  rounded-l-[5px] ]rounded-md p-1 ">
        <div class="flex"></div>

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create  New Challenge</p>
      </div>
      <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
          setShowCreateGroupChallenge(false)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>
      <div class="flex-col w-3/4  bg-purple-400 rounded-l-[5px]  rounded-md p-1 ">
        <div class="flex w-full ">
          <div class="flex w-1/2 justify-start">
          <p class="font-bold text-xl text-start">Create Group Challenge</p>
          </div>
          <div class="flex w-1/2 justify-end">
        <button class="bg-purple-700 rounded-md p-2" onClick={()=>{
            setShow(false)
            setShowDelete(false)
            setShowCreateGroupChallenge(!showCreateGroupChallenge)
          }}>
           <IonIcon name="people-outline" style={{color:"white",font:"bold"}}/>
          </button>
          </div>
        </div>
    

      <div class="flex-col m-3">
        <form onSubmit={submitGroupChallenge} >
        <input type="text" name="name" class="flex w-full rounded-sm bg-white p-2 mb-2" placeholder="Title" onChange={(e)=>{
        
          const name=e.target.name
          const value=e.target.value
        
          console.log(value,createGroupChallenge)
          setCreateGroupChallenge((prev)=> {return ({...prev,name:value})})
        }}/>
        <input type="number" name="no_questions" class="flex w-1/2 rounded-sm bg-white p-2 mb-2"  default={5} placeholder="# of Questions" onChange={(e)=>{
               const name=e.target.name
               const value=e.target.value
             
               console.log(value,createGroupChallenge)
               setCreateGroupChallenge((prev)=> {return ({...prev,no_questions:value})})
        }}/>
         <input type="number" name="no_passes"  class="flex w-1/2 rounded-sm bg-white p-2 mb-2"  default={0} placeholder="# of forgiveness passes" onChange={(e)=>{
              const name=e.target.name
              const value=e.target.value
            
              console.log({name:value},createGroupChallenge)
              setCreateGroupChallenge(prev=> {return({...prev,no_passes:value,initialPasses:value})})
        }}/>
      <p class="font-bold text-xl">
        Contestants
      </p>
    
     <ChallengesSelectedContestants setSelectedContestants={setSelectedContestants} selectedContestants={selectedContestants} contestantsChanged={contestantsChanged}/>
     
 
         <select name="cars" class=" flex p-2 rounded-md w-full" id="cars" onChange={(e)=>{
         console.log(selectedContestants)
          
        
          if(selectedContestants.length>0){
            const exists=selectedContestants.filter((c)=>{
              console.log(e.target.value,c)
              if( c==e.target.value){
                 return true
              }
             })
             console.log(exists)
          if(!exists.includes(true)){
           const ppl=selectedContestants
           ppl.push(e.target.value)
            setTimeout(()=>{
              console.log(ppl)
              setSelectedContestants(ppl)
              setContestantsChanged(!contestantsChanged)
          },500)
          }
          
          }else{
            const ppl=selectedContestants
            ppl.push(e.target.value)

            setTimeout(()=>{
              setSelectedContestants(ppl)
              setContestantsChanged(!contestantsChanged)

            },1500)

          }
         }}>
              {
                ourUser.followers.map((f)=>{
                  return(<option class="flex-col p-2 border-b-2 border-gray-300 ">
                    <p class="font-bold" value={f}>
                      {f.username}
                      </p></option>)
                })
              } 
            </select>
        <div class="flex-col">
          <p class="text-xl font-bold">Start Date/End Date</p>
          <DateRangePicker min={new Date()} ranges={[selectionGroupRange]}onChange={(selection)=>{
            console.log(selection.selection.startDate)
            console.log(selectionGroupRange)
         
            setStartDateGroup(selection.selection.startDate)
            setEndDateGroup(selection.selection.endDate)
            setCreateGroupChallenge(prev=> {return({...prev,key:"selection",startDate:startDate,endDate:endDate})})

          }} 
             minDates={new Date()} 
             />
          

        </div>
        <div class="flex w-full mt-2 justify-center">
          <button class="bg-green-500 rounded-md flex p-2" type="submit">
            <p class="text-white font-bold">Submit</p>
          </button>
          </div>
        </form>
        
      
      </div>
      </div>
      <div class="flex-col w-full  bg-orange-400  rounded-l-[5px] p-1">
              <div class="flex"></div>

              <div class="flex w-full justify-between">
            <p class="font-bold text-xl text-start">Delete Challenge</p>
         
           </div>
           <button class="bg-red-500 rounded-md p-2" onClick={()=>{
                setShowDelete(!showDelete)
                setShowCreateGroupChallenge(false)
                setShow(false)
              }}>
             <p class="text-white">-</p>
             </button>
          </div>
      </div>
      :
      <div></div>
  }
     
{!show && showDelete && !showCreateGroupChallenge?
<div class="flex w-full">
<div class="flex-col w-1/8  bg-yellow-400  rounded-l-[5px] ]rounded-md p-1 ">
        <div class="flex"></div>

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create  New Challenge</p>
      </div>
      <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
          setShowCreateGroupChallenge(false)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>
      <div class="flex-col w-1/8  bg-purple-400  rounded-l-[5px] ]rounded-md p-1 ">
            <div class="flex"></div>

            <div class="flex w-full justify-between">
            <p class="font-bold text-xl text-start">Create Group Challenge</p>
          </div>
          <button class="bg-purple-700 rounded-md p-2" onClick={()=>{
              setShow(false)
              setShowDelete(false)
              setShowCreateGroupChallenge(!showCreateGroupChallenge)
            }}>
            <IonIcon name="people-outline" style={{color:"white",font:"bold"}}/>
            </button> 
      </div>

      <div class="flex-col w-3/4  bg-orange-400  rounded-r-[5px] p-3 ">

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Delete Challenge</p>
        <button class="bg-red-500 rounded-md p-2" onClick={()=>{
          setShowDelete(!showDelete)
          setShow(false)
          setShowCreateGroupChallenge(false)
        }}>
          <p class="text-white">-</p>
        </button>
      </div>

      <div class="flex-col m-3">
       
        <div class="h-[20vh] overflow-y-scroll overflow-hidden w-full bg-white">
          {
            challenges.map((c)=>{
              if(c.challenge!=null){
                console.log()
              return(
                <DeleteChallengeComponent challenge={c.challenge}/>
              )
              }
            })
          }
        </div>
        
      
      </div>
      </div>

        
      </div>
      :
      <div></div>
  }
   
  </div>
  {!show && !showDelete && !showCreateGroupChallenge ?
  <div class="flex w-full">
      <div class="flex-col  bg-yellow-400 rounded-l-[5px] p-1 w-full ">
        <div class="flex"></div>

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create New Challenge</p>
        <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
          setShowCreateGroupChallenge(false)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>
    </div>
    <div class="flex-col w-full  bg-purple-400  rounded-l-[5px] p-1">
              <div class="flex"></div>

              <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create Group Challenge</p>
        <button class="bg-purple-700 rounded-md p-2" onClick={()=>{
          setShowCreateGroupChallenge(!showCreateGroupChallenge)
          setShow(false)
          setShowDelete(false)
        }}> 
      <IonIcon name="people-outline" style={{color:"white"}}/>       
        </button>
        </div>
      </div>
      <div class="flex-col w-full  bg-orange-400  rounded-l-[5px] p-1">
              <div class="flex"></div>

              <div class="flex w-full justify-between">
            <p class="font-bold text-xl text-start">Delete Challenge</p>
            <button class="bg-red-500 rounded-md p-2" onClick={()=>{
                setShowDelete(!showDelete)
              }}>
             <p class="text-white">-</p>
             </button>
           </div>
          </div>
  </div>
      :
      <div></div>
  }
    </div>
      
    
    </div>
  )
}
else if(isLoading){
  return(<div>No </div>)
}
}
/**
 * 
 *  {
          showGroupChallenges ?
          <div class="bg-gray-200 rounded-md p-2 flex-col m-2">
         
            <p class="text-xl font-bold">Group Challenges</p>
            <GroupChallenges setAllGroupChallenges={setAllGroupChallenges} allChallenges={allGroupChallenges}/>
    
        </div>
        :
        <div></div>
        }
 */
const mapStateToProps = (state, props) => {
  var refresh= state.editChallenge.refresh
 

  return {
 refresh:refresh
  };
};
export default connect(mapStateToProps)(Challenges)