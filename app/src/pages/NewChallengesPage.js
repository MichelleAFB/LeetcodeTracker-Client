import React from 'react'
import GroupChallengesModule from '../components/ChallengesModules/GroupChallengesModule'
import {useState} from 'react'

function NewChallengesPage() {
    const[groupChallengesPage,setGroupChallengesPage]=useState(false)
    const[challengesPage,setChallengesPage]=useState(true)

    const[groupChallengeView,setGroupChallengesView]=useState()
    const[allChallenges,setAllGroupChallenges]=useState()
    /********** */
  return (
    <div>
        <button class="bg-green-400 p-3" onClick={()=>{
            setGroupChallengesPage(!groupChallengesPage)
        }}>
            Group
        </button>
        {
            groupChallengesPage?
            <GroupChallengesModule groupChallengeView={groupChallengeView} setGroupChallengesView={setGroupChallengesView} allGroupChallenges={allChallenges} setAllGroupChallenges={setAllGroupChallenges}/>
            :
            <div></div>
        }
    </div>
  )
}

export default NewChallengesPage