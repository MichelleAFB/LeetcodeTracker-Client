import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function Header() {

  const[isLoading,setIsLoading]=useState(true)
  const [user,setUser]=useState()

  useEffect(()=>{

    const prom=new Promise((resolve,reject)=>{
      const u=JSON.parse(sessionStorage.getItem("user"))
      console.log(u)
     
        setUser(u)
      
      setTimeout(()=>{
        resolve()
      },1000)
    })

    prom.then(()=>{
      setIsLoading(false)
    })

  },[])

  const navigate=useNavigate()

  if(!isLoading && user!=null){
    console.log(user)
  return (
    <div class="mt-0 mr-0 ml-0 flex p-4 justify-between align-center bg-[#B5B4A7]">
      <div class="flex w-full">
        <div class="flex w-5/6">
          <p class="text-purple-800 text-4xl">LeetcodeTracker</p>
        </div>
        <div class="flex-col w-1/6 mr-0 justify-end">
         <div class="flex-col justify-end">
            <button class="justify-end flex">
              <p class="text-end text-lg text-white">{user.firstname} {user.lastname}</p>
           </button>
           <button class="justify-end flex" onClick={()=>{
            setIsLoading(true)
            navigate("/")
           }}>
              <p class="text-end text-white">Sign Out</p>
             </button>
         </div>
         
        </div>
      </div>
    </div>
  )
  }else{
    return(
      <div class="mt-0 mr-0 ml-0 flex p-4 justify-between align-center bg-[#B5B4A7]">
      <div class="flex w-full">
        <div class="flex w-1/2">

        </div>
        <div class="flex w-1/2 justify-end">
                  </div>
      </div>
    </div>
    )
  }
}

export default Header