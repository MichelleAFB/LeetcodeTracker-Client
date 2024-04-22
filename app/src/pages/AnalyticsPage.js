import React from 'react'
import StreakChart from '../components/StreakChart'
import Challenges from '../components/Challenges'
import { MonthChart } from '../components/MonthChart'
import {useState,useEffect} from 'react'
import { db } from '../firebase/firebase'
import {getDocs,collection,doc,updateDoc} from 'firebase/firestore'
import axios from 'axios'
import {useDispatch} from "react-redux"
import { setHeaderVisibility } from '../redux/user/editUser-actions'
function AnalyticsPage() {

  const [isLoading,setIsLoading]=useState(true)
  const[streaks,setStreaks]=useState()
  const[allStreaks,setAllStreaks]=useState()


    const [months,setMonths]=useState()
    const [currentStreaks,setCurrentStreaks]=useState()
  const dispatch=useDispatch()
  useEffect(()=>{
    const dataArr=[]
    const problemsListCollectionRef=collection(db,"problems")
    const arr=[] 
    const user=JSON.parse(sessionStorage.getItem("user"))
    const years=[]
    dispatch(setHeaderVisibility(true))
  const prom1=new Promise((resolve1,reject1)=>{
    axios.get("http://localhost:3022/current-streak/"+user.userId,{userId:parseInt(user.userId)}).then(async(response)=>{
      const data=await response.data
      setCurrentStreaks(response.data.streaks)
      
      console.log(response)
      if(response.data.streaks!=null){
      axios.get("http://localhost:3022/sort-streaks/"+user.userId,{message:"hi",userId:user.userId}).then(async(response1)=>{
        console.log("allstreaks",response1.data.streaks)
      setAllStreaks(response1.data.streaks)
        const str=response.data.streaks 
        setStreaks(response.data.streaks)
        console.log(response1)
        setTimeout(()=>{
          resolve1()
        },200)

     
      })
    }else{
      resolve1()
    }
      
   

  })

  })
  
  prom1.then(()=>{
    const user=JSON.parse(sessionStorage.getItem("user"))
      const prom1=new Promise((resolve1,reject1)=>{
        axios.get("http://localhost:3022/monthCharts/"+user.userId).then((response)=>{
        if(response.data.success){
            setMonths(response.data.months)
            setTimeout(()=>{
              resolve1()
            })
        }else{
          setIsLoading(false)
          reject1()
        }

      })
      })

      prom1.then(()=>{
        setIsLoading(false)
      }).catch(()=>{
        setIsLoading(false)
      })
   
   })

  },[])
  if(isLoading){
    return(
    <div class="h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div class="flex-col justify-end  ">
          <div class="loading-spinner"/>
      </div>
    
    </div>
    )
  }
  else{
  return (
    <div class="flex w-full h-screen justify-center ">
     <div class="flex-col  w-4/5">
 
        
      <MonthChart/>
      <StreakChart allStreaks={allStreaks} streaks={streaks} />
     </div>
      




    </div>
  )
  }
}

export default AnalyticsPage