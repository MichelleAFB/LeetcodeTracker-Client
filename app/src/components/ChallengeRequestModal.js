import React from 'react'
import {connect,useDispatch} from "react-redux"
import {useState,useEffect} from 'react'
import {setGroupC}
function ChallengeRequestModal({challenge,visibility}) {

  const[isLoading,setIsLoading]=useState(true)
  const dispatch=useDispatch()
  useEffect(()=>{
    console.log(challenge) 
    const prom=new Promise((resolve,reject)=>{
      resolve()
    })

    prom.then(()=>{
      setIsLoading(false)
    })

  },[])

  if(!isLoading){
  return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
     
      <main id='content' role='main' class='w-full max-w-lg mx-auto h-[80vh] overflow-y-scroll overflow-hidden rounded-md'>
      
        <div class=' bg-white  rounded-md shadow-lg bg-white dark:border-gray-700 mb-5 flex flex-col p-5'>
        <div class="flex w-full justify-end">
          <button class="bg-red-500 rounded-sm p-1" onClick={()=>{
            const prom=new Promise((resolve,reject)=>{

            })

            prom.then(()=>{

            })
          }}>
            <p class="text-white">x</p>
          </button>
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
 

  return {
   visibility:visibility,
  challenge:challenge
  };
};
export default connect(mapStateToProps)(ChallengeRequestModal)