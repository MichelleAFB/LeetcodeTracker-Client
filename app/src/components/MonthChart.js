import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {useEffect,useState} from 'react'
import axios from 'axios';
import { db } from '../firebase/firebase';
import { collection, getDoc, getDocs } from 'firebase/firestore'
import { useInRouterContext } from 'react-router-dom';
import { doc } from 'firebase/firestore';
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
  const[year,setYear]=useState()
  const[allYears,setAllYears]=useState()

  const[selectedYear,setSelectedYear]=useState(new Date().getUTCFullYear())
  const[creationDate,setCreationDate]=useState()



  useEffect(()=>{
 const years=[]
    const prom=new Promise(async(resolve,reject)=>{
      const user=JSON.parse(sessionStorage.getItem("user"))

      const usersCollectionRef=collection(db,"users")
     const info=await getDocs(usersCollectionRef)
     
     console.log(info.docs)
      info.docs.map((o)=>{
        try{
      /*    console.log(Object.keys(o))
          console.log(o._document)
          console.log(o._document.data.value.mapValue.fields.userId)
          console.log("\n\n")*/
        if(o._document.data.value.mapValue.fields.userId.stringValue.toString()==user.userId){
        console.log("here")
          const d=new Date(o._document.createTime.timestamp.seconds *1000)
        setCreationDate(d.getUTCFullYear())
        var i=0
        var currYear=new Date()
        currYear= Number(currYear.getUTCFullYear())
        var created=Number(d.getUTCFullYear())
        console.log(currYear)
        while(created<=currYear){
          console.log(currYear)
          years.push(currYear)
          currYear--
          
        } 
      }
    }catch(err){
      console.log(err)
    }
      })
      console.log(years.reverse())
     
      axios.get("hhttps://leetcodetracker.onrender.com/monthCharts/"+user.userId+"/"+selectedYear).then((response)=>{
        if(response.data.success){
          console.log(response.data)
            setMonths(response.data.months)
            setComplete(true)
           const y=years.reverse()
            setAllYears(y)
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
    console.log("cuurent year:",selectedYear)
    var i=0
  return (
  <div class="flex w-full justify-center p-5 align-center">
    <p class="text-5xl">Problems by Month</p>

    <div class="flex-col w-full justify-center align-center">

      <p class="mb-4 font-bold text-xl text-center">Total Problems per Month</p>
      <select class="p-2 ml-12 bg-gray-800 rounded-sm text-white justify-center" default={selectedYear.toString()} placeholder={"2024"} onChange={(e)=>{
          console.log("CHANGING YEAR:"+e.target.value)
         
            const user=JSON.parse(sessionStorage.getItem("user"))
            axios.get("https://leetcodetracker.onrender.com/monthCharts/"+user.userId+"/"+e.target.value).then((response)=>{
              if(response.data.success){
                setSelectedYear(e.target.value)
                console.log(response.data)
                  setMonths(response.data.months)
                  setComplete(true)
              }
            })
          }} >
    {
      allYears.map((d)=>{
        console.log(i,d)
        i++
        return(
          <option class="text-white" value={d}><p class="text-white">{d}</p></option>
        )
      })
    }
    </select>
        <Pie data={data} width={200} height={200} />
      </div>
    </div>)/* <Scatter options={options} data={data} />;*/
  }else if(isLoading && complete){
    return(<div>Loading</div>)

  }else{
    return(<div></div>)
  }
}
