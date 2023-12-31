import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'


import { useState } from 'react'
//redux
import { useDispatch } from 'react-redux'
import { setProblem,setEditProblemVisibility } from '../redux/editProblem/editProblem-actions'
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase/firebase'
import { getDoc } from 'firebase/firestore'
function ProblemListItem({problem,green,red,orange,setRed,setGreen,setOrange,handleOldest}) {
  const u=JSON.parse(sessionStorage.getItem("user"))
  const us=doc(db,"users",u.userId)
  
  const[user,setUser]=useState()
  const[isLoading,setIsLoading]=useState(true)
  const[dateLast,setDateLast]=useState() 
  const[lengthLast,setLengthLast]=useState()
  const[daysSince,setDaysSince]=useState()
  const[useDaysSince,setUseDaysSince,Since]=useState()
  const[edit,setEdit]=useState(false)
  const[halt,setHalt]=useState(true)
  
  const dispatch=useDispatch(false)
  const[reload,setReload]=useState()

  useEffect(()=>{
  var last
    const prom=new Promise(async(resolve,reject)=>{
      const dd = problem.problem.lastPracticed.toString()
      const d=dd.split(" ")
      const date=d[0]+ " "+d[1]+" "+d[2]+" "+d[3]
      const u=await getDoc(us)
      setUser(u.data())
     

      last=date
      setDateLast(date)
      setTimeout(()=>{
        resolve()
      },400)
      
    })

    prom.then(()=>{
      
      const prom1=new Promise((resolve1,reject1)=>{ 
         //console.log(problem.problem.title," ",problem.problem.lastPracticed," dateSet",dateLast)
          resolve1()
      })

      prom1.then(()=>{
        setIsLoading(false)
      })
    })

  },[])


  const navigate=useNavigate() 

  function getPeriod(dateNew){

    var days=-1
    var useDays=false
    var Length=-1


   // console.log(problem.problem.title)
   // console.log("PERIOD")
    const months = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

    const dateArr=dateNew.split(" ")
    const currentDate=new Date()
  
    const curr=currentDate.toString().split(" ")
   
    const currY=curr[3]
    const lastY=dateArr[3]
    const currL=months.indexOf(curr[1])
    const lastL=months.indexOf(dateArr[1]) 
   

    const diff=Math.abs("days since practicing"+lastL-currL)
   
    console.log(diff==0 )
    if(currY==lastL){
      if(diff==0 &&  currY==lastY){
        //console.log("USE DAYS\n\n")
        useDays=true
        
         days=Math.abs(curr[2]-dateArr[2])
        //console.log("days:"+days)
        setDaysSince(days)

      }else{
        

      }
    }

   
   


  }

  


  const deleteProblem=async(problem)=>{
    await deleteDoc(doc(db, "problems", problem.id)).then((response)=>{
      return response
    });
  }

 

  function handleGreen(){
    setGreen(green+1)
    const count=JSON.parse(sessionStorage.getItem("green"))
    sessionStorage.setItem("green",count+1)
    setHalt(false)
   }

   function handleOrange(){
    setOrange(orange+1)
    const count=JSON.parse(sessionStorage.getItem("orange"))
    sessionStorage.setItem("orange",count+1)

    setHalt(false)
   }

   function handleRed(){
    setRed(red+1)
    const count=JSON.parse(sessionStorage.getItem("red"))
 
    sessionStorage.setItem("red",count+1)
    setHalt(false)
   }



   const updateIndex=async(problemRef,timeIndex)=>{
    
    console.log("poblem id",problemRef)
    try{
    await updateDoc(problemRef,{
      id:problem.id,
                    title:problem.problem.title,
                    dataStructure:problem.problem.dataStructure,
                    category:problem.problem.category,
                    lastPracticed:problem.problem.lastPracticed,
                    hints:problem.problem.hints,
                    no_attempts:problem.problem.no_attempts,
                    attempts:problem.problem.attempts,
                    solution:problem.problem.solution,
                    userId:problem.problem.userId, 
                    boilerCode:problem.problem.boilerCode,
                    prompt:problem.problem.prompt,
                    examples:problem.problem.examples,
                    level:problem.problem.level,
                    index:timeIndex
     
    })
  }catch(err){
    console.log("could not set time index",err)
  }
    
  }
   try{
  if(!isLoading ){


    

    var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
    "Aug","Sep","Oct","Nov","Dec"];
    var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
    var cDate=new Date()
    var index=1
    var st=problem.problem.lastPracticed.split(" ")
  
   
  const currDate=cDate.toString().substring(0,15)

    const startDate=new Date(st[3],monthnum[months.indexOf(st[1])-1],st[2])
   
    var nextDate=new Date(startDate);
 
    var nextnext=nextDate.setDate(nextDate.getDate()+1)
  
   
    nextDate=new Date(nextnext)
    var index=1;
   
    while(nextDate.toString().substring(0,15)!=currDate && (nextDate<=cDate)){
      
      var nextnext=nextDate.setDate(nextDate.getDate()+1)
      nextDate=new Date(nextnext)
   
      
      index++
   }

    
    
    
      handleOldest(problem,index)
      problem.problem.index=index

    const problemRef=doc(db,"problems",problem.id)
    if(problem.problem.index==null || problem.problem.index!=index){
    updateIndex(problemRef,index)
    }
    console.log(problem.problem.title)
      console.log(user)
    console.log(index)


    if(   user.healthyIndex!=null? (index<=user.healthyIndex.end ):(index<=7 )){
      return (
        <div className='p-5 bg-white rounded shadow m-3'>
          <div class="flex w-full justify-end">
            <div class="flex w-1/3"><p class="font-semibold text-end text-sm">Practiced {index-1} days ago</p></div>
          </div>
        <div className="flex  items-center mb-4">
        
          <div className="flex w-full">
            <p class="font-bold text-xl">{problem.problem.title.toUpperCase()}</p>
           
          </div>
          
          
          <div
            className="m-2 flex justify-center items-center bg-blue-lighter rounded-full w-8 h-8"
            role="img"
          >
           
          </div>
          <div class="flex justify-end w-full">
            <button class="bg-red-600 rounded-md p-2 justify-self-end m-2" onClick={()=>{
                
              deleteProblem(problem).then((response)=>{
                alert("SUCCESS: deleted problem:"+problem.problem.title)
              })
              }}>
                <p class="text-end text-white">Remove</p>
              </button>
              <button class="bg-gray-300 rounded-md p-2 justify-self-end m-2" onClick={()=>{
                
                setEdit(!edit)
                const prom=new Promise((resolve,reject)=>{
                  console.log("dispatching")
                    dispatch(setProblem(problem))
                    sessionStorage.setItem('editProblem',JSON.stringify(problem))
                    resolve()
                })
    
                prom.then(()=>{
                  dispatch(setEditProblemVisibility(true))
                })
              }}>
                <p class="text-end">Edit</p>
              </button>
            </div>
        </div>
       
        <div className="flex-col text-4x1 text-grey-darkest mb-4  border-gray-400 border-2 p-3">
        <div class="flex">
          <p className="text-green font-bold mr-1">Last Practiced:</p>
          <p>{dateLast}</p>
            
          
             
          </div>
          <div class="flex">
          <span className="text-green mr-1">
             <p class="font-bold text-sm">Attempts:<span class="font-normal ml-2">{problem.problem.no_attempts}</span></p>
             
          </span>
          </div>
          <div class="flex">
          <span className="text-green mr-1">
             <p class="font-bold text-sm ">Category:<span class="font-normal ml-2">{problem.problem.category}</span></p>
             
          </span>
          </div>
        </div>
       
    
          <button class="bg-gray-300 p-3 rounded-sm w-full" onClick={()=>{
              navigate("/practice/"+problem.id+"/"+index)
          }}>
            Practice
          </button>
        
      </div>
          )
        
        }
  
if(   user.decliningIndex!=null? (index>=user.decliningIndex.start && index<user.criticalIndex.start):(index>=7 && index<14)){
  handleOldest(problem,index)
  problem.problem.index=index

  const problemRef=doc(db,"problems",problem.id)
    if(problem.problem.index==null || problem.problem.index!=index){
    updateIndex(problemRef,index)
    }

 
  return (
    <div className='p-5 bg-orange-400 rounded shadow m-3'>
         <div class="flex w-full justify-end">
            <div class="flex w-1/2"><p class="font-semibold text-end text-sm">Practiced {index-1} days ago</p></div>
          </div>
    <div className="flex  items-center mb-4">
      <div className="flex w-full">
        <p class="font-bold text-xl">{problem.problem.title.toUpperCase()}</p>
       
      </div>
      
      
      <div
        className="m-2 flex justify-center items-center bg-blue-lighter rounded-full w-8 h-8"
        role="img"
      >
        
      </div>
      <div class="flex justify-end w-full">
      <button class="bg-red-600 rounded-md p-2 justify-self-end m-2" onClick={()=>{
                
                deleteProblem(problem).then((response)=>{
                  alert("SUCCESS: deleted problem:"+problem.problem.title)
                })
                }}>
                  <p class="text-end text-white">Remove</p>
                </button>
          <button class="bg-gray-300 rounded-md p-2 justify-self-end" onClick={()=>{
            
            setEdit(!edit)
            const prom=new Promise((resolve,reject)=>{
              console.log("dispatching")
                dispatch(setProblem(problem))
                sessionStorage.setItem('editProblem',JSON.stringify(problem))
                resolve()
            })

            prom.then(()=>{
              dispatch(setEditProblemVisibility(true))
            })
          }}>
            <p class="text-end">Edit</p>
          </button>
        </div>
    </div>
  
    <div className="flex-col text-4x1 text-grey-darkest mb-4  border-gray-400 border-2 p-3">
    <div class="flex">
      <p className="text-green font-bold mr-1 text-sm">Last Practiced:</p>
      <p>{dateLast}</p>
        
      
         
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold text-sm">Attempts:<span class="font-normal ml-2">{problem.problem.no_attempts}</span></p>
         
      </span>
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold text-sm">Category:<span class="font-normal ml-2">{problem.problem.category}</span></p>
         
      </span>
      </div>
    </div>
   

      <button class="bg-gray-300 p-3 rounded-sm w-full" onClick={()=>{
          navigate("/practice/"+problem.id+"/"+index)
      }}>
        Practice
      </button>
    
  </div>
      )
    }
      
if(user.criticalIndex!=null ? (user.criticalIndex.start <=index ): (index>=14 )){
  console.log("UNHEALTHY")
// console.log(index,problem.problem.title)
  handleOldest(problem,index)
  problem.problem.index=index
  const problemRef=doc(db,"problems",problem.id)
    if(problem.problem.index==null || problem.problem.index!=index){
    updateIndex(problemRef,index)
    }

  return (
    <div className='p-5 bg-red-400 rounded shadow m-3'>
         <div class="flex w-full justify-end">
            <div class="flex w-1/2"><p class="font-semibold text-end text-sm mb-3">Practiced {index-1} days ago</p></div>
          </div>
    <div className="flex  items-center mb-4">
      <div className="flex w-full">
        <p class="font-bold text-xl">{problem.problem.title.toUpperCase()}</p>
       
      </div>
      
      
      <div
        className="m-2 flex justify-center items-center bg-blue-lighter rounded-full w-8 h-8"
        role="img"
      >
        
      </div>
      <div class="flex justify-end w-full">
      <button class="bg-red-600 rounded-md p-2 justify-self-end m-2" onClick={()=>{
                
                deleteProblem(problem).then((response)=>{
                  alert("SUCCESS: deleted problem:"+problem.problem.title)
                })
                }}>
                  <p class="text-end text-white">Remove</p>
                </button>
          <button class="bg-gray-300 rounded-md p-2 justify-self-end" onClick={()=>{
            
            setEdit(!edit)
            const prom=new Promise((resolve,reject)=>{
              console.log("dispatching")
                dispatch(setProblem(problem))
                sessionStorage.setItem('editProblem',JSON.stringify(problem))
                resolve()
            })

            prom.then(()=>{
              dispatch(setEditProblemVisibility(true))
            })
          }}>
            <p class="text-end">Edit</p>
          </button>
        </div>
    </div>
    
    <div className="flex-col text-4x1 text-grey-darkest mb-4  border-gray-400 border-2 p-3">
    <div class="flex">
      <p className="text-green font-bold mr-1 text-sm">Last Practiced:</p>
      <p>{dateLast}</p>
        
      
         
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold text-sm">Attempts:<span class="font-normal ml-2">{problem.problem.no_attempts}</span></p>
         
      </span>
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold text-sm">Category:<span class="font-normal ml-2">{problem.problem.category}</span></p>
         
      </span>
      </div>
    </div>
   

      <button class="bg-gray-300 p-3 rounded-sm w-full" onClick={()=>{
        console.log(typeof(problem.id.toString()))
         navigate("/practice/"+problem.id.toString()+"/"+index)
      }}>
        Practice
      </button>
    
  </div>
      )
    }
  }
}catch(err){
    return(
      <div class="flex w-full p-3 bg-purple-400">
        problem
      </div>
    )
  }finally{
    //console.log(err)
  }
}

export default ProblemListItem