import { map } from '@firebase/util';
import {useState,useEffect} from 'react'
//outside
import axios from 'axios';

import { useDispatch,connect } from 'react-redux';
import { addLeetcodeProblemReload, setLeetcodeProblem, setLeetcodeProblemVisibility } from '../redux/addLeetcodeProblem.js/addLeecodeProblem-reducer';

//firbase
import { db } from '../firebase/firebase'
import {getDocs,collection,setDoc,doc,updateDoc,addDoc, onSnapshot, getDoc} from 'firebase/firestore'
import AddQuestionTags from './smallerComponents/Modals/AddQuestionTags';
function AddLeetcodeProblemModal({visibility,ourProblem}) {

  const[isLoading,setIsLoading]=useState(true)
  const[problem,setProblem]=useState()
  const[prompt,setPrompt]=useState()
 
  const[showPrompt,setShowPrompt]=useState(true)
  const[category,setCategory]=useState("Find Sub:X Inside")
  const[dataStructure,setDataStructure]=useState("ArrayList") 
  const[alreadyExists,setAlreadyExists]=useState()
  const[updateFirebaseId,setUpdateFireBaseId]=useState(false)
  const[acRate,setAcRate]=useState()
  const[testCases,setTestCases]=useState()
  const[tags,setTags]=useState()
  const dispatch=useDispatch()
  const[ourTags,setOurTags]=useState()

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
   
      if(docTitle==problemTitle && doc.data().userId==user.userId){
        
        
       
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
    
      getProblemsList(ourProblem).then(async()=>{
        axios.get("http://localhost:3022/allTags").then(async(response)=>{     
             var problemData=JSON.parse(sessionStorage.getItem('currentProblem'))
        if(problemData!=null ){
          var topictags=response.data.tags
        
          const user=JSON.parse(sessionStorage.getItem("user"))
          const userRef= doc(db,"users",user.userId)
         
        
          const userData= (await getDoc(userRef)).data()
          if(userData.myTopicTags!=null){
            console.log("MINE")
            userData.myTopicTags.map((t)=>{
              topictags.push(t)
            })
            
            setTags(topictags)
          }else{
            setTags(topictags)
          }
         
           
         
          setPrompt(ourProblem.prompt)
          setDataStructure(problemData.problem.dataStructure)
          setCategory(problemData.problem.category)
          setAcRate(problemData.problem.acRate!=null? problemData.problem.acRate:0)
          setTestCases(problemData.problem.testCases!=null?problemData.problem.testCases:ourProblem.testCases)
          console.log("ourPrboem:",ourProblem," problemdata:",problemData)
          setOurTags(ourProblem.tags!=null && ourProblem.tags.length>0?ourProblem.tags:problemData.problems.tags)
          if(ourProblem.tags==null || ourProblem.tags.length==0){
            //setOurTags()
          }
        }else{
          setOurTags(ourProblem.tags!=null? ourProblem.tags:[])

          var topictags=response.data.tags
          const user=JSON.parse(sessionStorage.getItem("user"))
          const userRef= doc(db,"users",user.userId)
         
         
          const userData= (await getDoc(userRef)).data()
          if(userData.myTopicTags!=null){
            console.log("MINE")
            userData.myTopicTags.map((t)=>{
              topictags.push(t)
            })
            setTags(topictags)
          }else{
            setTags(topictags)
          }
         
        
        }
        setTimeout(()=>{
          resolve()
        },1000)
      })
      })

    })

    prom.then(()=>{
        setIsLoading(false)
    })

  },[visibility])
  const p=JSON.parse(sessionStorage.getItem("currentProblem"))
  
function updateTopicTags(updatedTags){
  setOurTags(updatedTags)

}


  if(visibility && !isLoading){ 
    const problemsListCollectionRef=collection(db,"problems")

    console.log(ourTags)
    var problemData=JSON.parse(sessionStorage.getItem('currentProblem'))

    /*if(problemData!=null){
    
      setDataStructure(problemData.dataStructure)
      setCategory(problemData.category)
    }
    */
   console.log(problemData,"ourproblem:",ourProblem)
  
    if(ourProblem!=null){
  return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
     
      <main id='content' role='main' class='w-full max-w-lg mx-auto h-[80vh] overflow-y-scroll overflow-hidden rounded-md'>
      
        <div class=' bg-white  rounded-md shadow-lg bg-white dark:border-gray-700 mb-5 flex flex-col p-5'>
        <button class="bg-red-500 pl-2 pr-2 pt-1 rounded-md w-1/4 justify-end" onClick={()=>{
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
              <div class="flex w-full m-3">
              {
                  ourProblem.link!=null?
                  <a href={ourProblem.link} target="_blank"  class="text-black font-bold"><p class="text-green-400 font-bold ml-2">{ourProblem.link}</p></a>
                  :
                  <p></p>
                }
              </div>
              
              <div class="flex w-full">
                <p class="text-md font-bold">Difficulty:</p>
              
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
            
           
            
              <div class="flex flex-col">
              <div class="flex-w-full">
              {tags.length>0?
                <div>
                  <AddQuestionTags allTags={tags} updateTopicTags={updateTopicTags} defaultTags={ourTags}/>
                </div>:
                <div></div>
              }
             </div>
                
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
                  {
                    ourProblem.testCases!=null?
                    <div>
                    </div>:
                    <div>
                    </div>
                  }
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
                    console.log("ourProblem",ourProblem)
                      console.log("problemData",problemData)
                    console.log(d.data())
                    console.log({
                      title:problemData.problem.title,
                      dataStructure:dataStructure,
                      category:category,
                      lastPracticed:problemData.problem.lastPracticed,
                      hints:problemData.problem.hints,
                      no_attempts:problemData.problem.no_attempts,
                      level:problemData.problem.difficulty,
                      tags:ourTags!=null && ourTags.length>0?ourTags:[],
                      createdAt:problemData.createdAt!=null? problemData.problem.createdAt:new Date(),
                      titleSlug:problemData.problem.titleSlug!=null? problemData.problem.titleSlug:null,
                      page:ourProblem.page!=null? ourProblem.page:1,
                      topicTags:ourTags!=null && ourTags.length>0?ourTags:[],
                      acRate:problemData.problem.acRate,
                      attempts:problemData.problem.attempts,
                      solution:problemData.problem.solution,
                      userId:problemData.problem.userId,
                      boilerCode:problemData.problem.boilerCode,
                      link:problemData.problem.link,
                      prompt:problemData.problem.prompt,
                     // examples:(d.data().examples==null? {0:"attempt",date:currDate}:d.data().examples),
                      userId:problemData.problem.userId
                     
                    })
                       await setDoc(docRefer, {
                      title:problemData.problem.title,
                      dataStructure:dataStructure,
                      category:category,
                      lastPracticed:problemData.problem.lastPracticed,
                      hints:problemData.problem.hints,
                      no_attempts:problemData.problem.no_attempts,
                      level:problemData.problem.difficulty,
                      tags:ourTags!=null && ourTags.length>0?ourTags:[],
                      createdAt:problemData.createdAt!=null? problemData.problem.createdAt:new Date(),
                      titleSlug:problemData.problem.titleSlug!=null? problemData.problem.titleSlug:null,
                      page:ourProblem.page!=null? ourProblem.page:1,
                      topicTags:ourTags!=null && ourTags.length>0?ourTags:[],
                      acRate:problemData.problem.acRate,
                      attempts:problemData.problem.attempts,
                      solution:problemData.problem.solution,
                      userId:problemData.problem.userId,
                      boilerCode:problemData.problem.boilerCode,
                      link:problemData.problem.link,
                      prompt:problemData.problem.prompt,
                      examples:(d.data().examples==null? {0:"attempt",date:currDate}:d.data().examples),
                      userId:problemData.problem.userId
                     
                    }).then((response)=>{
                      console.log(response)
                      alert("SUCCESS:ADDED LEETCODE PROBLEM "+ourProblem.id + d.id )
                    
                      axios.post("https://leetcodetracker.onrender.com/set-firebase-id/"+problemData.id,{title:ourProblem.title}).then((response)=>{
                        console.log(response)
                      })
                    
                      console.log(response)
                      console.log("success")
                      dispatch(setLeetcodeProblem(null))
                      setTimeout(()=>{
                        dispatch(addLeetcodeProblemReload())
                        dispatch(setLeetcodeProblemVisibility(false))
                    },100)
                     // setIsLoading(true)
                    }).catch(async(e)=>{
                      console.log("ourProblem",ourProblem)
                      console.log("problemData",problemData)
                      var user=JSON.parse(sessionStorage.getItem("user"))
                      await addDoc(collection(db,"problems"),{
                     
                        title:problemData.problem.title,
                        dataStructure:dataStructure,
                        category:category,
                        lastPracticed:new Date(),
                        hints:"none",
                        no_attempts:0,
                        tags:ourTags!=null && ourTags.length>0?ourTags:[],
                        topicTags:ourTags!=null && ourTags.length>0?ourTags:[],
                        acRate:problemData.problem.acRate,//ourProblem.acRate!=null ? ourProblem.acRate:0.0,
                        level:problemData.problem.difficulty!=null?problemData.problem.difficulty:problemData.problem.level!=null?problemData.problem.level:"Medium",
                        page:ourProblem.page!=null? ourProblem.page:1,
                        titleSlug:problemData.problem.titleSlug!=null?problemData.problem.titleSlug:null,
                        attempts:[{attempt:"N/A",date:new Date().toString().substring(0,15)}],
                        solution:"N/A",
                        createdAt:new Date(),
                        userId:user.userId,
                        leetcodeId:(ourProblem.problemID!=null? ourProblem.questionId:-1),
                        examples:{0:"N/A",date:currDate},
                        boilerCode:`import java.util.*;
                        public class Main{ 
                        
                            public static void main(String[] args){
                        
                            }
                          }`,
                        link:problemData.problem.link,
                        prompt:problemData.problem.prompt,
                        examples:{0:"attempt",date:currDate},
                        userId:user.userId,
                       
                      }).then((response)=>{
                        alert("SUCCESS:ADDED LEETCODE PROBLEM " )
                        dispatch(setLeetcodeProblem(null))
                        setTimeout(()=>{
                          dispatch(addLeetcodeProblemReload())
                          dispatch(setLeetcodeProblemVisibility(false))
                      },100)
                       
  
                    
                        
                        
                        console.log(response)
                        console.log("success")
                       // setIsLoading(true)
                      }).catch((e)=>{
                        console.log(e)
                      });
                      
                    });
                    /*
                    await setDoc(docRefer, {
                      title:problemData.problem.title,
                      dataStructure:dataStructure,
                      category:category,
                      lastPracticed:problemData.problem.lastPracticed,
                      hints:problemData.problem.hints,
                      no_attempts:problemData.problem.no_attempts,
                      level:problemData.problem.difficulty,
                      tags:ourTags!=null && ourTags.length>0?ourTags:[],
                      createdAt:problemData.createdAt!=null? problemData.problem.createdAt:new Date(),
                      titleSlug:problemData.problem.titleSlug!=null? problemData.problem.titleSlug:null,
                      page:ourProblem.page!=null? ourProblem.page:1,
                      topicTags:ourTags!=null && ourTags.length>0?ourTags:[],
                      acRate:problemData.problem.acRate,
                      attempts:problemData.problem.attempts,
                      solution:problemData.problem.solution,
                      userId:problemData.problem.userId,
                      boilerCode:problemData.problem.boilerCode,
                      link:problemData.problem.link,
                      prompt:problemData.problem.prompt,
                      examples:(d.data().examples==null? {0:"attempt",date:currDate}:d.data().examples),
                      userId:problemData.problem.userId
                     
                    }).then((response)=>{
                      console.log(response)
                      alert("SUCCESS:ADDED LEETCODE PROBLEM "+ourProblem.id + d.id )
                    
                      axios.post("https://leetcodetracker.onrender.com/set-firebase-id/"+problemData.id,{title:ourProblem.title}).then((response)=>{
                        console.log(response)
                      })
                    
                      console.log(response)
                      console.log("success")
                      dispatch(setLeetcodeProblem(null))
                      setTimeout(()=>{
                        dispatch(addLeetcodeProblemReload())
                        dispatch(setLeetcodeProblemVisibility(false))
                    },100)
                     // setIsLoading(true)
                    }).catch(async(e)=>{
                      console.log("ourProblem",ourProblem)
                      console.log("problemData",problemData)
                      var user=JSON.parse(sessionStorage.getItem("user"))
                      await addDoc(collection(db,"problems"),{
                     
                        title:problemData.problem.title,
                        dataStructure:dataStructure,
                        category:category,
                        lastPracticed:new Date(),
                        hints:"none",
                        no_attempts:0,
                        tags:ourTags!=null && ourTags.length>0?ourTags:[],
                        topicTags:ourTags!=null && ourTags.length>0?ourTags:[],
                        acRate:problemData.problem.acRate,//ourProblem.acRate!=null ? ourProblem.acRate:0.0,
                        level:problemData.problem.difficulty!=null?problemData.problem.difficulty:problemData.problem.level!=null?problemData.problem.level:"Medium",
                        page:ourProblem.page!=null? ourProblem.page:1,
                        titleSlug:problemData.problem.titleSlug!=null?problemData.problem.titleSlug:null,
                        attempts:[{attempt:"N/A",date:new Date().toString().substring(0,15)}],
                        solution:"N/A",
                        createdAt:new Date(),
                        userId:user.userId,
                        leetcodeId:(ourProblem.problemID!=null? ourProblem.questionId:-1),
                        examples:{0:"N/A",date:currDate},
                        boilerCode:`import java.util.*;
                        public class Main{ 
                        
                            public static void main(String[] args){
                        
                            }
                          }`,
                        link:problemData.problem.link,
                        prompt:problemData.problem.prompt,
                        examples:{0:"attempt",date:currDate},
                        userId:user.userId,
                       
                      }).then((response)=>{
                        alert("SUCCESS:ADDED LEETCODE PROBLEM " )
                        dispatch(setLeetcodeProblem(null))
                        setTimeout(()=>{
                          dispatch(addLeetcodeProblemReload())
                          dispatch(setLeetcodeProblemVisibility(false))
                      },100)
                       
  
                    
                        
                        
                        console.log(response)
                        console.log("success")
                       // setIsLoading(true)
                      }).catch((e)=>{
                        console.log(e)
                      });
                      
                    });
                    */
                  }
                })
               
              }

              setDocument(ourProblem)
            }   else if(problemData==null){
             
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
                    console.log({
                     
                      title:ourProblem.title,
                      dataStructure:dataStructure,
                      category:category,
                      lastPracticed:currDate,
                      hints:"none",
                      no_attempts:0,
                      tags:ourTags!=null && ourTags.length>0?ourTags:[],
                      topicTags:ourTags!=null && ourTags.length>0?ourTags:[],
                      acRate:ourProblem.acRate!=null ? ourProblem.acRate:0.0,
                      level:ourProblem.difficulty,
                      page:ourProblem.page!=null? ourProblem.page:1,
                      titleSlug:ourProblem.titleSlug!=null?ourProblem.titleSlug:null,
                      attempts:[{attempt:"N/A",date:new Date()}],
                      solution:"N/A",
                      createdAt:new Date(),
                      userId:user.userId,
                      leetcodeId:(ourProblem.problemID!=null? ourProblem.questionId:-1),
                      examples:{0:"N/A",date:currDate},
                      boilerCode:`import java.util.*;
                      public class Main{ 
                      
                          public static void main(String[] args){
                      
                          }
                        }`,
                      link:ourProblem.link,
                      prompt:ourProblem.prompt,
                      examples:{0:"attempt",date:currDate},
                      userId:user.userId,
                     
                    })
                    
                    await addDoc(collection(db,"problems"),{
                     
                      title:ourProblem.title,
                      dataStructure:dataStructure,
                      category:category,
                      lastPracticed:currDate,
                      hints:"none",
                      no_attempts:0,
                      tags:ourTags!=null && ourTags.length>0?ourTags:[],
                      topicTags:ourTags!=null && ourTags.length>0?ourTags:[],
                      acRate:ourProblem.acRate!=null ? ourProblem.acRate:0.0,
                      level:ourProblem.difficulty,
                      page:ourProblem.page!=null? ourProblem.page:1,
                      titleSlug:ourProblem.titleSlug!=null?ourProblem.titleSlug:null,
                      attempts:[{attempt:"N/A",date:new Date()}],
                      solution:"N/A",
                      createdAt:new Date(),
                      userId:user.userId,
                      leetcodeId:(ourProblem.problemID!=null? ourProblem.questionId:-1),
                      examples:{0:"N/A",date:currDate},
                      boilerCode:`import java.util.*;
                      public class Main{ 
                      
                          public static void main(String[] args){
                      
                          }
                        }`,
                      link:ourProblem.link,
                      prompt:ourProblem.prompt,
                      examples:{0:"attempt",date:currDate},
                      userId:user.userId,
                    }).then((response)=>{
                      alert("SUCCESS:ADDED LEETCODE PROBLEM " )
                      dispatch(setLeetcodeProblem(null))
                      setTimeout(()=>{
                        dispatch(addLeetcodeProblemReload())
                        dispatch(setLeetcodeProblemVisibility(false))
                    },100)
                     

                  
                      
                      
                      console.log(response)
                      console.log("success")
                     // setIsLoading(true)
                    }).catch((e)=>{
                      console.log(e)
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
     }
  }else{
    return(<div></div>)
  }
}
const mapStateToProps = (state, props) => {
  var visibility= state.leetcodeProblem.visibility
  var problem=state.leetcodeProblem.problem


  return {
   visibility:visibility,
   ourProblem:problem
  };
};

export default  connect(mapStateToProps)(AddLeetcodeProblemModal)