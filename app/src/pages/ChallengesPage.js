import React from 'react'
import Challenges from '../components/Challenges'
import { useEffect } from 'react'
import {useDispatch} from "react-redux"
import { setHeaderVisibility } from '../redux/user/editUser-actions'
function ChallengesPage() {

  const dispatch=useDispatch()
  useEffect(()=>{
    
    dispatch(setHeaderVisibility(true))
  },[])
  return (
    <div class="flex w-full h-screen justify-center mt-5">
                  <Challenges/>

    </div>
  )
}

export default ChallengesPage