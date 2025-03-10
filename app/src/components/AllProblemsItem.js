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
          setTimeout(()=>{
            resolve()
          },100)
        
        })

        prom.then(()=>{
          dispatch(setLeetcodeProblemVisibility(true))
        })
      }}>view</p></button>
      <div class="border-b border-gray-600 v=border-3">
      <div class="flex"><p class="text-center font-bold text-xl">{problem.title} </p><p class={`m-2 font-bold ${ problem.level=="Easy"?"text-green-600":(problem.level=="Medium"?"text-orange-600":(problem.level=="Hard"?"text-red-600":"text-black"))}`}>{problem.level}</p></div>
      </div>
      <div class={`flex ${problem.tags.length<3? "w-[10vw]":"w-[15vw]"} `}>
        {
          problem.tags.map((t)=>{
            return(<p class="text-xs text-gray-400 mr-2 border-r-2 border-gray-300">{t} </p>)
          })
        }
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
            setTimeout(()=>{
              resolve()
            },100)
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