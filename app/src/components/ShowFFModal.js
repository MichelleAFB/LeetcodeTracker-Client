import React from 'react'
import { connect,useDispatch } from 'react-redux';
import { useEffect,useState } from 'react';
import { setEditFFUser, setFFFollowers,setFFFollowing, setFFVisibility } from '../redux/editFollowersAndFollowing/editFollowersAndFollowing-actions';
function ShowFFModal({setFollowers,setFollowing,user,visibility}) {
    const[isLoading,setIsLoading]=useState(true)
    const [showFollowers,setShowFollowers]=useState(false)
    const[showFollowing,setShowFollowing]=useState(false)
    const dispatch=useDispatch()
    
    
    useEffect(()=>{

        const prom=new Promise((resolve,reject)=>{
            if(visibility){
                if(setFollowing==true && setFollowers==false){
                    setShowFollowing(true)
                    setShowFollowers(false)
                    setTimeout(()=>{
                        resolve()
                    },200)

                }else if(!setFollowing && setFollowers){
                    setShowFollowers(true)
                    setShowFollowing(false)
                    setTimeout(()=>{
                        resolve()
                    },200)

                }
            }
        })

        prom.then(()=>{
            if(user!=null){
                setIsLoading(false)
            }
        })
    },[visibility,setFollowers,setFollowing])
 
 if(!isLoading && visibility && user!=null){
  
    if(showFollowers){
    return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
     
      <main id='content' role='main'  class={`w-full max-w-lg mx-auto ${user.followers!=null && user.followers.length>4?"h-[80%]  overflow-y-scroll overflow-hidden":"h-[50%]"} rounded-md`}>
        <div class=' bg-white  rounded-md shadow-lg bg-white dark:border-gray-700 mb-5 flex flex-col p-5'>
            <div class="flex w-full justify-end">
                <button class="bg-red-600 p-1" onClick={()=>{
                    const prom=new Promise((resolve,reject)=>{
                        dispatch(setEditFFUser(null))
                      
                        setTimeout(()=>{
                            resolve()
                        },100)
                    })

                    prom.then(()=>{
                        dispatch(setFFFollowers(false))
                        dispatch(setFFFollowing(false))
                        dispatch(setFFVisibility(false))

                    })
                }}>
                    <p class="text-white">
                        x
                    </p>
                </button>
            </div>
        {
            showFollowers?
            <p class="text-lg font-bold">
                Followers
            </p>
            :
            <p class="text-lg font-bold">
                Following
            </p>
        }
        {
            showFollowers &&  user.followers!=null &&user.followers.length>0?
            
                <div class="ul">
                    {
                        user.followers.map((m)=>{
                           
                            return(
                            <div>
                                <p>{m.username}</p>
                            </div>
                            )
                        })
                    }
                </div>
           
                :
                <div>
                </div>
        }
        </div>
      </main>
    </div>
</div>
  )
   }else if(showFollowing){
    return(
        <div class='bg-gray-200' data-testId="modal-public">
     
        <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
         
          <main id='content' role='main' class={`w-full max-w-lg mx-auto ${user.following!=null && user.following.length>6?"h-[80%]  overflow-y-scroll overflow-hidden":"h-[50%]"}  rounded-md`}>
            <div class=' bg-white  rounded-md shadow-lg bg-white dark:border-gray-700 mb-5 flex flex-col p-5'>
                <div class="flex w-full justify-end">
                    <button class="bg-red-600 p-1" onClick={()=>{
                        const prom=new Promise((resolve,reject)=>{
                            dispatch(setEditFFUser(null))
                          
                            setTimeout(()=>{
                                resolve()
                            },100)
                        })
    
                        prom.then(()=>{
                            dispatch(setFFFollowers(false))
                            dispatch(setFFFollowing(false))
                            dispatch(setFFVisibility(false))
    
                        })
                    }}>
                        <p class="text-white">
                            x
                        </p>
                    </button>
                </div>
            {
                showFollowers?
                <p class="text-lg font-bold">
                    Followers
                </p>
                :
                <p class="text-lg font-bold">
                    Following
                </p>
            }
            {
                 user.following!=null && user.following.length>0 ?
                
                    <div class="ul">
                        {
                            user.following.map((m)=>{
                               
                                return(
                                <div>
                                    <p>{m.username}</p>
                                </div>
                                )
                            })
                        }
                    </div>
               
                    :
                    <div>
                    </div>
            }
            </div>
          </main>
        </div>
    </div>
    )
   } }else{
        return(<div></div>)
    }
}

const mapStateToProps = (state, props) => {

    var visibility= state.editFollowersAndFollowing.ffVisibility
    var setFollowers=state.editFollowersAndFollowing.setFollowers
    var setFolllowing=state.editFollowersAndFollowing.setFollowing
    const user=state.editFollowersAndFollowing.user

    console.log("visibility"+visibility)
  
    return {
     visibility:visibility,
     setFollowers:setFollowers,
     setFollowing:setFolllowing,
   
     
     user:user
    };
  };
export default connect(mapStateToProps)(ShowFFModal)