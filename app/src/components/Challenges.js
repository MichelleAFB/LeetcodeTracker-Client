import React from 'react'
import {useState,useEffect} from 'react'
import { db} from '../firebase/firebase'
import { collection,getDocs,doc, updateDoc } from 'firebase/firestore' 
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { setDoc } from 'firebase/firestore';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import axios from 'axios';


function Challenges() {

  const usersCollectionRef=collection(db,"users")
  //const data=await getDocs(usersCollectionRef)

  const[isLoading,setIsLoading]=useState()
  const[show,setShow]=useState(false)
  const[ourUser,setOurUser]=useState(JSON.parse(sessionStorage.getItem("user")))
  const [showCurrentChallenge,setShowCurrentChallenge]=useState(true)
  const[challenges,setChallenges]=useState()
  const[name,setName]=useState()
  const[currentChallenge,setCurrentChallenge]=useState()
  const[numberOfQuestions,setNumberOfQuestions]=useState(0)
  const[startDate,setStartDate]=useState(new Date())
  const [endDate,setEndDate]=useState(new Date()) 
  const selectionRange={
    startDate:startDate,
    endDate:endDate,
    key:"selection"
  }

  useEffect(()=>{
    const prom=new Promise(async(resolve,reject)=>{
        axios.get("http://localhost:3022/get-current-challenge/"+ourUser.userId).then((response)=>{
          console.log(response)
          setCurrentChallenge(response.data.currentChallenge)
      const currChallenge=response.data.currentChallenge
          const dates=getDatesArray(new Date(currChallenge.startDate),new Date(currChallenge.endDate))
          console.log(dates)
        })
        setTimeout(()=>{
          resolve()
        },500)

    })

    prom.then(()=>{
      setIsLoading(false)
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
   const newChallenge={
     title:name,
     no_questions:numberOfQuestions,
     startDate:startDate,
     endDate:endDate,
     current:true,
     success:true
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
         const ourDates=getDatesArray(startDate,endDate)
         currentChallenge.length=ourDates.length
         setTimeout(()=>{
           axios.post("http://localhost:3022/create-new-challenge",{challenge:currentChallenge,userId:user.userId,current: startDate.toString().substring(0,15)==curr.toString().substring(0,15)? true:false}).then(async(response)=>{
             console.log(response)
             if(response.data.challenge!=null){
              newChallenge.challenge_id=response.data.challenge._id
                var today=new Date()
              setTimeout(async()=>{
                const update=await updateDoc(userRef,{
                  challenges:{0:"null",1:newChallenge},
                  currentChallenge: today.toString().substring(0.15)==startDate.toString().substring(0,15)? newChallenge:null
                }) 
                     checkCurrent()
             alert("New challenge successfully added! starting on",startDate.toString().substring(0,15)," through ", endDate.toString().substring(0,15)," must complete ", numberOfQuestions, " each day!")

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
           if(oldChallenges[a].title==name){
             return a
           }
         })
     
         const duplicateTime = Object.keys(oldChallenges).filter((a)=>{
           if(oldChallenges[a]!=null){
           
           const st=oldChallenges[a].startDate
           const en=oldChallenges[a].endDate
           const newStart=startDate
           const newEnd=endDate
           try{
               
             var start = new Date(
             st.seconds * 1000 + st.nanoseconds / 1000000,
           );
           var end = new Date(
             en.seconds * 1000 + en.nanoseconds / 1000000,
           );
           const dates=getDatesArray(start,end)
           const ourDates=getDatesArray(startDate,endDate)
           if(findCommonElement(dates,ourDates)){
             message=message+" Challenge must not overlap in time."
           }if(oldChallenges[a].title==name){
             console.log("SAME:"+oldChallenges[a].name+ " "+ name)
             message=message+" Challenge must have unique name."
           }
         }catch(err){
             console.log(err)
           }
          }
         })

        
         oldChallenges[index]=newChallenge

          setTimeout(async()=>{
           if(message.length>1){
             alert(message)
           }else{

          try{
           var curr=new Date()
           if(startDate.toString().substring(0,15)==curr.toString().substring(0,15)){
         
             const ourDates=getDatesArray(startDate,endDate)
              currentChallenge.length=ourDates.length
              setTimeout(()=>{
                axios.post("http://localhost:3022/create-new-challenge",{challenge:currentChallenge,userId:user.userId,current:true}).then(async(response)=>{
                  console.log(response)
                  if(response.data.challenge!=null){
                    newChallenge.challengeId=response.data.challenge._id
                    setTimeout(async()=>{

                      const update=await updateDoc(userRef,{
                        challenges:oldChallenges,
                        currentChallenge:newChallenge
                      })
                      checkCurrent()
                      alert("New challenge successfully added! starting on",startDate.toString().substring(0,15)," through ", endDate.toString().substring(0,15)," must complete ", numberOfQuestions, " each day!")
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
             currentChallenge.length=ourDates.length
             setTimeout(()=>{
               axios.post("http://localhost:3022/create-new-challenge",{challenge:currentChallenge,userId:user.userId,current:false}).then(async(response)=>{
                 console.log(response)
                 if(response.data.challenge!=null){

                  newChallenge.challenge_id=response.data.challenge._id
               setTimeout(async()=>{

                const update=await updateDoc(userRef,{
                  challenges:oldChallenges,
                })
                  checkCurrent()
                alert("New challenge successfully added! starting on",startDate.toString().substring(0,15)," through ", endDate.toString().substring(0,15)," must complete ", numberOfQuestions, " each day!")
               },300)

               
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


if(!isLoading){
  console.log("HHHEEEY")
  console.log("start",startDate,"end:",endDate)
  if(challenges==null){
  return (
    <div class="flex-col  rounded-md p-3 w-full ">
      <div class="flex w-full bg-gray-300 m-2 rounded-md p-3">
        <p class="font-bold">Your challenges!!!</p>
        

      </div>
      <div class=" flex-col  bg-red-400 rounded-md p-3">
      <div class="flex w-full justify-end  rounded-md p-3 ">
        <button class="bg-red-500 rounded-md p-3" onClick={()=>{
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
    return(
      <div class="flex-col  rounded-md p-3 w-full ">
        <div class="flex-col w-full">
          <div class="flex-col w-full">
            <p class="font-bold text-2xl">Your Challenges!</p>
          </div>
          {
            showCurrentChallenge?
            <div>
                <div class="bg-gray-200 rounded-md p-2 flex-col m-2">
                  <p class="text-xl font-bold">Current Challenge</p>
                  <p>{currentChallenge.title}</p>
                  <FullCalendar
                       plugins={[dayGridPlugin]}
                       handleMouseEnter={()=>{
                        console.log("hello")
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
      
      <div class="flex-col w-full  bg-red-400  rounded-md p-3 ">
      <div class="flex w-full justify-end">
        <button class="bg-red-500 rounded-md p-2" onClick={()=>{
          setShow(!show)
        }}>
          <p class="text-white">+</p>
        </button>
      </div>
      <div class="flex"><p class="font-bold text-xl">Create New Challenge</p></div>
      {show?
      <div class="flex-col m-3">
        <form onSubmit={submit} >
        <input type="text" class="flex w-full rounded-sm bg-white p-2 mb-2" placeholder="Title" onChange={(e)=>{
          setName(e.target.value)
        }}/>
        <input type="number" class="flex w-1/2 rounded-sm bg-white p-2 mb-2"  default={5} placeholder="# of Questions" onChange={(e)=>{
          setNumberOfQuestions(e.target.value)
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
      :
      <div></div>
  }
    </div>
    </div>
    )
  }
}
else if(isLoading){
  return(<div>No </div>)
}
}

export default Challenges