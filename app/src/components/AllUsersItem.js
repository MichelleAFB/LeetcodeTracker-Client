import { useNavigate } from "react-router-dom"
import {useState} from 'react'
import { Link } from "react-router-dom"
import {connect,useDispatch} from 'react-redux'
import { useEffect } from "react"
import { collection,getDocs } from "firebase/firestore"
import { db } from "../firebase/firebase"
import {Image, Video, Transformation} from 'cloudinary-react';
import axios from 'axios';

import {Cloudinary} from "@cloudinary/url-gen";


import { CloudinaryImage } from '@cloudinary/url-gen';
import { setEditFFUser, setFFVisibility,setFFFollowers,setFFFollowing} from "../redux/editFollowersAndFollowing/editFollowersAndFollowing-actions"
function AllUsersItem({u,refreshFollowers,refreshFollowing,checkUser}){
    const navigate=useNavigate()
 
    const[user,setUser]=useState(u.data())
    const[isLoading,setIsLoading]=useState(true)
    const self=JSON.parse(sessionStorage.getItem("user"))
    const [followers,getFollowers]=useState(u.data().followers!=null? u.data().followers.length:0)
    const [following,getFollowing]=useState(u.data().following!=null? u.data().following.length:0)
   const[avi,setAvi]=useState()
    const dispatch=useDispatch()

    const cld = new Cloudinary({
        cloud: {
          cloudName: 'michelle-badu',
          apiKey:'877163957659927',
          apiSecret:'NBk67NDZKIxpnGE06FUDFLSisp8'
        }
      })
      console.log(u)
    useEffect(()=>{
        if(checkUser!=null){
            if(checkUser.userId==u.userId){
              const prom=new Promise(async(resolve,reject)=>{
                const ref=collection(db,"users")
                const docu=await getDocs(ref)
                docu.docs.map((d)=>{
                    if(d.data().userId==u.data().userId){
                        
                        setUser(d.data())
                       
                        if(d.data().profilePicUrl!=null){
                           var arr=d.data().profilePicUrl
                         var url=arr[0]+"/"+arr[1]+"/"+arr[2]+"/"+arr[3]+"/"+arr[4]+"/"+arr[5]+"/s--rL26fQoJ--/t_profile-small/"+arr[6]+"/"+arr[7]
       
                           const a1=cld.image(url);
                           setAvi(a1)
                        }
                        if(d.data().followers!=null){
                            getFollowers(d.data().followers.length)
                            dispatch(setFFFollowers(true))
                        }
                        if(d.data().following!=null){
                            getFollowing(d.data().following.length)
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

                            if(d.data().profilePicUrl!=null && d.data().userId==u.data().userId ){
                                var arr=d.data().profilePicUrl
                              var url=arr[0]+"/"+arr[1]+"/"+arr[2]+"/"+arr[3]+"/"+arr[4]+"/"+arr[5]+"/s--rL26fQoJ--/t_profile-small/"+arr[6]+"/"+arr[7]
            
                                const a1=cld.image(url);
                                setAvi(a1)
                             }
                            if(d.data().followers!=null){
                                getFollowers(d.data().followers)
                            }
                            if(d.data().following!=null){
                                getFollowing(d.data().following)
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

                      
                        if(d.data().profilePicUrl!=null && d.data().userId==u.data().userId){
                           var arr=d.data().profilePicUrl.split("/")
                         var url=arr[0]+"/"+arr[1]+"/"+arr[2]+"/"+arr[3]+"/"+arr[4]+"/"+arr[5]+"/s--rL26fQoJ--/t_profile-small/"+arr[6]+"/"+arr[7]
       
                           const a1=cld.image(url);
                           setAvi(a1)
                        }
                        if(d.data().followers!=null){
                            getFollowers(d.data().followers.length)
                        }
                        if(d.data().following!=null){
                            getFollowing(d.data().following.length)
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
    
    
    return(
        <div class="p-2 flex-col">
            <div class="flex-col">
            <div class="flex">
                <button class="p-1 flex-col items-center " onClick={()=>{
                   
                    if(user.userId.stringValue!=null){
                    navigate("/user/"+user.userId)
                    }else{
                        navigate("/user/"+user.userId)
                    }
                }}>
                    <p class="font-bold hover:text-green-400">{user.firstname} {user.lastname}</p>
             
                </button>
                               
                {avi!=null?
                    <Image cloudName="michelle-badu" publicID={avi.publicID}   crop="limit"
                        width="170"
                        height="16">
                   <Transformation height={300} crop="scale" quality="auto" fetchFormat="auto" />
                     
                 </Image>:<div></div>
    }
                 </div>
                <div class="flex-col">
                    <button class="rounded-sm flex p-2 m-0" onClick={()=>{
                       const prom=new Promise((resolve,reject)=>{
                    
                        
                        dispatch(setFFFollowers(true))
                      
                        setTimeout(()=>{
                            dispatch(setFFFollowing(false)) 
                          resolve()
                        },1000)
                    })

                    prom.then(()=>{
                        dispatch(setEditFFUser(user))
                        dispatch(setFFVisibility(true))
                    })

                    }}>
                        <p class="text-white bg-purple-600  text-xs">{user.followers!=null?user.followers.length:0} followers</p>
                    </button>
                    <button class="rounded-sm flex  m-0 p-2" onClick={()=>{
                        const prom=new Promise((resolve,reject)=>{
                         
                         
                            dispatch(setFFFollowers(false))
                           
                            setTimeout(()=>{
                                dispatch(setFFFollowing(true)) 
                              resolve()
                            },1000)
                        })

                        prom.then(()=>{
                            dispatch(setEditFFUser(user))
                            dispatch(setFFVisibility(true))

                        })
                       

                    }}>
                        <p class="text-white bg-purple-600  text-xs">following {user.following!=null?user.following.length:0} </p>
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
    var refreshFollowers=state.editFollowersAndFollowing.setFFFollowers
    var refreshFollowing=state.editFollowersAndFollowing.setFFFollowing
  
  
    return {
  checkUser:checkuser,
  refreshFollowers:refreshFollowers,
  refreshFollowing:refreshFollowing,
 
    };
  };

export default connect(mapStateToProps)(AllUsersItem)