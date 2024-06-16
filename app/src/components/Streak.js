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
 

  const[isLoading,setIsLoading]=useState(true)
  const [data,setData]=useState()
  
  
  const [problems,setProblems]=useState()
 const[ourOptions,setOurOptions]=useState()
  useEffect(()=>{
  var ourData
  const days=[]
  const dayData=[]
  if(streaks!=null && streaks.length>0){
    const prom=new Promise(async(resolve,reject)=>{
      var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
      "Aug","Sep","Oct","Nov","Dec"];
      var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
      try{
      var contains=streaks.map((s)=>{
        var date=s.day.split(" ")
        date=new Date(date[3],monthnum[months.indexOf(date[1])-1],date[2])
    console.log(s.day)
        if(useSelectedMonth && (s.day.toString().includes(selectedMonth)) ){
          return true
        }
      })
      console.log("Contains",contains)
    }catch(err){
      console.log("\n\n",err)
    }
 
       ourData= {
 
        labels:streaks.map((d)=>{
          if(!days.includes(d.day)){
            days.push(d.day)
          return new Date(d.day).toString().substring(0,15)
          }
        }),
        datasets:[
          {
            labels:streaks.map((d)=>{
              if(!days.includes(d.day)){
                days.push(d.day)
              if(useSelectedYear){
                if(d.day.toString().substring(0,15).includes(selectedYear.toString())){
                  if(useSelectedMonth){
                    if(useSelectedYear){
                      if(contains.includes(true)&& d.day.toString().substring(0,15).includes(selectedYear.toString())){
                        return typeof(d.day)=="Object"? d.day.toString().substring(0,15):d.day.toString().substring(0,15)                      }
                    }else{
                      return typeof(d.day)=="Object"? d.day.toString().substring(0,15):d.day.toString().substring(0,15)                    }
                  }else{
                    return typeof(d.day)=="Object"? d.day.toString().substring(0,15):d.day.toString().substring(0,15)                  }
                }
              }else{
                if(useSelectedMonth){
                  if(d.day.toString().substring(0,15).includes(selectedMonth)){
                    return typeof(d.day)=="Object"? d.day.toString().substring(0,15):d.day.toString().substring(0,15)

                  }
                }else{
                  return typeof(d.day)=="Object"? "hi":"hi"

                }
              }
            }
            }),
            data:streaks.map((d)=>{
              console.log(days)
              if(!dayData.includes(d.day)){
                dayData.push(d.day)
                if(useSelectedYear){
                if(d.day.toString().substring(0,15).includes(selectedYear.toString())){
                  if(useSelectedMonth){
                    if(d.day.toString().substring(0,15).includes(selectedMonth)){
                      return d.problems.length
                    }
                  }else{
                    return d.problems.length
                  }
                }
              }else{
                if(useSelectedMonth){
                  if(useSelectedYear){
                  if(d.day.toString().substring(0,15).includes(selectedMonth) && d.day.toString().substring(0,15).includes(selectedYear.toString())){
                    return d.problems.length
                  }
                }else{
                  return d.problems.length
                }
                }else{
                  return d.problems.length
                }
              }
            }
            })
          }
        ]
       
          
        
      }
      console.log("ourData",ourData)
      setTimeout(()=>{
        setData(ourData)
        setTimeout(()=>{
          resolve()

        },800)

      },1000)
      })


    prom.then(()=>{
      //setData()
      const prom=new Promise((resolve,reject)=>{
        var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
        "Aug","Sep","Oct","Nov","Dec"];
        var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
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
              title:streaks.map((d)=>{
           
                var date= d.day instanceof Date? d.day:d.day.split(" ")
                if((date instanceof Date)==false){
                 date=new Date(date[3],monthnum[months.indexOf(date[1])-1],date[2])
                }
                return typeof(d.day)=="Object"? date.toString().substring(0,15):d.day.toString().substring(0,15)
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
        setOurOptions(options)
        setTimeout(()=>{
          resolve()
        },100)
      })
      prom.then(()=>{
        setIsLoading(false)
      })
   
    })
  }
  },[useSelectedMonth,selectedMonth,selectedYear,useSelectedYear])




 


 async function remove(e,s,p){
  e.preventDefault()
 
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

  var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
  "Aug","Sep","Oct","Nov","Dec"];
  var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]

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
        title:streaks.map((d)=>{

          var date=d.day instanceof Date?d.day:d.day.split(" ")
          if(!(date instanceof Date)){
           date=new Date(date[3],monthnum[months.indexOf(date[1])-1],date[2])
          }
          return typeof(d.day)=="Object"? date.toString().substring(0,15):d.day.toString().substring(0,15)
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

  //console.log(streaks)
 //console.log("useSelectedYear",useSelectedYear,"selected Year:",selectedYear," useSelected Month:",useSelectedMonth," selected Month:",selectedMonth)
 //console.log(data)
  
  return (
    <div class="flex h-[550px]  w-full border-l-2 border-gray-500 p-3 z-1  m-5">
      <div class={streaks.length>4?"w-[50vw] overflow-x-scroll overflow-hidden ":"w-[50vw] overflow-x-scroll overflow-hidden "}>
      { 
      streaks!=null ?
      <div class=" flex-col z-1 ">
        <div class="h-1/3"> 
            <Bar class="z-l"options={ourOptions} data={data} height={null} width={null} />
            </div>
            <div class={`flex  w-[${data.datasets[0].data.length>5? "80":"50"}vw] overflow-x-scroll overflow-hidden h-2/3 pt-6`} >
          
            {streaks.map((s)=>{
              if(s!=null || s!={}){
            
              return(
                <div class="flex-col m-2 mb-1 border-r-2 border-gray-300 ">
                <p class="text-md font-bold">
                {useSelectedYear && useSelectedMonth && s.day.toString().substring(0,15).includes(selectedMonth) && s.day.toString().substring(0,15).includes(selectedYear.toString())? 
                <div>
                    <p>{new Date(s.day).toString().substring(0,15)}</p>
                    <ul class={`h-[100px] ${s.problems.length>2?"overflow-y-scroll overflow-hidden ":"" }`}>
                  {
                    s.problems.map((p)=>{
                    
                      if(p!=null){
              if(useSelectedYear){
                 if(!useSelectedMonth  && s.day.toString().substring(0,15).includes(selectedYear.toString())){
                   if(Object.keys(p).includes("problem")){
                   
                      return(<RemoveProblemFromStreak p={p.problem} s={s}/>)
                   }else if(!Object.keys(p).includes("problem")){
                       return(<div><RemoveProblemFromStreak p={p} s={s}/></div>)

                   }

                      }else if(useSelectedMonth && s.day.toString().substring(0,15).includes(selectedMonth) && s.day.toString().substring(0,15).includes(selectedYear.toString())){
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
                    {useSelectedYear && !useSelectedMonth && s.day.toString().substring(0,15).includes(selectedYear.toString())? 
                      <div>
                      <p>{new Date(s.day).toString().substring(0,15)}</p>
                      <ul class={`h-[100px] ${s.problems.length>2?"overflow-y-scroll overflow-hidden ":"" }`}>
                    {
                      s.problems.map((p)=>{
                      
                        if(p!=null){
                if(useSelectedYear){
                   if(!useSelectedMonth  && s.day.toString().substring(0,15).includes(selectedYear.toString())){
                     if(Object.keys(p).includes("problem")){
                     
                        return(<RemoveProblemFromStreak p={p.problem} s={s}/>)
                     }else if(!Object.keys(p).includes("problem")){
                         return(<div><RemoveProblemFromStreak p={p} s={s}/></div>)
  
                     }
  
                        }else if(useSelectedMonth && s.day.toString().substring(0,15).includes(selectedMonth) && s.day.toString().substring(0,15).includes(selectedYear.toString())){
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
                    <p>{new Date(s.day).toString().substring(0,15)}</p>
                    <ul class={`h-[150px] ${s.problems.length>2?"overflow-y-scroll overflow-hidden ":"" }`}>
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