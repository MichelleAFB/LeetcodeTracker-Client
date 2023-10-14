import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate ,useLocation, Link} from 'react-router-dom'
import { connect, useSelector } from 'react-redux'
function Header({ourUser,visibility}) {

  const[isLoading,setIsLoading]=useState(true)
  const [user,setUser]=useState()
  const location=useLocation()
  console.log(location.pathname)
  console.log("HEADER:",visibility)
  useEffect(()=>{
    console.log("\n\nHeader RELODING",visibility)
    const prom=new Promise((resolve,reject)=>{
      const u=JSON.parse(sessionStorage.getItem("user"))
      console.log(u)
      if(ourUser==null){
        setUser(u)
      }else{
        setUser(ourUser)
      }
     
      
      setTimeout(()=>{
        resolve()
      },500)
    })

    prom.then(()=>{
      if(location.pathname=='/' ){

      }else if(visibility || visibility=="true"){
     // setIsLoading(false)
     console.log("HEADER SHOULD SHOW")
     if(user!=null){
        setIsLoading(false)
     }
      
      }
    })

  },[visibility])


  const navigate=useNavigate()

  function checkStatus(){

  }

  if(visibility){
    console.log(user)
  return (
    <div class="mt-0 mr-0 ml-0 flex justify-between align-center bg-[#B5B4A7]">
      <div class="flex-col w-full ">
        <div class="w-full flex p-4">
      <div class="flex w-full">
        <div class="flex w-5/6">
          <p class="text-purple-800 text-4xl">LeetcodeTracker</p>
        
        </div>
        <div class="flex-col w-1/6 mr-0 justify-end">
         <div class="flex-col justify-end">
            <button class="justify-end flex">
              <p class="text-end text-lg text-white m-0">{user.firstname} {user.lastname}</p>
           </button>
           
           <button class="justify-end flex m-0" onClick={()=>{
            setIsLoading(true)
            navigate("/settings")
           }}>
              <p class="text-end text-white">Settings</p>
             </button>
           <button class="justify-end flex m-0" onClick={()=>{
            setIsLoading(true)
            navigate("/")
           }}>
              <p class="text-end text-white">Sign Out</p>
             </button>
         </div>
         
        </div>
      </div>
      </div>
      <div class="bg-cyan-600 flex w-full p-2 mb-0 justify-around ">
        <Link class="text-white font-bold" to="/home">Your Problems</Link>

        <Link class="text-white font-bold" to="/analytics">Your Stats</Link>

        <Link class="text-white font-bold" to="/challenges">Your Challenges</Link>

      </div>
      </div>
    </div>
  )
  }else{
    return(
      <div >
    </div>
    )
  }


}






export default  Header