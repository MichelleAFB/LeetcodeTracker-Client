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
import { db } from '../firebase/firebase'
import { getDocs,docs, collection,updateDoc,doc,getDoc } from 'firebase/firestore'
import {setUser,setHeaderVisibility} from '../redux/user/editUser-actions'
import AllUsers from '../components/AllUsers'
function Home({problem,visibility,leetCodeVisiblity}) {
  const dispatch=useDispatch()
  console.log(performance.getEntriesByType("resource"))

  useEffect(()=>{
    if(sessionStorage.getItem("user")!=null){
      dispatch(setUser(JSON.parse(sessionStorage.getItem("user"))))

      setTimeout(()=>{
        dispatch(setHeaderVisibility(true))
      },500)
    }
    //axios.get("https://leetcodetracker.onrender.com/generate-prompt")
    /*axios.post("https://leetcodetracker.onrender.com/remove-duplicates").then((response)=>{
      console.log(response)
    })
    */

  },[visibility,leetCodeVisiblity])

  return (
    <div class="w-full flex min-h-screen ">
      <div class="flex-col">
        <div class="flex w-full">
    
        </div>
        <div class="flex w-full">     
         <div class=" w-1/2 flex-col bg-gray-400 p-5 z-1 ">
        
      <AddProblem/>
        <ProblemList/>
      </div>

      <div class="w-1/2 flex-col overflow-y-scroll h-screen  p-5 sticky overflow-hidden  ">

        <div>
       
          <p class=" mt-5 text-4xl z-10">Add More Problems</p>
            <  AllProblems/>
         
         </div>

  
        </div>
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