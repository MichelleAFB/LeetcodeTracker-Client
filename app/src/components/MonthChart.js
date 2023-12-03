import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {useEffect,useState} from 'react'
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);


/*
export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const data = {
  datasets: [
    {
      label: 'A dataset',
      data: Array.from({ length: 100 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
      })),
      backgroundColor: 'rgba(255, 99, 132, 1)',
    },
  ],
};
*/
export function MonthChart() {
  

  const [isLoading,setIsLoading]=useState(true)
  const [complete,setComplete]=useState(false)
  const[months,setMonths]=useState()

  useEffect(()=>{

    const prom=new Promise((resolve,reject)=>{
      const user=JSON.parse(sessionStorage.getItem("user"))
      axios.get("https://leetcodetracker.onrender.com/monthCharts/"+user.userId).then((response)=>{
        if(response.data.success){
            setMonths(response.data.months)
            setComplete(true)
            setTimeout(()=>{
              resolve()
            })
        }
      })
    })

    prom.then(()=>{
      setIsLoading(false)

    })

  },[])
  if(!isLoading && complete){
    console.log(months)
     const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June',"July","August","September","October","November","December"],
      datasets: [
        {
          label:["Total problems:"],
          data: months.map((m)=>{
            return m.problems
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
  return (
  <div class="flex w-full justify-center p-5">
    <p class="text-5xl">Problems by Month</p>

    <div class="flex-col w-2/3">
      <p class="mb-4 font-bold text-xl text-center">Total Problems per Month</p>
        <Pie data={data} width={200} height={200} />
      </div>
    </div>)/* <Scatter options={options} data={data} />;*/
  }else if(isLoading && complete){
    return(<div>Loading</div>)

  }else{
    return(<div></div>)
  }
}
