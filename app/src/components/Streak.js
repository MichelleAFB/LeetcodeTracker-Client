import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState,useEffect } from 'react';

function Streak({streaks}) {

  //console.log(streak[0]) 
  const[isLoading,setIsLoading]=useState(true)
  
  const [problems,setProblems]=useState()

  useEffect(()=>{
    setIsLoading(false)
  },[])

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

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

 /*const labels = [
    starters[0].name,
    starters[1].name,
    starters[2].name,
    starters[3].name,
  ];
*/
//console.log(streak)
//console.log(typeof(streak))

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

/**
 *  {
        streak.map((s)=>{
          console.log(s)
          return(
            <div class="bg-cyan-400 p-2 flex m-2 rounded">
             <Bar option={options} data={streak} height="400px"width="300px"/>
            
            </div>
          )
        })
      }
 */

export default Streak