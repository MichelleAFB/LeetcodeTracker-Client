import React from 'react'
import { useState,useEffect } from 'react'
import {doc,getDoc} from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import axios from 'axios'
import CheckoutForm from './CheckoutForm'
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSettingsContent,setSettingsVisibility,setSettingsType } from '../../redux/settings/settings-actions'
/**STRIP_KEY=sk_test_51MrXkxLxMJskpKlAqyll3YtK4rnwOsslfy4HkGHeDrvChbt3Yk9f8ZJuEzv28Qf2nAgz6kM2nVmzigtEYQ2wkj4H00Ma19A8HG */
function Billing() {
  const[user,setUser]=useState(JSON.parse(sessionStorage.getItem("user")))
  const[isLoading,setIsLoading]=useState(true)
  const[showCard,setShowCard]=useState(false)
  const[subscription,setSubscription]=useState()
  const[clientSecret,setClientSecret]=useState()


  const stripePromise = loadStripe("pk_test_51MrXkxLxMJskpKlAwlDbX2DaLQtD7jHuU5hob6BH6rbvYmr4KE410R5DUSDJT2wktidpYkOubes4eYx1b2TMalJt00F47d8DQI"); 

  const navigate=useNavigate()
  const dispatch=useDispatch()

  useEffect(()=>{

    const prom=new Promise(async(resolve,reject)=>{
      const userRef=doc(db,"users",user.userId)
       const u= await getDoc(userRef)
       setUser(u.data())
       setTimeout(()=>{
        resolve()

        
       },300)
    })

    prom.then(async()=>{
      const userRef=doc(db,"users",user.userId)
      const u= await getDoc(userRef)

      console.log("user",u)
      setTimeout(()=>{
        setIsLoading(false)

      },200)
      /*if(user!=null){
        fetch("http://localhost:3022/payment/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            setClientSecret(data.clientSecret)
            setTimeout(()=>{
              setIsLoading(false)

            },200)
          });
      }
      */
    })

  },[])// starts with pk_

 // setIsLoading(false)
  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  const appearanceMethod= {
    theme: 'flat',
    variables: { colorPrimaryText: '#262626' }
  };
  if(!isLoading){
    console.log(user)
  return (
    <div class="w-full flex-col">
      <div class="flex w-full m-4">
        {user.subscription==null || user.subscription=="free"?
          <div class="bg-[#F6E5A1] border-[#E2C85F] border-3 w-1/3 flex-col  justify-center p-3">
            <h2>Free</h2>

          </div>
          :
          <div class="bg-[#F6E5A1] w-1/3 flex-col  justify-center p-3">
                        <h2>Free</h2>

          </div>
        }
        { user.subscription=="premium"?
          <div class="bg-[#ACEC7B] border-[#91DC58] border-3 w-1/3 flex-col justify-center p-3">
              <h2>Premium</h2>
              <p>$3.99/month</p>
          </div>
          :
          <div class="bg-[#ACEC7B]  w-1/3  flex-col  justify-center p-3">
                          <h2>Premium</h2>
                        <p>$3.99/month</p>
                        
                          <button class="border-green-600 border-3 rounded-sm p-2 flex" onClick={()=>{
                                                        setShowCard(false)

                                                        setSubscription("diamond")
                                                        setTimeout(()=>{
                          
                                                      
                                                      fetch("http://localhost:3022/payment/checkout/"+user.userId+"/premium", {
                                                      method: "POST",
                                                      headers: { "Content-Type": "application/json" },
                                                      body: JSON.stringify({ items: [{ id: process.env.REACT_APP_PREMIUM_ID_TEST,quantity:1 }] }),
                                                      }).then((res) => res.json()) .then((response) => {
                                                      console.log("data",response)
                                                      window.location.href=response.url
                                                      //navigate(response.data.url)
                                                     // setClientSecret(data.clientSecret)
                                                      setTimeout(()=>{
                                                      setShowCard(true)
                          
                                                      },200)
                                                      });
                                                    },300)
                            
                        }}>
                        
                          <p class="text-[#3CC41A]">Get</p>
                        </button>


          </div>
        }
         {user.subscription=="diamond"?
          <div class="bg-[#77DFFF] w-1/3 flex-col border-cyan-600 border-3 justify-center p-3">
                            <h2>Diamond</h2>
                            <p>$5.99/month</p>
                        

          </div>
          :
          <div class="bg-[#77DFFF] w-1/3 flex-col  justify-center p-3">
                          <h2>Diamond</h2>
                          <p>$5.99/month</p>
                          <button class="border-[#1B96BC] border-3 rounded-sm p-2 flex" onClick={()=>{
                                                          setShowCard(false)

                              setSubscription("diamond")
                              setTimeout(()=>{

                            
                            fetch("http://localhost:3022/payment/checkout/"+user.userId+"/diamond", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ items: [{ id: process.env.REACT_APP_DIAMOND_ID_TEST,quantity:1 }] }),
                            }).then((res) => res.json()) .then((response) => {
                            console.log("data",response)
                            window.location.href=response.url
                            //navigate(response.data.url)
                           // setClientSecret(data.clientSecret)
                            setTimeout(()=>{
                            setShowCard(true)

                            },200)
                            });
                          },300)
                          }}>
                            <p class="text-[#1B96BC] font-bold">Get</p>
                         </button>
                          

          </div>
        }
      </div>
      {
        JSON.parse(sessionStorage.getItem("payment_success"))?
        <p class="text-green-500 text-2xl">Payment Succeeded</p>
        :
        <p></p>
      }
      {
        JSON.parse(sessionStorage.getItem("payment_cancel"))?
        <p class="text-red-500 text-2xl">Payment Failed</p>
        :
        <p></p>
      }
      <p class="font-bold ml-4" >Your Billing</p>
      <div class="flex-col bg-[#F3C588] w-full m-4">
        {
          showCard && subscription=="diamond" &&clientSecret!=null?
          <div class="flex-col">
                {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm  clientSecret={clientSecret} />
        </Elements>
        )}

          </div>
          :
          <div></div>
        }

      </div>
      <div class="flex-col bg-[#F3C588] w-full m-4">
        {
          showCard && subscription=="premium" &&clientSecret!=null?
          <div class="flex-col">
                {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm  clientSecret={clientSecret} />
        </Elements>
        )}

          </div>
          :
          <div></div>
        }

      </div>
      <div class="flex w-full p-3">
        {
          user.subscription=="premium" || user.subscription=='diamond'?
          <button class="p-2 bg-red-500 rounded-sm" onClick={()=>{
            const prom=new Promise((resolve,reject)=>{
              const user=JSON.parse(sessionStorage.getItem("user"))
              dispatch(setSettingsContent(user))
              setTimeout(()=>{
                resolve()
              },300)
            })

            prom.then(()=>{
              const prom1=new Promise((resolve,reject)=>{
                dispatch(setSettingsType("CANCEL_SUBSCRIPTION"))
              setTimeout(()=>{
                resolve()
              },300)
              })

              prom1.then(()=>{
                dispatch(setSettingsVisibility(true))
              })
            })
          }}>
          <p class="font-bold text-white">Cancel</p>
        </button> 
        :
        <div></div>
        }
      </div>
      <div class="flex w-full">
        <CardElement options={appearanceMethod} />

      </div>
    </div>
  )
      }else{
        return(<div></div>)
      }
}

export default Billing