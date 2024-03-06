import React from 'react'
import { connect,useDispatch } from 'react-redux';
import { useEffect,useState } from 'react';
import { setEditFFUser, setFFFollowers,setFFFollowing, setFFVisibility } from '../redux/editFollowersAndFollowing/editFollowersAndFollowing-actions';
function ShowFFModal({setFollowers,setFollowing,user,visibility}) {
    const[isLoading,setIsLoading]=useState(true)
    const dispatch=useDispatch()
    
    
    useEffect(()=>{

            if(visibility &&(setFollowers!=false && setFollowing!=false)){
                setIsLoading(false)
            }
    },[visibility,user])
 
 if(!isLoading && visibility && user!=null){
    console.log(user.followers)
    if(setFollowers){
    return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
     
      <main id='content' role='main' class='w-full max-w-lg mx-auto h-[80%] overflow-y-scroll overflow-hidden rounded-md'>
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
            setFollowers?
            <p class="text-lg font-bold">
                Followers
            </p>
            :
            <p class="text-lg font-bold">
                Following
            </p>
        }
        {
            setFollowers && user.followers.length>0?
            
                <div class="ul">
                    {
                        user.followers.map((m)=>{
                            console.log(m)
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
                {user.following!=null && user.following.length>0?
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
            <div></div>
                }
         </div>
        }
        </div>
      </main>
    </div>
</div>
  )
   }else{
    return(
        <div class='bg-gray-200' data-testId="modal-public">
     
        <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
         
          <main id='content' role='main' class='w-full max-w-lg mx-auto h-[80%] overflow-y-scroll overflow-hidden rounded-md'>
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
                setFollowers?
                <p class="text-lg font-bold">
                    Followers
                </p>
                :
                <p class="text-lg font-bold">
                    Following
                </p>
            }
            {
                setFollowing && user.following.length>0 ?
                
                    <div class="ul">
                        {
                            user.following.map((m)=>{
                                console.log(m)
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
                    {user.followers!=null && user.followers.length>0?
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
                <div></div>
                    }
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
    console.log(state.editFollowersAndFollower)
    var visibility= state.editFollowersAndFollowing.ffVisibility
    var setFollowers=state.editFollowersAndFollowing.setFFFollowers
    var setFolllowing=state.editFollowersAndFollowing.setFFFollowing
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