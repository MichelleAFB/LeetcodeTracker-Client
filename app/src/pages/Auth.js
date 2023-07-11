import React, { useEffect } from 'react'
import { useState } from 'react'

//outside
import axios from 'axios'
//firebase 
import {auth, googleProvider} from '../firebase/firebase'
import { createUserWithEmailAndPassword,signInWithPopup,signOut} from 'firebase/auth'
import { db } from '../firebase/firebase'
import {getDocs,collection,doc,setDoc,addDoc} from 'firebase/firestore'
//routing
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
function Auth() {

  const[isLoading,setIsLoading]=useState(true)

  const[email,setEmail]=useState()
  const[password,setPassword]=useState()
  const[firstname,setFirstName]=useState()
  const[lastname,setLastName]=useState()
  const[timezone,setTimezone]=useState("CST")

  //find user for regualr signin method
  const[userFound,setuserFound]=useState(false)
  
  const usersCollectionRef=collection(db,"users")

  const navigate=useNavigate() 
  

  useEffect(()=>{

    const prom=new Promise((resolve,reject)=>{
      axios.get("https://leetcodetracker.onrender.com").then((response)=>{
        console.log(response.data)
          sessionStorage.removeItem("user")
          sessionStorage.removeItem("signInType")
          
      resolve()
      })
    
    })

    prom.then(()=>{
      setIsLoading(false)
    })
  },[])
 
  const signIn=async()=>{

    try{
        const data=await getDocs(usersCollectionRef)

        var found=false
        const prom=new Promise((resolve,reject)=>{
          data.docs.map((doc)=>{
            console.log(doc.data())
            const userData=doc.data()
            if(userData.email==email && userData.password==password){
              found=true
              sessionStorage.setItem("user",JSON.stringify(userData))
              sessionStorage.setItem("signInType","signIn")

              const todaysQuestions=Cookies.get("total_questions_today")
              if(todaysQuestions==null){
                Cookies.set("total_questions_today",JSON.stringify({total:0,userId:userData.userId}),{expires:1/24})
              }
            }
          })
          resolve()
        })
      
        prom.then(()=>{
          console.log(found)

          if(found){
            navigate('/home')
          }else{

            const prom1=new Promise((resolve1,reject1)=>{

               createUserWithEmailAndPassword(auth,email,password).then((response)=>{
                console.log(response)

                var userUid = auth.currentUser.uid;
                const id=Math.floor(Math.random()*100000)

                const added=async()=>{

                  const added=await addDoc(collection(db,"users"),{
                
                    email: email,
                   emailVerified: false,
                    firstname:"user",
                    lastname:"user",
                     online: false,
                     onlock: false,
                     password: password,
                     userId:id,
                     timezone:timezone
                  })

                  added()
                  const todaysQuestions=Cookies.get("total_questions_today")
                  if(todaysQuestions==null){
                   
                    Cookies.set("total_questions_today",JSON.stringify({total:0,userId:id}),{expires:1/24})
                  }
                  sessionStorage.setItem("user",JSON.stringify({
                    userId:id,
                    email: email,
                    emailVerified: false,
                    firstname:"user",
                    lastname:"user ",
                    online: false,
                    onlock: false,
                    password: password
                    }))
                  sessionStorage.setItem("signInType","signIn")
                 

                }
                
              })

              setTimeout(()=>{
                resolve1()
              },500)
            })
            

            prom1.then(()=>{
              navigate("/home")
            })
          }
        })

    }catch(err){
      
      console.log(err)
    }

    
    /*await createUserWithEmailAndPassword(auth,email,password).then((response)=>{
      console.log(response)
      
      var userUid = auth.currentUser.uid;
      

      db.collection('users').doc(userUid).set({
          userId:userUid,
          email: email,
          emailVerified: false,
          firstname: firstname,
          lastname:lastname,
          online: false,
          onlock: false,
          password: password
      });
      
    })
    */
  }

  console.log(Math.floor(Math.random()*1000))

  const signInWithGoogle=async()=>{
    try{
      await signInWithPopup(auth,googleProvider).then((response)=>{
        console.log("signin with google")
        console.log(response)
        console.log(response.user.providerData[0])
        const user=response.user.providerData[0]
        sessionStorage.setItem("user",JSON.stringify(user))
        sessionStorage.setItem("signInType","google")
      }).then(()=>{
        navigate("/home")
      })
    }catch(err){
      console.log(err)
    }
  }

  const logOut=async()=>{
    try{
        await signOut(auth).then((response)=>{
          console.log("signing out")
          console.log(response)
        })
      }catch(err){
        console.log(err)
      }
  }

if(isLoading){
  return(
    <div class='bg-gray-200 z-30' data-testId="modal-public">
     
      <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50'>
       
        <main id='content' role='main' class='w-full max-w-md mx-auto '>
      <div class="flex w-full justify-center ">
          <div class="flex-col justify-end  ">
          <div class="loading-spinner-large"/>
      </div>
    </div>
    </main>
    </div>
    </div>
    )
}
if(!isLoading){
  return (
    <div class="bg-gray-300 rounded-md p-3 h-screen p-5">
    
      <div class="flex flex-col m-3 bg-gray-500 p-3 rounded-md justify-center ">
         <p class="text-xl text-center">Create An Account</p>
         <div class="bg-gray-300 rounded-md p-3">
         <div class="flex justify-center m-2">
             <label class="mr-2">Firstname :</label>
            <input type="text" onChange={(e)=>{
              setFirstName(e.target.value)
               }}/>
          </div>
          <div class="flex justify-center m-2 p-3 rounded-md">
             <label class="mr-2">Lastname :</label>
            <input type="text" onChange={(e)=>{
              setLastName(e.target.value)
               }}/>
          </div>
          <div class="flex m-2 justify-center ">
            <label class="mr-3">Email:</label>
            <input type="email" onChange={(e)=>{
             setEmail(e.target.value)
               }}/>
          </div>
          <div class="flex justify-center">
             <label class="mr-2">Password:</label>
            <input type="text" onChange={(e)=>{
              setPassword(e.target.value)
               }}/>
          </div>
         <div class="flex justify-center m-2">
          <select class="justify-center" onChange={(e)=>{
            setTimezone(e.target.value)
          }}>
            <option value="CST">CST</option>
            <option value="AST">AST</option>
            <option value="PST">PST</option>
            <option value="MT">MT</option>
            <option value="HAT">HAT</option>
            <option value="ET">ET</option>
          </select>
          </div>
         
          <div class="flex justify-center mt-2">
            <button class="bg-green-600 rounded-md p-3" onClick={signIn}>
                <p class="text-white font-semibold">Create</p>
             </button>
            
          </div>
          <div class="flex justify-center mt-2">
            <button class="bg-green-600 rounded-md p-3" onClick={signInWithGoogle}>
                <p class="text-white font-semibold">Create with Google</p>
             </button>
            
          </div>
           
          </div>
       </div>
      
     
        <div class="flex flex-col m-3 bg-gray-500 p-3 rounded-md justify-center ">
         <p class="text-xl text-center">Sign In</p>
         <div class="bg-gray-300 rounded-md p-3">
          <div class="flex m-2 justify-center">
            <label class="mr-3">Email:</label>
            <input type="email" onChange={(e)=>{
             setEmail(e.target.value)
               }}/>
          </div>
          <div class="flex justify-center">
             <label class="mr-2">Password:</label>
            <input type="text" onChange={(e)=>{
              setPassword(e.target.value)
               }}/>
          </div>
          <div class="flex justify-center">
             <button class="bg-green-600 rounded-md p-3 m-2" onClick={signIn}>
              <p class="text-white">Sign In</p>
             </button>
          </div>
          
          </div>
       </div>
     
    </div>
  )
              }
}

export default Auth