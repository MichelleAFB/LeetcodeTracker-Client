import React from 'react'
import {useEffect,useState} from 'react'
import axios from 'axios'
//redux
import { connect,useDispatch } from 'react-redux'
import { setEditProblemVisibility } from '../redux/editProblem/editProblem-actions'

//outside
import { db } from '../firebase/firebase'
import {getDocs,collection,setDoc,doc,updateDoc} from 'firebase/firestore'
function EditProblemModal2({ourProblem,visibility}) {

  const [problem,setProblem]=useState(ourProblem.problem)
  const[id,setId]=useState(ourProblem.id)
 

  const[title,setTitle]=useState(ourProblem.problem.title)
  const[dataStructure,setDataStructure]=useState(ourProblem.problem.dataStructure)
  const[category,setCategory]=useState(ourProblem.problem.category)
  const[hints,setHints]=useState(ourProblem.problem.hints)
  //const[solution,setSolution]=useState()


  const[solution,setSolution]=useState(()=>{
    if(ourProblem.problem.solution!=null){
      return ourProblem.problem.solution
    }else{
      return "none"
    }
  })
  const[link,setLink]=useState(ourProblem.problem.link!=null ? ourProblem.problem.link:"https://leetcode.com/problemset/all/")
  const [addPrompt,setAddPrompt]=useState(false)
  const [prompt,setPrompt]=useState((ourProblem.problem.prompt!=null && ourProblem.problem.prompt!="none") ? ourProblem.problem.prompt:"none")

  const[addNewDataStructure,setAddNewDataStructure]=useState(false)
  const[addNewCategory,setAddNewCategory]=useState(false)
  const[examples,setExamples]=useState(ourProblem.problem.examples!=null? ourProblem.problem.examples:["N/A"])
  const[addExamples,setAddExamples]=useState(false)
  const[boilerCode,setBoilerCode]=useState()
  const[currentExample,setCurrentExample]=useState()
  const[isLoading,setIsLoading]=useState(true)
  const [level,setLevel]=useState()


  const dispatch=useDispatch()
  
  useEffect(()=>{

    const lev=ourProblem.problem.level!=null? ourProblem.problem.level:"Medium"
    const promp=ourProblem.problem.prompt!=null? ourProblem.problem.prompt:"none"
    const lin=ourProblem.problem.link!=null && ourProblem.problem.link!="none"?ourProblem.problem.link :"https://leetcode.com/problemset/all/"
    const examp=ourProblem.problem.examples!=null? ourProblem.problem.examples:[]
    const boil=ourProblem.problem.boilerCode!=null? ourProblem.problem.boilerCode:"public class Main{ publice static void main(String[] args){}}"
    const title=ourProblem.problem.title
    const prom=new Promise((resolve,reject)=>{
      if(ourProblem.problem.boilerCode!=null){
        setBoilerCode(ourProblem.problem.boilerCode)
      }else{
        setBoilerCode("public class main{ public static void main(String [] args){}}")
      }
      setTimeout(()=>{
        resolve()
      },2000)
      
    })

    prom.then(()=>{

      const prom2=new Promise((resolve2,reject2)=>{
        console.log(lev)
        console.log("link:"+lin)
        console.log(examp)
        console.log(boil)

        setExamples(examp)
        setPrompt(promp)
        setLevel(lev)
        setLink(link)
        setBoilerCode(boil)
        setIsLoading(false)
      })
     
    })

  },[visibility])


  if(!isLoading && visibility){
    console.log(ourProblem.id)
    console.log("prompt:"+prompt)
    console.log("examples:"+examples)
    console.log("link:"+link)
    console.log("here")
    const problemsListCollectionRef=collection(db,"problems")
  return (
    <div class='bg-gray-200' data-testId="modal-public">
     
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50'>
     
      <main id='content' role='main' class='w-full max-w-lg mx-auto '>
      <div class=' bg-white  rounded-xl shadow-lg bg-white dark:border-gray-700 mb-5 p-3 flex flex-col'>
        <div class="flex w-full justify-end">
          <button class="bg-red-500 rounded-md w-1/8 p-2" onClick={()=>{
            dispatch(setEditProblemVisibility(false))
          }}>
            <p class="text-white">
              X
            </p>
          </button>
          <button class="bg-green-400 p-3" onClick={()=>{
            axios.get("http://localhost:3022/getData").then((response)=>{
              console.log(response)
            })
          }}>

          </button>
        </div>
        <div class="flex m-2 align-items-center">
          <label class="m-2 font-bold text-lg">Title:</label>
          <input type="text" class="p-2 border-gray-500 border-2 rounded-md" default={ourProblem.problem.title} placeholder={ourProblem.problem.title} onChange={(e)=>{
            console.log("current:"+title)
            console.log("e:"+e.target.value)
            console.log("ourProblem:"+ourProblem.problem.title)
            if(e.target.value.length>0 && e.target.value!=ourProblem.problem.title){
              setTitle(e.target.value)
            }else{
              setTitle(ourProblem.problem.title)
            }
          }}/>
        </div>
        <div class="flex m-2 align-items-center">
           <label class="m-2 font-bold text-lg">Link:</label>
          <input type="text" class="p-2 border-gray-500 border-2 rounded-md" default={link}     placeholder={link} onChange={(e)=>{
            console.log(e.target.value.length)
            if(e.target.value.length>0 && link=="https://leetcode.com/problemset/all/")
              {setLink(e.target.value)
              }else{
                setLink("https://leetcode.com/problemset/all/")
              }
          }}/>
        </div>
        <div class="flex m-2 align-items-center">
           <label class="m-2 font-bold text-lg">Level:</label>
          <input type="text" class="p-2 border-gray-500 border-2 rounded-md" default={link}     placeholder={level} onChange={(e)=>{
            console.log(e.target.value)
            if(e.target.value.length>0 )
              {setLevel(e.target.value)
              }else{
                setLevel("https://leetcode.com/problemset/all/")
              }
          }}/>
        </div>
        <div classs="flex m-4">
          <label class="m-2 font-bold text-lg">Prompt:</label>
          {
            addPrompt?
            <button class="bg-red-500 rounded-md p-1 m-2" onClick={()=>{
                
              setPrompt(ourProblem.problem.prompt!=null ? ourProblem.problem.prompt:
                "none")
                setAddPrompt(!addPrompt)
            }}>
              <p class="text-white">
                Remove prompt
              </p>
            </button>:
             <button class="bg-green-400 m-2 rounded-md p-1" onClick={()=>{
              setAddPrompt(!addPrompt)
            }}>
              <p class="text-white">
                Add Prompt
              </p>
            </button>
          }
          {
            addPrompt?
            <div class="flex flex-col m-2 ">
              
           
                <textarea class="p-1 border-gray-400 border-2 rounded-md" rows="5" cols="50" default={prompt} placeholder={prompt} onChange={(e)=>{
                  console.log("e:"+e.target.value)
                  console.log("current:"+title)
                  console.log("ourProblem:"+ourProblem.problem.prompt)
                  if( e.target.value.length>0 && e.target.value!="none"){
                    setPrompt(e.target.value)
                  }else{
                    setPrompt(ourProblem.problem.prompt)
                  }
                }}/>

            </div>:
            <div  class="flex flex-col">
             

            </div>
          }
        </div>
        <div classs="flex  m-4">
          <label class="m-2 font-bold text-lg">Examples:</label>
          {addExamples?
          <button class="bg-red-500 p-1 m-2 rounded-md" onClick={()=>{
            setExamples(ourProblem.problem.examples!=null?
              ourProblem.problem.examples :
              []
              )
            setAddExamples(!addExamples)
          }}>
            <p class="text-white">Remove Examples</p>
          </button>:
          <button class="bg-green-400 m-2 rounded-md p-1" onClick={()=>{
            setExamples([])
            setAddExamples(!addExamples)
            console.log(examples)
          }}>
            <p class="text-white">
            Add Examples
            </p>
          </button>
          }
          {addExamples?
          <div class="flex flex-col">
          <textarea type="textarea" class="p-1 border-gray-400 border-2 rounded-t-md" rows="5" cols="20" default={examples.length==0? "add examples":"already has exam"} placeholder={examples} onChange={(e)=>{
            console.log(examples)
            setCurrentExample(e.target.value)
          }}/>
          <button class="bg-green-400 rounded-b-md p-1" onClick={()=>{
          
            const prev=examples
            prev.push(currentExample)
            setExamples(prev)
            console.log(examples)
          }}>
            <p class="text-white font-bold text-xl">+</p>
          </button>
          </div>:
          <div></div>
        }
        </div>
        <div class="flex flex-col m-2">
          <div class="flex">
            <label class="font-bold">Solution:</label>
            <textarea rows="5" cols="40" class="border-gray-900 border-2 rounded-md p-1" onChange={(e)=>{
              setSolution(e.target.value)
            }}/>
          </div>
        </div>
        <button class="bg-blue-500 rounded-md p-3 w-full flex justify-center" onClick={()=>{
          console.log(examples)
          console.log("solution:"+solution)
          console.log("prompt:"+prompt)
          console.log("level:"+level)
          console.log("link:"+link)
          console.log("title:"+title)
        }}>
          <p class="text-white">check</p>
        </button>
        <div class="flex m-2">
          <button class="bg-purple-500 m-1 p-2 rounded-md w-full flex justify-center" onClick={(ourProblem)=>{
            console.log("addExamples:"+addExamples)
            console.log(examples)
            console.log("addPrompt:"+prompt)
            console.log(prompt)
            console.log("title:"+title)
            console.log("link:"+link)
            const p=JSON.parse(sessionStorage.getItem('editProblem'))
            const  docRefer=doc(db,"problems",p.id)
            
            const setDocument=async(ourProblem)=>{
              const  docRefer=doc(db,"problems",ourProblem.id)
              //READ DATA
              try{
               
      
              const data=await getDocs(problemsListCollectionRef)
              data.docs.map((d)=>{
               
                
               
                
                
                const addDocument=async(ourProblem)=>{
                  if(ourProblem.id==d.id){
                    console.log(id )
                    console.log(ourProblem.id)
                    console.log("MATCH")
                    console.log(examples)
                  if(examples.length>0){
                    console.log(examples)
                  
                    await setDoc(docRefer, {
                      title:title,
                      dataStructure:ourProblem.problem.dataStructure,
                      category:ourProblem.problem.category,
                      lastPracticed:ourProblem.problem.lastPracticed,
                      hints:ourProblem.problem.hints,
                      no_attempts:ourProblem.problem.no_attempts,
                      attempts:ourProblem.problem.attempts,
                      solution:solution,
                      userId:ourProblem.problem.userId,
                      boilerCode:boilerCode,
                      prompt:prompt,
                      level:level,
                      examples:examples,
                      link:link
                     
                    }).then((response)=>{
                      console.log(response)
                      alert("success")
                      //setReload(!reload)
  
                    });
                   console.log(prob)
               
                  }
                }else {
                  if(examples.length==0){
                  var prob={
                    title:title,
                    link:link,
                    examples:{0:"first"},
                    prompt:prompt
                   }
                  // console.log(prob)

                  await setDoc(docRefer, {
                    title:title,
                    dataStructure:ourProblem.problem.dataStructure,
                    category:ourProblem.problem.category,
                    lastPracticed:ourProblem.problem.lastPracticed,
                    hints:ourProblem.problem.hints,
                    no_attempts:ourProblem.problem.no_attempts,
                    attempts:ourProblem.problem.attempts,
                    solution:solution,
                    userId:ourProblem.problem.userId,
                    boilerCode:boilerCode,
                    prompt:prompt,
                    level:level,
                    examples:examples,
                    link:link
                   
                  }).then((response)=>{
                    console.log(response)
                    alert("success")
                    //setReload(!reload)

                  });

                }
              }
                  
                  //console.log(d)
                }

                addDocument(ourProblem)
              })
            }catch(err){
              console.log(err)
            }
              
            }
           
            setDocument(p)
            
            

          }}>
            <p class="text-white font-bold text-center">Submit</p>
          </button>
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
  var visibility= state.editProblem.visibility;
  var problem=state.editProblem.problem
  console.log("visibility"+visibility)

  return {
   visibility:visibility,
   ourProblem:problem
  };
};

export default connect(mapStateToProps)(EditProblemModal2)