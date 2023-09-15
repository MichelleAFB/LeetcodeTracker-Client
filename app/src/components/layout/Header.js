import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate ,useLocation, Link} from 'react-router-dom'
import { connect, useSelector } from 'react-redux'
function Header({ourUser,visibility}) {

  const[isLoading,setIsLoading]=useState(true)
  const [user,setUser]=useState()
  const location=useLocation()
  console.log(location.pathname)

  useEffect(()=>{

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

      }else if(visibility || location.pathname!="/"){
     // setIsLoading(false)
        setIsLoading(false)
      
      }
    })

  },[visibility])



  const navigate=useNavigate()

  if(!isLoading && user!=null){
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
              <p class="text-end text-lg text-white">{user.firstname} {user.lastname}</p>
           </button>
           <p class="text-end"></p>
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
      <div class="bg-cyan-600 flex w-full p-2 mb-0 justify-around ">
        <Link class="text-white font-bold" to="/home">Your Problems</Link>

        <Link class="text-white font-bold" to="/analytics">Your Stats</Link>

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


const mapStateToProps = (state, props) => {
  var visibility= state.user.visibility
  var user=state.user.user
  console.log("visibility"+visibility)

  return {
   visibility:visibility,
   ourUser:user
  };
};



export default connect (mapStateToProps) (Header)