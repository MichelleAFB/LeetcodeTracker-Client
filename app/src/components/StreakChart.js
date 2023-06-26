import React from 'react'
import {useState,useEffect} from 'react'

import { db } from '../firebase/firebase'
import {getDocs,collection,doc,updateDoc} from 'firebase/firestore'

import axios from 'axios'

function StreakChart() {

  const [problems,setProblems]=useState()

  useEffect(()=>{
    const dataArr=[]
    const problemsListCollectionRef=collection(db,"problems")
    const prom=new Promise(async(resolve,reject)=>{
     
      const user=JSON.parse(sessionStorage.getItem("user"))
      const userType=JSON.parse(sessionStorage.getItem("userType"))

    const data=await getDocs(problemsListCollectionRef)
    data.docs.map((doc)=>{
      
      if(doc.data().userId==user.userId){
      console.log(doc.data().title)
        dataArr.push({problem:doc.data(),id:doc.id})
      } 
    })
    resolve(dataArr)

  })

  prom.then(()=>{
    console.log(dataArr)
    setProblems(dataArr)

  const prom1=new Promise((resolve1,reject1)=>{
    axios.post("http://localhost:3022/streak",{problems:dataArr}).then((response)=>{
      console.log(response)
    })

  })

  prom.then(()=>{

  })
  })

  },[])


  const [may,setMay]=useState()
  const [apr,setApr]=useState()
  const[jun,setJun]=useState()
  const [mar,setMar]=useState()

  

  const generate=()=>{

    const May=[]
    const Apr=[]
    const Mar=[]
    const Jun=[]
    
    problems.map((r)=>{
      const attempts=r.problem.attempts
      Object.keys(attempts).forEach(
        function(key,index){
          const date=attempts[key].date
          if(date!=null){
          
            if(date.includes("Mar")){
              Mar.push({problem:r.problem.title,date:date})

            }
            if(date.includes("Apr")){
              Apr.push({problem:r.problem.title,date:date})

            }
            if(date.includes("May")){
              May.push({problem:r.problem.title,date:date})

            }
            if(date.includes("Jun")){
              Jun.push({problem:r.problem.title,date:date})

            }

          }
       
        }
      )
    })

    setTimeout(()=>{
      
      setMay(May)
      setApr(Apr)
      setJun(Jun)
      setMar(Mar)

      setTimeout(()=>{
        sort()
      },500)
      
    },200)
  }
  const [months,setMonths]=useState(false)

  const sort=()=>{
  
    const months=[mar,apr,may,jun]
    
    setMonths(true)

    months.map((m)=>{
     m.map((date)=>{
     
     })
    })
    

  }

  console.log(months)
  return (
    <div>
      {months==true ?
      <div>
        {
          
          apr.map((r)=>{
            var i=0
            may.map((d)=>{
              console.log(d.problem==r.problem)
              const n=d.problem==r.problem
              console.log(n)
              if(n==true){
                console.log("\n\nHERE\n\n")
                i++
                console.log(r.problem+": "+i+"\n\n")
              }
            })
          })
        
        }
      </div>
      :
      <div>
      </div>

      }

    </div>
  )
}

export default StreakChart