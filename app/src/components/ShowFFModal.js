import React from 'react'
import { connect,useDispatch } from 'react-redux';
import { useEffect,useState } from 'react';
function ShowFFModal({setFollower,setFollowing,user,visibility}) {
    const[isLoading,setIsLoading]=useState(true)
    
    useEffect(()=>{

    },[visibility])
 
 if(!isLoading){
    return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
     
      <main id='content' role='main' class='w-full max-w-lg mx-auto h-[80vh] overflow-y-scroll overflow-hidden rounded-md'>
        Modal
        <div class=' bg-white  rounded-md shadow-lg bg-white dark:border-gray-700 mb-5 flex flex-col p-5'>
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
    var visibility= state.editFollowersAndFollower.ffVisibility
    var setFollowers=state.editFollowersAndFollower.setFollowers
    var setFolllowing=state.editFollowersAndFollower.setFollowing
    const user=state.eitFollowersAndFollower.user

    console.log("visibility"+visibility)
  
    return {
     visibility:visibility,
     setFollowers:setFollowers,
     setFollowing:setFolllowing,
     
     user:user
    };
  };
export default connect(mapStateToProps)(ShowFFModal)