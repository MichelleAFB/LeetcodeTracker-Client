import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
  CardElement
} from "@stripe/react-stripe-js";
import { useMemo } from "react";
import{
CardNumberElement,
CardExpiryElement,
CardCvcElement,
} from "@stripe/react-stripe-js";

export default function CheckoutForm({clientSecret}) {
  const stripe = useStripe();
  const elements = useElements();
  const[name,setName]=useState()
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const[paymentIntent,setPaymentElement]=useState()
  const[cardNumber,setCardNumber]=useState()
  const[cvv,setCvv]=useState()
  const[expiry,setExpiry]=useState()

  const handleChange=(info,e)=>{
    if(info==cvv){
      setCvv(e.target.value)
    }else if(info=="cardnumber"){
      setCardNumber(e.target.value)
    }else if(info=="expiry"){
      setExpiry(e.target.value)

    }
  }
  const appearance = {
    theme: 'stripe',
  };
  const options=useMemo(()=>{
    return{
      clientSecret,
      appearance,
    }
  })

  useEffect(() => {
    if (!stripe) {
      return;
    }
    console.log("client secret",clientSecret)
    

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      setPaymentElement(paymentIntent)
      console.log("intent",paymentIntent)
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const paymentElementOptions = {
    layout: "tabs"
  }
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e)
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    console.log("elements",elements.getElement(PaymentElement))
    try{
      console.log(paymentIntent)
      const el=elements.getElement(PaymentElement)
      console.log("el",el)
      console.log("payment element",PaymentElement)

      await stripe.createPaymentMethod(clientSecret,{
        payment_method:{
          type:'card',
          card:el,
          billing_detail:{
            name:name,
            email:email
          } 
        }
      }).then((result)=>{
        console.log(result)
      })
      
      const stuff=await stripe.createPaymentMethod(clientSecret,{
        payment_method:{
          type:'card',
          card:el,
          billing_detail:{
            name:name,
            email:email
          } 
        }
      })

     
    //console.log("error",error)
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
   /* if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }*/
  }catch(err){
    console.log(err)
  }
 setTimeout(()=>{
  setIsLoading(false);

 },200)
  };


  if(!isLoading){
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <input type="text" onChange={(e)=>{
          setName(e.target.value)
      }} placeholder="Name"/>
      <input type="text" onChange={(e)=>{
          setEmail(e.target.value)
      }} placeholder="Email"/>
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => {

        }}
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      
      <button class="bg-green-500 rounded-sm p-2" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
      }else{
        return(<form id="payment-form" onSubmit={handleSubmit}>
      
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => {
  
          }}
        />
<CardNumberElement
        
        options={{}}
        onChange={(e)=>{
          handleChange("cardnumber",e)
        }}
      />
      <CardCvcElement
        
        options={{}}
        onChange={(e)=>{
          handleChange("cvv",e)
        }}
      />
      <CardExpiryElement
        
        options={{}}
        onChange={(e)=>{
          handleChange("expiry",e)
        }}
      />        
        <button class="bg-green-500 rounded-sm p-2" disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>)
      }
}
