import { map } from '@firebase/util';
import {useState,useEffect} from 'react'
//outside
import axios from 'axios';

import { useDispatch,connect } from 'react-redux';
import { setOtherUsersProblem, setOtherUsersProblemVisibility } from '../redux/addOtherUsersProblem/addOtherUsersProblem-reducer';
//firbase
import { db } from '../firebase/firebase'
import {getDocs,collection,setDoc,doc,updateDoc,addDoc} from 'firebase/firestore'
import { addLeetcodeProblemReload } from '../redux/addLeetcodeProblem.js/addLeecodeProblem-reducer';
function AddOtherUsersProblemModal({problemId,visibility,ourProblem,user,otherUser}) {

  const[isLoading,setIsLoading]=useState(true)
  const[problem,setProblem]=useState(ourProblem)
  const[prompt,setPrompt]=useState(ourProblem!=null && ourProblem.prompt!=null? ourProblem.prompt:"")
  const[showPrompt,setShowPrompt]=useState(true)
  const[category,setCategory]=useState(ourProblem!=null && ourProblem.category!=null? ourProblem.category:"")
  const[dataStructure,setDataStructure]=useState(ourProblem!=null && ourProblem.dataStructure!=null?ourProblem.dataStructure:"") 
  const[alreadyExists,setAlreadyExists]=useState()
  const[updateFirebaseId,setUpdateFireBaseId]=useState(false)
  const[link,setLink]=useState()
  const[acRate,setAcRate]=useState()
  const dispatch=useDispatch()

  const problemsListCollectionRef=collection(db,"problems")
  console.log(problemId)
  useEffect(()=>{
    if(visibility){
    console.log("user:",user)
    console.log("other:",otherUser)
    setCategory(ourProblem!=null && ourProblem.category!=null? ourProblem.category:"")
    setDataStructure(ourProblem!=null && ourProblem.dataStructure!=null?ourProblem.dataStructure:"")
    const prom=new Promise((resolve,reject)=>{
        var end = ourProblem.title //.substring(1, title.length);
        end = end.toLowerCase();
        end = end.replace(/\s/g, "-");
        end = end.replace(/{([])}/g, "");
        end = end.replace("---","-");
        end=end.replace("()","")
        end=end.replace("`","")
        end=end.replace("---","-")
        end=end.replace("(","")
        end=end.replace(")","")
        end=end.replace(":","")
        setLink("https://leetcode.com/problems/"+end)
      setTimeout(()=>{
        resolve()
      },1000)

    })

    prom.then(()=>{
        setIsLoading(false)
    })
  }

  },[visibility])
  
  


  if(visibility && !isLoading){ 
    const problemsListCollectionRef=collection(db,"problems")

    console.log(ourProblem)
   
    
  return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
     
      <main id='content' role='main' class='w-full max-w-lg mx-auto h-[80vh] overflow-y-scroll overflow-hidden rounded-md'>
      
        <div class=' bg-white  rounded-md shadow-lg bg-white dark:border-gray-700 mb-5 flex flex-col p-5'>
        <button class="bg-red-500 pl-2 pr-2 pt-1 rounded-md w-1/4 justify-end" onClick={()=>{
          const prom=new Promise((resolve,reject)=>{
            
            setTimeout(()=>{
              resolve()

            },500)
          })
          prom.then(()=>{
            dispatch(setOtherUsersProblem(null))
            dispatch(setOtherUsersProblemVisibility(false))

          })
        }}>
          <p class="text-white">Close</p>
        </button>
          <div class="flex flex-col">
            <p class="text-2xl font-bold justify-items-center text-center">{ourProblem.title}</p>
            </div>

            <div class="flex flex-col m-3 p-3">
              <div class="flex w-full m-3">
              {
                  ourProblem.link!=null?
                  <p class="text-black font-bold"><p class="text-green-400 font-bold ml-2">{ourProblem.link}</p></p>
                  :
                  <p class="text-black font-bold">
                    <span class="text-purple-600">(Suggested):</span>
                    {link}
                  </p>
                }
              </div>
              
              <div class="flex w-full">
                <p class="text-md font-bold">Difficulty:</p>
                {
                  ourProblem.level=="Easy"?
                  <p class="text-green-400 font-bold ml-2">{ourProblem.difficulty}</p>
                  :
                  <p></p>
                }
                {
                  ourProblem.level=="Medium"?
                  <p class="text-orange-400 font-bold ml-2">{ourProblem.difficulty}</p>
                  :
                  <p></p>
                }
                {
                  ourProblem.level=="Hard"?
                  <p class="text-red-500 font-bold ml-2">{ourProblem.difficulty}</p>
                  :
                  <p></p>
                }
                {
                  ourProblem.difficulty=="Easy"?
                  <p class="text-green-400 font-bold ml-2">{ourProblem.difficulty}</p>
                  :
                  <p></p>
                }
                {
                  ourProblem.difficulty=="Medium"?
                  <p class="text-orange-400 font-bold ml-2">{ourProblem.difficulty}</p>
                  :
                  <p></p>
                }
                {
                  ourProblem.difficulty=="Hard"?
                  <p class="text-red-500 font-bold ml-2">{ourProblem.difficulty}</p>
                  :
                  <p></p>
                }
              </div>
              <div class="flex w-full">
                <p class="font-bold">Acceptance Rate:</p>
              {
                  ourProblem.acRate!=null?
                  <p class="text-purple-400 font-bold ml-2">{ourProblem.acRate.toString().substring(0,5)}</p>
                  :
                  <p></p>
                }
              </div>
              {showPrompt?
              <div class="p-3 m-3 border-gray-500 border-2 rounded-md">
                <p class="text-sm whitespace-pre-wrap ">
               {ourProblem.prompt}
                </p>
             </div>:
             <p></p>
             }
             <div class="flex-w-full">
              {
                ourProblem.topicTags!=null && ourProblem.topicTags.length>0?
                <div class="flex w-fuLl">
                  {
                    ourProblem.topicTags.map((t)=>{
                      return(<p class="text-gray-400 font-bold m-2">{t}</p>)
                    })
                  }
                </div>:
                <div>
                </div>
              }
             </div>
            
              <div class="flex flex-col">
                    <select
                  id='category'
                  default={ourProblem.category}
                  placeholder={ourProblem.category}
                  type="text"
                   class=' m-2  w-full text-gray-900 text-sm rounded-md border-l bg-gray-300 p-1'
                         onChange={(e)=>{
                           console.log(e.target.value)
                           setCategory(e.target.value)
                         }} >   
                       <option value ="Find Sub:X Inside">Find Sub:X Inside</option>
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
                  default={ourProblem.dataStructure}
                  placeholder={ourProblem.dataStructure}
                   class=' m-2  w-full text-gray-900 text-sm rounded-md border-l bg-gray-300 p-1'
                   type="text"
                   onChange={(e)=>{
                     console.log(e.target.value)
                     console.log(typeof(e.target.value))
                     setDataStructure(e.target.value)
                   }}  >
                           
                    
                     <option value="ArrayList" >ArrayList</option>
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
              console.log(ourProblem)
              console.log("title:"+ourProblem.title)
              console.log("link:"+ourProblem.link)
              console.log("level:"+ourProblem.difficulty)
              console.log("dataStructure:"+dataStructure)
              console.log("category:"+category)
              console.log(problemId)

              if(ourProblem!=null){
                console.log(problemId)
              const  docRefer=doc(db,"problems",problemId)
             
                
              const setDocument=async(ourProblem)=>{
                console.log(ourProblem)
                const  docRefer= doc(db,"problems",problemId)
                console.log(docRefer)
                //READ DATA
                
                 
                const data=await getDocs(problemsListCollectionRef)
                const curr=new Date()
                const currDate=curr.toString().substring(0,15)
                
              
                 
                   console.log({
                    title:ourProblem.title,
                    dataStructure:dataStructure,
                    category:category,
                    lastPracticed:new Date(),
                    hints:ourProblem.hints!=null?ourProblem.hints:"",
                    no_attempts:0,
                    level:ourProblem.difficulty!=null? ourProblem.difficulty:ourProblem.level!=null?ourProblem.level:"",
                    tags:ourProblem.topicTags!=null?ourProblem.topicTags:[],
                    page:ourProblem.page!=null? ourProblem.page:1,
                    topicTags:ourProblem.topicTags!=null?ourProblem.topicTags:[],
                    acRate:ourProblem.acRate!=null? ourProblem.acRate:0.0,
                    attempts:[{attempt:"N/A",date:currDate}],
                    solution:ourProblem.solution!=null? ourProblem.solution:"",
                    userId:user.userId,
                    createdAt:new Date(),
                    boilerCode:ourProblem.boilerCode!=null? ourProblem.boilerCode:`import java.util.*;
                    public class Main{ 
                    
                        public static void main(String[] args){
                    
                        }
                      }`,
                    
                    link:ourProblem.link!=null?ourProblem.link:link,
                    prompt:ourProblem.prompt,
                    examples:ourProblem.examples!=null? ourProblem.examples:[],
                    addedProblemFromUser:otherUser.userId
                   
                   })
                   
                   const added= await addDoc(collection(db,"problems"), {
                    title:ourProblem.title,
                    dataStructure:dataStructure,
                    category:category,
                    lastPracticed:new Date(),
                    hints:ourProblem.hints!=null?ourProblem.hints:"",
                    no_attempts:0,
                    level:ourProblem.difficulty!=null? ourProblem.difficulty:ourProblem.level!=null?ourProblem.level:"",
                    tags:ourProblem.topicTags!=null?ourProblem.topicTags:[],
                    page:ourProblem.page!=null? ourProblem.page:1,
                    topicTags:ourProblem.topicTags!=null?ourProblem.topicTags:[],
                    acRate:ourProblem.acRate!=null? ourProblem.acRate:0.0,
                    attempts:[{attempt:"N/A",date:currDate}],
                    createdAt:new Date(),
                    solution:ourProblem.solution!=null? ourProblem.solution:"",
                    userId:user.userId,
                    boilerCode:ourProblem.boilerCode!=null? ourProblem.boilerCode:`import java.util.*;
                    public class Main{ 
                    
                        public static void main(String[] args){
                    
                        }
                      }`,
                    link:ourProblem.link!=null?ourProblem.link:link,
                    prompt:ourProblem.prompt,
                    examples:ourProblem.examples!=null? ourProblem.examples:[],
                    addedProblemFromUser:otherUser.userId
                     
                    }).then((response)=>{
                        console.log(response)
                      alert("SUCCESS:ADDED LEETCODE PROBLEM "+ourProblem.id  )
                      dispatch(addLeetcodeProblemReload(true))
                    /*
                      axios.post("https://leetcodetracker.onrender.com/set-firebase-id/"+ourProblem.id,{title:ourProblem.title}).then((response)=>{
                        console.log(response)
                      })
                      */
                   
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
  var visibility= state.addOtherUsersProblem.visibility
  var problem=state.addOtherUsersProblem.problem
  const ourUser=state.addOtherUsersProblem.user
  const other=state.addOtherUsersProblem.otherUser

    if(problem!=null){
  return {
   visibility:visibility,
   ourProblem:problem.problem,
   user:ourUser,
   otherUser:other,
   problemId:problem.id
  };
}
};

export default  connect(mapStateToProps)(AddOtherUsersProblemModal)