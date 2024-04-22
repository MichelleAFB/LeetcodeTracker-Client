import React from 'react'
import {useState} from 'react'
import {db} from '../../firebase/firebase'
import {doc,updateDoc,getDoc} from 'firebase/firestore'
import ProblemCountMeter from '../ProblemCountMeter'
import { useEffect } from 'react'
function EnvironmentVariables() {
  const[user,setUser]=useState(JSON.parse(sessionStorage.getItem("user")))
  const[userInfo,setUserInfo]=useState()

  const[goodDays,setGoodDays]=useState({/*start:0,end:null*/})
  const[declining,setDeclining]=useState({/*start:null,end:null*/})
  const[critical,setCritical]=useState({/*start:null,end:null*/})
  const[green,setGreen]=useState(JSON.parse(sessionStorage.getItem("green")))
  const[red,setRed]=useState(JSON.parse(sessionStorage.getItem("red")))
  const[orange,setOrange]=useState(JSON.parse(sessionStorage.getItem("orange")))
  const[isLoading,setIsLoading]=useState(true)
  useEffect(()=>{
      const prom=new Promise(async(resolve,reject)=>{
        const userRef=doc(db,"users",user.userId)
        const userInfo=await getDoc(userRef)
        console.log(userInfo.data())
        setUserInfo(userInfo.data())
        if(userInfo!=null){
          const data=userInfo.data()
          setTimeout(()=>{
            if(data.healthyIndex!=null){
            setGoodDays({start:0,end:data.healthyIndex.end})
            setDeclining({start:data.decliningIndex.start,end:data.decliningIndex.end})
            setCritical({start:data.criticalIndex.start,end:data.criticalIndex.end})
            }
            setTimeout(()=>{
              resolve()
            },300)

          },100)
        }
      })

      prom.then(()=>{
        setIsLoading(false)
      })
  },[])

  if(!isLoading){
    console.log(goodDays,declining,critical)

  return (
    <div class="w-full flex p-3">
      <div class="flex-col w-full">
      <p class="text-2xl text-center font-bold">Settings</p>

        <div class="flex-col  rounded-sm m-2">
          <p class="text-xl font-semibold">Question setting:</p>

          <div class="flex-col bg-[#F7E187] p-3">
            <p class="text-lg font-bold">Indexes</p>
            <div class="flex m-2">
                <ProblemCountMeter color={"green"} count={green} backgroundColor={"bg-[#F7E187] "} hideCount={true}/>
                <ProblemCountMeter color={"orange"} count={orange} backgroundColor={"bg-[#F7E187] "} hideCount={true}/>
                <ProblemCountMeter color={"red"} count={red} backgroundColor={"bg-[#F7E187] "} hideCount={true}/>

            </div>
            <p>When do you want to designate questions as in good health, declining and critical?</p>
            
            <div class="flex justify-between">
              <div class="flex">
                <label><p class="font-semibold">Good Health:</p></label>
                <div class="flex-col">
                 <input type="number" class="m-2 rounded-sm" onChange={(e)=>{
                    //setGoodDays({start:e.target.value,end:goodDays.end})
                  }} placeholder="0" value={0} disabled="true"/>
                  <input type="number" class="m-2 rounded-sm" default={goodDays.end} onChange={(e)=>{
                    setGoodDays({start:goodDays.start,end:parseInt(e.target.value)})
                    const next=parseInt(e.target.value)+1
                    console.log(next)
                    console.log(typeof(parseInt(e.target.value)))
                    setDeclining({start:next,end:next+5})
                    setCritical({start:next+6,end:null})
                    
                  }} placeholder={goodDays.end!=null?goodDays.end:"end interval"} />
                </div>
                
              </div>
              <div class="flex">
                <label><p class="font-semibold">Declining Health:</p></label>
                <div class="flex-col">
                 <input type="number" class="m-2 rounded-sm" default={declining.start} onChange={(e)=>{
                   // setDeclining({start:e.target.value,end:declining.end})
                  }} placeholder={declining.start? declining.start:"start interval"} value={declining.start}/>
                  <input type="number" class="m-2 rounded-sm" default={declining.end} onChange={(e)=>{
                    setDeclining({start:declining.start,end:e.target.value})
                    console.log(typeof(e.target.value))
                    const next=parseInt(e.target.value)+1

                    setCritical({start:next,end:critical.end})
                    setCritical({start:next,end:next+7})
                    
                  }} placeholder={declining.end!=null? declining.end:"end interval"} value={declining.end}/>
                </div>
              </div>
              <div class="flex">
                <label class=""><p class="font-semibold">Critical Health:</p></label>
                <div class="flex-col">
                 <input type="number" class="m-2 rounded-sm" default={critical.start} onChange={(e)=>{
                    //setCritical({start:e.target.value,end:critical.end})
                  }}  value={critical.start} placeholder={critical.start!=null? critical.start:"start interval"}/>
                  <input type="number" class="m-2 rounded-sm" default={critical.end} onChange={(e)=>{
                    setCritical({start:critical.start,end:e.target.value})
                  }}   disabled="true"/>
                </div>
              </div>
            </div>
            <div class="flex w-full justify-center">
              <button class="bg-green-500 rounded-sm justify-center w-1/3 align-bottomr" onClick={async()=>{
                const userRef=doc(db,"users",user.userId)
                console.log(goodDays)
                console.log(declining)
                console.log(critical)
                if(declining.end!=null && goodDays.end!=null){
                await updateDoc(userRef,{
                    healthyIndex:goodDays
                })
                await updateDoc(userRef,{
                  decliningIndex:declining,
              })
              await updateDoc(userRef,{
                criticalIndex:critical
            })
              }
                alert("Successfully updated indexes.")
              }}>
                    <p class="text-white font-bold mt-2">Submit</p>
               </button>
            </div>
            

          </div>


          <div class="flex-col bg-[#F7F170] p-3 mt-2">
            <p class="text-lg font-bold">Question Options</p>
            <div class="flex m-2">
              
            </div>
            <p>When do you want to designate questions as in good health, declining and critical?</p>
            
            <div class="flex justify-between">
              <div class="flex">
                <label><p class="font-semibold">Good Health:</p></label>
              
                
              </div>
              <div class="flex">
                <label><p class="font-semibold">Declining Health:</p></label>
               
              </div>
              <div class="flex">
                <label class=""><p class="font-semibold">Critical Health:</p></label>
           
              </div>
            </div>

            <div class="flex w-full justify-center">
              <button class="bg-green-500 rounded-sm justify-center w-1/3 align-bottomr" onClick={async()=>{
                const userRef=doc(db,"users",user.userId)
                console.log(goodDays)
                console.log(declining)
                console.log(critical)
                if(declining.end!=null && goodDays.end!=null){
                await updateDoc(userRef,{
                    healthyIndex:goodDays
                })
                await updateDoc(userRef,{
                  decliningIndex:declining,
              })
              await updateDoc(userRef,{
                criticalIndex:critical
            })
              }
                alert("Successfully updated indexes.")
              }}>
                    <p class="text-white font-bold mt-2">Submit</p>
               </button>
            </div>
          </div>
                  
        </div>
      </div>
    </div>
  )
            }else{
              return(<div></div>)
            }
}

export default EnvironmentVariables