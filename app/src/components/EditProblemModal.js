import React from 'react'
import {useEffect,useState} from 'react'

//redux
import { connect,useDispatch } from 'react-redux'
import { setEditProblemVisibility } from '../redux/editProblem/editProblem-actions'

//outside
import { db } from '../firebase/firebase'
import {getDocs,collection,setDoc,doc,updateDoc} from 'firebase/firestore'

function EditProblemModal({ourProblem,visibility}) {
  
  const [problem,setProblem]=useState()
  const[link,setLink]=useState()


  const[title,setTitle]=useState()
  const[dataStructure,setDataStructure]=useState()
  const[category,setCategory]=useState()
  const[hints,setHints]=useState()
  const[solution,setSolution]=useState()
  const [addPrompt,setAddPrompt]=useState(false)
  const [prompt,setPrompt]=useState()
  const[addNewDataStructure,setAddNewDataStructure]=useState(false)
  const[addNewCategory,setAddNewCategory]=useState(false)
  const[examples,setExamples]=useState()
  const[addExamples,setAddExamples]=useState(false)
  const[numExamples,setNumExamples]=useState(0)
  const[currentExample,setCurrentExample]=useState()
 // const[solution,setSolution]=useState()
  const[isLoading,setIsLoading]=useState(true)
  
  useEffect(()=>{
    if(ourProblem!=null){
    const prom=new Promise((resolve,reject)=>{
      setTitle(ourProblem.problem.title)
      setDataStructure(ourProblem.problem.dataStructure)
      setLink(ourProblem.problem.link)
      setCategory(ourProblem.problem.category)
      setHints(ourProblem.problem.hints)
      setSolution(ourProblem.problem.solution)
      setPrompt(ourProblem.problem.prompt)
      setExamples(ourProblem.problem.examples)
      setProblem(ourProblem.problem)
      getProblemsList(ourProblem.id).then((response)=>{
        console.log(response)
       
       
          resolve()
      
      })
    })

    prom.then(()=>{
      if(visibility){
        
        var p=JSON.parse(sessionStorage.getItem('currentProblem')) 
        console.log(p)
        console.log(p) 

        const prom1=new Promise((resolve1,reject1)=>{
        
      
         
          resolve1()
        })

        prom1.then(()=>{
          setIsLoading(false)

        })
      
      }

    })
  }
  

  },[visibility,ourProblem])

  const problemsListCollectionRef=collection(db,"problems")



  
  const getProblemsList=async(id)=>{
    console.log(id)
    //READ DATA
    try{
      const user=JSON.parse(sessionStorage.getItem("user"))
      const userType=JSON.parse(sessionStorage.getItem("userType"))

    const data=await getDocs(problemsListCollectionRef)
      data.docs.map((doc)=>{
    
      console.log(doc.id +" "+id )
      if(doc.id==id){
        
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

  const dispatch=useDispatch()

  console.log(examples)

  if(!isLoading){

    console.log("prompt:"+prompt)
    console.log("examples:"+examples)
    console.log("link:"+link)
  return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50'>
     
      <main id='content' role='main' class='w-full max-w-md mx-auto '>
        <div class=' bg-white  rounded-xl shadow-lg bg-white dark:border-gray-700 mb-5'>
          <div class='p-4 sm:p-7 flex flex-col'>
            {problem.problem.examples==null ?
            <p class="text-xl">
                 add examples
            </p>:<p class="text-red-600 font-bold text-xl">Dont add examples</p>}
          <div class="flex justify-end">
               <button class="bg-red-400 p-3"><p class="text-xl text-white text-center font-bold " onClick={()=>{
                dispatch(setEditProblemVisibility(false))
                setIsLoading(false)
              
               }} >X</p></button> 
              </div>
              <div class="flex justify-center">
                <p class="text-xl text-center font-bold ">{problem.problem.title}</p>
              </div>
              <div class="flex flex-col p-3">
                <div class="flex flex-col m-2">
                  
                  <input type="text" class="w-full flex rounded-md p-3 bg-gray-300" placeholder={problem.problem.title} default={problem.problem.title} onChange={(e)=>{
                    setTitle(e.target.value)

                  }}/>
                  
                </div>
                <div class="flex flex-col m-2">
                  
                  <input type="text" class="w-full flex rounded-md p-3 bg-gray-300" placeholder="https://www.LeetCode.com" default={problem.problem.title} onChange={(e)=>{
                    setLink(e.target.value)

                  }}/>
                  
                </div>
                  <div class flex=" p-2 justify-between">
                  <div class="flex flex-col m-2">
                <div class="flex m-2">
                  <label><p class="text-lg font-bold">Category:</p>
                  </label>
                  <button  class="bg-green-400 p-1 rounded-md " onClick={()=>{
                    setAddNewCategory(!addNewCategory)
                  }}>
                    Add
                  </button>
                  </div>
                  {addNewCategory?<input type="text" class="w-full flex rounded-md p-3 bg-gray-300" placeholder={problem.problem.category} default={problem.problem.category} onChange={(e)=>{
                    setCategory(e.target.value)
                  }}/>:
                  <select
                  id='category'
                   class=' m-2  w-full text-gray-900 text-sm rounded-md border-l border-gray-300 p-1'
                         onChange={(e)=>{
                           console.log(e.target.value)
                           setCategory(e.target.value)
                         }} >   
                     <option value={problem.problem.category} selected>{problem.problem.category}</option>
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
               
                  }
                </div>
                <div class="flex flex-col m-2">
                  <div class="flex m-2">
                  <label><p class="text-lg font-bold">Data Structure:</p>
                  </label>
                  <button  class="bg-green-400 p-1 rounded-md " onClick={()=>{
                    setAddNewDataStructure(!addNewDataStructure)
                  }}>
                    Add
                  </button>
                  </div>
                  {addNewDataStructure?<input type="text" class="w-full flex rounded-md p-3 bg-gray-300" placeholder={problem.problem.dataStructure} default={problem.problem.dataStructure} onChange={(e)=>{
                    setDataStructure(e.target.value)
                    
                  }}/>:
                  <select
                  id='category'
                   class=' m-2  w-full text-gray-900 text-sm rounded-md border-l border-gray-300 p-1'
                   onChange={(e)=>{
                     console.log(e.target.value)
                     console.log(typeof(e.target.value))
                     setDataStructure(e.target.value)
                   }}  >
                           
                     <option value={problem.problem.dataStructure} selected>{problem.problem.dataStructure} </option>
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
                }
                </div>
              </div>
            

                <div class="flex flex-col m-2">
                <label><p class="text-lg font-bold">Hints:</p>
                  </label>
                  <input type="text" class="w-full flex rounded-md p-3 bg-gray-300" placeholder={problem.problem.hints} default={problem.problem.hints} onChange={(e)=>{
                    setHints(e.target.value)
                  }}/>
                </div>
                <div class="flex">
                {
                addPrompt?
                <div class="flex flex-col m-2">
                  <div class="flex m-2">
                <label><p class="text-ld font-bold">Prompt:</p>
                  </label>
                  <button class="bg-green-400 p-1 rounded-md" onClick={()=>{
                    setAddPrompt(!addPrompt)
                  }}>
                    No prompt
                  </button>
                  </div>
                  <textarea type="text-area" cols="4" rows="5"  class="bg-gray-300 rounded-md"placeholder={problem.problem.hints} default={problem.problem.hints} onChange={(e)=>{
                    setPrompt(e.target.value)
                    console.log(e.target.value)
                  }}/>
                </div>:<div class="flex m-2">
                <label><p class="text-ld font-bold">Prompt:</p>
                  </label>
                  <button class="bg-green-400 p-2 rounded-md" onClick={()=>{
                    setAddExamples(!addExamples)
                    console.log("addExamples:"+addExamples)
                    console.log("here")
                  }}>
                    Add
                  </button>
                </div>
               }
               {
                addExamples? 
                <div class="flex flex-col m-2">
                <div class="flex m-2">
              <label><p class="text-ld font-bold">Examples:</p>
                </label>
                <textarea  type="text-area" row="5"cols="4" class="bg-gray-300 rounded-md" onChange={(e)=>{
                  setCurrentExample(e.target.value)
                }} default={problem.problem.examples}/>
                <button class="bg-green-400 p-1 rounded-md" onClick={()=>{
                  setAddExamples(!addExamples)
                }}>
                  No prompt
                </button>
                </div>
                <button class="bg-green-400" onClick={(e)=>{
                  //setNumExamples(numExamples+1);
                  const prev=examples
                  prev.push(currentExample)
               
                    setExamples(prev)
                    console.log(examples)
            
                  console.log(numExamples)
                }}>
               
                  +
                </button>
              
                  <textarea id={"example_"+numExamples} type="text-area" cols="4" rows="5"  class="bg-gray-300 rounded-md"onChange={(e)=>{
                            //setCurrentExample(e.target.value)
                    }}/>
                        
              </div>:<div class="flex m-2">
              <label><p class="text-ld font-bold">Examples:</p>
                </label>
                <button class="bg-green-400 p-2 rounded-md" onClick={()=>{
                 // setAddExamples(!addExamples)
                }}>
                  Add
                </button>
              </div>

               }
                </div>
               

              </div>
              <button class="w-full bg-purple-900 rounded-md p-3 m-2" onClick={()=>{
                const prom=new Promise((resolve,reject)=>{

                  const  docRefer=doc(db,"problems",problem.id)
                  const setDocument=async()=>{
                    const  docRefer=doc(db,"problems",problem.id)
                    //READ DATA
                    try{
                     
            
                    const data=await getDocs(problemsListCollectionRef)
                    data.docs.map((d)=>{
                     
                      const date=new Date()
                      const oldAttempts=problem.problem.attempts
                     
                      
                      
                      const addDocument=async()=>{
                        const cDate=new Date()
                        const currDate=cDate.toString().substring(0,15)
                      
                     
                    
                        if(d.id==problem.id){

                          console.log(title)
                          console.log(dataStructure)
                          console.log(category)
                          console.log("addPrompt: "+addPrompt+ " prompt:"+prompt)
                          console.log(examples)

                          var exampleObj={}
                          if(examples!=null){
                          
                            var index=0;
                            while(index<examples.length){
                              const ex=examples[index].replace("\n"," ")
                              exampleObj[index]={id:index,example:ex}
                              index++
                            }
                          }
                          console.log(exampleObj)
                        
                          if(!addPrompt && !addExamples){
                            await setDoc(docRefer, {
                              title:title,
                              dataStructure:dataStructure,
                              category:category,
                              lastPracticed:problem.problem.lastPracticed,
                              hints:hints,
                              no_attempts:problem.problem.no_attempts,
                              attempts:problem.problem.attempts,
                              solution:problem.problem.solution,
                              userId:problem.problem.userId,
                              prompt:problem.problem.prompt,
                              examples:problem.problem.examples
                             
                            }).then((response)=>{
                              console.log(response)
                              dispatch(setEditProblemVisibility(false))
                              setIsLoading(true)
                            });
                          }

                         if(addPrompt && addExamples && examples!=null){
                          await setDoc(docRefer, {
                            title:title,
                            dataStructure:dataStructure,
                            category:category,
                            lastPracticed:problem.problem.lastPracticed,
                            hints:hints,
                            link:(link!=null ? link:null),
                            no_attempts:problem.problem.no_attempts,
                            attempts:problem.problem.attempts,
                            solution:problem.problem.solution,
                            userId:problem.problem.userId,
                            prompt:prompt,
                            examples:examples
                           
                          }).then((response)=>{
                            console.log(response)
                            dispatch(setEditProblemVisibility(false))
                            setIsLoading(true)
                          });
                        }
                        if(!addPrompt && addExamples && examples!=null && problem.problem.examples==null){
                          await setDoc(docRefer, {
                            title:title,
                            dataStructure:dataStructure,
                            category:category,
                            lastPracticed:problem.problem.lastPracticed,
                            hints:hints,
                            link:(link!=null ? link:null),
                            no_attempts:problem.problem.no_attempts,
                            attempts:problem.problem.attempts,
                            solution:problem.problem.solution,
                            userId:problem.problem.userId,
                            prompt:problem.problem.prompt,
                            examples:examples
                           
                          }).then((response)=>{
                            console.log(response)
                            dispatch(setEditProblemVisibility(false))
                            setIsLoading(true)
                          });
                        }
                        if(!addPrompt && addExamples && examples!=null ){
                          await setDoc(docRefer, {
                            title:title,
                            dataStructure:dataStructure,
                            category:category,
                            lastPracticed:problem.problem.lastPracticed,
                            hints:hints,
                            no_attempts:problem.problem.no_attempts,
                            attempts:problem.problem.attempts,
                            solution:problem.problem.solution,
                            userId:problem.problem.userId,
                            prompt:problem.problem.prompt,
                            examples:examples
                           
                          }).then((response)=>{
                            console.log(response)
                            dispatch(setEditProblemVisibility(false))
                            setIsLoading(true)
                          });
                          
                        }
                        if(addPrompt && !addExamples ){
                          await setDoc(docRefer, {
                            title:title,
                            dataStructure:dataStructure,
                            category:category,
                            lastPracticed:problem.problem.lastPracticed,
                            hints:hints,
                            link:(link!=null ? link:null),
                            no_attempts:problem.problem.no_attempts,
                            attempts:problem.problem.attempts,
                            solution:problem.problem.solution,
                            userId:problem.problem.userId,
                            prompt:problem.problem.prompt,
                            examples:problem.problem.examples
                           
                          }).then((response)=>{
                            console.log(response)
                            dispatch(setEditProblemVisibility(false))
                            setIsLoading(true)
                          });
                        }
                        if(!addPrompt && !addExamples ){
                          await setDoc(docRefer, {
                            title:title,
                            dataStructure:dataStructure,
                            category:category,
                            lastPracticed:problem.problem.lastPracticed,
                            hints:hints,
                            link:(link!=null ? link:null),
                            no_attempts:problem.problem.no_attempts,
                            attempts:problem.problem.attempts,
                            solution:problem.problem.solution,
                            userId:problem.problem.userId,
                            prompt:problem.problem.prompt,
                            examples:problem.problem.examples
                           
                          }).then((response)=>{
                            console.log(response)
                            dispatch(setEditProblemVisibility(false))
                            setIsLoading(true)
                          });
                        }
                          
                          
                        } 
                      }
                     addDocument()
      
                    })
                    }catch(err){
                      console.log(err)
                    }
                  }

                  setDocument()

                  

                })
              }}>
                <p class="text-white text-center">
                  Submit
                </p>
              </button>

              </div>
              </div>
          </main>
      </div>
   </div>
  )
  }
}

const mapStateToProps = (state, props) => {
  var visibility= state.editProblem.visibility;
  var problem=state.editProblem.problem
  console.log("visibility"+visibility)

  return {
   visibility:visibility,
   ourProblem:problem
  };
};

export default connect(mapStateToProps)(EditProblemModal)