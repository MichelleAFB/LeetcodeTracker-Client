import React from 'react'
import {useState,useEffect} from 'react'

//outside


import { Bar } from "react-chartjs-2";

import { db } from '../firebase/firebase'
import {getDocs,collection,doc,updateDoc} from 'firebase/firestore'

import axios from 'axios'
import Streak from './Streak'
import Challenges from './Challenges';

function StreakChart({allStreaks,streaks}) {

  const [problems,setProblems]=useState()
 // const[streaks,setStreaks]=useState()
  const[streakGroups,setStreakGroup]=useState()
  const[isLoading,setIsLoading]=useState(false)
  const[seeAllStreaks,setSeeAllStreaks]=useState(false)
  /*const[allStreaks,setAllStreaks]=useState()*/
  useEffect(()=>{
   /* const dataArr=[]
    const problemsListCollectionRef=collection(db,"problems")
    const arr=[] 
    const user=JSON.parse(sessionStorage.getItem("user"))
    console.log(Number(user.userId))
    console.log(typeof(user.userId))
    console.log(typeof(parseInt(user.userId)))
  const prom1=new Promise((resolve1,reject1)=>{
    axios.get("https://leetcodetracker.onrender.com/current-streak/"+user.userId,{userId:parseInt(user.userId)}).then(async(response)=>{
      const data=await response.data
      console.log(data)
      console.log(response.data.streaks)
      console.log(response.data)
      if(response.data.streaks!=null){
      axios.get("https://leetcodetracker.onrender.com/sort-streaks/"+user.userId,{message:"hi",userId:user.userId}).then((response1)=>{
        setAllStreaks(response1.data.streaks)
        const str=response.data.streaks 
        setStreaks(response.data.streaks)
        console.log(response1)
        setTimeout(()=>{
         resolve1()
        },700)
      })
    }else{
      resolve1()
    }
      
   

  })

  })
  
  prom1.then(()=>{
    setIsLoading(false)
   
   })
   */
  },[])


  const [may,setMay]=useState()
  const [apr,setApr]=useState()
  const[jun,setJun]=useState()
  const [mar,setMar]=useState()

  

  const generate=()=>{

    const May=[]
    const Apr=[]
    const Mar=[]
    const Jun=[]
    
    problems.map((r)=>{
      const attempts=r.problem.attempts
      Object.keys(attempts).forEach(
        function(key,index){
          const date=attempts[key].date
          if(date!=null){
          
            if(date.includes("Mar")){
              Mar.push({problem:r.problem.title,date:date})

            }
            if(date.includes("Apr")){
              Apr.push({problem:r.problem.title,date:date})

            }
            if(date.includes("May")){
              May.push({problem:r.problem.title,date:date})

            }
            if(date.includes("Jun")){
              Jun.push({problem:r.problem.title,date:date})

            }

          }
       
        }
      )
    })

    setTimeout(()=>{
      
      setMay(May)
      setApr(Apr)
      setJun(Jun)
      setMar(Mar)

      setTimeout(()=>{
        sort() 
      },500)
      
    },200)
  }
  const [months,setMonths]=useState(false)

  const sort=()=>{
  
    const months=[mar,apr,may,jun]
    
    setMonths(true)

    months.map((m)=>{
     m.map((date)=>{
     
     })
    })
    

  }


  const options = {
    maintainAspectRatio: false,
    width: 100,
    height: 100,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Daily Solved Problems",
      }, 
    },
  };



  console.log(months)
  
  if(!isLoading && streaks!=null){
  
    console.log(problems)
    console.log("")

    console.log(streaks)
   /* const data = {
      labels:problems.map((p)=> {return p.day}),
      datasets: [
        {
          label: "Dataset 1",
          data: problems.map((p)=>{
            console.log(p)
            p.streaks.map((s)=>{
              return s.day
            })
          }),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    */

 
  return (
    <div class="m-5 flex h-[500px] w-full  border-gray-300 border-t-2 m p-5 "> 
      
      <p>{}</p>
    {allStreaks.length>0 && streaks.length==0 ?
    <div class="flex flex-col w-full p-10">

      
   
      
      <div class="flex-col p-5 w-full">
           <p class="text-4xl">Your Streaks</p>
      <div class="flex w-full overflow-x-scroll  overflow-hidden">
        {allStreaks.map((st)=>{
          return(<Streak streaks={st}/>)
        })
          
        }
      </div>
     
      </div>
      </div>:
      <p class="text-5xl"></p>
  }
   {allStreaks.length>0 && streaks.length>0 ?
    <div class="flex flex-col w-full p-10">

      
   
      {seeAllStreaks?
      
      <div class="flex-co p-5l">
           <p class="text-4xl">Your Streaks hi</p>
      <div class="flex w-full overflow-x-scroll  overflow-hidden">
        {allStreaks.map((st)=>{
          return(<Streak streaks={st}/>)
        })
          
        }
      </div>
      <button class="bg-green-700 p-3 rounded-md m-2" onClick={()=>{
        setSeeAllStreaks(!seeAllStreaks)
      }}>
        <p class="text-white">See Current Streak</p>
      </button>
      </div>
      :
      <div class="flex-col w-full p-10">
           <p class="text-4xl">Your Current Streak</p>
      <Streak streaks={streaks}/>
      <button class="bg-green-700 p-3 rounded-md m-2" onClick={()=>{
        setSeeAllStreaks(!seeAllStreaks)
      }}>
        <p class="text-white">See all streaks</p>
      </button>
      </div>
      }

      </div>:
      <p class="text-5xl"></p>
  }
  {allStreaks.length==0 && streaks.length==0 ?
    <div class="flex flex-col w-full p-10">
      <p class="text-5xl">No streaks yet..</p>
      </div>:
      <p class="text-5xl"></p>
  }
    </div>
  )
    }else if(!isLoading && streaks==null){
      return(<div></div>) 
    }
}

export default StreakChart