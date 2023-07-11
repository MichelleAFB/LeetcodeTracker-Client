import React from 'react'
import { useEffect } from 'react'
//redux
import {useDispatch,connect} from 'react-redux'
//components
import AddProblem from '../components/AddProblem'
import ProblemList from '../components/ProblemList'
import EditProblemModal from '../components/EditProblemModal'
import EditProblemModal2 from '../components/EditProblemModal2'
import AllProblems from '../components/AllProblems'
import AddLeetcodeProblemModal from '../components/AddLeetcodeProblemModal'
import axios from 'axios'
import Header from '../components/layout/Header'
import StreakChart from '../components/StreakChart'
import { setProblem,setEditProblemVisibility } from '../redux/editProblem/editProblem-actions'

function Home({problem,visibility,leetCodeVisiblity}) {

  useEffect(()=>{
    //axios.get("http://localhost:3022/generate-prompt")

  },[visibility,leetCodeVisiblity])
  const dispatch=useDispatch()

  return (
    <div class="w-full flex min-h-screen ">
      <div class=" w-1/2 sticky flex-col bg-gray-400 p-5 ">
      <AddProblem/>
        <ProblemList/>
      </div>
      <div class="w-1/2 overflow-y-scroll h-screen  sticky overflow-hidden p-3 ">

      
        <StreakChart/>
        <p class="ml-4 text-4xl">Add More Problems</p>
        <AllProblems/>

      </div>
   
    </div>
  )
}
/*
    <div class="p-8 md:w-full flex flex-col min-h-screen ">
    <div class="flex flex-col p-15 justify-center">
      {visibility?
        <EditProblemModal2/>:<div></div>}
      
      {
        leetCodeVisiblity?
        <AddLeetcodeProblemModal/>:<div></div>
      }
      <div class="flex  justify-center ">
          <StreakChart/>
      </div>
      <div class="flex w-full justify-center  p-5 ">
       <ProblemList/>
       <AllProblems/>
      </div>
    
    </div>
    </div>
*/
const mapStateToProps = (state, props) => {
  var visibility= state.editProblem.visibility;
  var problem=state.editProblem.problem
  console.log("visibility"+visibility)
  var leetCodeVisiblity=state.leetcodeProblem.visibility

  return {
   visibility:visibility,
   problem:problem,
   leetCodeVisiblity:leetCodeVisiblity
  };
};

export default connect(mapStateToProps)(Home)