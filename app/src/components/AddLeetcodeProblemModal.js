import { map } from '@firebase/util';
import {useState,useEffect} from 'react'

//outside
import axios from 'axios';

import { useDispatch,connect } from 'react-redux';
import { setLeetcodeProblemVisibility } from '../redux/addLeetcodeProblem.js/addLeecodeProblem-reducer';

//firbase
import { db } from '../firebase/firebase'
import {getDocs,collection,setDoc,doc,updateDoc,addDoc} from 'firebase/firestore'
function AddLeetcodeProblemModal({visibility,ourProblem}) {

  const[isLoading,setIsLoading]=useState(true)
  const[problem,setProblem]=useState()
  const[prompt,setPrompt]=useState()
  const[showPrompt,setShowPrompt]=useState(true)
  const[category,setCategory]=useState("Find Sub:X Inside")
  const[dataStructure,setDataStructure]=useState("ArrayList") 
  const[alreadyExists,setAlreadyExists]=useState()
  const[updateFirebaseId,setUpdateFireBaseId]=useState(false)
  const dispatch=useDispatch()

  const problemsListCollectionRef=collection(db,"problems")
  const getProblemsList=async(p)=>{
    
    //READ DATA
    try{
      const user=JSON.parse(sessionStorage.getItem("user"))
      const userType=JSON.parse(sessionStorage.getItem("userType"))

    const data=await getDocs(problemsListCollectionRef)
      data.docs.map((doc)=>{
    
     
      var docTitle=doc.data().title.toUpperCase()
      docTitle=docTitle.replace(/\s/g, "");
      docTitle=docTitle.replace(/{[()]}/g, "");
      var problemTitle=p.title.toUpperCase()
      problemTitle=problemTitle.replace(/\s/g, "");
      problemTitle=problemTitle.replace(/{[()]}/g, "");
     console.log(docTitle + " "+problemTitle)
     
      if(docTitle==problemTitle){
        console.log(docTitle)
        console.log(problemTitle+"\n\n")
        
        console.log("found" )
        console.log(doc.data())
        setProblem({problem:doc.data(),id:doc.id})
        sessionStorage.setItem("currentProblem",JSON.stringify({problem:doc.data(),id:doc.id}))
        
        return {problem:doc.data(),id:doc.id}
      } 
    })
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    const prom=new Promise((resolve,reject)=>{
      getProblemsList(ourProblem).then(()=>{
        console.log(problem)
        var problemData=JSON.parse(sessionStorage.getItem('currentProblem'))
        if(problemData!=null){
          setPrompt(ourProblem.prompt)
          setDataStructure(problemData.problem.dataStructure)
          setCategory(problemData.problem.category)
        }
        setTimeout(()=>{
          resolve()
        },1000)
      })

    })

    prom.then(()=>{
        setIsLoading(false)
    })

  },[])


  if(visibility && !isLoading){ 
    const problemsListCollectionRef=collection(db,"problems")

    
    var problemData=JSON.parse(sessionStorage.getItem('currentProblem'))
    console.log(problemData)
    console.log(ourProblem)
    /*if(problemData!=null){
    
      setDataStructure(problemData.dataStructure)
      setCategory(problemData.category)
    }
    */
   console.log("prompt:"+prompt)
   console.log("dataStructue:"+dataStructure)
    
  return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50'>
     
      <main id='content' role='main' class='w-full max-w-lg mx-auto h-[80vh] overflow-y-scroll overflow-hidden rounded-md'>
      
        <div class=' bg-white  rounded-md shadow-lg bg-white dark:border-gray-700 mb-5 flex flex-col p-5'>
        <button class="bg-red-500 p-3 rounded-md w-1/4 justify-end" onClick={()=>{
          const prom=new Promise((resolve,reject)=>{
            sessionStorage.removeItem("currentProblem")
            setTimeout(()=>{
              resolve()

            },500)
          })
          prom.then(()=>{
            dispatch(setLeetcodeProblemVisibility(false))

          })
        }}>
          <p class="text-white">Close</p>
        </button>
          <div class="flex flex-col">
            <p class="text-2xl font-bold justify-items-center text-center">{ourProblem.title}</p>
            {
            sessionStorage.getItem("currentProblem")!=null?
            <p class="text-center font-semibold bg-yellow-300">Your already have this problem</p>
            :
            <p></p>
            }
            </div>

            <div class="flex flex-col m-3 p-3">
              {showPrompt?
              <div class="p-3 m-3 border-gray-500 border-2 rounded-md">
                <p class="text-sm whitespace-pre-wrap ">
               {ourProblem.prompt}
                </p>
             </div>:
             <p></p>
             }
            
              <div class="flex flex-col">
                    <select
                  id='category'
                   class=' m-2  w-full text-gray-900 text-sm rounded-md border-l bg-gray-300 p-1'
                         onChange={(e)=>{
                           console.log(e.target.value)
                           setCategory(e.target.value)
                         }} >   
                       <option value ="Find Sub:X Inside" selected>Find Sub:X Inside</option>
                       <option value="Sorting">Sorting</option>
                       <option value="String to Number/Number to String">String to Number/Number to String</option>
                      <option value="Sliding Window">Sliding Window</option>
                      <option value="Recursion">Recursion</option>
                      <option value="KSmallest">KSmallest/KBiggest</option>
                       <option value="Array Processing">Array Processing</option>
                      <option value="Math">Math</option>
                      <option value="Traverse">Traverse</option>
                </select>
                <select
                  id='category'
                   class=' m-2  w-full text-gray-900 text-sm rounded-md border-l bg-gray-300 p-1'
                   onChange={(e)=>{
                     console.log(e.target.value)
                     console.log(typeof(e.target.value))
                     setDataStructure(e.target.value)
                   }}  >
                           
                    
                     <option value="ArrayList" selected>ArrayList</option>
                     <option value ="LinkedList">LinkedList</option>
                     <option value="Array">Array</option>
                     <option value ="Matrix">Matrix</option>
                     <option value ="Hash">Hash</option>
                     <option value ="Stack">Stack</option>
                     <option value ="Matrix">Matrix</option>
                     <option value ="BST">BST</option>
                     <option value ="Graph">Graph</option>
                     <option value="Set">Set</option>
                     <option value ="etc">etc</option>
                     
                  </select>
            <button class="bg-green-700 rounded-md p-3 justify-center" onClick={()=>{
              //console.log("prompt:"+ ourProblem.prompt)
              console.log("title:"+ourProblem.title)
              console.log("link:"+ourProblem.link)
              console.log("level:"+ourProblem.difficulty)
              console.log("dataStructure:"+dataStructure)
              console.log("category:"+category)
              const problemData=JSON.parse(sessionStorage.getItem("currentProblem"))
              console.log(problemData)

              if(problemData!=null){
              const  docRefer=doc(db,"problems",problemData.id)
              const p=JSON.parse(sessionStorage.getItem('currentProblem'))
                console.log(problemData)
                
              const setDocument=async(ourProblem)=>{
                console.log(ourProblem)
                const  docRefer= doc(db,"problems",problemData.id)
                console.log(docRefer)
                //READ DATA
                
                 
                const data=await getDocs(problemsListCollectionRef)
                const curr=new Date()
                const currDate=curr.toString().substring(0,15)
                
                data.docs.map(async(d)=>{
                  if(d.id==problemData.id){
                    console.log("match")
                    console.log(d.data())
                    await setDoc(docRefer, {
                      title:ourProblem.title,
                      dataStructure:dataStructure,
                      category:category,
                      lastPracticed:problemData.problem.lastPracticed,
                      hints:problemData.problem.hints,
                      no_attempts:problemData.problem.no_attempts,
                      level:ourProblem.difficulty,
                      attempts:problemData.problem.attempts,
                      solution:problemData.problem.solution,
                      userId:problemData.problem.userId,
                      boilerCode:problemData.problem.boilerCode,
                      link:ourProblem.link,
                      prompt:prompt,
                      examples:(d.data().examples==null? {0:"attempt",date:currDate}:d.data().examples),
                      userId:problemData.problem.userId,
                     
                    }).then((response)=>{
                      alert("SUCCESS:ADDED LEETCODE PROBLEM "+ourProblem.id + d.id )
                      axios.post("http://localhost:3022/set-firebase-id/"+ourProblem.id,{pid:d.id}).then((response)=>{
                        console.log(response)
                      })
                      console.log(response)
                      console.log("success")
                     // setIsLoading(true)
                    });
                  }
                })
               
              }

              setDocument(ourProblem)
            }    if(problemData==null){
             
              const p=JSON.parse(sessionStorage.getItem('currentProblem'))
                console.log(problemData)
                
              const setDocument=async(ourProblem)=>{
                console.log(ourProblem)
               // const  docRefer= doc(db,"problems",problemData.id)
                //console.log(docRefer)
                //READ DATA
                
                 
               // const data=await getDocs(problemsListCollectionRef)
                const curr=new Date()
                const currDate=curr.toString().substring(0,15)
                const user=JSON.parse(sessionStorage.getItem("user"))
                
                
                  
                    console.log("match")
                    
                    await addDoc(collection(db,"problems"),{
                      title:ourProblem.title,
                      dataStructure:dataStructure,
                      category:category,
                      lastPracticed:currDate,
                      hints:"none",
                      no_attempts:0,
                      level:ourProblem.difficulty,
                      attempts:{attempt:"N/A",date:currDate},
                      solution:"N/A",
                      userId:user.userId,
                      leetcodeId:(ourProblem.problemID!=null? ourProblem.questionId:-1),
                      examples:{0:"N/A",date:currDate},
                      boilerCode:`public class Main{
                        public static void main(String[]args){

                        }
                      }`,
                      link:ourProblem.link,
                      prompt:ourProblem.prompt,
                      examples:{0:"attempt",date:currDate},
                      userId:user.userId,
                     
                    }).then((response)=>{
                      alert("SUCCESS:ADDED LEETCODE PROBLEM " )
                      
                      console.log(response)
                      console.log("success")
                     // setIsLoading(true)
                    });
                  
                
               
              }

              setDocument(ourProblem)
            }
            }}><p class="text-white font-bold">Add</p>
            </button>
               
              </div>
             
             
          </div>
        </div>
      </main>
    </div>
  </div>
  )
  }else{
    return(<div></div>)
  }
}
const mapStateToProps = (state, props) => {
  var visibility= state.leetcodeProblem.visibility
  var problem=state.leetcodeProblem.problem
  console.log("visibility"+visibility)

  return {
   visibility:visibility,
   ourProblem:problem
  };
};

export default  connect(mapStateToProps)(AddLeetcodeProblemModal)