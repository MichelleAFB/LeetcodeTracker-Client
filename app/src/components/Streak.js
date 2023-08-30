import React from 'react'

import { Bar } from "react-chartjs-2";
import { useState,useEffect } from 'react';
import {CategoryScale} from 'chart.js'; 
import Chart from 'chart.js/auto';
import axios from 'axios';
import { db } from '../firebase/firebase';
import { getDocs } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import RemoveProblemFromStreak from './RemoveProblemFromStreak';
function Streak({streaks}) {
  Chart.register(CategoryScale);

  const[isLoading,setIsLoading]=useState(true)
  
  const [problems,setProblems]=useState()

  useEffect(()=>{
    setIsLoading(false)
  },[])



  const options = {
    maintainAspectRatio: true,
    responsive: true,
    type:"bar",
   // width: 200,
   // height: 100,
    plugins: {
      legend: {
        position: "top",
        margin:"3px",
        
      },
      title: {
        display: true,
        text: "Problems Practiced",
      },
    },
  };

 
  const data= {
    labels:streaks.map((m) => {return m.day}),
    datasets: [
      {
        base:0,
        xAxisId:"Problems",
        label: streaks.map((d)=>{return d.day}),
        data: streaks.map((m) => m.problems!=null? m.problems.length:0),
        backgroundColor: "rgba(50, 270, 100, 0.5)",
      },
    ],
  };

 async function remove(e,s,p){
  e.preventDefault()
  console.log("here")
 const problemsListCollectionRef=collection(db,"problems")
 const user=JSON.parse(sessionStorage.getItem("user"))
 
   const data=await getDocs(problemsListCollectionRef) 
   data.docs.map((d)=>{
   // console.log(p.title)
    
     if(d.data().userId==user.userId && d.data().title==p.title){
      console.log("MATCH")
      axios.post("https://leetcodetracker.onrender.com/try-remove",{problem:p,userId:JSON.parse(sessionStorage.getItem("user")).userId,day:s.day}).then((response)=>{
        console.log(response)
        if(response.data.success){
          alert("SUCCESS: deleted "+ p.title)
        }

      })
       console.log("match")
     }
  
 })
}

 if(!isLoading && streaks.length!=0){
  //console.log(streaks)
 
  console.log(streaks)
  
  return (
    <div class="flex h-[500px]  w-full m-2 border-l-2 border-gray-500 p-3 z-1  ">
      <div class={streaks.length>4?"flex w-full":"flex w-full"}>
      { 
      streaks!=null ?
      <div class=" flex-col z-1 ">
        <div class="h-1/2">
            <Bar class="z-l"options={options} data={data} height={null} width={null} />
            </div>
            <div class="flex  w-[470px] overflow-x-scroll overflow-hidden h-1/2 pt-6" >
          
            {streaks.map((s)=>{
              if(s!=null || s!={}){
            
              return(
                <div class="flex-col m-2 mb-1 ">
                <p class="text-md font-bold">
                {s.day}
                </p>
          
                <ul class={`h-full ${s.problems.length>2?"overflow-y-scroll overflow-hidden ":"" }`}>
                  {
                    s.problems.map((p)=>{
                      if(p!=null){
                 
                   if(Object.keys(p).includes("problem")){
                      return(<RemoveProblemFromStreak p={p.problem} s={s}/>)
                   }else if(!Object.keys(p).includes("problem")){
                       return(<RemoveProblemFromStreak p={p} s={s}/>)

                   }

                      }else{
                        console.log("\n\nnull problem")
                        console.log(p)
                      }
                     
                      })
                  }
                </ul>
                
               

              
              
              
              </div>)


            }
            })}
        
            </div>
      </div>
        :   
 <div>
  
  </div>}
      </div>
    
      
    </div>



)
      }else{
        return(<div></div>)
      }
}



export default Streak