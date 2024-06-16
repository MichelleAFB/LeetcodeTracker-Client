import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate ,useLocation, Link} from 'react-router-dom'

 

import { query,doc,collection,getDocs,where, updateDoc,getDoc} from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import IonIcon from '@reacticons/ionicons'
import { setChallengeRequestModalVisibility,setChallengeRequest } from '../../redux/groupChallangeRequest/groupChallenge-actions'
import OpenChallengeRequestButton from './OpenChallengeRequestButton'
import Notification from './Notification'

import { useDispatch, connect} from 'react-redux'

function Header({ourUser,visibility}) {

  const[isLoading,setIsLoading]=useState(true)
  const [user,setUser]=useState()
  const[hasNotifications,setHasNotifications]=useState(false)
  const[reload,setReload]=useState(false)
  const[showAllNotifications,setShowAllNotifications]=useState(false)
  const location=useLocation()
 const dispatch=useDispatch()

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

  },[visibility,hasNotifications,reload,showAllNotifications])


  const navigate=useNavigate()

  function checkStatus(){

  }

 
  
  
  
 

  if(visibility && !isLoading){
   console.log(user.allNotifications)
   console.log(user.notifications)
   console.log(user)
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
        
           <div class="group relative  flex w-2/3 justify-center">
           <button class="flex" >
              <p class="text-md text-white m-0">{user.firstname} {user.lastname}</p>
             {user!=null ? 

<IonIcon class={user.hasNewNotifications?`animate__animated animate__pulse  animate__infinite	infinite animate__rubberBand`:``} onClick={async()=>{
          //class="justify-end flex w-full m-2"
          const prom=new Promise(async(resolve,reject)=>{
            const refer=doc(db,"users",user.userId)
            if(user.hasNewNotifications){
            const update=await updateDoc(refer,{
              
              hasNewNotifications:false
             // allNotifications:an

            }).then(()=>{
              resolve()
            })
          }else{
            resolve()
          }
          })
          prom.then(()=>{
            setHasNotifications(!hasNotifications)
          })
       

         }} name="notifications-outline"  style={{color:user.hasNewNotifications?"green":"white"}}  size="large"/>

:<p></p>}
           </button>  
          </div>
          
          {hasNotifications ? /*hasNotifications   && user.hasNewNotifications?*/ <span class=" p-2 absolute top-20 w-1/3 right-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white scale-100">
            <div class="flex-col ">
              <div class="flex w-full justify-end ">
                <button class="flex bg-red-500 p-1 m-2" onClick={async()=>{
                            
                             setHasNotifications(!hasNotifications)
               
                }}>
                 <IonIcon name="close-outline" style={{color:"white"}}/>
                </button>
              </div>
              <div class="flex w-full">
                <input type="checkbox" onChange={(e)=>{
                    console.log(e.target.checked)
                    setShowAllNotifications(e.target.checked)
                }}></input>
                <p class="text-white text-small">Show all notifications</p>
              </div>
              {!showAllNotifications?
            <ul class={`h-[${user.notifications.length>3?60:30}vh] overflow-y-scroll overflow-hidden `}>
              { user.notifications.map((n)=>{
                  if(n.acknowledged!=null && n.acknowledged==false ){
                    console.log("SHOULD NOT BE DISABLED")
                  return(<Notification user={user} n={n}/> )
                }else if(n.acknowledged==null){
                  return(<Notification user={user} n={n}/> )
                }
                })
              }
               
            </ul>
            :





              <div class="flex-col">
              {user.allNotifications.length !=0?
                <ul class={`h-[${user.allNotifications.length || user.notifications.length >3?60:30}vh] overflow-y-scroll overflow-hidden`}>

              { user.allNotifications.map((n)=>{
                  
                  return(<Notification user={user} n={n}/> )
                
                })
              }
              </ul>
              :
              <ul class={`h-[${user.allNotifications.length || user.notifications.length >3?60:30}vh] overflow-y-scroll overflow-hidden`}>

              { user.notifications.map((n)=>{
                  
                  return(<Notification user={user} n={n}/> )
                
                })
              }
              </ul>

           
              }
              </div>
            
            }
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