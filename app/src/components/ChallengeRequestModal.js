import React from 'react'
import {connect,useDispatch} from "react-redux"
import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { setChallengeRequestModalVisibility,setChallengeRequest } from '../redux/groupChallangeRequest/groupChallenge-actions'
import { collection,doc,getDocs,getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import axios from 'axios'
import IonIcon from '@reacticons/ionicons'
function ChallengeRequestModal({challenge,visibility,disabled,socket}) {

  const[isLoading,setIsLoading]=useState(true)
  const[groupChallenge,setGroupChallenge]=useState()
  const[allGroupChallenges,setAllGroupChallenges]=useState()
  const[host,setHost]=useState()
  const dispatch=useDispatch()
  const navigate=useNavigate()
  useEffect(()=>{
    console.log(challenge) 
    var gc
    var h
    var allGC
    const prom=new Promise(async(resolve,reject)=>{

      if(visibility && challenge!=null){
        const refer=collection(db,"users")
        const docs=await getDocs(refer)
        docs.docs.map((d)=>{
          const data=d.data()
          if(data.groupChallenges!=null && data.userId==challenge.createdBy){
            allGC=data.groupChallenges
            data.groupChallenges.map(async(c)=>{
             if(c.challengeId==challenge.challengeId)
             var hostRefer=doc(db,"users",challenge.createdBy)
            var hostData=await getDoc(hostRefer)
              h=hostData.data()
              gc=c
            setTimeout(()=>{
              resolve()
            },100)
            })
          }
        })
       
      }

    })

    prom.then(()=>{
      const prom1=new Promise((resolve,reject)=>{
        if(gc!=null){
          setGroupChallenge(gc)
          setAllGroupChallenges(allGC)
          setHost(h)
          setTimeout(()=>{
            resolve()
          },100)
        }
      })

      prom1.then(()=>{
        setIsLoading(false)
      })
    })

  },[visibility,challenge])

  function findIndex(arr,e){
    console.log(arr)
    var i=0
    var index=arr.map((a)=>{
      if(a.userId==e.userId){
        return i
      }
      i++
    })
    index=index.filter((f)=>{
      return f!=null
    })
    console.log("index in func:",index)
    return index.length>0?index[0]:-1
  }

  function findGroupIndex(arr,e){
    console.log(arr)
    var ind
    var i=0
    const index=arr.map((a)=>{
      console.log(a.challengeId,e.challengeId)
      if(a.challengeId==e.challengeId){
        ind= i
      }
      i++
    })
    
    console.log("index:",ind)
    return ind!=null?ind:-1
  }

  if(!isLoading){
    console.log("challenge request:",challenge)
    console.log("groupChallenge:",groupChallenge)
    console.log(allGroupChallenges)
    console.log("host:",host)
  return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
     
      <main id='content' role='main' class='w-full max-w-lg mx-auto h-[80vh] overflow-y-scroll overflow-hidden rounded-md'>
      
        <div class=' bg-white  rounded-md shadow-lg bg-white dark:border-gray-700 mb-5 flex flex-col p-5'>
        <div class="flex w-full justify-end">
          <button class="bg-red-500 rounded-sm p-1" onClick={()=>{
            const prom=new Promise((resolve,reject)=>{
              dispatch(setChallengeRequestModalVisibility(false))
              dispatch(setChallengeRequest(null))
              setIsLoading(true)

            
              setTimeout(()=>{
                resolve()
              },300)
            })

            prom.then(()=>{
              dispatch(setChallengeRequestModalVisibility(false))
            })
          }}>
           <IonIcon name="close-outline" style={{color:"white"}} onClick={()=>{
                  setIsLoading(true)
                }}/>
          </button>
        </div>
        <div class="flex-col w-full p-3">
          <div class="bg-purple-300 p-2 flex rounded-d">
            <p class="text-xs">{`${host.username} (${host.firstname} ${host.lastname}) has invited you to participate in a group challenge `} </p>
          </div>
          <p class="text-2xl font-bold">
            {groupChallenge.title}
          </p>

          <p class="font-semibold">{new Date(groupChallenge.startDate.seconds*1000).toString().substring(0,15)} - {new Date(groupChallenge.endDate.seconds*1000).toString().substring(0,15)}</p>
          <p class="font-bold">No. Questions:<span class="font-normal">{groupChallenge.no_questions}</span></p>
          <p class="font-bold">No. Passes:<span class="font-normal">{groupChallenge.passes}</span></p>
          <div>
            <p class="font-bold">Contestants:</p>
          <div class={` ${groupChallenge.selectedContestants.length<8? "flex w-full":"overflow-x-scroll overflow-hidden"} bg-gray-200 p-2`}>
            {
              groupChallenge.selectedContestants.map((c)=>{
                return(<button class="grid-col-1 bg-gray-400 rounded-sm p-1 m-2 gap-0" onClick={()=>{
                  navigate("/user/"+c.userId)
                  setTimeout(()=>{
                    dispatch(setChallengeRequestModalVisibility(false))
                    setIsLoading(true)
                  },200)
                }}>
                <p class="text-white text-sm m-1 hover:text-green-500">{`${c.username} `}</p>
                <p class="text-gray-100 text-xs m-0 hover:text-green-500">{`${c.firstname} ${c.lastname} `}</p>
                </button>)
              })
            }
          </div>
          </div>
          <div class="flex">
            {
              challenge.approved?
              <div class="flex w-full">
                <p class="font-bold">
                  Status:<span class="text-green-500 font-normal m-1">Approved </span>  <span class="ml-2 font-normal text-xs">{`(${new Date(challenge.dateApproved.seconds *1000).toString().substring(0,15)}) ${Number(new Date(challenge.dateApproved.seconds *1000).toString().substring(16,18))>12? (Number(new Date(challenge.dateApproved.seconds *1000).toString().substring(16,18))-12).toString()+(new Date(challenge.dateApproved.seconds *1000).toString().substring(18,25))+"PM":Number(new Date(challenge.dateApproved.seconds *1000).toString().substring(16,18)).toString()+"AM"}`}</span>
                </p>
              </div>:
              <div>
              </div>
            }
            {
              challenge.denied?
              <div class="flex w-full">
                <p class="font-bold">
                  Status:<span class="text-red-500 font-normal">Denied </span>  <span class="ml-2 font-normal text-xs">{`(${new Date(challenge.dateDenied.seconds *1000).toString().substring(0,15)}) ${Number(new Date(challenge.dateDenied.seconds *1000).toString().substring(16,18))>12? (Number(new Date(challenge.dateDenied.seconds *1000).toString().substring(16,18))-12).toString()+(new Date(challenge.dateDenied.seconds *1000).toString().substring(18,25))+"PM":Number(new Date(challenge.dateDenied.seconds *1000).toString().substring(16,18)).toString()+"AM"}`}</span>
                </p>
              </div>:
              <div>
              </div>
            }

          </div>
          {disabled==false && challenge.denied!=true && challenge.approved!=true?

          <div class="flex w-full justify-around m-2">
            <button class="bg-green-500 rounded-sm p-1" onClick={()=>{
              groupChallenge.selectedContestants.map(async(c)=>{
                if(c.userId==challenge.userId){
                  var allgroups=allGroupChallenges
                  const groupIndex=findGroupIndex(allgroups,groupChallenge)
                 var newGroupChallenge=groupChallenge
                 const position=findIndex(groupChallenge.selectedContestants,c)
                  const contestant=c
                  contestant.approved=true
                  contestant.dateApproved=new Date()
                  
                  console.log("position:"+position)
                  if(position!=-1 && groupIndex!=-1){
                    newGroupChallenge.hasAccepted=true
                    console.log(newGroupChallenge.selectedContestants[position])
                    newGroupChallenge.selectedContestants[position].approved=true
                    newGroupChallenge.selectedContestants[position].dateApproved=new Date()
                   
                 
                      console.log("group",groupIndex)
                      allgroups[groupIndex]=newGroupChallenge
                      console.log("CHANGED:",allgroups)
                    const challengeRefer=doc(db,"users",host.userId)
                    const notification={
                      message:challenge.username+" ("+challenge.firstname +" " +challenge.lastname+") has accepted your group challenge invitation for "+groupChallenge.title+" from "+ new Date(groupChallenge.startDate.seconds*1000).toString().substring(0,15)+" through "+new Date(groupChallenge.endDate.seconds*1000).toString().substring(0,15),
                      time:new Date(),
                      type:"GROUP_CHALLENGE_REQUEST_ACCEPTED",
                      challenge:newGroupChallenge.selectedContestants[position],
                      acknowledged:false
                    }
                    console.log(notification)
                    /*****HOST */
                    const hostRef=doc(db,"users",host.userId)
                    const hostData=await getDoc(hostRef)
                    console.log(hostData.data().notifications)
                    var hdata=hostData.data()
                    var newNots=hdata.notifications!=null && hdata.notifications.length>0? hdata.notifications:[]
                    var newAllNots=hdata.notifications!=null && hdata.notifications.length>0? hdata.allNotifications:[]
                    if(newNots.length>0){
                      newNots.push(notification)
                    }else{
                      newNots=[notification]
                    }
                    if(newAllNots.length>0){
                      newAllNots.push(notification)
                    }else{
                      newAllNots=[notification]
                    }
                    const updateHost=await updateDoc(hostRef,{
                      notifications:newNots,
                      allNotifications:newAllNots,
                      hasNewNotifications:true,
                      groupChallenges:allgroups
                    })
                    /*****CONTESTANT */
                    const contRef=doc(db,"users",challenge.userId)
                    var contData=await getDoc(contRef)
                    contData=contData.data()
                    var changed
                    if(contData.groupChallengeRequests!=null && contData.groupChallengeRequests.length>0){
                      var newChallengeReq=contData.groupChallengeRequests
                      contData.groupChallengeRequests.map((c)=>{
                        if(c.challengeId==challenge.challengeId){
                       
                          const contIndex=findGroupIndex(newChallengeReq,c)
                          newChallengeReq[contIndex].approved=true
                          newChallengeReq[contIndex].dateApproved=new Date()
                          changed=newChallengeReq[contIndex]
                         setTimeout(async()=>{
                          const updateCont=await updateDoc(contRef,{
                            groupChallengeRequests:newChallengeReq
                          })
                         },150)
                        }
                      })
                    }else{
                      const newreq=challenge
                      newreq.approved=true
                      newreq.dateApproved=new Date()
                      changed=newreq
                     setTimeout(async()=>{
                      const updateCont=await updateDoc(contRef,{
                        groupChallengeRequests:newreq
                      })
                     },150)

                    }
               
                    setTimeout(()=>{
                      
                      axios.post("http://localhost:3022/update-group-challenge-contestant/"+challenge.userId,{createdBy:groupChallenge.userId,groupChallenge:newGroupChallenge,user:changed,case:"CONTESTANT_GROUP_CHALLENGE_ACCEPTED"}).then((response)=>{
                        console.log(response)
                        if(response.data.success){
                          alert("SUCCESS: you are now participating in "+groupChallenge.title)
                          setIsLoading(true)
                        }
                      })
                    },150)
                  }
                }
              })
            }}>
              <p class="text-white">Approve</p>
            </button>
            <button class="bg-red-500 rounded-sm p-1" onClick={()=>{
              groupChallenge.selectedContestants.map(async(c)=>{
                if(c.userId==challenge.userId){
                  var allgroups=allGroupChallenges
                  const groupIndex=findGroupIndex(allgroups,groupChallenge)
                 var newGroupChallenge=groupChallenge
                 const position=findIndex(groupChallenge.selectedContestants,c)
                  const contestant=c
                  contestant.denied=true
                  contestant.dateDenied=new Date()
                  
                  
                  if(position!=-1 && groupIndex!=-1){
               
                    newGroupChallenge.selectedContestants[position].denied=true
                    newGroupChallenge.selectedContestants[position].dateDenied=new Date()
                   
                 
                      console.log("group",groupIndex)
                      allgroups[groupIndex]=newGroupChallenge
                      console.log("CHANGED:",allgroups)
                    const challengeRefer=doc(db,"users",host.userId)
                    const notification={
                      message:challenge.username+" ("+challenge.firstname +" " +challenge.lastname+") has rejected your group challenge invitation for "+groupChallenge.title+" from "+ new Date(groupChallenge.startDate.seconds*1000).toString().substring(0,15)+" through "+new Date(groupChallenge.endDate.seconds*1000).toString().substring(0,15),
                      time:new Date(),
                      type:"GROUP_CHALLENGE_REQUEST_REJECTED",
                      challenge:newGroupChallenge.selectedContestants[position],
                      acknowledged:false
                    }
                    console.log(notification)
                    /*****HOST */
                    const hostRef=doc(db,"users",host.userId)
                    const hostData=await getDoc(hostRef)
                    console.log(hostData.data().notifications)
                    var hdata=hostData.data()
                    var newNots=hdata.notifications!=null && hdata.notifications.length>0? hdata.notifications:[]
                    var newAllNots=hdata.notifications!=null && hdata.notifications.length>0? hdata.allNotifications:[]
                    if(newNots.length>0){
                      newNots.push(notification)
                    }else{
                      newNots=[notification]
                    }
                    if(newAllNots.length>0){
                      newAllNots.push(notification)
                    }else{
                      newAllNots=[notification]
                    }
                    const updateHost=await updateDoc(hostRef,{
                      notifications:newNots,
                      allNotifications:newAllNots,
                      hasNewNotifications:true,
                      groupChallenges:allgroups
                    })
                    /*****CONTESTANT */
                    const contRef=doc(db,"users",challenge.userId)
                    var changed
                    var contData=await getDoc(contRef)
                    contData=contData.data()
                    var newAddGroupChallenge=contData.groupChallenges!=null && hdata.notifications.length>0? hdata.groupChallenges:[]
                    if(newAddGroupChallenge.length==0){
                      newAddGroupChallenge=[newGroupChallenge]
                    }else{
                      newAddGroupChallenge.push(newGroupChallenge)
                    }
                    if(contData.groupChallengeRequests!=null && contData.groupChallengeRequests.length>0){
                      var newChallengeReq=contData.groupChallengeRequests
                      contData.groupChallengeRequests.map((c)=>{
                        if(c.challengeId==challenge.challengeId){
                       
                          const contIndex=findGroupIndex(newChallengeReq,c)
                          newChallengeReq[contIndex].denied=true
                          newChallengeReq[contIndex].dateDenied=new Date()
                          changed=newChallengeReq[contIndex]
                         setTimeout(async()=>{
                          const updateCont=await updateDoc(contRef,{
                            groupChallengeRequests:newChallengeReq,
                            groupChallenges:newAddGroupChallenge
                          })
                         },150)
                        }
                      })
                    }else{
                      const newreq=challenge
                      newreq.denied=true
                      newreq.dateDenied=new Date()
                      changed=newreq
                     setTimeout(async()=>{
                      const updateCont=await updateDoc(contRef,{
                        groupChallengeRequests:newreq
                      })
                     },150)

                    }
                    
                    setTimeout(()=>{
                      axios.post("http://localhost:3022/update-group-challenge-contestant/"+challenge.userId,{groupChallenge:newGroupChallenge,user:changed,case:"CONTESTANT_GROUP_CHALLENGE_REJECTED"}).then((response)=>{
                        console.log(response)
                        if(response.data.success){
                          alert("SUCCESS: you are not participating in "+groupChallenge.title)
                          setIsLoading(true)
                        }
                      })
                    },150)
                  } 
                }
              })
            }}>
              <p class="text-white">Deny</p>
            </button>
  
          </div>
          :
          <div></div>
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
  var visibility= state.groupChallenge.visibility
  var challenge=state.groupChallenge.challenge
  var disabled=state.groupChallenge.disabled
  var socket=state.socket.socket

 

  return {
   visibility:visibility,
  challenge:challenge,
  disabled:disabled,
  socket:socket
  };
};
export default connect(mapStateToProps)(ChallengeRequestModal)