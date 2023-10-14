import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { db } from '../firebase/firebase'
import {doc,getDoc,updateDoc} from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
function UpdateUserSuccess() {

  const[isLoading,setIsLoading]=useState(true)
  const[user,setUser]=useState(JSON.parse(sessionStorage.getItem("user")))
  const [error,setError]=useState(false)
  const[email,setEmail]=useState()

  const {subscription}=useParams()

  const navigate=useNavigate()
  useEffect(()=>{
    const prom=new Promise(async(resolve,reject)=>{
      console.log(user)
      console.log(user.length)
      var u=doc(db,"users", user.userId)
      u=await getDoc(u)
      console.log("user",u.data())
      
      console.log(process.env.REACT_APP_PREMIUM_ID_TEST)
      axios.post("https://leetcodetracker.onrender.com/user/update-subscription/"+subscription,{user:u.data(),subscription:(subscription=='premium'? process.env.REACT_APP_PREMIUM_ID_TEST:process.env.REACT_APP_DIAMOND_ID_TEST)}).then(async(response)=>{
        console.log(response)
        if(response.data.success){
          setUser(response.data.user)
          sessionStorage.setItem("user",JSON.stringify(response.data.user))
          const userRef=doc(db,"users",response.data.user.userId)
          await updateDoc(userRef,{
            subscription:response.data.user.subscription,
            subscription_updated:response.data.user.subscription_updated,
            subscription_Id:response.data.user.subscription_Id,
            customer_Id:response.data.user.customer_Id
          })


        }else{
          setError(true)
        }

        setTimeout(()=>{
          resolve()
        },400)
      })

    })

    prom.then(()=>{
      setIsLoading(false)
/*
      const prom1=new Promise((resolve,reject)=>{
        axios.post("https://leetcodetracker.onrender.com/user/get-stripe-customer",{user:user}).then((response)=>{
        console.log(response)
        const userRef=doc(db,"users",user.userRef)
        
        setTimeout(()=>{
          resolve()
        },200)
      })
      
    })

      prom1.then(()=>{
        setIsLoading(false)
      })
      */
    })
  },[])
if(!isLoading){
  console.log(user)
  if(error){
    console.log(user)
  return (
    <div class="flex w-full h-screen justify-center mt-5">
    


    </div>
  )
  }else{
    return(
      <div class="flex w-full h-screen justify-center ">
        <div class="bg-gray-200 shadow-xl rounded-md p-3 w-full m-10 flex-col  justify-center">
          <p class="text-xl font-semibold text-center">You have updated your subscription to <span class="text-cyan-600">{user.subscription}</span> status!</p>
          <div class="flex flex-col w-full justify-center">
          <p class="text-center font-semibold">Please enter the email used for the payment:</p>
          <input type="text" class="rounded-sm p-3 border-2 border-gray-100 m-2 w-1/2 justify-center" onChange={(e)=>{
            setEmail(e.target.value)
          }}/>
          </div>

          
           <div class="flex w-full p-3 justify-center">
            <ion-icon name="arrow-back-outline"/>
            <button class="p-3" onClick={()=>{
              navigate("/home")
            }}>
              Go home
            </button>
           </div>
        </div>
      </div>

    )
  }
}else{
  return(<div></div>)
}
}

export default UpdateUserSuccess