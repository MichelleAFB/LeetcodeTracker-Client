import React from 'react'
import { useEffect } from 'react'

function GroupChallengeList({challenges}) {
    useEffect(()=>{
        console.log("GROUPCHALLENGESLIST",challenges)
    },[])
  return (
    <div class="flex w-full p-2">GroupChallengeList
    <div class="flex-col w-full">
        {
            challenges.map((c)=>{
                return(<div>{c.challenge.challengeId}</div>)
            })
        }

    </div>
    </div>
  )
}

export default GroupChallengeList