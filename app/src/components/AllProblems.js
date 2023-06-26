import React from 'react'
import {useState,useEffect} from 'react'

//outside
import axios from 'axios'
import AllProblemsItem from './AllProblemsItem'

function AllProblems() {

  const[isLoading,setIsLoading]=useState()
  const[problems,setProblems]=useState()
  const[filtered,setFiltered]=useState()
  const[search,setSearch]=useState(false)

  useEffect(()=>{

    const getProblems=async()=>{
      axios.get("https://leetcodetracker.onrender.com/problems").then((response)=>{
        console.log(response)
        console.log(response)
        setProblems(response.data.problems)
        setFiltered(response.data.problems)
        setTimeout(()=>{
          return response.data.problem
        },1000)
      
      })
    }

    const prom=new Promise((resolve,reject)=>{
      getProblems().then((response)=>{
        console.log(response)
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
      console.log("\n\n")
      console.log(eve)
      //console.log(eve)
      console.log(evie.includes(str))
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
    <div class="flex flex-col bg-gray-400 rounded-md m-4 p-3">
      <p class="text-2xl text-center font-bold">Problems from Leetcode</p>
      <p class="font-bold text-center text-purple-500 text-xl">{problems.length} Questions</p> 
      <input type="text" class="flex w-full p-2 rounded-md" onFocus={()=>{
        setSearch(true)
      }}onChange={(e)=>{
        handleSearch(e)
      }}/>
      
  { search && filtered!=null?
      <div class=" h-[60vh] overflow-y-scroll overflow-hidden bg-gray-400 m-4 p-3">
        {filtered.map((p)=>{
          return(<AllProblemsItem problem={p}/>)
        })}
      </div>
      :
      <div class=" h-[80vh] overflow-y-scroll overflow-hidden bg-gray-400 m-4 p-3">
        {problems.map((p)=>{
          return(<AllProblemsItem problem={p}/>)
        })}
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