import React from 'react'
import { useState,useEffect } from 'react'
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

  if(!isLoading){
    console.log(user)
  return (
    <div class="mt-0 mr-0 ml-0 flex p-4 justify-between align-center bg-[#B5B4A7]">
      <div class="flex w-full">
        <div class="flex w-1/2">

        </div>
        <div class="flex w-1/2 justify-end">
          <p class="text-end text-white">{user.firstname} {user.lastname}</p>
        </div>
      </div>
    </div>
  )
  }else{
    return(<div></div>)
  }
}

export default Header