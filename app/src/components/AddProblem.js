import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
//assets
import { IconButton } from '@chakra-ui/react'

//firebase
import {getDocs,collection,doc,setDoc,addDoc,getDoc} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useDispatch } from 'react-redux'
import { addLeetcodeProblemReload } from '../redux/addLeetcodeProblem.js/addLeecodeProblem-reducer'
function AddProblem() {

  const[title,setTitle]=useState()
  const[link,setLink]=useState("https://leetcode.com/problemset/all/")
  const[category,setCategory]=useState()
  const[userId,setUserId]=useState()
  const [solution,setSolution]=useState()
  const[hints,setHints]=useState()
  const [dataStructure,setDataStructure]=useState()
  const[level,setLevel]=useState()
  const[prompt,setPrompt]=useState()
  const[examples,setExamples]=useState([])
  const[currentExample,setCurrentExample]=useState()
  const[isLoading,setIsLoading]=useState(true)
  const[acRate,setAcRate]=useState()
 const[tags,setTags]=useState()

  const[show,setShow]=useState(false)
  const dispatch=useDispatch()
  useEffect(()=>{
    const prom=new Promise((resolve,reject)=>{

  
    axios.get("http://localhost:3022/allTags").then(async(response)=>{
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
        setTimeout(()=>{
          resolve()
       },100)
      }else{
        setTags(topictags)
       setTimeout(()=>{
          resolve()
       },100)
      }
    })
    })

    prom.then(()=>{
      setIsLoading(false)
    })
  },[])
  
  


   

 

  const navigate=useNavigate()

//TODO:ADD LINK INPUT
if(!isLoading){
  return (
    <div class="flex-col bg-inherit w-full m-2  p-3 rounded-md w-1/2">
        <button class="bg-green-500 p-3 rounded-md flex w-full justify-center" onClick={()=>{
          setShow(!show)

        }}>
          <p class="text-white font-bold">Add</p>
        </button>
        <IconButton/>
        {show?
        <div class="flex flex-col bg-gray-200 p-3 rounded-md">
                   <div class="flex p-3 m2">
            <label>Title:</label>
            <input type="text" class="p-2 rounded-sm w-full ml-2" onChange={(e)=>{
              setTitle(e.target.value)
            }}/>
          </div>
          <div class="flex p-3 m2">
            <label>Link:</label>
            <input type="text" placeholder="https://www.LeetCode.com" class="p-2 rounded-sm w-full ml-2" onChange={(e)=>{
              setLink(e.target.value)
            }}/>
          </div>
          <div class="flex p-3 m2">
            <label>Hints:</label>
            <input type="text" class="p-2 rounded-sm w-full ml-2" onChange={(e)=>{
              setHints(e.target.value)
            }}/>
          </div>
          <div class="flex p-3 m2">
            <label>Level:</label>
            <input type="text" class="p-2 rounded-sm w-full ml-2" onChange={(e)=>{
              setLevel(e.target.value)
            }}/>
          </div>
     
          <div class="flex p-3 m2">
            <label>Prompt:</label>
            <textarea rows="5" cols="50" class="white-space-prewrap" onChange={(e)=>{
              setPrompt(e.target.value)
            }}/>
          </div>
          <div class="flex flex-col p-3 m2">
            <label>Example:</label>
            <textarea rows="5" cols="50" class="white-space-prewrap" onChange={(e)=>{
              setCurrentExample(e.target.value)
            }}/>
            <button class="bg-green-400" onClick={()=>{
              var prev=examples
              prev.push(currentExample)
              setExamples(prev)
              console.log(examples)
            }}>
              <p class="text-white">
                +
              </p>
            </button>
          </div>

          <div class="flex p-3 m2">
            <label>Category: </label>
            <input type="text" list="category" class="m-2  w-full text-gray-900 text-sm rounded-md border-l bg-gray-300 p-1"/>
          <datalist
               id='category'
                class=' m-2  w-full text-gray-900 text-sm rounded-md border-l border-gray-100 p-1'
                      onChange={(e)=>{
                        console.log(e.target.value)
                        setCategory(e.target.value)
                      }} >   
               {
                tags.map((t)=>{
                  return(<option value={t}>{t}</option>)
                })
               }
                 
                  
           </datalist>
          </div>
          <div class="flex p-3 m2">
            <label>Data Structure: </label>
          <select
               id='category'
                class=' m-2  w-full text-gray-900 text-sm rounded-md border-l border-gray-100 p-1'
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
          
          </div>
          <button class="bg-green-500 p-3 rounded-sm" onClick={()=>{
            
            const added=async()=>{
              console.log(dataStructure)
              const currentDate = new Date();
              const currentDayOfMonth = currentDate.getDate();

              var exampleObj={}
              var index=0;
              while(index<examples.length){
                const ex=examples[index].replace("\n"," ")
                exampleObj[index]={id:index,example:ex}
                index++
              }

              console.log(sessionStorage.getItem("signInType"))
              if(sessionStorage.getItem("signInType")=="signIn"){
                const user=JSON.parse(sessionStorage.getItem('user'))
                const cDate=new Date()
                const currDate=cDate.toString().substring(0,15)
                const added=await addDoc(collection(db,"problems"),{
                  title:title,
                  dataStructure:dataStructure,
                  category:category,
                  lastPracticed:currentDate.toString(),
                  no_attempts:0,
                  attempts:[{attempt:"N/A",date:currDate}],
                  hints:hints!=null? hints:"",
                  link,link,
                  prompt:prompt,
                  examples:examples,
                  level:level,
                  solution:"solution",
                  userId:user.userId,

             
            

                  boilerCode:`public class Main{
                    public static void main(String[]args){

                    }
                  }`,

              }).then((response)=>{
                
                alert("SUCCESS")
                dispatch(addLeetcodeProblemReload())
              })

              }
              if(sessionStorage.getItem("signInType")=="google"){
                
              }
            }
            added()
          }}>
          <p class="text-white">Submit</p>
           </button>
        </div>:<div></div>
      }
    </div>
  )
    }else{
      return(<div></div>)
    }
}
console.log()
export default AddProblem