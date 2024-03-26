import React from 'react'
import { useEffect,useState } from 'react'
function ChallengesSelectedContestants({setSelectedContestants,selectedContestants,contestantsChanged}) {
    const[users,setUsers]=useState([])
    const[isLoading,setIsLoading]=useState(true)

    
    useEffect(()=>{
        console.log("CONTESTANTS",selectedContestants)
        const prom=new Promise((resolve,reject)=>{
            if(selectedContestants.length>0){
            setTimeout(()=>{
                resolve()
            },100)
            }
        })

        prom.then(()=>{
            setIsLoading(false)
        })
    },[selectedContestants,contestantsChanged])

    function change(p,selectedContestants){
      
        const ppl=selectedContestants.filter((d)=>{
            if(d!=p){
                return d
            }
        })
        console.log("handling",ppl)
        setTimeout(()=>{
            setSelectedContestants(ppl)
        },500)

    }
    
    if(isLoading==false ){
        if( selectedContestants.length>0){
  return (
    <div clas="flex p-2 border-2 border-gray-800 bg-gray-100 m-2 rounded-sm">
        {selectedContestants.length>6?
        <div class="flex w-full overflow-hidden overflow-x-scroll">
         {
                  selectedContestants.map((f)=>{
                    return(
                      <button class=" m-1 bg-gray-300 p-1 rounded-md flex" onClick={()=>{
                        change(f,selectedContestants)
                      }}>
                         <p class=" text-gray-800 text-sm font-semibold">{f}</p>
                      </button>
                   
                    )
                  })
                }
    </div>
    :
    <div class="flex p-2 border-2 border-gray-800 m-2  bg-gray-100 rounded-sm ">
         {
                  selectedContestants.map((f)=>{
                    return(
                      <button class="m-1 bg-gray-300 p-1 rounded-md flex" onClick={()=>{
                        change(f,selectedContestants)}}>
                         <p class=" text-gray-800 text-sm font-semibold">{f}</p>
                      </button>
                   
                    )
                  })
                }
    </div>
        }
    </div>
   
  )
            }
 }else{
        <div class="flex w-full overflow-hidden overflow-x-scroll">
                    ho
        </div>
 }
}

export default ChallengesSelectedContestants