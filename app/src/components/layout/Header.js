import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate ,useLocation, Link} from 'react-router-dom'
import { connect, useSelector } from 'react-redux'
import { query,doc,collection,getDocs,where, updateDoc} from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import IonIcon from '@reacticons/ionicons'

function Header({ourUser,visibility}) {

  const[isLoading,setIsLoading]=useState(true)
  const [user,setUser]=useState()
  const[hasNotifications,setHasNotifications]=useState(false)
  const location=useLocation()
 
  useEffect(()=>{

    const prom=new Promise(async(resolve,reject)=>{
      const u=JSON.parse(sessionStorage.getItem("user"))
      const q = query(collection(db, "users"), where("email", "==", u.email));

      const querySnapshot = await getDocs(q);
    var us=[]
   querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    
          us.push(doc.data())
       
       
        });
       
     setTimeout(()=>{
     
    
 
      setUser(us[0])
      setTimeout(()=>{
        resolve()
      },800)
     },800)
        
       
 
  
    })

    prom.then(()=>{
     
        setIsLoading(false)
    
    })

  },[visibility,hasNotifications])


  const navigate=useNavigate()

  function checkStatus(){

  }



  if(visibility && !isLoading){
   
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
           <button class="justify-end flex w-full m-2" onClick={async()=>{
           
            const q = collection(db, "users")
            const docs=await getDocs(q)
           
            docs.docs.filter(async(d)=>{
              console.log(d)

              if(d.data().email==user.email){
                const doo=await doc(db,"users",d._key.path.segments[d._key.path.segments.length-1])
               if(d.data().allNotifications==null){
                await updateDoc(doo,{"allNotifications":d.data().notifications})
                await updateDoc(doo,{
                  "hasNewNotifications":false
                })
                await updateDoc(doo,{
                  "notifications":[]
                })
               }else if(d.data().allNotifications!=null){
                const allnotif=d.data().allNotifications
               d.data().notifications.map((n)=>{
                allnotif.push(n)
               })

               setTimeout(async(allnotif)=>{
                await updateDoc(doo,{"allNotifications":allnotif})
                await updateDoc(doo,{
                  "hasNewNotifications":false
                })
                await updateDoc(doo,{
                  "notifications":[]
                })
               },300)
               }
                console.log(doo)

                setTimeout(()=>{
                  setHasNotifications(!hasNotifications)
             },600)
              }
            })
          
         

           }}>
              <p class="text-md text-white m-0">{user.firstname} {user.lastname}</p>
             {user.hasNewNotifications? <IonIcon name="notifications-outline" size="large"/>:<p></p>}
           </button>  
          </div>
          {hasNotifications && user.hasNewNotifications?<span onClick={()=>{
            setHasNotifications(!hasNotifications)
          }} class=" p-2 absolute top-20 scale-0 rounded bg-gray-800 p-2 text-xs text-white scale-100">
            <div class="flex-col">
              <div class="flex w-full justify-end">
                <button class="flex bg-red-500 p-1" onClick={async()=>{
                              const q = collection(db, "users")
                              const docs=await getDocs(q)
                             
                              docs.docs.filter(async(d)=>{
                                console.log(d)
                  
                                if(d.data().email==user.email){
                                  const doo=await doc(db,"users",d._key.path.segments[d._key.path.segments.length-1])
                                 if(d.data().allNotifications==null){
                                  await updateDoc(doo,{"allNotifications":d.data().notifications})
                                  await updateDoc(doo,{
                                    "hasNewNotifications":false
                                  })
                                  await updateDoc(doo,{
                                    "notifications":[]
                                  })
                                 }else if(d.data().allNotifications!=null){
                                  const allnotif=d.data().allNotifications
                                 d.data().notifications.map((n)=>{
                                  allnotif.push(n)
                                 })
                  
                                 setTimeout(async(allnotif)=>{
                                  await updateDoc(doo,{"allNotifications":allnotif})
                                  await updateDoc(doo,{
                                    "hasNewNotifications":false
                                  })
                                  await updateDoc(doo,{
                                    "notifications":[]
                                  })
                                 },300)
                                 }
                                  console.log(doo)
                  
                                  setTimeout(()=>{
                                    setHasNotifications(!hasNotifications)
                               },600)
                                }
                              })
               
                }}>
                  <p class="text-white font-bold">
                    x
                  </p>
                </button>
              </div>
            <ul>
              {
                user.notifications.map((n)=>{
                  return(
                    <div class="flex-col m-1 p-1 bg-gray-400 rounded-sm gap-y-0">
                  <p class=" font-bold text-white text-xs">
                    {n.message}-
                  </p>
                  <p class="text-gray-200 font-semi-bold text-xs">{new Date(n.time.seconds*1000).toString().substring(0,25)}</p>
                  </div>)
                })
              }
            </ul>
            </div></span>
           :<p></p>
          }
           
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
    return(<p></p>)
  }


}

const mapStateToProps = (state, props) => {
  var visibility= state.user.visibility
 

  return {
   visibility:visibility,
  
  };
};




export default  connect(mapStateToProps)(Header)