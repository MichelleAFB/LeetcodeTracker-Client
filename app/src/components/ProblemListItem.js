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
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase/firebase'
function ProblemListItem({problem,green,red,orange,setRed,setGreen,setOrange}) {


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
    const prom=new Promise((resolve,reject)=>{
      console.log(typeof(problem.problem.lastPracticed))
      const dd = problem.problem.lastPracticed.toString()
      const d=dd.split(" ")
      const date=d[0]+ " "+d[1]+" "+d[2]+" "+d[3]
     

      last=date
      setDateLast(date)
      setTimeout(()=>{
        resolve()
      },300)
      
    })

    prom.then(()=>{
      
      const prom1=new Promise((resolve1,reject1)=>{ 
         // console.log("after:"+last)
         
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


    console.log(problem.problem.title)
    console.log("PERIOD")
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

  const fix=(problem1,problem2)=>{
    console.log(problem1)
    console.log(problem2)
  }


  const deleteProblem=async(problem)=>{
    await deleteDoc(doc(db, "problems", problem.id)).then((response)=>{
      return response
    });
  }

 

  function handleGreen(){
    setGreen(green+1)
    const count=JSON.parse(sessionStorage.getItem("green"))
    console.log("green storage:"+count)
    console.log("green:"+green) 
    sessionStorage.setItem("green",count+1)
    setHalt(false)
   }

   function handleOrange(){
    setOrange(orange+1)
    const count=JSON.parse(sessionStorage.getItem("orange"))
    console.log("gorange storage:"+count)
    console.log("orange:"+orange)
    sessionStorage.setItem("orange",count+1)

    setHalt(false)
   }

   function handleRed(){
    setRed(red+1)
    const count=JSON.parse(sessionStorage.getItem("red"))
 
    sessionStorage.setItem("red",count+1)
    console.log("red:"+red)
    setHalt(false)
   }
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
   
    
    if(index<7 && problem.problem.no_attempts!=0){
    
     
      
      return (
        <div className='p-5 bg-white rounded shadow m-3'>
        <div className="flex  items-center mb-4">
        
          <div className="flex w-full">
            <p class="font-bold text-2xl">{problem.problem.title.toUpperCase()}</p>
           
          </div>
          
          
          <div
            className="m-2 flex justify-center items-center bg-blue-lighter rounded-full w-8 h-8"
            role="img"
          >
            <span role="img" aria-label="Ninja-Cat">
              🐱‍👤
            </span>
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
             <p class="font-bold">Attempts:<span class="font-normal mr-2">{problem.problem.no_attempts}</span></p>
             
          </span>
          </div>
          <div class="flex">
          <span className="text-green mr-1">
             <p class="font-bold">Category:<span class="font-normal mr-2">{problem.problem.category}</span></p>
             
          </span>
          </div>
        </div>
       
    
          <button class="bg-gray-300 p-3 rounded-sm w-full" onClick={()=>{
              navigate("/practice/"+problem.id)
          }}>
            Practice
          </button>
        
      </div>
          )
        }
   
  
if(index>7 && index<14){
  
 
  return (
    <div className='p-5 bg-orange-400 rounded shadow m-3'>
    <div className="flex  items-center mb-4">
      <div className="flex w-full">
        <p class="font-bold text-2xl">{problem.problem.title.toUpperCase()}</p>
       
      </div>
      
      
      <div
        className="m-2 flex justify-center items-center bg-blue-lighter rounded-full w-8 h-8"
        role="img"
      >
        <span role="img" aria-label="Ninja-Cat">
          🐱‍👤
        </span>
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
      <p className="text-green font-bold mr-1">Last Practiced:</p>
      <p>{dateLast}</p>
        
      
         
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold">Attempts:<span class="font-normal mr-2">{problem.problem.no_attempts}</span></p>
         
      </span>
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold">Category:<span class="font-normal mr-2">{problem.problem.category}</span></p>
         
      </span>
      </div>
    </div>
   

      <button class="bg-gray-300 p-3 rounded-sm w-full" onClick={()=>{
          navigate("/practice/"+problem.id)
      }}>
        Practice
      </button>
    
  </div>
      )
    }
      
if(index>14 || problem.problem.no_attempts==0){
 
  
  return (
    <div className='p-5 bg-red-400 rounded shadow m-3'>
    <div className="flex  items-center mb-4">
      <div className="flex w-full">
        <p class="font-bold text-2xl">{problem.problem.title.toUpperCase()}</p>
       
      </div>
      
      
      <div
        className="m-2 flex justify-center items-center bg-blue-lighter rounded-full w-8 h-8"
        role="img"
      >
        <span role="img" aria-label="Ninja-Cat">
          🐱‍👤
        </span>
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
      <p className="text-green font-bold mr-1">Last Practiced:</p>
      <p>{dateLast}</p>
        
      
         
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold">Attempts:<span class="font-normal mr-2">{problem.problem.no_attempts}</span></p>
         
      </span>
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold">Category:<span class="font-normal mr-2">{problem.problem.category}</span></p>
         
      </span>
      </div>
    </div>
   

      <button class="bg-gray-300 p-3 rounded-sm w-full" onClick={()=>{
          navigate("/practice/"+problem.id)
      }}>
        Practice
      </button>
    
  </div>
      )
    }
  }
}

export default ProblemListItem