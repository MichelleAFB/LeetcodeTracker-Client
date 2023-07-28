import React from 'react'

import { Bar } from "react-chartjs-2";
import { useState,useEffect } from 'react';
import {CategoryScale} from 'chart.js'; 
import Chart from 'chart.js/auto';
import axios from 'axios';
function Streak({streaks}) {
  Chart.register(CategoryScale);

  //console.log(streak[0]) 
  const[isLoading,setIsLoading]=useState(true)
  
  const [problems,setProblems]=useState()

  useEffect(()=>{
    setIsLoading(false)
  },[])



  const options = {
    maintainAspectRatio: true,
    width: 200,
    height: 100,
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

 

 if(!isLoading){
  
  console.log(streaks.length)
  const data= {
    labels:streaks.map((m) => {return m.day}),
    datasets: [
      {
        base:0,
        dataIndex:"hello",
        xAxisId:"Problems",
        label: streaks.map((d)=>{return d.day}),
        data: streaks.map((m) => m.problems.length),
        backgroundColor: "rgba(50, 270, 100, 0.5)",
      },
    ],
  };
 
 
  return (
    <div class="flex w-full m-2 border-l-2 border-gray-500 p-3 z-1 ">
      <div class="overflow-x-scroll overflow-hidden">
      { 
      streaks!=null ?
      <div class="flex-col z-1">
            <Bar class="z-l"options={options} data={data} height='400px' width='300px' />
            <div class="flex">
            {streaks.map((s)=>{
              return(
                <div class="flex-col m-2">
                <p class="text-md font-bold">
                {s.day}
                </p>
                <ul class="h-[150px] overflow-y-scroll overflow-hidden">
                  {
                    s.problems.map((p)=>{
                      console.log(p)
                      return(<div class="flex"><button class="bg-red-500 p-1 rounded-md m-2" onClick={()=>{
                        axios.post("https://leetcodetracker.onrender.com/remove-from-streak",{problem:p,userId:JSON.parse(sessionStorage.getItem("user")).userId,day:s.day}).then((response)=>{
                          console.log(response)

                        })
                      }
                      }><p class="text-white">x</p></button><p class="text-xs m-2">-{p.title} {p.id}</p></div>)
                    })
                  }
                </ul>
              </div>)
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