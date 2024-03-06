import React from 'react'
import { useEffect,useState } from 'react'
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
import {getDocs,collection,setDoc,addDoc, getDoc,doc, updateDoc} from 'firebase/firestore'

import {setUser,setHeaderVisibility} from '../redux/user/editUser-actions'
import AllUsers from '../components/AllUsers'
function Home({problem,visibility,leetCodeVisiblity}) {
  const dispatch=useDispatch()
  console.log(performance.getEntriesByType("resource"))
  const[user,setOurUser]=useState()
  const [newUsername,setUsername]=useState()
  const [isLoading,setIsLoading]=useState(true)
  const[hasUsername,setHasUserName]=useState(true)

  useEffect(()=>{
    if(sessionStorage.getItem("user")!=null){
      if(JSON.parse(sessionStorage.getItem("user").username==null)){
        setHasUserName(false)
      }
      const prom=new Promise(async(resolve,reject)=>{
        setOurUser(JSON.parse(sessionStorage.getItem("user")))
        dispatch(setUser(JSON.parse(sessionStorage.getItem("user"))))
        setTimeout(()=>{
          dispatch(setHeaderVisibility(true))
        },100)
        setTimeout(()=>{
          resolve()
        },300)
      })

      prom.then(()=>{
        setIsLoading(false)
      })
     

    
    }
  },[visibility,leetCodeVisiblity,hasUsername])

  const refer=collection(db,"users")
  if(!isLoading){
  return (
    <div class="max-w-auto flex min-h-screen ">
      <div class="flex-col">
        <div class="flex w-full">
            {
             !Object.keys(user).includes("username") && !hasUsername?
              <div class="flex-col justify-center w-full">
                <p class="text-lg font-bold">Become Discoverable!</p>
                  <div class="flex m-2 ">
                    <label class="font-bold text-md">
                        Username:
                    </label>
                    <input type="text" class="border-2 border-gray-400" onChange={(e)=>{
                        setUsername(e.target.value)
                    }}/>
                    <button class="bg-green-700 rounded-sm p-2" onClick={async()=>{
                      console.log(newUsername,"\n")
                      if(newUsername.length>4){
                   axios.get("http://localhost:3022/username-available/"+user.userId+"/"+newUsername).then(async(response)=>{
                        console.log(response)
                      if(response.data.available){
                      const data=await getDocs(refer)
                      data.docs.map(async(d)=>{
                        console.log(d.data())
                        if((d.data().userId==user.userId) || d.data().email==user.email){
                          const dat=d.data()
                          const foundUser=doc(refer,d._key.path.segments[d._key.path.segments.length-1])
                          
                          try{
                          await updateDoc(foundUser,{
                              "username":newUsername
                          })
                        axios.post("http://localhost:3022/set-username/"+user.userId+"/"+newUsername,{user:user}).then(async(response)=>{
                        console.log(response)
                        if(response.data.success){
                          user.username=newUsername;
                          sessionStorage.setItem("user",JSON.stringify(user))
                       alert("SUCCESS,set username")
                            setHasUserName(true)
                        }
                      })
                        }catch(err){
                          console.log(err)
                        }
                        }
                      })
                    }
                    })
                  }
                    }}>
                      <p class="text-white font-bold">Submit</p>
                    </button>
                  </div>
              </div>:
              <p></p>
            }
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
          }else{
            return(<div></div>)
          }
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