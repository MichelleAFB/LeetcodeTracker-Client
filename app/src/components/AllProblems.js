import React from 'react'
import {useState,useEffect} from 'react'

//outside
import axios from 'axios'
import AllProblemsItem from './AllProblemsItem'
import { connect } from 'react-redux'

function AllProblems() {

  const[isLoading,setIsLoading]=useState()
  const[problems,setProblems]=useState()
  const[filtered,setFiltered]=useState()
  const[search,setSearch]=useState(false)

  useEffect(()=>{

    const getProblems=async()=>{
      axios.get("https://leetcodetracker.onrender.com/problems").then((response)=>{
        
        setProblems(response.data.problems)
        setFiltered(response.data.problems)
        setTimeout(()=>{
          return response.data.problem
        },1000)
      
      })
    }

    const prom=new Promise((resolve,reject)=>{
      getProblems().then((response)=>{
      
        resolve()
      })
    })

    prom.then(()=>{
     if(problems!=null){
      setIsLoading(false)
     }
    })

  },[])

  const handleSearch = (e) => {
    if(e.target.value==null || e.target.value==""){
      const fil=problems
      setFiltered(problems)
    }

    const fil=[]

    const prom = new Promise((resolve,reject) => {
      
    setFiltered([])
    problems.map((ev) => {
     
    
      var str=e.target.value.toUpperCase()
      var evie=ev.title.toUpperCase()
      str=str.replace(/ /g,"")
      evie=evie.replace(/ /g,"")
      console.log(evie)
      console.log(str)
      const evieSplit=evie.split(" ")
      
      
      const eve=ev.title
      
      if(evie.includes(str)){ 
        evieSplit.map((o) => {
          if(o.includes(str)){
            //console.log(evie.includes(str))
          
            console.log("\n\n")
            if(!fil.includes(ev))
            fil.push(ev)
          }
        })
        
      }
    })
    console.log(fil)
      resolve(fil)
    })

    prom.then(() => {
      setFiltered(fil)
      console.log("filtered should be")
      console.log(filtered)
  }).catch(
    console.log("filter not working")
  )   
}

  if(!isLoading && problems!=null){
  return ( 
    <div class="flex h-screen w-full flex-col border-gray-100 bg-gray-100 border-b-2 rounded-md m-4 p-3 z-auto">
      <p class="text-2xl text-center font-bold">Problems from Leetcode</p>
      <p class="font-bold text-center text-purple-500 text-xl">{problems.length} Questions</p> 
      <input type="text" class="flex w-full p-2 rounded-md" onFocus={()=>{
        setSearch(true)
      }}onChange={(e)=>{
        handleSearch(e)
      }}/>
      
  { search && filtered!=null?
      <div class=" h-full overflow-y-scroll overflow-hidden  z-10 m-4 p-3">
        {filtered.map((p)=>{
          if(p.prompt!=null){
          return(<AllProblemsItem problem={p}/>)
          }
        })}
      </div>
      :
      <div class=" h-full overflow-y-scroll overflow-hidden z-10 bg-gray-100 m-4 p-3">
        {problems.map((p)=>{
if(p.prompt!=null){
  return(<AllProblemsItem problem={p}/>)
  }        })}
      </div>
      }
    </div>
  )
  }else{
    return(
      <div></div>
    )
  }
}



export default AllProblems