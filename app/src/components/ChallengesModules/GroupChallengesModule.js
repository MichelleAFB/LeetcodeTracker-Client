import React from 'react'
import GroupChallenges from '../GroupChallenges'
import { useState} from 'react'
function GroupChallengesModule(groupChallengeView,setGroupChallengeView,setAllGroupChallenges,allGroupChallenges) {
    const[groupChallengeViewModule,setGroupChallengeViewModule]=useState()
    const[allGroupChallengesModule,setAllGroupChallengesModule]=useState()
    console.log(allGroupChallenges)
   const setGroupChallenges=(e)=>{
    setAllGroupChallenges(e)
   }
    return (
    <div class="flex w-full">
        <div class="flex-col">
        <GroupChallenges groupChallengeView={groupChallengeView} setGroupChallengeView={setGroupChallengeView} setAllGroupChallenges={setGroupChallenges} allChallenges={allGroupChallenges}/>
        </div>
    </div>
  )
}

export default GroupChallengesModule