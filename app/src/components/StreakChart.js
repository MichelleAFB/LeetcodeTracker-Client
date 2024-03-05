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
  const[allYears,setAllYears]=useState()
  const[selectedYear,setSelectedYear]=useState(new Date().getUTCFullYear())
  const[useSelectedMonth,setUseSelectedMonth]=useState(false)
  const[selectedMonth,setSelectedMonth]=useState(new Date().toLocaleString("en-US",{month:"long"}).substring(0,3))
  const[useSelectedYear,setUseSelectedYear]=useState(true)
  /*const[allStreaks,setAllStreaks]=useState()*/
  console.log(selectedYear)
  
  useEffect(()=>{
    const years=[]
    const prom=new Promise(async(resolve,reject)=>{
      const user=JSON.parse(sessionStorage.getItem("user"))
      const usersCollectionRef=collection(db,"users")
      const userDoc=await getDocs(usersCollectionRef,user.userId)
      userDoc.docs.map((d)=>{
   
        const data=d.data()
        if(data.userId==user.userId){
        const create=new Date(d._document.createTime.timestamp.seconds*1000)
        var today=Number(new Date().getUTCFullYear())
        var first=Number(create.getUTCFullYear())
        while(today>=first){
          years.push(today)
          today--
        }
        setTimeout(()=>{
          setAllYears(years)
          setTimeout(()=>{
            resolve()
          },200)
         },500)
      }
      })
    })

    prom.then(()=>{
      setIsLoading(false)
    })
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
  },[selectedYear])


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
  console.log(selectedYear)
 
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
    <div class="m-5 flex  w-full  border-gray-300 border-t-2 m p-5 "> 
      
      <p>{}</p>
    {allStreaks.length>0 && streaks.length==0 ?
    <div class="flex flex-col w-full p-5">

      
   
      
      <div class="flex-col p-2 w-full">
           <p class="text-4xl">Your Streaks</p>
      <div class="flex w-full overflow-x-scroll  overflow-hidden">
        {allStreaks.map((st)=>{
          console.log(st)
          return(<Streak streaks={st}/>)
        })
          
        }
      </div>
     
      </div>
      </div>:
      <p class="text-5xl"></p>
  }
   {allStreaks.length>0 && streaks.length>0 ?
    <div class="flex flex-col w-full p-5">

      
   
      {seeAllStreaks?
      
      <div class="flex-col p-2">
      
           <p class="text-4xl">Your Streaks </p>
      <div class="flex justify-around">
                <select class="bg-gray-500 p-1 rounded-sm text-white" default={selectedYear} onChange={(e)=>{
                setSelectedYear(e.target.value)
              }}>
                {
                  allYears.map((y)=>{
                
                    return(<option class="text-white"><span class="text-white">
                      {y}
                      </span></option>)
                  })
                }

              </select>
              {
                useSelectedMonth?
                <button class="flex p-2 border-gray bg-green-500 border-2 rounded-[75%] p-2"  onClick={()=>{
                  setUseSelectedMonth(!useSelectedMonth)
                }}>

                </button>
                :
                <button class="flex p-2 border-gray border-2 rounded-[75%] p-2" onClick={()=>{
                  setUseSelectedMonth(!useSelectedMonth)
                }}>
                  
                </button>
              }
              {
                useSelectedMonth?
              <select class="bg-gray-500 text-white p-2" value={selectedMonth} onChange={(e)=>{
                setSelectedMonth(e.target.value)
              }}>
                <option value={"Jan"}> January</option>
                <option value={"Feb"}>February</option>
                <option value={"Mar"}>March</option>
                <option value={"Apr"}>April</option>
                <option value={"May"}>May</option>
                <option value={"Jun"}>June</option>
                <option value={"Jul"}>July</option>
                <option value={"Aug"}>Aug</option>
                <option value={"Sep"}>September</option>
                <option value={"Oct"}>October</option>
                <option value={"Nov"}>November</option>
                <option value={"Dec"}>December</option>

              </select>
                :
              <p></p>
              }
      </div>

      <div class="flex w-full overflow-x-scroll  overflow-hidden">
        {allStreaks.map((st)=>{
         
          const validYear=st.map((s)=>{
            if(useSelectedYear){
            if(s.day.includes(selectedYear.toString()) && useSelectedMonth==false){
           
              if(useSelectedMonth && s.day.includes(selectedMonth)){
              return true;
              }else{
                return true
              }
            }else if(s.day.includes(selectedYear.toString()) && useSelectedMonth && s.day.includes(selectedMonth)){
              return true
            }
          }else {

            return true
          }
          })
    
          if(validYear.includes(true) ){
          
          return(<Streak streaks={st} selectedMonth={selectedMonth} useSelectedMonth={useSelectedMonth} selectedYear={selectedYear} useSelectedYear={useSelectedYear}/>)
          
          }
         
        })
          
        }
      </div>
      <button class="bg-green-700 p-3 rounded-md m-2" onClick={()=>{
        setSeeAllStreaks(!seeAllStreaks)
        setUseSelectedYear(false)
        setUseSelectedMonth(false)
      }}>
        <p class="text-white">See Current Streak</p>
      </button>
      </div>
      :
      <div class="flex-col w-full p-10">
           <p class="text-4xl">Your Current Streak</p>
      <Streak streaks={streaks} selectedMonth={selectedMonth} useSelectedMonth={useSelectedMonth} selectedYear={selectedYear} useSelectedYear={useSelectedYear}/>
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