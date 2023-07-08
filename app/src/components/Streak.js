import React from 'react'

import { Bar } from "react-chartjs-2";
import { useState,useEffect } from 'react';
import {CategoryScale} from 'chart.js'; 
import Chart from 'chart.js/auto';

function Streak({streaks}) {

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
        margin:"3px"
      },
      title: {
        display: true,
        text: "Problems Practiced",
      },
    },
  };

 

 if(!isLoading){
  Chart.register(CategoryScale);
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
    <div class="flex w-full m-2 border-l-2 border-gray-500 p-3">
     { 
      streaks!=null ?
      <div >
            <Bar options={options} data={data} height='400px' width='300px' />
      </div>
        :   
 <div>
  
  </div>}
      
    </div>
  )
      }else{
        return(<div></div>)
      }
}



export default Streak