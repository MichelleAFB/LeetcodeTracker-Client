import React from 'react'
import{useDispatch,connect} from 'react-redux'
import {useState,useEffect} from 'react'
import { setSettingsVisibility,setSettingsType,setSettingsContent } from '../redux/settings/settings-actions'
import {  useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios';
import {doc,getDoc} from "firebase/firestore"
import { db } from '../firebase/firebase';
function SettingsModal({visibility,content,type}) {


  const stripePromise = loadStripe("pk_test_51MrXkxLxMJskpKlAwlDbX2DaLQtD7jHuU5hob6BH6rbvYmr4KE410R5DUSDJT2wktidpYkOubes4eYx1b2TMalJt00F47d8DQI"); 


  const [isLoading,setIsLoading]=useState(true)
  const [cancel,setCancel]=useState()
  const dispatch=useDispatch()
  useEffect(()=>{

    const prom=new Promise((resolve,reject)=>{
      if(visibility==true && content!=null && type!=null){
        resolve()
      }
    })

    prom.then(()=>{
      setIsLoading(false)
    })

  },[visibility])

  if(!isLoading){
  return (
    <div class='bg-gray-200 z-20' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-50'>
     
    <main id='content' role='main' class='w-full max-w-md mx-auto z-40 '>
        <div class='   rounded-xl shadow-lg bg-white dark:border-gray-700 mb-5'>
           <div class='p-4 sm:p-7 flex flex-col'>
            {
              type=="CANCEL_SUBSCRIPTION"?
              <div class="flex flex-col w-full  justify-center">
                <div class="flex w-full justify-end mt-3 p-0">
                  <button class="p-2 flex justify-end" onClick={()=>{
                    console.log("dipatch")
                    setIsLoading(true)
                    dispatch(setSettingsVisibility(false))
                  }}>
                      <p class="text-red-500 font-bold text-xl justify-end">x</p>
                  </button>
                </div>
              
                <p class="text-center font-bold"> To cancel your subscription, please confirm by typing "cancel"</p>
                <div class="flex w-full justify-center">
                <input type="text" class="justify-center w-1/2 flex m-3 rounded-sm border-gray-200 border-2" onChange={(e)=>{
                  setCancel(e.target.value)
                }}/>
                </div>
                <button class="bg-red-500 p-2 rounded-sm" onClick={async()=>{
                  if(cancel=="cancel"){

                          console.log(cancel)
                    const user=JSON.parse(sessionStorage.getItem("user"))
                     const use=doc(db,"users",user.userId)
                     const newUser=await getDoc(use)
                      axios.post("https://leetcodetracker.onrender.com/user/cancel-subscription",{user:newUser.data()}).then((response)=>{

                      })
                  }else{
                    alert("please type in 'cancel'")
                  }
                }}>
                  <p class="text-white">Cancel</p>
                </button>
                
              </div>
              :
              <div>
              </div>
            }
            </div>
        </div>
      </main>
      </div>
    </div>
  )
  }else{
    return(<div></div>)
  }
}


const mapStateToProps = (state, props) => {
  var visibility= state.settings.visibility;
  var type=state.settings.type
  var content=state.settings.content
 

  return {
   visibility:visibility,
   type:type,
   content:content
  };
};
export default connect(mapStateToProps)(SettingsModal)