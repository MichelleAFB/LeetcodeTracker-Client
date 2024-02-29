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

    const prom=new Promise((resolve,reject)=>{
      const u=JSON.parse(sessionStorage.getItem("user"))
 
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
    <div class="w-full  ">
    <div class="mt-0 mr-0 ml-0 flex justify-between align-center bg-[#B5B4A7]">
      <div class="flex-col w-full ">
        <div class="w-full flex p-4">
      <div class="flex w-full">
        <div class="flex w-5/6">
          <p class="text-purple-800 text-4xl">LeetcodeTracker</p>
        
        </div>
        <div class="flex-col w-1/5 mr-0 justify-end">
         <div class="flex-col justify-end">
        
           <div class="group relative m-12 flex w-2/3 justify-center">
           <button class="justify-end flex w-full m-2">
              <p class="text-md text-white m-0">{user.firstname} {user.lastname}</p>
           </button>  
           <span class="absolute top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white scale-100">✨ You hover me!</span>
                
          </div>
           
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