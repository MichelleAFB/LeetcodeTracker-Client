import React from 'react'
import {useDispatch,connect} from 'react-redux'
import { setChallengeRequestModalVisibility,setChallengeRequest } from '../../redux/groupChallangeRequest/groupChallenge-actions'

function OpenChallengeRequestButton({challenge}) {
    const dispatch=useDispatch()

  /*  if(challenge.approved==true || challenge.denied==true){
        return(<div></div>)
    }else{*/
  return (
    <button class="bg-gray-700 rounded-sm p-1" onClick={()=>{
        console.log("CLICK")
        dispatch(setChallengeRequest(challenge))
        setTimeout(()=>{
            dispatch(setChallengeRequestModalVisibility(true))
        },100)
              }}>
                <p class="text-white">Open Request</p>
     </button>
  )
           // }
}

export default OpenChallengeRequestButton