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

function Streak({streaks,selectedMonth,useSelectedMonth,selectedYear,useSelectedYear}) {
  Chart.register(CategoryScale);
  console.log(selectedYear)

  const[isLoading,setIsLoading]=useState(true)
  
  
  const [problems,setProblems]=useState()
  console.log("\n",streaks)
  useEffect(()=>{
    const prom=new Promise(async(resolve,reject)=>{
      resolve()
      })


    prom.then(()=>{
      setIsLoading(false)
    })
 
  },[useSelectedMonth,selectedMonth,selectedYear,useSelectedYear])



  const options = {
    maintainAspectRatio: true,
    responsive: true,
    type:"bar",
   // width: 200,
   // height: 100,
   scale: {
    ticks: {
      stepSize: 1
    }
  },
    plugins: {
      legend: {
        position: "top",
        margin:"3px",
        labels:["hi","hi"],
        title:streaks.map((s)=>{
          return(s.day)
        })

        
      },
      title: {
        display: true,
        text: "Problems Practiced",
      },
      tootip:{
        title:"Problem"
      }
    },
  };

 
  const data= {
    labels:streaks.map((m) => {
      if(useSelectedMonth && m.day.includes(selectedMonth) && m.day.includes(selectedYear)){
        return m.day
      }else{
        if(useSelectedMonth==false && m.day.includes(selectedYear)){
          return m.day
        }
      }
    }),
    datasets: [
      {
        base:0,
        xAxisId:"Problems",
        labels: streaks.filter((d)=>{
          if(useSelectedYear && d.day.includes(selectedYear.toString())){
          if(useSelectedMonth){
          if( d.day.includes(selectedMonth) && d.day.includes(selectedYear.toString())){
          return d.day
        }
      }else if(!useSelectedMonth){
        if(d.day.includes(selectedYear.toString())){
          return d.day
        }
      }
    }else{
        return d.day  
    }
        }),
        data: streaks.map((d) => {
          if(useSelectedYear && d.day.includes(selectedYear.toString())){
            if(useSelectedMonth){
            if( d.day.includes(selectedMonth) && d.day.includes(selectedYear.toString())){
            return d.problems.length
          }
        }else if(!useSelectedMonth){
          if(d.day.includes(selectedYear.toString())){
            return d.problems.length
          }
        }
      }else{
        console.log(d.day)
          return d.problems.length
        
      }
      }),
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
 console.log("useSelectedYear",useSelectedYear)
 
  
  return (
    <div class="flex h-[550px]  w-full m-2 border-l-2 border-gray-500 p-3 z-1  ">
      <div class={streaks.length>4?"flex w-full":"flex w-full"}>
      { 
      streaks!=null ?
      <div class=" flex-col z-1 ">
        <div class="h-1/3">
            <Bar class="z-l"options={options} data={data} height={null} width={null} />
            </div>
            <div class="flex  w-[470px] overflow-x-scroll overflow-hidden h-2/3 pt-6" >
          
            {streaks.map((s)=>{
              if(s!=null || s!={}){
            
              return(
                <div class="flex-col m-2 mb-1 ">
                <p class="text-md font-bold">
                {useSelectedYear && useSelectedMonth && s.day.includes(selectedMonth) && s.day.includes(selectedYear.toString())? 
                <div>
                    <p>{s.day}</p>
                    <ul class={`h-[250px] ${s.problems.length>2?"overflow-y-scroll overflow-hidden ":"" }`}>
                  {
                    s.problems.map((p)=>{
                    
                      if(p!=null){
              if(useSelectedYear){
                 if(!useSelectedMonth  && s.day.includes(selectedYear.toString())){
                   if(Object.keys(p).includes("problem")){
                   
                      return(<RemoveProblemFromStreak p={p.problem} s={s}/>)
                   }else if(!Object.keys(p).includes("problem")){
                       return(<div><RemoveProblemFromStreak p={p} s={s}/></div>)

                   }

                      }else if(useSelectedMonth && s.day.includes(selectedMonth) && s.day.includes(selectedYear.toString())){
                        if(Object.keys(p).includes("problem")){
                          return(<div>hi1<RemoveProblemFromStreak p={p} s={s}/></div>)
                       }else if(!Object.keys(p).includes("problem")){
                           return(<RemoveProblemFromStreak p={p} s={s}/>)
    
                       }
                      }
                    }else{
                      if(Object.keys(p).includes("problem")){
                        console.log(p.problem.title)
                        return(<div><RemoveProblemFromStreak p={p} s={s}/></div>)
                      }
                    }
                    }
                     
                      })
                    
                  }
                </ul>
                    
                </div>:<p>{
                   
                }
                
                </p>
                }
                    {useSelectedYear && !useSelectedMonth && s.day.includes(selectedYear.toString())? 
                      <div>
                      <p>{s.day}</p>
                      <ul class={`h-[250px] ${s.problems.length>2?"overflow-y-scroll overflow-hidden ":"" }`}>
                    {
                      s.problems.map((p)=>{
                      
                        if(p!=null){
                if(useSelectedYear){
                   if(!useSelectedMonth  && s.day.includes(selectedYear.toString())){
                     if(Object.keys(p).includes("problem")){
                     
                        return(<RemoveProblemFromStreak p={p.problem} s={s}/>)
                     }else if(!Object.keys(p).includes("problem")){
                         return(<div><RemoveProblemFromStreak p={p} s={s}/></div>)
  
                     }
  
                        }else if(useSelectedMonth && s.day.includes(selectedMonth) && s.day.includes(selectedYear.toString())){
                          if(Object.keys(p).includes("problem")){
                            return(<div>hi1<RemoveProblemFromStreak p={p} s={s}/></div>)
                         }else if(!Object.keys(p).includes("problem")){
                             return(<RemoveProblemFromStreak p={p} s={s}/>)
      
                         }
                        }
                      }else{
                        if(Object.keys(p).includes("problem")){
                       
                          return(<div><RemoveProblemFromStreak p={p} s={s}/></div>)
                        }
                      }
                      }
                       
                        })
                      
                    }
                  </ul>
                      
                  </div>
                    :<p>{
    
                }
                
                </p>
                }
                
                 {!useSelectedYear ?   
                 <div>
                    <p>{s.day}</p>
                    <ul class={`h-[250px] ${s.problems.length>2?"overflow-y-scroll overflow-hidden ":"" }`}>
                  {
                    s.problems.map((p)=>{
               
                      if(p!=null){
                        return(<div><RemoveProblemFromStreak p={p} s={s}/></div>)
                    }   
                 })
                    
                  }
                </ul>
                    
                </div>:<p>
                </p>
                }
                </p>
          
             
                
               

              
              
              
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