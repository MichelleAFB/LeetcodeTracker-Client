import { useParams } from "react-router-dom"
import {useState,useEffect} from 'react'
import { db } from "../firebase/firebase"
import axios from "axios"
import { collection,doc,getDoc,query,where,getDocs,updateDoc } from "firebase/firestore"
import ProblemList from "../components/ProblemList"
function User(){
    const id=useParams().id
    const [user,setUser]=useState()
    const [createTime,setCreateTime]=useState()
    const[notFound,setNotFound]=useState(false)
    const[isLoading,setIsLoading]=useState(true)
    const[lastLogin,setLastLogin]=useState()
    const [streaks,setStreaks]=useState()
    console.log(typeof(id))
    const[longestStreak,setLongestStreak]=useState()
    const[currentChallenge,setCurrentChallenge]=useState()
    const[notFollowing,setNotFollowing]=useState(true)
    const[loggedIn,setLoggedIn]=useState(true)

    //ourUser=user we are viewing
    //user=logged in user

    const[alreadyFollowing,setAlreadyFollowing]=useState(false)
    useEffect(()=>{
        const ref=collection(db,"users")
        const prom=new Promise(async(resolve,reject)=>{
       
            const us=await getDocs(ref)
            const ourUser=JSON.parse(sessionStorage.getItem("user"))
            if(ourUser==null){
                setLoggedIn(false)
            }
          
            us.docs.map((us)=>{
            
                if(us.data()!=null){
                  if(us.data().userId==id){
           
                
                 
                    const s=us.data()
                  
                    if(s.followers!=null){

                        console.log(s.firstname," has followers",s.followers)
                      
                       var isFollowing= s.followers.map((f)=>{
                        console.log(s.followers)
                            if(f.username==ourUser.username && f.user==ourUser.userId){
                                console.log("\n\n\nFOLLOWING")
                                console.log(ourUser,"viwing user",f.username)
                                console.log("loggedin",ourUser.username)
                                console.log(s.followers)
                                console.log("\n\n")
                                return true
                            }else{
                                return false
                            }
                        })
                     setTimeout(()=>{
                        console.log(isFollowing)
                        if(isFollowing.includes(true)){
                            setNotFollowing(false)
                        }else{
                            setNotFollowing(true)
                            setAlreadyFollowing(false)
                        }
                     },300)
                    }
                    
               
                setUser(s)
                setLastLogin( new Date(s.lastLogin.seconds*1000))
                setCreateTime(new Date(us._document.createTime.timestamp.seconds*1000))
                setCurrentChallenge(s.currentChallenge)
                setTimeout(()=>{
                    resolve()
                },1000)
            }
               
                }else{
                    reject()
                }
            })
          
        })
        const allStreaks=[]
        prom.then(()=>{
           setIsLoading(false)
         const prom1=new Promise(async(resolve1,reject1)=>{
            axios.get("http://localhost:3022/sort-streaks/"+id).then((response)=>{
                console.log("\n\n\n")
                console.log(response.data)
                if(response.data.streaks.length>0){
                response.data.streaks.map((s)=>{
                    if(s.length>1){
                        allStreaks.push(s)
                    }
                    
                })
                var longest=response.data.streaks.reduce(function (a, b) { return a.length>= b.length   ? a : b; });
                console.log("longest:",longest)
                setLongestStreak(longest)
                setTimeout(()=>{
                    resolve1()
                },600)
            }
            })
         })

         prom1.then(()=>{
            setStreaks(allStreaks)
            setTimeout(()=>{
                setIsLoading()

            },100)
         })
        })

        prom.catch(()=>{
            setIsLoading(false)
            setNotFound(true)
        })

    },[id,notFollowing])
    const ourUser=JSON.parse(sessionStorage.getItem("user"))

    if(isLoading){
        return(
            <div class="h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div class="flex-col justify-end  ">
                <div class="loading-spinner"/>
            </div>
          </div>
        )
    }

    function parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }
    if(!isLoading){

        if(!notFound && loggedIn){
          

         
    
    console.log("notfollowing:"+notFollowing)

    console.log("alreadyFollowing:"+alreadyFollowing)
    return(
        <div class="w-full flex min-h-screen ">
           <div class="flex-col w-full bg-gray-300 p-3">
            <div class="flex w-full">
                <div class="flex-col">
                    <div class="flex">
                        <p class="text-4xl font-bold">{user.firstname} {user.lastname} </p>
                        <div class="flex-col gap-y-1 ml-2">
                        <p class="text-purple-500 text-xs font-bold"> Last active {lastLogin!=null?lastLogin.toString().substring(0,15):"N/A"}</p>
                           { 
                           user.username!=null  && ourUser.username!=null && notFollowing==true ?
                           <button class="bg-gray-600 rounded-md  pb-1 pt-1 pr-2 pl-2" onClick={()=>{
                            const ourUser=JSON.parse(sessionStorage.getItem("user"))
                                axios.post("http://localhost:3022/follow-user/"+user.username+"/"+ourUser.username).then(async(response)=>{
                                    if(response.data.success){
                                        sessionStorage.setItem("user",JSON.stringify(response.data.user))
                                        alert("You now follow "+ user.username)
                                        const refer=collection(db,"users")
                                        const docs=await getDocs(refer)
                                        docs.docs.map(async(d)=>{
                                            //add this user to the other users followers
                                            if(d.data().userId==ourUser.userId){
                                                const thefollowed=doc(db,"users", d._key.path.segments[d._key.path.segments.length-1])
                                                const following=d.data().following

                                                if(following==null){
                                                    var addedthisFollower=[{followedSince: new Date(),user:user.userId,username:user.username}]
                                                    console.log(ourUser.username,"follows",addedthisFollower)
                                                   await  updateDoc(thefollowed,{
                                                    "following":addedthisFollower
                                                   })
                                                }else{
                                                    following.push({followedSince: new Date(),user:user.userId,username:user.username})
                                                    setTimeout(async()=>{
                                                        await updateDoc(thefollowed,{
                                                            "following":following
                                                        })
                                                    },100)
                                                    console.log("following")
                                                    console.log(following)
                                                }
                                            }
                                           
                                            if(d.data().userId==user.userId){
                                                const thefollowed=doc(db,"users", d._key.path.segments[d._key.path.segments.length-1])
                                                const following=d.data().followers

                                                if(following==null){
                                                    var addedthisFollower=[{followedSince: new Date(),user:ourUser.userId,username:ourUser.username}]
                                                    console.log(ourUser.username,"follows",addedthisFollower)
                                                    await  updateDoc(thefollowed,{
                                                        "followers":addedthisFollower
                                                       })
                                                       if(user.notifications!=null){
                                                        console.log("UPDATING NOTIFICATIONS")
                                                        const notifications= user.notifications
                                                        notifications.push({message:"New follower: "+ourUser.username+" started following you!",time:new Date()})
                                                        await  updateDoc(thefollowed,{
                                                            "notifications":notifications
                                                           })
                                                           await  updateDoc(thefollowed,{
                                                            "hasNewNotifications":true
                                                           })
                                                    }else{
                                                        await  updateDoc(thefollowed,{
                                                            "notifications":[{message:"New follower: "+ourUser.username+" started following you!" ,time:new Date()}]
                                                           })
                                                           await  updateDoc(thefollowed,{
                                                            "hasNewNotifications":true
                                                           })

                                                    }
                                                }else{
                                                    following.push({followedSince: new Date(),user:ourUser.userId,username:ourUser.username})
                                                    setTimeout(async()=>{
                                                        await  updateDoc(thefollowed,{
                                                            "followers":following
                                                           })
                                                           if(user.notifications!=null){
                                                            console.log("UPDATING NOTIFICATIONS")
                                                            const notifications= user.notifications
                                                            notifications.push({message:"New follower: "+ourUser.username+" started following you!",time:new Date()})
                                                            await  updateDoc(thefollowed,{
                                                                "notifications":notifications
                                                               })
                                                               await  updateDoc(thefollowed,{
                                                                "hasNewNotifications":true
                                                               })
                                                        }else{
                                                            await  updateDoc(thefollowed,{
                                                                "notifications":[{message:"New follower: "+ourUser.username+" started following you!",time:new Date()}]
                                                               })
                                                               await  updateDoc(thefollowed,{
                                                                "hasNewNotifications":true
                                                               })

                                                        }
                                                    })
                                                }
                                            }
                                        })
                                        setTimeout(()=>{
                                            setNotFollowing(false)
                                        })
                                    }
                                })
                            }}>
                                <p class="text-white">Follow</p>
                            </button>
                            :<p></p>
                             }
                            <div></div>
                        </div>
                    </div>
            
                <p class="text-md font-semibold">joined {createTime.toLocaleString('en-EN',{month:'long'})} {createTime.getUTCFullYear()}</p>
                   
                </div>
               
            </div>
            <div class="flex w-full">
                <div class="flex w-1/2">
                    <ProblemList id={id}/>
                </div>
                <div class="flex w-1/2">
                    <div class="flex-col">

                        <div class="flex p-3 border-b-2 border-gray-400 m-3">
                            <div class="flex-col">
                                <p class="text-lg font-bold">Current Challenge</p>
                                {
                                    currentChallenge!=null?
                                    <div class="flex-col gap-y-2  border-purple-500 border-2 rounded-md">
                                       <div class="flex"> 
                                            <p class="font-semibold m-2">{currentChallenge.title}</p>
                                            <p class="font-bold m-2">status: <span class={`font-bold ${currentChallenge.success? "text-green-600":"text-red-700"}`}>{currentChallenge.success? "Success":"Failed"}</span></p>
                                       </div>
                                        <div class="flex">
                                            {currentChallenge.startDate.seconds!=null?<p class="font-semibold m-2">Start:<span class="font-normal text-xs">{new Date(currentChallenge.startDate.seconds*1000).toString().substring(0,15)}</span></p>:<p class="font-semibold m-2">Start: <span class="font-normal text-xs">{parseISOString(currentChallenge.startDate).toString().substring(0,15)}</span></p>}
                                            {currentChallenge.endDate.seconds!=null?<p class="font-semibold m-2">End:<span class="font-normal text-xs">{new Date(currentChallenge.endDate.seconds*1000).toString().substring(0,15)}</span></p>:<p class="font-semibold m-2">End: <span class="font-normal text-xs">{parseISOString(currentChallenge.endDate).toString().substring(0,15)}</span></p>}
                                        </div>
                                    </div>:
                                    <p>
                                        No Current Challenge
                                    </p>
                                }
                            
                            </div>
                        </div>

                        <div class="flex w-full border-b-2 border-gray-400 p-3 m-3">
                            <div class="flex-col">
                                <p class="text-lg font-bold">Streaks</p>
                                <p>Longest streak length: {longestStreak!=null?longestStreak.length:""}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
           </div>
        </div> 
    )
        }else if(!notFound && !loggedIn){
            return(
                <div class="w-full flex min-h-screen ">
                <div class="flex-col w-full bg-gray-300 p-3">
                 <div class="flex w-full">
                     <div class="flex-col">
                         <div class="flex">
                             <p class="text-4xl font-bold">{user.firstname} {user.lastname} </p>
                             <div class="flex-col gap-y-1 ml-2">
                             <p class="text-purple-500 text-xs font-bold"> Last active {lastLogin!=null?lastLogin.toString().substring(0,15):"N/A"}</p>
            
                                 <div></div>
                             </div>
                         </div>
                 
                     <p class="text-md font-semibold">joined {createTime.toLocaleString('en-EN',{month:'long'})} {createTime.getUTCFullYear()}</p>
                        
                     </div>
                    
                 </div>
                 <div class="flex w-full">
                     <div class="flex w-1/2">
                         <ProblemList id={id}/>
                     </div>
                     <div class="flex w-1/2">
                         <div class="flex-col">
     
                             <div class="flex p-3 border-b-2 border-gray-400 m-3">
                                 <div class="flex-col">
                                     <p class="text-lg font-bold">Current Challenge</p>
                                     {
                                         currentChallenge!=null?
                                         <div class="flex-col gap-y-2  border-purple-500 border-2 rounded-md">
                                            <div class="flex"> 
                                                 <p class="font-semibold m-2">{currentChallenge.title}</p>
                                                 <p class="font-bold m-2">status: <span class={`font-bold ${currentChallenge.success? "text-green-600":"text-red-700"}`}>{currentChallenge.success? "Success":"Failed"}</span></p>
                                            </div>
                                             <div class="flex">
                                                 {currentChallenge.startDate.seconds!=null?<p class="font-semibold m-2">Start:<span class="font-normal text-xs">{new Date(currentChallenge.startDate.seconds*1000).toString().substring(0,15)}</span></p>:<p class="font-semibold m-2">Start: <span class="font-normal text-xs">{currentChallenge!=null?parseISOString(currentChallenge.startDate).toString().substring(0,15):""}</span></p>}
                                                 {currentChallenge.endDate.seconds!=null?<p class="font-semibold m-2">End:<span class="font-normal text-xs">{new Date(currentChallenge.endDate.seconds*1000).toString().substring(0,15)}</span></p>:<p class="font-semibold m-2">End: <span class="font-normal text-xs">{currentChallenge!=null?parseISOString(currentChallenge.endDate).toString().substring(0,15):""}</span></p>}
                                             </div>
                                         </div>:
                                         <p>
                                             No Current Challenge
                                         </p>
                                     }
                                 
                                 </div>
                             </div>
     
                             <div class="flex w-full border-b-2 border-gray-400 p-3 m-3">
                                 <div class="flex-col">
                                     <p class="text-lg font-bold">Streaks</p>
                                     <p>Longest streak length: {longestStreak!=null?longestStreak.length:""}</p>
                                 </div>
                             </div>
     
                         </div>
                     </div>
                 </div>
                </div>
             </div> 

            )
        }else{
            return(
                <div class="w-full flex min-h-screen ">
                    Not found
                 </div>   
            )
        }
    }

}

export default User