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
      <div class=" w-1/2 flex-col bg-gray-400 p-5 z-1 ">
        <button class="bg-purple-400 p-3 flex" onClick={async()=>{
          //const useRef=docs(db,"users")
          const useRef=collection(db,"problems")
          const data= await getDocs(useRef)
          const arr=[]
          const dates=[]
          function checkAlready(date){
            var valid=true
            if(dates.includes(date)){

              return false
            }else{
              dates.push(date)

              return true
            }
          }
          var validProblem
          data.docs.map(async(d)=>{
            
            console.log(d.data().title)
            var attempts=d.data().attempts
            console.log(attempts)
            console.log(Object.keys(attempts).length)
            if(Object.keys(attempts).length==0){
              var problemRef=doc(db,"problems",d.id)
                
               var problem=await getDoc(problemRef)
               // console.log(problem.data())
               console.log("CHANGE EMPTY")
               var today=new Date()
                const update=await updateDoc(problemRef,{
                  attempts:[{date:today.toString().substring(0,15),attempt:'N \ A'}],
                  
              }) 

            }
            console.log("\n\n")
            if(attempts!=null){
            attempts.map((a)=>{
              if(typeof a.attempt==='object' && a.attempt!=null){
                validProblem=d
                console.log(d.data().title)

                console.log("BAD",a.attempt)
                const at=a.attempt
                console.log("level 1",at)

                Object.keys(at).map((m)=>{
                  const att=at[m].attempt
                  if(typeof att==='object'){
                    Object.keys(att).map((aa)=>{
                      console.log("level 2",att[aa])
                      const attt=att[aa].attempt
                      if(typeof attt ==='object'){
                        console.log("level 3",attt)
                        Object.keys(attt).map((aaa)=>{
                          const atttt=  attt[aaa].attempt
                          if(typeof atttt==='object'){
                            console.log("level 4",atttt)
                          }
                        })
                      }else{
                        if(attt[aa].date.length>3 && attt[aa].attempt.length>3){
                          //console.log("\n\n\n CHECK VALID level 2:")
                         // console.log(attt[aa].date,attt[aa].attempt)
                         console.log(checkAlready(attt[aa].date))
                          if(checkAlready(attt[aa].date)){
                          arr.push({date:attt[aa].date,attempt:attt[aa].attempt})
                          }
                          console.log("\n\n")
                        }else{
                          console.log("boot:",att[aa])
                        }
                      }
                    })
                  }else{
                    if(att[m].date.length>3 && att[m].attempt.length>3){
                     // console.log("\n\n\n CHECK VALID: level 1")
                     // console.log(att[m].date,att[m].attempt)
                      if(checkAlready(att[m].date)){
                      arr.push({date:att[m].date,attempt:att[m].attempt})
                      }
                     // console.log("\n\n")
                    }else{
                      console.log("boot:",att[m])
                    }

                  }
                })
              }else{
                if(a.date.length>3 && a.attempt.length>3){
                 // console.log("\n\n\n CHECK VALID")
                // console.log(a.date,a.attempt)
                 if(checkAlready(a.date)){
                 arr.push({date:a.date,attempt:a.attempt})
                 }
                console.log("\n\n")
                }
              }
              if(a.attempt==null){
                console.log("NULLL",a.attempt)
              }
            })

           
          }
          if(Object.keys(attempts).length<1){
            console.log("NULLLL",attempts)
          }
            
          /*  if(attempts[0]=='attempt'){
              console.log("FARSE")
              arr.push({date:attempts[1],attempt:"N/A"})
              console.log(arr)

              var problemRef=doc(db,"problems",d.id)
                  var problem=await getDoc(problemRef)
                 // console.log(problem.data())
                  const update=await updateDoc(problemRef,{
                    attempts:arr,
                    
                }) 
            }
            */
            if(Array.isArray(attempts)){
              //console.log(attempts)
             /* if(attempts.length==0){
                console.log(attempts)
                var problemRef=doc(db,"problems",d.id)
                
               var problem=await getDoc(problemRef)
               // console.log(problem.data())
               var today=new Date()
                const update=await updateDoc(problemRef,{
                  attempts:[{date:today.toString().substring(0,15),attempt:'N \ A'}],
                  
              }) 
              }
              */
              
            }else{
             // console.log(attempts)
            }
            //console.log(attempts)
            //console.log("\n\n")
           // console.log(Object.keys(d.data().attempts))
            if(Object.keys(attempts).includes("attempts")){
            /* // console.log("has attempts")
              attempts=attempts.attempts
              Object.keys(attempts).map((a)=>{
                arr.push(attempts[a])
                
              })
              setTimeout(async()=>{
                  //console.log(arr)
                  //console.log(Object.keys(attempts).length,"\n\n")
                  var problemRef=doc(db,"problems",d.id)
                  var problem=await getDoc(problemRef)
                 // console.log(problem.data())
                  const update=await updateDoc(problemRef,{
                    attempts:arr,
                    
                }) 
                
              },500)
              */
              
            }else if(Object.keys(attempts).includes('attempt') && Object.keys(attempts).includes('date')){
              /*console.log("has attemtps and date good")
              console.log(attempts)
              Object.keys(attempts).map((a)=>{
                console.log(a)
                arr.push({attempt:attempts.attempt,date:attempts.date})
                
              })
              setTimeout(async()=>{
                console.log(arr)
                //console.log(Object.keys(attempts).length,"\n\n")
                var problemRef=doc(db,"problems",d.id)
                
               var problem=await getDoc(problemRef)
               // console.log(problem.data())
                const update=await updateDoc(problemRef,{
                  attempts:arr,
                  
              }) 
              
              
            },500)
            */


            }else {
              /*
              Object.keys(attempts).map((a)=>{
                console.log(attempts[a])
                arr.push(attempts[a])
              })
              console.log("\n\n")
              setTimeout(async()=>{
                console.log(d.data().title)

                console.log(arr)
                var problemRef=doc(db,"problems",d.id)

                var problem=await getDoc(problemRef)
                // console.log(problem.data())
                 const update=await updateDoc(problemRef,{
                 //  attempts:arr,
                   
               }) 
              },400)
            //  console.log("DIFFERENT",attempts)
            */
            
            }
            
          })
          if(arr.length>0){
            setTimeout(async()=>{
              console.log(Object.keys(validProblem))
              console.log(validProblem.data())
              console.log("dates:",dates)
              console.log("ARR",arr)
              /*
              var problemRef=doc(db,"problems",validProblem.id)

                var problem=await getDoc(problemRef)
                console.log(validProblem.id,problem)
                // console.log(problem.data())
                const update=await updateDoc(problemRef,{
                 attempts:arr,
                   
               })
               */ 
               
            },600)

          }
         
        }}>
          attempts
        </button>
        <button class="bg-cyan-500 rounded-sm p-3" onClick={async()=>{
          const usersRef=collection(db,"users")
          const users=await getDocs(usersRef)
          users.docs.map((o)=>{
            console.log(o.data())
            axios.post("https://leetcodetracker.onrender.com/user/create-user",{user:o.data()}).then(async(response)=>{
              console.log(response)
              const userRef=doc(db,"users",o.data().userId)
              const newUser=await getDoc(userRef).data()
              console.log(newUser)
              
            })
          })
        }}>
          <p class="text-white">Users</p>
        </button>
        <button class="bg-cyan-500 p-2 rounded-md" onClick={()=>{
          axios.get("https://leetcodetracker.onrender.com/titles/4").then((response)=>{
            console.log(response)
          })
        }}>
          <p>pages</p>
        </button>
      <AddProblem/>
        <ProblemList/>
      </div>

      <div class="w-1/2 flex-col overflow-y-scroll h-screen  p-5 sticky overflow-hidden  ">

        <div>
       
         <div class="mt-10 border-box block">
          <p class="ml-4 mt-5 text-4xl z-10">Add More Problems</p>
            <  AllProblems/>
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