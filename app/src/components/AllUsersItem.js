import { useNavigate } from "react-router-dom"
import {useState} from 'react'
import { Link } from "react-router-dom"
import {connect,useDispatch} from 'react-redux'
import { useEffect } from "react"
import { collection,getDocs } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { setEditFFUser, setFFVisibility } from "../redux/editFollowersAndFollowing/editFollowersAndFollowing-actions"
function AllUsersItem({u,refreshFollowers,refreshFollowing,checkUser}){
    const navigate=useNavigate()
 
    const[user,setUser]=useState(u.data())
    const[isLoading,setIsLoading]=useState(true)
    const self=JSON.parse(sessionStorage.getItem("user"))
    const [followers,setFollowers]=useState(u.data().followers!=null? u.data().followers.length:0)
    const [following,setFollowing]=useState(u.data().following!=null? u.data().following.length:0)
    const dispatch=useDispatch()
    useEffect(()=>{
        if(checkUser!=null){
            if(checkUser.userId==u.userId){
              const prom=new Promise(async(resolve,reject)=>{
                const ref=collection(db,"users")
                const docu=await getDocs(ref)
                docu.docs.map((d)=>{
                    if(d.data().userId==u.data().userId){
                        setUser(d.data())
                        console.log("\n\n\nMATCH")
                        if(d.data().followers!=null){
                            setFollowers(d.data().followers.length)
                        }
                        if(d.data().following!=null){
                            setFollowing(d.data().following.length)
                        }
                        setTimeout(()=>{
                            resolve()
                        },300)
                    }
                })
              })
              prom.then(()=>{
                setIsLoading(false)
              })  
            }else{
                const prom=new Promise(async(resolve,reject)=>{
                    const ref=collection(db,"users")
                    const docu=await getDocs(ref)
                    docu.docs.map((d)=>{
                        if(d.data().userId==u.data().userId){
                            setUser(d.data())

                            console.log("\n\n\nMATCH")
                            if(d.data().followers!=null){
                                setFollowers(d.data().followers.length)
                            }
                            if(d.data().following!=null){
                                setFollowing(d.data().following.length)
                            }
                            setTimeout(()=>{
                                resolve()
                            },300)
                        }
                    })
                  })
                  prom.then(()=>{
                    setIsLoading(false)
                  })  

            }
        }else{
            const prom=new Promise(async(resolve,reject)=>{
                const ref=collection(db,"users")
                const docu=await getDocs(ref)
                docu.docs.map((d)=>{
                    if(d.data().userId==u.data().userId){
                        setUser(d.data())

                        console.log("\n\n\nMATCH")
                        if(d.data().followers!=null){
                            setFollowers(d.data().followers.length)
                        }
                        if(d.data().following!=null){
                            setFollowing(d.data().following.length)
                        }
                        setTimeout(()=>{
                            resolve()
                        },500)
                    }
                })
              })
              prom.then(()=>{
                setIsLoading(false)
              })  
           
        }

    },[refreshFollowers,refreshFollowing,checkUser])
    if(!isLoading && user!=null){
        console.log("\n\n",user.firstname)
        console.log("followers",followers.length)
        console.log("following",following.length)

    return(
        <div class="p-2 flex-col">
            <div class="flex-col">
                <button class="p-1 flex-col" onClick={()=>{
                   
                    if(user.userId.stringValue!=null){
                    navigate("/user/"+user.userId)
                    }else{
                        navigate("/user/"+user.userId)
                    }
                }}>
                    <p class="font-bold hover:text-green-400">{user.firstname} {user.lastname}</p>
             
                </button>
                <div class="flex-col">
                    <button class="rounded-sm flex p-2" onClick={()=>{
                        dispatch(setEditFFUser(user))
                        dispatch(setFollowers(true))
                        dispatch(setFollowing(false))
                        setTimeout(()=>{
                            setFFVisibility(true)
                        },500)

                    }}>
                        <p class="text-white bg-purple-600  text-xs">{user.followers!=null?user.followers.length:"0"} followers</p>
                    </button>
                    <button class="rounded-sm flex  p-2" onClick={()=>{
                        dispatch(setEditFFUser(user))
                        dispatch(setFollowers(false))
                        dispatch(setFollowing(true))
                        setTimeout(()=>{
                            setFFVisibility(true)
                        },500)

                    }}>
                        <p class="text-white bg-purple-600  text-xs">following {user.following!=null?user.following.length:"0"} </p>
                    </button>
                </div>
            </div>
        </div>
    )
            }else{
                return(<div></div>)
            }

}

const mapStateToProps = (state, props) => {
    var checkuser= state.editFollowersAndFollowing.user
    var refreshFollowers=state.editFollowersAndFollowing.setFollowers
    var refreshFollowing=state.editFollowersAndFollowing.setFollowing
  
  
    return {
  checkUser:checkuser,
  refreshFollowers:refreshFollowers,
  refreshFollowing:refreshFollowing,
 
    };
  };

export default connect(mapStateToProps)(AllUsersItem)