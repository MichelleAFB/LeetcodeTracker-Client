import React, { useEffect } from 'react'
import axios from 'axios';
import { db } from '../firebase/firebase';
import { getDocs } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import {useState} from 'react'
function RemoveProblemFromStreak({s,p}) {
  const[isLoading,setIsLoading]=useState(true)
  const[problem,setProblem]=useState()
  useEffect(()=>{
    const prom=new Promise((resolve,reject)=>{
      if(p!=null){
        setProblem(p)
        setTimeout(()=>{
          resolve()
        },40)
    
      }
    })
    prom.then(()=>{
      setIsLoading(false)
    })
  },[p])

  async function remove(e,s,p){
  e.preventDefault()
    console.log("here")
   const problemsListCollectionRef=collection(db,"problems")
   const user=JSON.parse(sessionStorage.getItem("user"))
   
     const data=await getDocs(problemsListCollectionRef) 
     data.docs.map((d)=>{
     // console.log(p.title)
      
       if(d.data().userId==user.userId && d.data().title==p.title){
   
        axios.post("https://leetcodetracker.onrender.com/try-remove",{problem:p,userId:JSON.parse(sessionStorage.getItem("user")).userId,day:s.day}).then((response)=>{
        
          if(response.data.success){
            alert("SUCCESS: deleted "+ p.title)
          }
  
        })
         console.log("match")
       }
    
   })
  }
  
 if(problem!=null){
  return (
    <div class="flex">
                        <form onSubmit={(e)=>{
                          
                          remove(e,s,p)
                        }}>
                        <button type="submit" class="bg-red-500 p-1 rounded-md m-2">
                          <p class="text-white">x</p>
                        </button>
                        </form>
                        <p class="text-xs m-2">-{problem.title} </p></div>
  )
                      }
}

export default RemoveProblemFromStreak