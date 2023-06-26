import React from 'react'
import { useEffect } from 'react'
//redux
import {dispatch,connect} from 'react-redux'
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

function Home({problem,visibility,leetCodeVisiblity}) {

  useEffect(()=>{
    //axios.get("http://localhost:3022/generate-prompt")

  },[visibility,leetCodeVisiblity])
  

  return (
    <div>
      <Header/>
    <div class="flex flex-col p-10">
      {visibility?
        <EditProblemModal2/>:<div></div>}
      
      {
        leetCodeVisiblity?
        <AddLeetcodeProblemModal/>:<div></div>
      }
      <div class="flex w-full">
          <StreakChart/>
      </div>
      <div class="flex justify-between h-screen">
       <ProblemList/>
       <AllProblems/>
      </div>
    
    </div>
    </div>
  )
}
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