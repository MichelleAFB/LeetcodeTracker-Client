import React from 'react'
import {useDispatch,connect} from 'react-redux'
import { setChallengeRequestModalVisibility,setChallengeRequest, setChallengeRequesDiabled } from '../../redux/groupChallangeRequest/groupChallenge-actions'

function OpenChallengeRequestButton({challenge,disabled}) {
    const dispatch=useDispatch()
  console.log("disabled:"+disabled)
  /*  if(challenge.approved==true || challenge.denied==true){
        return(<div></div>)
    }else{*/
  return (
    <button class="bg-gray-700 rounded-sm p-1" onClick={()=>{
        console.log("CLICK")
        dispatch(setChallengeRequest(challenge))
        dispatch(setChallengeRequesDiabled(disabled))
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