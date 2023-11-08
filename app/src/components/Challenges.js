import React from 'react'
import {useState,useEffect} from 'react'
import { db} from '../firebase/firebase'
import { collection,getDocs,doc, updateDoc ,getDoc} from 'firebase/firestore' 
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { setDoc } from 'firebase/firestore';

import FullCalendar from "@fullcalendar/react";
//import interactionPlugin from "@fullcalendar/core/"
import dayGridPlugin from "@fullcalendar/daygrid";
import * as bootstrap from "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import { getDatasetAtEvent } from 'react-chartjs-2';
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import DeleteChallengeComponent from './DeleteChallengeComponent';

function Challenges() {

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
  const[updateChallenge,setUpdateChallenge]=useState("NOT DONE")
  const[streaks,setStreaks]=useState()
  const[isOpen,setIsOpen]=useState(false)

  const selectionRange={
    startDate:startDate,
    endDate:endDate,
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
    const prom=new Promise(async(resolve,reject)=>{
        axios.get("https://leetcodetracker.onrender.com/get-current-challenge-2/"+ourUser.userId).then(async(response)=>{
      console.log(response)
      
        if(response.data.currentChallenge!=null){
         checkStatus2(response.data.streaks,response.data.currentChallenge,response.data.challenges)
            setCurrentChallenge(response.data.currentChallenge)
        }

          console.log(response)
          cha=response.data.currentChallenge
          console.log(response.data.currentChallenge)
          
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
          })
     
     // const currChallenge=response.data.currentChallenge
         // const dates=getDatesArray(new Date(currChallenge.startDate),new Date(currChallenge.endDate))

          setTimeout(()=>{
            setTimeout(()=>{
              resolve()
            },200)
          },500)
        })
     

    })

    prom.then(()=>{

      const prom1=new Promise((resolve1,reject1)=>{
        if(ourStreaks!=null){
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

              console.log("ourstreaks length:"+ourStreaks.length+"  arr length:"+arr.length +" i:"+i)
            if(i==ourStreaks.length){
              setTimeout(()=>{
                setChallenges(arr)
      
                setTimeout(()=>{
                  resolve1()
                },200)
              },800)
            }

            },50)
          })
        }
      })

      prom1.then(()=>{
        setIsLoading(false)

      })
    })

  },[])

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
  console.log(challenge)
  const challengeDates=getDatesArray(new Date(challenge.startDate),new Date(challenge.endDate))
  console.log(challengeDates)
  var today=new Date()
  if(challenge.success && challenge.lastUpdated.toString().substring(0,15)!=today.toString().substring(0,15)){
    console.log("CHALLENGE STILL SUCCESS")

    const indexToday=challengeDates.indexOf(today.toString().substring(0,15))
    console.log("todayIndex",indexToday)
    const prevStreaks=streaks.filter((s)=>{
      console.log("\n",s)
      console.log(s.streak.day+"   ",challengeDates.indexOf(s.streak.day))
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
    console.log("STREAKLESS",streaksLess)
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

    console.log("check these streaks",prevStreaks)
    if(prevStreaks.length>0){
      console.log("CHECK STREAKS")
      console.log("check if challenge has used up all passes but for checking streakproblem length")
      console.log("attempted streaks length",3,"initialPasses",challenge.initialPasses ,"extra day for zero passes:",1,"length of days-1(for today)",challengeDates.length)
      console.log("attempts+passes:",(prevStreaks.length+challenge.initialPasses+1), "total dates:",challengeDates.length,"\n\n")

      if((prevStreaks.length+challenge.initialPasses+1)<challengeDates.length){
        const failedStreaks=prevStreaks.filter((s)=>{
          console.log(s.streak.day," success?",s.passed)
          if(s.passed==false){
            return s
          }
        })
        console.log("FAIL THE CHALLENGE: total days attempted"+prevStreaks.length,"total passes + 1 day at 0:initial passes",challenge.initialPasses +" and 1 day at 0 passes:1", "total days:"+challengeDates.length)
       

        console.log("FAIL THE CHALLENGE")
          const index=challenges.filter((c)=>{
            if(c.title==challenge.title){
              return challenges.indexOf(c)
            }
          })
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
        console.log("check Problems length for all streak")
        const failedStreaks=prevStreaks.filter((s)=>{
          console.log(s.streak.day," success?",s.passed)
          if(s.passed==false){
            return s
          }
        })
        console.log("number of failed:",failedStreaks.length)
        if(failedStreaks.length<challenge.initialPasses){
          console.log("PASS")
        }else{
          console.log("FAIL THE CHALLENGE")
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
              setTimeout(async()=>{
                const update=await updateDoc(userRef,{
                  challenges:[newChallenge],
                  currentChallenge: today.toString().substring(0.15)==startDate.toString().substring(0,15)? newChallenge:null
                }) 
                     checkCurrent()
             alert("New challenge successfully added! starting on"+ startDate.toString().substring(0,15)+"  through "+ endDate.toString().substring(0,15)+" must complete "+ numberOfQuestions+ " each day!")

              },300)
        
          }
        })
          

         },500)
         
  
       }catch(err){
         console.log("UPDATE FAILED:",err)
       }

       }else{
         const oldChallenges=u.data().challenges
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

        
         oldChallenges.push(newChallenge)

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
             console.log("cnew Challenge",newChallenge)
             console.log(newChallenge.startDate instanceof Date)
             console.log("currentChallenge",currentChallenge)
             console.log(currentChallenge.startDate instanceof Date)
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

 /**
  *       <button class="bg-purple-400 p-2 flex w-full" onClick={async()=>{
              console.log(currentChallenge)
              const us= doc(db,"users",ourUser.userId)
              console.log(us)
              const update=await updateDoc(us,{
                challenges:{0:currentChallenge},
                currentChallenge:currentChallenge
              })
              console.log(update)
              


            }}>
              add to
            </button>
  */
function findEvent(ev){
  return challenges.filter((e)=> e.title==ev.event._def.title )
}
if(!isLoading){
  if(challenges==null){
  return (
    <div class="flex-col  rounded-md p-3 w-full border-t-2 border-gray-400">
      <div class="flex w-full bg-gray-300 m-2 rounded-md p-3">
        <p class="font-bold">Your challenges</p>
        

      </div>
      <div class=" flex-col  bg-yellow-400 rounded-md p-3">
      <div class="flex w-full justify-end  rounded-md p-3 ">
        <button class="bg-green-500 rounded-md p-3" onClick={()=>{
          setShow(!show)
        }}> 
          <p class="text-white">+</p>
        </button>
      </div>
  
      <div class="flex w-full justify-start"><p class="font-bold text-xl">Create New Challenge</p></div>
      {show?
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
        }}/>
        <div class="flex-col">
          <p class="text-xl font-bold">Start Date/End Date</p>
          <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} 
             minDates={new Date()} 
             />

        </div>
        <div class="flex w-full mt-2 justify-center">
          <button class="bg-red-500 rounded-md flex p-2" type="submit">
            <p class="text-white font-bold">Submit</p>
          </button>
          </div>
        </form>
        
      
      </div>
      :
      <div></div>
  }
    
  </div>
    </div>
  )
  }else if(challenges!=null){
   function renderEventContent(event) {

  return (
    <>
      <b>{"hi"}</b>
      <i>{event.title}</i>
    </>
  )
}
    console.log("challenges",challenges)
    return(
      <div class="flex-col  rounded-md p-3 w-full  ">
        <div class="flex-col w-full">
          <div class="flex-col w-full">
      
            <p class="font-bold text-2xl">Your Challenges</p>
          </div>
          {
            showCurrentChallenge?
            <div>
                <div class="bg-gray-200 rounded-md p-2 flex-col m-2">
                  <p class="text-xl font-bold">Current Challenge:{currentChallenge!=null ? 
                  <span class="text-green-500">{currentChallenge.title}</span>:<span>No current Challenge</span>}</p>
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
                       // console.log(event.event.extendedProps)
                        const cha=event.event.extendedProps.challenge
                        //console.log(cha)
                        const ev=event.event.extendedProps.titles
                       // console.log(event.event.extendedProps)
                       // console.log("\n\n")

                        if(ev!=null){
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
            </div>

          }
      </div>
      
      <div class="flex w-full">
      {show && !showDelete ?
      <div class="flex w-full">
      <div class="flex-col w-3/4  bg-yellow-400 rounded-l-[5px]  rounded-md p-1 ">
        <div class="flex"><p class="font-bold text-xl">Create New Challenge</p></div>

        <div class="flex w-full justify-end">
        <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
        }}>
          <p class="text-white">+</p>
        </button>
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
      <div class="flex-col w-1/2  bg-orange-400 rounded-l-[5px]  rounded-md p-3 ">
        <div class="flex"><p class="font-bold text-xl">Delete Challenge</p></div>

        <div class="flex w-full justify-end">
        <button class="bg-red-500 rounded-md p-2" onClick={()=>{
          setShowDelete(!showDelete)
          setShow(false)
        }}>
          <p class="text-white">-</p>
        </button>
      </div>

      <div class="flex-col m-3">
    
        
      
      </div>
      </div>
      </div>
      :
      <div></div>
  }

     
{!show && showDelete ?
<div class="flex w-full">
<div class="flex-col w-1/4  bg-yellow-400  rounded-l-[5px] ]rounded-md p-1 ">
        <div class="flex"></div>

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create  New Challenge</p>
        <button class="bg-red-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
          setShowDelete(false)
        }}>
          <p class="text-white">-</p>
        </button>
      </div>

      <div class="flex-col m-3">
    
        
      
      </div>
      </div>

      <div class="flex-col w-3/4  bg-orange-400  rounded-r-[5px] p-3 ">

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create New Challenge</p>
        <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShowDelete(!showDelete)
          setShow(false)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>

      <div class="flex-col m-3">
        <div class="h-[20vh] overflow-y-scroll overflow-hidden w-full bg-white">
          {
            challenges.map((c)=>{
              if(c.challenge!=null){
                console.log()
              return(
                <DeleteChallengeComponent challenge={c}/>
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
  {!show && !showDelete ?
  <div class="flex w-full">
      <div class="flex-col w-1/2  bg-yellow-400 rounded-l-[5px] p-1 ">
        <div class="flex"></div>

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Create New Challenge</p>
        <button class="bg-green-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>

      <div class="flex-col m-3">
  
        
      
      </div>
      </div>

      <div class="flex-col w-1/2  bg-orange-400  rounded-r-[5px] p-1 ">
        <div class="flex"></div>

        <div class="flex w-full justify-between">
        <p class="font-bold text-xl text-start">Delete Challenge</p>
        <button class="bg-red-500 rounded-md p-2" onClick={()=>{
          setShowDelete(!showDelete)
        }}>
          <p class="text-white">-</p>
        </button>
      </div>

      <div class="flex-col m-3">
    
        
      
      </div>
      </div>
  </div>
      :
      <div></div>
  }
    </div>
    )
  }
}
else if(isLoading){
  return(<div>No </div>)
}
}

export default Challenges