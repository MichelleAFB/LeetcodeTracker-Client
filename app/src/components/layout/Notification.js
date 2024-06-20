import React from 'react'
import { db } from '../../firebase/firebase';
import { getDoc,doc ,updateDoc} from 'firebase/firestore';
import { useState } from 'react';
import IonIcon from '@reacticons/ionicons';
import OpenChallengeRequestButton from './OpenChallengeRequestButton';
function Notification({user,n}) {
    const[isLoading,setIsLoading]=useState(false)
    if(!isLoading){
      console.log(n)

    if(n.acknowledged!=null && n.acknowledged==false ){
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
              console.log("CLICK")
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
                console.log("ALLNOTIFICATION NEW:",an)

                const update=await updateDoc(refer,{
                  notifications:newNotifications,
                  hasNewNotifications:newNotifications.length==0?false:true
                 // allNotifications:an

                })
               
              },100)
              }

            }}>
              <IonIcon name="close-outline" style={{color:"white"}} onClick={()=>{
                setIsLoading(true)
              }}/>
            </button>
          </div>
      <p class=" font-bold text-white text-3xs">
        {n.message}-
      </p>
      {n.type!=null && n.type=="GROUP_CHALLENGE_REQUEST"?
      <div class="flex p-3">
        
        {
          user.groupChallengeRequests.map((r)=>{
            if(n.challengeId==r.challengeId){
              console.log(r.dateApproved)
              return(<div class="flex-col w-full">
                {r.approved==true ?<p class="font-semi-bold">Status:<span class="font-normal text-green-800">Accepted-{`(${new Date(r.dateApproved.seconds *1000).toString().substring(0,15)}) ${Number(new Date(r.dateApproved.seconds *1000).toString().substring(16,18))>12? (Number(new Date(r.dateApproved.seconds *1000).toString().substring(16,18))-12).toString()+(new Date(r.dateApproved.seconds *1000).toString().substring(18,25))+"PM":Number(new Date(r.dateApproved.seconds *1000).toString().substring(16,18)).toString()+"AM"}`}</span></p>:<p></p>}
                {r.denied==true ?<p class="font-semi-bold">Status:<span class="font-normal text-red-500">Rejected-{`(${new Date(r.dateDenied.seconds *1000).toString().substring(0,15)}) ${Number(new Date(r.dateDenied.seconds *1000).toString().substring(16,18))>12? (Number(new Date(r.dateDenied.seconds *1000).toString().substring(16,18))-12).toString()+(new Date(r.dateDenied.seconds *1000).toString().substring(18,25))+"PM":Number(new Date(r.dateDenied.seconds *1000).toString().substring(16,18)).toString()+"AM"}`}</span></p>:<p></p>}
                <OpenChallengeRequestButton challenge={r} disabled={r.approved!=true && r.denied!=true? false:true}/>
                </div>)
            }
          })
        }
        </div>
        :
        <div></div>}
      </div>)
     
    }else if(n.acknowledged==null){
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
                console.log("CLICK")

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
                  console.log("ALLNOTIFICATION NEW:",an)
                  const update=await updateDoc(refer,{
                    notifications:newNotifications,
                    hasNewNotifications:newNotifications.length==0?false:true
                   // allNotifications:an

                  })
               
                },100)
                }

              }}>
                <IonIcon name="close-outline" style={{color:"white"}} onClick={()=>{
                  setIsLoading(true)
                }}/>
              </button>
            </div>
        <p class=" font-bold text-white text-3xs">
          {n.message}-
        </p>
        {n.type!=null && n.type=="GROUP_CHALLENGE_REQUEST"?
        <div class="flex p-3">
          {
            user.groupChallengeRequests.map((r)=>{
              if(n.challengeId==r.challengeId){
                console.log(r.dateApproved)
                return(<div class="flex-col w-full">
                  {r.approved==true ?<p class="font-semi-bold">Status:<span class="font-normal text-green-800">Accepted-{`(${new Date(r.dateApproved.seconds *1000).toString().substring(0,15)}) ${Number(new Date(r.dateApproved.seconds *1000).toString().substring(16,18))>12? (Number(new Date(r.dateApproved.seconds *1000).toString().substring(16,18))-12).toString()+(new Date(r.dateApproved.seconds *1000).toString().substring(18,25))+"PM":Number(new Date(r.dateApproved.seconds *1000).toString().substring(16,18)).toString()+"AM"}`}</span></p>:<p></p>}
                  {r.denied==true ?<p class="font-semi-bold">Status:<span class="font-normal text-red-500">Rejected-{`(${new Date(r.dateDenied.seconds *1000).toString().substring(0,15)}) ${Number(new Date(r.dateDenied.seconds *1000).toString().substring(16,18))>12? (Number(new Date(r.dateDenied.seconds *1000).toString().substring(16,18))-12).toString()+(new Date(r.dateDenied.seconds *1000).toString().substring(18,25))+"PM":Number(new Date(r.dateDenied.seconds *1000).toString().substring(16,18)).toString()+"AM"}`}</span></p>:<p></p>}
                  <OpenChallengeRequestButton challenge={r} disabled={r.approved!=true && r.denied!=true? false:true}/>
                  </div>)
              }
            })
          }
        </div>
        :
        <div></div>
        }
        <p class="text-gray-200 font-semi-bold text-xs">{new Date(n.time.seconds*1000).toString().substring(0,25)}</p>
        </div>)
      }else {
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
                console.log("CLICK")

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
                  console.log("old Notifications",user.notifications)
                  newNotifications.splice(nIndex,1)
                  console.log("new Notifications",newNotifications)
                  /*
                setTimeout(async()=>{
                  console.log("ALLNOTIFICATION NEW:",an)
                  const update=await updateDoc(refer,{
                    notifications:newNotifications,
                    hasNewNotifications:newNotifications.length==0?false:true
                   // allNotifications:an

                  })
               
                },100)
                */
                }

              }}>
                <IonIcon name="close-outline" style={{color:"white"}} onClick={()=>{
                  setIsLoading(true)
                }}/>
              </button>
            </div>
        <p class=" font-bold text-white text-3xs">
          {n.message}-
        </p>
        {n.type!=null && n.type=="GROUP_CHALLENGE_REQUEST"?
        <div class="flex p-3">
          {
            user.groupChallengeRequests.map((r)=>{
              if(n.challengeId==r.challengeId){
                console.log(r.dateApproved)
                return(<div class="flex-col w-full">
                  {r.approved==true ?<p class="font-semi-bold">Status:<span class="font-normal text-green-800">Accepted-{`(${new Date(r.dateApproved.seconds *1000).toString().substring(0,15)}) ${Number(new Date(r.dateApproved.seconds *1000).toString().substring(16,18))>12? (Number(new Date(r.dateApproved.seconds *1000).toString().substring(16,18))-12).toString()+(new Date(r.dateApproved.seconds *1000).toString().substring(18,25))+"PM":Number(new Date(r.dateApproved.seconds *1000).toString().substring(16,18)).toString()+"AM"}`}</span></p>:<p></p>}
                  {r.denied==true ?<p class="font-semi-bold">Status:<span class="font-normal text-red-500">Rejected-{`(${new Date(r.dateDenied.seconds *1000).toString().substring(0,15)}) ${Number(new Date(r.dateDenied.seconds *1000).toString().substring(16,18))>12? (Number(new Date(r.dateDenied.seconds *1000).toString().substring(16,18))-12).toString()+(new Date(r.dateDenied.seconds *1000).toString().substring(18,25))+"PM":Number(new Date(r.dateDenied.seconds *1000).toString().substring(16,18)).toString()+"AM"}`}</span></p>:<p></p>}
                  <OpenChallengeRequestButton challenge={r} disabled={r.approved!=true && r.denied!=true? false:true}/>
                  </div>)
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
    }
}

export default Notification
