import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate ,useLocation, Link} from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'

import { query,doc,collection,getDocs,where, updateDoc,getDoc} from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import IonIcon from '@reacticons/ionicons'
import { setChallengeRequestModalVisibility,setChallengeRequest } from '../../redux/groupChallangeRequest/groupChallenge-actions'
import OpenChallengeRequestButton from './OpenChallengeRequestButton'

function Header({ourUser,visibility}) {

  const[isLoading,setIsLoading]=useState(true)
  const [user,setUser]=useState()
  const[hasNotifications,setHasNotifications]=useState(false)
  const[reload,setReload]=useState(false)
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

  },[visibility,hasNotifications,reload])


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
           <button class="justify-end flex w-full m-2" >
              <p class="text-md text-white m-0">{user.firstname} {user.lastname}</p>
             {user.hasNewNotifications? <IonIcon onClick={async()=>{
           
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
           
         
        

          }} name="notifications-outline" size="large"/>:<p></p>}
           </button>  
          </div>
          {hasNotifications && user.hasNewNotifications? <span class=" p-2 absolute top-20 w-1/3 right-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white scale-100">
            <div class="flex-col ">
              <div class="flex w-full justify-end ">
                <button class="flex bg-red-500 p-1 m-2" onClick={async()=>{
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
                 <IonIcon name="close-outline" style={{color:"white"}}/>
                </button>
              </div>
            <ul class={`h-[${user.notifications.length>3?60:30}vh] overflow-y-scroll overflow-hidden `}>
              {
                user.notifications.map((n)=>{
                  if(n.acknowledged!=null && n.acknowledged==false){
                  return(
                    <div class="flex-col m-1 p-1 bg-gray-400 rounded-sm gap-y-0">
                      <div class="flex w-full justify-end p-1">
                        <button class="bg-gray-600 p-1 rounded-sm" onClick={async()=>{
                          function findNote(arr,n){
                            var pos
                            var i=0;
                            arr.map((a)=>{
                              if(a.time.toString()==n.time.toString()){
                                pos=i
                              }
                              i++
                            })
                            return pos==null? -1:pos
                          }
                          const refer=doc(db,"users",user.userId)
                          const d=await getDoc(refer)
                          const data=d.data()
                          console.log(data)
                          const nn=data.notifications
                          const an=data.allNotifications
                          const aIndex=findNote(an,n)
                          const nIndex=findNote(nn,n)
                          an.map((d)=>{
                            d.acknowledged=true
                          })
                          console.log(aIndex,nIndex)
                          if(nIndex!=-1){
                            var newNotifications=nn
                            newNotifications[nIndex].acknowledged=true
                            newNotifications[nIndex].timeAcknowledged=new Date()
                            console.log(newNotifications)
                            if(aIndex==-1){
                              const updateNote=newNotifications[nIndex]
                              an.push(updateNote)
                            }
                            newNotifications.splice(nIndex,1)
                          setTimeout(async()=>{
                            const update=await updateDoc(refer,{
                              notifications:newNotifications,
                              allNotifications:an

                            })
                            setIsLoading(true)
                          },100)
                          }

                        }}>
                          <IonIcon name="close-outline" style={{color:"white"}}/>
                        </button>
                      </div>
                  <p class=" font-bold text-white text-3xs">
                    {n.message}-
                  </p>
                  {n.type!=null && n.type=="GROUP_CHALLENGE_REQUEST"?
                  <div class="flex p-3">
                    {
                      user.groupChallengeRequests.map((r)=>{
                        if(r.challengeId==n.challengeId){
                          return(<OpenChallengeRequestButton challenge={r}/>)
                        }
                      })
                    }
                  </div>
                  :
                  <div></div>
                  }
                  <p class="text-gray-200 font-semi-bold text-xs">{new Date(n.time.seconds*1000).toString().substring(0,25)}</p>
                  </div>)
                }
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