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
//<MonthChart userId={user.userId} showTitle={true}/>
  const [isLoading,setIsLoading]=useState(true)
  const[streaks,setStreaks]=useState()
  const[allStreaks,setAllStreaks]=useState()


    const [months,setMonths]=useState()
    const [currentStreaks,setCurrentStreaks]=useState()
  const dispatch=useDispatch()
  const[user,setUser]=useState(JSON.parse(sessionStorage.getItem("user")))
  useEffect(()=>{
    const dataArr=[]
    const problemsListCollectionRef=collection(db,"problems")
    const arr=[] 
    const user=JSON.parse(sessionStorage.getItem("user"))
    const years=[]
    var checkCurrentStreak=JSON.parse(sessionStorage.getItem("currentStreak"))
    const checkAllStreaks=JSON.parse(sessionStorage.getItem("allStreaks"))
    const checkMonthChart=JSON.parse(sessionStorage.getItem("monthChart"))
   
    console.log("currentStreaks",checkCurrentStreak,checkAllStreaks)
 
    dispatch(setHeaderVisibility(true))
    const prom1=new Promise((resolve1,reject1)=>{
    
      axios.get("http://localhost:3022/current-streak/"+user.userId,{userId:parseInt(user.userId)}).then(async(response)=>{
        const data=await response.data
        const storeCurrentStreak=response.data
        storeCurrentStreak.lastFetched=new Date()
        storeCurrentStreak.needsRefresh=false
        sessionStorage.setItem("currentStreak",JSON.stringify(storeCurrentStreak))
        setCurrentStreaks(response.data.streaks)
        
        console.log(response)
      
        axios.get("http://localhost:3022/sort-streaks/"+user.userId,{message:"hi",userId:user.userId}).then(async(response1)=>{
          console.log("allstreaks",response1.data.streaks)
          const storeStreaks=response1.data
          storeStreaks.lastFetched=new Date()
          storeStreaks.needsRefresh=false
          sessionStorage.setItem("allStreaks",JSON.stringify(storeStreaks))
  
        setAllStreaks(response1.data.streaks)
          const str=response.data.streaks 
          setStreaks(response.data.streaks)
          setCurrentStreaks(response.data.streaks)
          console.log(response1)
          setTimeout(()=>{
            resolve1()
          },200)
  
       
        })
      
     
  
    })
  
    })
    
    prom1.then(()=>{
      const user=JSON.parse(sessionStorage.getItem("user"))
        const prom1=new Promise((resolve1,reject1)=>{
          axios.get("http://localhost:3022/monthCharts/"+user.userId).then((response)=>{
          if(response.data.success){
             var storeMonthChart=response.data
             storeMonthChart.lastFetched=new Date()
              storeMonthChart.needsRefresh=false
              sessionStorage.setItem("monthChart",JSON.stringify(storeMonthChart))
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
    /*
    if(checkAllStreaks!=null ){
      if(checkCurrentStreak!=null && checkCurrentStreak.length>0){
        console.log("currnent",checkCurrentStreak)
        checkCurrentStreak.streaks.map((l)=>{
          console.log(new Date(l.day))
          l.day=new Date(l.day)
        })
      }
    if(checkAllStreaks.streaks.length!=0 || checkAllStreaks.needsRefresh || checkAllStreaks.lastFetched.toString().substring(0,15)!=new Date().toString().substring(0,15) ||(checkMonthChart!=null && checkMonthChart.needsRefresh)){
  const prom1=new Promise((resolve1,reject1)=>{
    
    axios.get("http://localhost:3022/current-streak/"+user.userId,{userId:parseInt(user.userId)}).then(async(response)=>{
      const data=await response.data
      const storeCurrentStreak=response.data
      storeCurrentStreak.lastFetched=new Date()
      storeCurrentStreak.needsRefresh=false
      sessionStorage.setItem("currentStreak",JSON.stringify(storeCurrentStreak))
      setCurrentStreaks(response.data.streaks)
      
      console.log(response)
    
      axios.get("http://localhost:3022/sort-streaks/"+user.userId,{message:"hi",userId:user.userId}).then(async(response1)=>{
        console.log("allstreaks",response1.data.streaks)
        const storeStreaks=response1.data
        storeStreaks.lastFetched=new Date()
        storeStreaks.needsRefresh=false
        sessionStorage.setItem("allStreaks",JSON.stringify(storeStreaks))

      setAllStreaks(response1.data.streaks)
        const str=response.data.streaks 
        setStreaks(response.data.streaks)
        setCurrentStreaks(response.data.streaks)
        console.log(response1)
        setTimeout(()=>{
          resolve1()
        },200)

     
      })
    
   

  })

  })
  
  prom1.then(()=>{
    const user=JSON.parse(sessionStorage.getItem("user"))
      const prom1=new Promise((resolve1,reject1)=>{
        axios.get("http://localhost:3022/monthCharts/"+user.userId).then((response)=>{
        if(response.data.success){
           var storeMonthChart=response.data
           storeMonthChart.lastFetched=new Date()
            storeMonthChart.needsRefresh=false
            sessionStorage.setItem("monthChart",JSON.stringify(storeMonthChart))
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
  }else{
    console.log("sessionStorage all streaks",checkAllStreaks)
    const prom=new Promise((resolve,reject)=>{
      checkAllStreaks.needsRefresh=false;
      sessionStorage.setItem("allStreaks",JSON.stringify(checkAllStreaks))
      console.log(checkAllStreaks)
      console.log("\n\n\ncurrent",checkCurrentStreak)
      setCurrentStreaks(checkCurrentStreak)
      setAllStreaks(checkAllStreaks.streaks)
      setMonths(checkMonthChart)
      setTimeout(()=>{
        resolve()
      },400)
    })

    prom.then(()=>{
      setIsLoading(false)
    })
  }
  }else{
    console.log("ALLSTREAKS DOENOT EXIST")
    const prom1=new Promise((resolve1,reject1)=>{
    
      axios.get("http://localhost:3022/current-streak/"+user.userId,{userId:parseInt(user.userId)}).then(async(response)=>{
        const data=await response.data
        console.log(response)
  
        if(response.data.streaks!=null){
          const storeCurrentStreak=response.data.streaks
          storeCurrentStreak.lastFetched=new Date().toString()
          storeCurrentStreak.needsRefresh=false
          sessionStorage.setItem("currentStreak",JSON.stringify(storeCurrentStreak))
          setCurrentStreaks(response.data.streaks)
        }
        axios.get("http://localhost:3022/sort-streaks/"+user.userId,{message:"hi",userId:user.userId}).then(async(response1)=>{
          console.log("allstreaks",response1.data.streaks)
          const storeStreaks=response1.data
          storeStreaks.lastFetched=new Date().toString()
          storeStreaks.needsRefresh=false
          sessionStorage.setItem("allStreaks",JSON.stringify(storeStreaks))
  
        setAllStreaks(response1.data.streaks)
          const str=response.data.streaks 
          setStreaks(response.data.streaks)
          setCurrentStreaks(response.data.streaks)
          console.log(response1)
          setTimeout(()=>{
            resolve1()
          },200)
  
       
        })
     
        
     
  
    })
  
    })
    
    prom1.then(()=>{
      const user=JSON.parse(sessionStorage.getItem("user"))
        const prom1=new Promise((resolve1,reject1)=>{
          axios.get("http://localhost:3022/monthCharts/"+user.userId).then((response)=>{
          if(response.data.success){
             var storeMonthChart=response.data
             storeMonthChart.lastFetched=new Date().toString()
              storeMonthChart.needsRefresh=false
              sessionStorage.setItem("monthChart",JSON.stringify(storeMonthChart))
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
  }
*/
  },[])
  if(isLoading){
    console.log("current",currentStreaks)
    return(
    <div class="h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div class="flex-col justify-end  ">
          <div class="loading-spinner"/>
      </div>
    
    </div>
    )
  }
  else{
    console.log("\n\n\n\n\n\n\n",allStreaks)
  return (
    <div class="flex w-full h-screen justify-center ">
     <div class="flex-col  w-4/5">

        
      
      <StreakChart allStreaks={allStreaks} streaks={currentStreaks} />
     </div>
      




    </div>
  )
  }
}

export default AnalyticsPage