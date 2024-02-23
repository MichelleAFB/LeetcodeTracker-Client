import React, { useEffect } from 'react'
import { useState } from 'react'

//outside
import axios from 'axios'
//firebase 
import {auth, googleProvider} from '../firebase/firebase'
import { createUserWithEmailAndPassword,signInWithPopup,signOut} from 'firebase/auth'
import { db } from '../firebase/firebase'
import {getDocs,collection,setDoc,addDoc, getDoc} from 'firebase/firestore'
import {signInWithEmailAndPassword,getAuth} from 'firebase/auth'
import { doc } from 'firebase/firestore'

//routing
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import {useDispatch,connect} from 'react-redux'
import { setUser,setHeaderVisibility } from '../redux/user/editUser-actions'
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
    sessionStorage.clear()
    const prom=new Promise((resolve,reject)=>{
      axios.get("https://leetcodetracker.onrender.com").then((response)=>{
        dispatch(setHeaderVisibility(false))
        dispatch(setUser(false))
        console.log(response.data)
          sessionStorage.removeItem("user")
          sessionStorage.removeItem("signInType")
          
      resolve()
      })
    
    })

    prom.then(()=>{
      setIsLoading(false)
      const prom1=new Promise((resolve1,reject1)=>{
     
        setTimeout(()=>{
          setIsLoading(false)
        },300) 
      })
    })
  },[])
 const dispatch=useDispatch()


  const signIn=async()=>{

    try{

        const data=await getDocs(usersCollectionRef)

        var found=false
        const prom=new Promise((resolve,reject)=>{
          data.docs.map(async(d)=>{
            //console.log(doc.data())
            const userData=d.data()
            console.log(userData)
            console.log(d )
            
            if(userData.email==email && userData.password==password){
              console.log("\n\n")
          
              const foundUser=doc(db,"users",d._key.path.segments[d._key.path.segments.length-1])
              try{
              const updated=await setDoc(foundUser,
               { email: email,
                emailVerified: false,
               firstname:"user",
               lastname:"user",
                online: false,
                onlock: false,
                password: password,
                userId:d._key.path.segments[d._key.path.segments.length-1],
                timezone:timezone,
                challenges:{0:null},
               currentChallenge:null,
               userType:"Google",
               lastLogin: new Date()})
              console.log(updated)
            }catch(err){
              console.log("\n\n\nERR:",err)
            }
              found=true
              sessionStorage.setItem("user",JSON.stringify(userData))
              sessionStorage.setItem("signInType","signIn")
              dispatch(setUser(userData))
              console.log(userData)
            /*STOP*/
              
            }

          })
          setTimeout(()=>{
            resolve()
          },500)
         
        })
      
        prom.then(()=>{
        


          if(found){
            console.log("FOUND")
            dispatch(setHeaderVisibility(true))
            sessionStorage.setItem("headerVisibility","true")

            setTimeout(()=>{

             navigate('/home')

            },500)
          }else{

            const prom1=new Promise((resolve1,reject1)=>{

               createUserWithEmailAndPassword(auth,email,password).then((response)=>{
                console.log(response)

                var userUid = auth.currentUser.uid;
                dispatch(setUser(auth.currentUser))
                const id=Math.floor(Math.random()*100000)

                const added=async()=>{
                  const today=new Date()
                  const added=await addDoc(collection(db,"users"),{
                
                    email: email,
                     emailVerified: false,
                    firstname:"user",
                    lastname:"user",
                     online: false,
                     onlock: false,
                     password: password,
                     userId:id,
                     timezone:timezone,
                     timeCreated:today.toString(),
                     challenges:{0:null},
                    currentChallenge:null,
                    userType:"Google",
                    lastLogin: new Date()
                  })

                 const ad=added()
                 console.log(ad)

                  
                 

                }

                dispatch(setUser(added))
                setTimeout(()=>{
                  sessionStorage.setItem("headerVisibility",true)

                  dispatch(setHeaderVisibility(true)).then(()=>{
                    resolve1()
  
                  })
                  //resolve1()
                },800)
                
              }).catch(()=>{

                const auth = getAuth();
                signInWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                     // Signed in 
                     console.log("userCredential",userCredential)
                          const user = userCredential.user;
    // ...
                              }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
                
              })
             
            })
            

          }
        }).catch((err)=>{

          console.log("NOT FOUND")
          console.log(Object.keys(err))
        })

    }catch(err){
      
      console.log(err)
    }

    
    await createUserWithEmailAndPassword(auth,email,password).then(async(response)=>{
      console.log("response 180",response.data)
      
      var userUid = auth.currentUser.uid;
      console.log(auth)
      console.log(userUid)
      const today=new Date()
      const added=await addDoc(collection(db,"users"),{
                
        email: email,
         emailVerified: false,
        firstname:"user",
        lastname:"user",
         online: false,
         onlock: false,
         password: password,
        // userId:id, //TODO:CREATE AND SET USER ID ON ENTRY
         timezone:timezone,
         timeCreated:today.toString(),
         challenges:{0:null},
        currentChallenge:null,
        userType:"Google",
        lastLogin: new Date()
      })
      console.log("\n\naddded",added._key.path.segments[1])
      const  docRefer=doc(db,"users",added._key.path.segments[1])


     const setUserData=await setDoc(docRefer,{
      userId:added._key.path.segments[1],
      email: email,
      emailVerified: false,
     firstname:"user",
     lastname:"user",
      online: false,
      onlock: false,
      password: password,
     // userId:id, //TODO:CREATE AND SET USER ID ON ENTRY
      timezone:timezone,
      timeCreated:today.toString(),
      challenges:{0:null},
     currentChallenge:null,
     userType:"Regular",
     lastLogin: new Date()
      })
      console.log("SETDOCUSER",setUserData)

      const userData={userId:added._key.path.segments[1],
      email: email,
      emailVerified: false,
     firstname:"user",
     lastname:"user",
      online: false,
      onlock: false,
      password: password,
     // userId:id, //TODO:CREATE AND SET USER ID ON ENTRY
      timezone:timezone,
      timeCreated:today.toString(),
      challenges:{0:null},
     currentChallenge:null,
     userType:"Regular",
     lastLogin: new Date()
      }
      const prom3=new Promise((resolve3,reject3)=>{
             
      const userData={userId:added._key.path.segments[1],
        email: email,
        emailVerified: false,
       firstname:"user",
       lastname:"user",
        online: false,
        onlock: false,
        password: password,
       // userId:id, //TODO:CREATE AND SET USER ID ON ENTRY
        timezone:timezone,
        timeCreated:today.toString(),
        challenges:{0:null},
       currentChallenge:null,
       userType:"Regular",
       lastLogin: new Date()
        }

        found=true
      sessionStorage.setItem("user",JSON.stringify(userData))
      sessionStorage.setItem("signInType","signIn")
      dispatch(setUser(userData))

      setTimeout(()=>{
          resolve3()
      },700)
        
      })

      prom3.then(()=>{
        signIn()

      })

      
      
      
      
    }).catch(async(err)=>{
      console.log(err.message)
      if(err.message.includes("email-already-in-use")){
        console.log("IN USE")
        const data=await getDocs(usersCollectionRef)

        data.docs.map((doc)=>{
          //console.log(doc.data())
          const userData=doc.data()
         userData.lastLogin= new Date()
          if(userData.email==email && userData.password==password){
            const prom3=new Promise((resolve3,reject3)=>{

              found=true
            sessionStorage.setItem("user",JSON.stringify(userData))
            sessionStorage.setItem("signInType","signIn")
            dispatch(setUser(userData))

            setTimeout(()=>{
                resolve3()
            },700)
              
            })

            prom3.then(()=>{
              dispatch(setHeaderVisibility(true))
              setTimeout(()=>{
              //  navigate("/home")
              },600)

            })
            

          }

        })

      }
   

    }).catch((err)=>{
      console.log("err",err)
    })
    
    
  }

  //console.log(Math.floor(Math.random()*1000))

  const signInWithGoogle=async()=>{
  
    try{
      await signInWithPopup(auth,googleProvider).then(async(response)=>{
        console.log("signin with google")
        console.log(response)
        console.log(response.user)
        const user=response.user.providerData[0]
        sessionStorage.setItem("user",JSON.stringify(user))
        sessionStorage.setItem("signInType","google")

        const f=user.displayName.split(" ")
        const fir=f[0]
        const las=f[f.length-1]
        console.log(user)
        const id=Math.floor(Math.random()*100000)
        const today= new Date()
        await addDoc(collection(db,"users"),{
           userId:id,     
          email: email,
         emailVerified: false,
          firstname:fir,
          lastname:las,
           online: false,
           onlock: false,
           password: password,
           timezone:timezone,
           timeCreated:today.toString(),
           challenges:[],
           currentChallenge:null,
           userType:"Google",
           lastLogin: new Date()
        })

        
        
        return user
        

      }).then(async(user)=>{

        dispatch(setUser(user))

          setTimeout(()=>{
             var header=dispatch(setHeaderVisibility(true)) 
             console.log("header")
             console.log(header)
            
 
            console.log("SETTING HEADER VIS 2")
           // navigate("/home")

          },700)
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
            <p class="text-white text-center mb-4">Loading Server..</p>
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
    <div class="bg-gray-300 rounded-md p-3 h-full flex-col p-5 justify-center align-middle">
      <div class="w-full h-1/6"></div>
      <p class="text-4xl text-center mb-5 text-purple-500">LeetcodeTracker</p>
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
          
          </div>
          <div class="flex justify-center mt-2">
            <button class="bg-green-600 rounded-md pr-3 pl-3 pt-2" onClick={signInWithGoogle}>
                <p class="text-white font-semibold">Create with Google</p>
             </button>
            
          </div>
           
          </div>
       </div>
        <div class="flex flex-col m-3 bg-gray-500 p-3 rounded-md justify-center ">
         <p class="text-xl text-center text-white font-semibold m-3">Sign In/Sign Up</p>
         <div class="bg-gray-300 rounded-md p-3">
          <div class="flex m-2 justify-center">
            <label class="mr-3">Email:</label>
            <input class="p-1 rounded-md" type="email" onChange={(e)=>{
             setEmail(e.target.value)
               }}/>
          </div>
          <div class="flex justify-center">
             <label class="mr-2">Password:</label>
            <input class="p-1 rounded-md" type="text" onChange={(e)=>{
              setPassword(e.target.value)
               }}/>
          </div>
          <div class="flex justify-center">
             <button class="bg-green-600 rounded-md pr-3 pl-3 pt-2 m-2" onClick={signIn}>
              <p class="text-white">Sign In</p>
             </button>
          </div>
          
          </div>
       </div>
     
    </div>
  )
              }
}

/*
   
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

*/

const mapStateToProps = (state, props) => {
  var visibility= state.user.visibility;
  var user=state.user.user
  console.log("visibility"+visibility)

  return {
   visibility:visibility,
   user:user
  };
};
export default (Auth)