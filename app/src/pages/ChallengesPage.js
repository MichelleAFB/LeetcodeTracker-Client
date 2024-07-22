import React from 'react'
import Challenges from '../components/Challenges'
import { useEffect } from 'react'
import {useDispatch} from "react-redux"
import { setHeaderVisibility } from '../redux/user/editUser-actions'
import Board from '../components/Board'
import { generateQuoteMap } from "../components/mockData";
import Drag from '../components/Drag'
function ChallengesPage() {

  const dispatch=useDispatch()
  useEffect(()=>{
    
    dispatch(setHeaderVisibility(true))
  },[])
  const data = {
    medium: generateQuoteMap(100),
    large: generateQuoteMap(500)
  };
  return (
    <div class="flex w-full h-screen justify-center mt-5">
       <Drag/>
                  <Challenges/>

    </div>
  )
}

export default ChallengesPage