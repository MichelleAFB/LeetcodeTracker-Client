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
    var streaksNeedRefresh=sessionStorage.getItem("streaksNeedRefresh")
    var streaksObject=JSON.parse(sessionStorage.getItem("streaksObject"))
    if(streaksNeedRefresh!=null && streaksObject!=null){
      if(streaksNeedRefresh==false){
        setAllStreaks(streaksObject.streaks)
        setStreaks(streaksObject.streaks)
        setCurrentStreaks(streaksObject.currentStreaks)

      }else{
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
              storeStreaks.needsRefresh=
              sessionStorage.setItem("streaksNeedRefresh",false)
              //sessionStorage.setItem("allStreaks",JSON.stringify(storeStreaks))
              streaksObject={
                currentStreaks:response.data.streaks,
                streaks:response.data.streaks,
                allStreaks:response1.data.streaks
              }
              sessionStorage.setItem("streaksObject",JSON.stringify(streaksObject))
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
                  streaksObject=JSON.parse(sessionStorage.getItem("streaksObject"))
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
      setTimeout(()=>{
        setIsLoading(false)
      },500)
    }else{
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
            storeStreaks.needsRefresh=
            sessionStorage.setItem("streaksNeedRefresh",false)
            //sessionStorage.setItem("allStreaks",JSON.stringify(storeStreaks))
            streaksObject={
              currentStreaks:response.data.streaks,
              streaks:response.data.streaks,
              allStreaks:response1.data.streaks
            }
            try{
            sessionStorage.setItem("streaksObject",JSON.stringify(streaksObject))
            }catch(e){
              console.log(e)
            }
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
                streaksObject=JSON.parse(sessionStorage.getItem("streaksObject"))
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

        
      
      <StreakChart allStreaks={allStreaks} streaks={currentStreaks} />
     </div>
      




    </div>
  )
  }
}

export default AnalyticsPage