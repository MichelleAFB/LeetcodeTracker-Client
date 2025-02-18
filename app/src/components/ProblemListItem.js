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
import { doc, deleteDoc, updateDoc,getDocs,collection } from "firebase/firestore";
import { db } from '../firebase/firebase'
import { getDoc } from 'firebase/firestore'
import { setOtherUsersProblem, setOtherUsersProblemVisibility,setCurrentUser,setOtherUser } from '../redux/addOtherUsersProblem/addOtherUsersProblem-reducer'
import { addLeetcodeProblemReload } from '../redux/addLeetcodeProblem.js/addLeecodeProblem-reducer'
import axios from 'axios'
function ProblemListItem({id,problem,green,red,orange,setRed,setGreen,setOrange,handleOldest}) {
 /*
    if id arguement is present, it means it is another user viewing this users problem list. and attempting to
    try to solve the question.disable edit or delete capability. In practice page disable submit and boiler plate
    modification

 */
 
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
  const[hasTestCases,setHasTestCases]=useState(false)
  const[testCases,setTestCases]=useState()
  const dispatch=useDispatch(false)
  const[index,setIndex]=useState(0)
  const[reload,setReload]=useState()
  var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
    "Aug","Sep","Oct","Nov","Dec"];
    var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
    var lastDate
    function isDateValid(dateString) {

      return !isNaN(Date.parse(dateString)); 
    
    }
    function convertDate(dateString) {
      const parts = dateString.split(" ");
      const day = parseInt(parts[2], 10);
      const m=months.indexOf(parts[1])
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      //console.log(parseInt("\n\n",m))
      const year = parseInt(parts[3], 10);
    //console.log("day",day,"month",parts[1]," ",month,"year",year)
      return new Date(year, month, day);
    }
    const prob=JSON.parse(sessionStorage.getItem("problems"))
    var problemIndexes=JSON.parse(sessionStorage.getItem("problemIndexes"))
  useEffect(()=>{
    var needsRefresh=false
    const timeLastUpdatedIndex=sessionStorage.getItem("timeLastUpdatedIndex")
    //console.log(timeLastUpdatedIndex)
    
  var last
  var d
    const prom=new Promise(async(resolve,reject)=>{
    // console.log("\n\n",problem.problem.lastPracticed.seconds)
      const dd = typeof problem.problem.lastPracticed =='string'? problem.problem.lastPracticed:new Date(problem.problem.lastPracticed.seconds*1000)
      
      

      //console.log(d) 
      //setDaysSince
     
      const u=await getDoc(us)
      setUser(u.data())
     setDateLast(new Date(problem.problem.lastPracticed).seconds*1000)
     var ind=daysBetween(new Date(problem.problem.lastPracticed.seconds*1000),new Date())
     if(problem.problem.lastPracticed!=null){
     
    setIndex(ind)
    }
    setTestCases(problem.problem.testCases)
    setTimeout(()=>{
      resolve()
    },400)
     if(problemIndexes==null){
      
      const problemRef=doc(db,"problems",problem.id)
      if(problemIndexes==null){
        problemIndexes={}
        problemIndexes[`${problem.problem.title}`]=new Date()
        sessionStorage.setItem("problemsIndexes",JSON.stringify(problemIndexes))
        
        await updateDoc(problemRef,{
          index:ind
        }).then(()=>{
          last=d
          setDateLast(d)
          setTimeout(()=>{
            resolve()
          },200)
        })
        
        needsRefresh=true
      }else{
        if(!Object.keys(problemIndexes).includes(problem.problem.title)){
          var key=problem.problem.title
          Object.assign(problemIndexes,{key:new Date()})
          sessionStorage.setItem("problemsIndexes",JSON.stringify(problemIndexes))
          await updateDoc(problemRef,{
            index:ind
          }).then(()=>{
            last=d
            setDateLast(d)
            setTimeout(()=>{
              resolve()
            },200)
          })
          
 
        }
      }

    }else{
      sessionStorage.setItem("timeLastUpdatedIndex",new Date().toString().substring(0,15))
      needsRefresh=true
    }

     if(problem.problem.link==null || problem.problem.acRate==null || problem.problem.difficulty==null || problem.problem.level==null || problem.problem.testCases==null ){
      
      setHasTestCases(true)
      
      
     /* axios.post("http://localhost:3022/getProblemByTitle",{title:problem.problem.title}).then(async(response)=>{
      if(response.data.success){
        console.log(response.data)
        const problemRef=doc(db,"problems",problem.id)
        if(response.data.problem.testCases!=null){
          setHasTestCases(true)
          setTestCases(response.data.problem.testCases)
          
       
      }else{
        await updateDoc(problemRef,{
          acRate:response.data.problem.acRate,
          difficulty:response.data.problem.difficulty,
         
          level:response.data.problem.level,
          link:response.data.problem.link
        }).then(()=>{
          last=date
          setDateLast(date)
          setTimeout(()=>{
            resolve()
          },200)
        })
      }

    

      }else{
      last=d
      //setDateLast(d)
      setTimeout(()=>{
        resolve()
      },400)
    }
      })*/
    }else{
      last=d
      setDateLast(d)
      setHasTestCases(true)
      if(problem.problem.lastPracticed!=null){
        setIndex(daysBetween(new Date(problem.problem.lastPracticed.seconds*1000),new Date()))
        }    
          setTestCases(problem.problem.testCases)
      
      setTimeout(()=>{
        resolve()
      },400)
    }
      
      
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
  

  function daysBetween(date1, date2) {
    
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
   const red=JSON.parse(sessionStorage.getItem("red"))
   const orange=JSON.parse(sessionStorage.getItem("orange"))
   const green=JSON.parse(sessionStorage.getItem("green"))
    setDaysSince(daysDiff)
   // console.log(prob.length)
   // console.log(green+red+orange)
    var total=green+red+orange
    if(daysDiff<7 && green<prob.length() && total<prob.length){
      handleGreen()
    }else if(daysDiff>=7 && daysDiff<14 && orange<prob.length && total<prob.length){
      handleOrange()
    }else if(daysDiff>=14 && red< prob.length && total<prob.length){
      handleRed()
    }
    return daysDiff;
  }
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
   
   
  /*  if(currY==lastL){
      if(diff==0 &&  currY==lastY){
        //console.log("USE DAYS\n\n")
        useDays=true
        
         days=Math.abs(curr[2]-dateArr[2])
        //console.log("days:"+days)
        setDaysSince(days)

      }else{
        

      }
    }*/
  }

  


  const deleteProblem=async(problem)=>{
    await deleteDoc(doc(db, "problems", problem.id)).then((response)=>{
      return response
    });
  }

 

  function handleGreen(){
    console.log("green:",green)
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



   const updateIndex=async(problemRef,timeIndex,p)=>{
    /*
    console.log(timeIndex)
    if(user.healthyIndex==null){
      console.log("NOT NULL")
      if(timeIndex<7){
      handleGreen()
        
      }else if(timeIndex>=7 && timeIndex<14){
        console.log(p.title+ " ORANGE "+ timeIndex)
        handleOrange()
      }else if(timeIndex>=14){
        handleRed()
      }
    }else{
      if(timeIndex<=user.healthyIndex){
        handleGreen()
          
        }else if(timeIndex>user.healthyIndex.end && timeIndex<user.decliningIndex){
          handleOrange()
        }else{
          handleRed()
        }

    }
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
  }*/
    
  }
   try{
  if(!isLoading ){

    
  
    if(   user.healthyIndex!=null? (index<=user.healthyIndex.end ):(index<=7 )){
      
      return (
        <div className='p-5 bg-white rounded shadow m-3'>
          <div class="flex w-full justify-end">
            <div class="flex w-1/3"><p class="font-semibold text-end text-sm">Practiced {index} days ago</p></div>
          </div>
        <div className="flex  items-center mb-4">
        
          <div className="flex w-full">
            <p class="font-bold text-xl">{problem.problem.title.toUpperCase()}</p>
           
          </div>
          
          
          <div
            className="m-2 flex justify-center items-center bg-blue-lighter rounded-full w-8 h-8"
            role="img"
          >
             {
          testCases!=null?
          <div>
            <p class="font-bold">HAS TEST CASES</p>
          </div>
          :
          <div>
          </div>
        }
          </div>
          <div class="flex justify-end w-full">
          {id==null?<button class="bg-red-600 rounded-md p-2 justify-self-end m-2" onClick={()=>{
                
                deleteProblem(problem).then((response)=>{
                  alert("SUCCESS: deleted problem:"+problem.problem.title)
                  dispatch(addLeetcodeProblemReload())
                })
                }}>
                  <p class="text-end text-white">Remove</p>
                </button>
                :
                <div></div>
        }
         {id==null? <button class="bg-gray-300 rounded-md p-2 justify-self-end" onClick={()=>{
            
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
          :
          <div></div>
        }
         {id!=null? <button class="bg-green-700 rounded-md p-2 justify-self-end" onClick={()=>{
            
          
            const prom=new Promise(async(resolve,reject)=>{
             
                dispatch(setOtherUsersProblem(problem))
              
                const snap = await getDocs(collection(db, "users"))
                snap.forEach((d) => {
                  const currentUser=JSON.parse(sessionStorage.getItem("user"))
                  if(d.id==currentUser.userId){
                    console.log("MATCH")
                    dispatch(setCurrentUser(d.data()))
                    
                  }
                  if(d.id==problem.problem.userId){
                    dispatch(setOtherUser(d.data()))
                  }
                })
                setTimeout(()=>{
                  resolve()
                },1000)
            })

            prom.then(()=>{
              dispatch(setOtherUsersProblemVisibility(true))
            })
          }}>
            <p class="text-end text-white font-bold">Add</p>
          </button>
          :
          <div></div>
        }
            </div>
        </div>
       
        <div className="flex-col text-4x1 text-grey-darkest mb-4  border-gray-400 border-2 p-3">
        <div class="flex">
          <p className="text-green font-bold mr-1">Last Practiced:</p>
          <p>{new Date(problem.problem.lastPracticed.seconds*1000).toString().substring(0,15)}</p>
            
          
             
          </div>
          <div class="flex">
          <span className="text-green mr-1">
          <p class="font-bold text-sm">Attempts:<span class="font-normal ml-2">{problem.problem.attempts.length>1 && problem.problem.attempts[0].attempt=='N/A'? problem.problem.attempts.length-1:problem.problem.attempts.length>0 && problem.problem.attempts[0].attempt!='N/A'&& problem.problem.attempts[0].attempt!='' && problem.problem.attempts[0].attempt!=null? problem.problem.attempts.length:"0"}</span></p>
             
          </span>
          </div>
          <div class="flex">
          <span className="text-green mr-1">
             <p class="font-bold text-sm ">Category:<span class="font-normal ml-2">{problem.problem.category}</span></p>
             
          </span>
          </div>
        </div>
       
    
          <button class="bg-gray-300 p-3 rounded-sm w-full" onClick={()=>{
            const userId=id
            if(id==null){
              navigate("/practice/"+problem.id+"/"+index)
            }else{
              navigate("/practice/"+problem.id+"/"+index+"/"+id)
            }
          }}>
            Practice
          </button>
        
      </div>
          )
        }
  
if(   user.decliningIndex!=null? (index>=user.decliningIndex.start && index<user.criticalIndex.start):(index>=7 && index<14)){
 /* handleOldest(problem,index)
  problem.problem.index=index

  const problemRef=doc(db,"problems",problem.id)
    if(problem.problem.index==null || problem.problem.index!=index){
    updateIndex(problemRef,index,problem.problem)
    }*/

 
  return (
    <div className='p-5 bg-orange-400 rounded shadow m-3'>
         <div class="flex w-full justify-end">
            <div class="flex w-1/2"><p class="font-semibold text-end text-sm">Practiced {index} days ago</p></div>
          </div>
    <div className="flex  items-center mb-4">
      <div className="flex w-full">
        <p class="font-bold text-xl">{problem.problem.title.toUpperCase()}</p>
       
      </div>
      
      
      <div
        className="m-2 flex justify-center items-center bg-blue-lighter rounded-full w-8 h-8"
        role="img"
      >
          {
          testCases!=null?
          <div>
            <p class="font-bold">HAS TEST CASES</p>
          </div>
          :
          <div>
          </div>
        }
        
      </div>
      <div class="flex justify-end w-full">
      {id==null?<button class="bg-red-600 rounded-md p-2 justify-self-end m-2" onClick={()=>{
                
                deleteProblem(problem).then((response)=>{
                  alert("SUCCESS: deleted problem:"+problem.problem.title)
                  dispatch(addLeetcodeProblemReload())
                })
                }}>
                  <p class="text-end text-white">Remove</p>
                </button>
                :
                <div></div>
        }
         {id==null? <button class="bg-gray-300 rounded-md p-2 justify-self-end" onClick={()=>{
            
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
          :
          <div></div>
        }
         {id!=null? <button class="bg-green-700 rounded-md p-2 justify-self-end" onClick={()=>{
            
          
            const prom=new Promise(async(resolve,reject)=>{
             
                dispatch(setOtherUsersProblem(problem))
              
                const snap = await getDocs(collection(db, "users"))
                const currentUser=JSON.parse(sessionStorage.getItem("user"))

                snap.forEach((d) => {
                  if(d.id==currentUser.userId){
                    console.log("MATCH")
                    dispatch(setCurrentUser(d.data()))
                    
                  }
                  if(d.id==problem.problem.userId){
                    dispatch(setOtherUser(d.data()))
                  }
                })
                setTimeout(()=>{
                  resolve()
                },1000)
            })

            prom.then(()=>{
              dispatch(setOtherUsersProblemVisibility(true))
            })
          }}>
            <p class="text-end text-white font-bold">Add</p>
          </button>
          :
          <div></div>
        }
        </div>
    </div>
  
    <div className="flex-col text-4x1 text-grey-darkest mb-4  border-gray-400 border-2 p-3">
    <div class="flex">
      <p className="text-green font-bold mr-1 text-sm">Last Practiced:</p>        
         <p>{new Date(problem.problem.lastPracticed.seconds*1000).toString().substring(0,15)}</p>
         
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold text-sm">Attempts:<span class="font-normal ml-2">{problem.problem.attempts.length>1 && problem.problem.attempts[0].attempt=='N/A'? problem.problem.attempts.length-1:problem.problem.attempts.length>0 && problem.problem.attempts[0].attempt!='N/A'&& problem.problem.attempts[0].attempt!='' && problem.problem.attempts[0].attempt!=null? problem.problem.attempts.length:"0"}</span></p>
         
      </span>
      </div>
      <div class="flex">
      <span className="text-green mr-1">
         <p class="font-bold text-sm">Category:<span class="font-normal ml-2">{problem.problem.category}</span></p>
         
      </span>
      </div>
    </div>
   

      <button class="bg-gray-300 p-3 rounded-sm w-full" onClick={()=>{
if(id==null){
  navigate("/practice/"+problem.id+"/"+index)
}else{
  navigate("/practice/"+problem.id+"/"+index+"/"+id)
}      }}>
        Practice
      </button>
    
  </div>
      )
    }
      
if(user.criticalIndex!=null ? (user.criticalIndex.start <=index ): (index>=14 )){

// console.log(index,problem.problem.title)
  

  return (
    <div className='p-5 bg-red-400 rounded shadow m-3'>
         <div class="flex w-full justify-end">
            <div class="flex w-1/2"><p class="font-semibold text-end text-sm mb-3">Practiced {index} days ago</p></div>
          </div>
    <div className="flex  items-center mb-4">
      <div className="flex w-full">
        <p class="font-bold text-xl">{problem.problem.title.toUpperCase()}</p>
       
      </div>
      
      
      <div
        className="m-2 flex justify-center items-center bg-blue-lighter rounded-full w-8 h-8"
        role="img"
      >
        {
          testCases!=null?
          <div>
            <p class="font-bold">HAS TEST CASES</p>
          </div>
          :
          <div>
          </div>
        }
      </div>
      <div class="flex justify-end w-full">
      {id==null?<button class="bg-red-600 rounded-md p-2 justify-self-end m-2" onClick={()=>{
                
                deleteProblem(problem).then((response)=>{
                  alert("SUCCESS: deleted problem:"+problem.problem.title)
                  dispatch(addLeetcodeProblemReload())
                })
                }}>
                  <p class="text-end text-white">Remove</p>
                </button>
                :
                <div></div>
        }
         {id==null? <button class="bg-gray-300 rounded-md p-2 justify-self-end" onClick={()=>{
            
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
          :
          <div></div>
        }
         {id!=null? <button class="bg-green-700 rounded-md p-2 justify-self-end" onClick={()=>{
            
          
            const prom=new Promise(async(resolve,reject)=>{
             
                dispatch(setOtherUsersProblem(problem))
              
                const snap = await getDocs(collection(db, "users"))
                const currentUser=JSON.parse(sessionStorage.getItem("user"))

                snap.forEach((d) => {
                  if(d.id==currentUser.userId){
                    console.log("MATCH")
                    dispatch(setCurrentUser(d.data()))
                    
                  }
                  if(d.id==problem.problem.userId){
                    dispatch(setOtherUser(d.data()))
                  }
                })
                setTimeout(()=>{
                  resolve()
                },1000)
            })

            prom.then(()=>{
              dispatch(setOtherUsersProblemVisibility(true))
            })
          }}>
            <p class="text-end text-white font-bold">Add</p>
          </button>
          :
          <div></div>
        }
        </div>
    </div>
    
    <div className="flex-col text-4x1 text-grey-darkest mb-4  border-gray-400 border-2 p-3">
    <div class="flex">
      <p className="text-green font-bold mr-1 text-sm">{`Last Practiced<3`}:</p>
      <p>{new Date(problem.problem.lastPracticed.seconds*1000).toString().substring(0,15)}</p>

      
        
      
         
      </div>
      <div class="flex">
      <span className="text-green mr-1">
      <p class="font-bold text-sm">Attempts:<span class="font-normal ml-2">{problem.problem.attempts.length>1 && problem.problem.attempts[0].attempt=='N/A'? problem.problem.attempts.length-1:problem.problem.attempts.length>0 && problem.problem.attempts[0].attempt!='N/A'&& problem.problem.attempts[0].attempt!='' && problem.problem.attempts[0].attempt!=null? problem.problem.attempts.length:"0"}</span></p>
         
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
        if(id==null){
          navigate("/practice/"+problem.id+"/"+index)
        }else{
          navigate("/practice/"+problem.id+"/"+index+"/"+id)
        }      }}>
        Practice
      </button>
    
  </div>
      )
    }
  }
}catch(err){
  console.log(err)
  console.log(problem.problem.lastPracticed)
    return(
      <div class="flex w-full p-3 bg-purple-400">
        problem {problem.problem.title}
{dateLast!=null? dateLast.toString().susbtring(0,15):"N/A"}
      </div>
    )
  }finally{
    //console.log(err)
  }
}

export default ProblemListItem