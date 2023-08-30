import React from 'react'


//redux
import { useDispatch } from 'react-redux'
import { setLeetcodeProblem,setLeetcodeProblemVisibility } from '../redux/addLeetcodeProblem.js/addLeecodeProblem-reducer'
function AllProblemsItem({problem}) {
  const dispatch=useDispatch()

 // console.log(problem)
  if(problem.firebase_id==null){
  return (
    <div class="relative z-[-1]">
    <div class="bg-gray-200 p-3 m-3 rounded-md flex flex-col z-10">
      <button class="bg-green-400 rounded-md p-2 m-2 justify-end"><p class="text-white" onClick={()=>{
        const prom=new Promise((resolve,reject)=>{
          dispatch(setLeetcodeProblem(problem))
          resolve()
        })

        prom.then(()=>{
          dispatch(setLeetcodeProblemVisibility(true))
        })
      }}>view</p></button>
      <div class="border-b border-gray-600 v=border-3">
      <p class="text-center font-bold text-xl">{problem.title}</p>
      </div>
      <div class="flex flex-col">
        <a target="_blank" rel="noopener noreferrer" class="text-center hover:text-yellow-600 font-semibold"href={problem.link}>{problem.link}</a>
      </div>

    </div>
    </div>
  )
    }else{
      return(
        <div class="relative z-[-1]">
        <div class="bg-gray-300 p-3 m-3 rounded-md flex flex-col z-10">
        <button class="bg-gray-400 rounded-md p-2 m-2 justify-end"><p class="text-white" onClick={()=>{
          const prom=new Promise((resolve,reject)=>{
            dispatch(setLeetcodeProblem(problem))
            resolve()
          })
  
          prom.then(()=>{
            dispatch(setLeetcodeProblemVisibility(true))
          })
        }}>view</p></button>
        <div class="border-b border-gray-600 v=border-3">
        <p class="text-center font-bold text-xl">{problem.title}</p>
        </div>
        <div class="flex flex-col">
          <a target="_blank" rel="noopener noreferrer" class="text-center hover:text-yellow-600 font-semibold"href={problem.link}>{problem.link}</a>
        </div>
  
      </div>
      </div>

      )
    }
}

export default AllProblemsItem