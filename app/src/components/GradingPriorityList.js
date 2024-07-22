import React from 'react'

function GradingPriorityList({priorities,setPriority}) {
    function handleSetPriority(e){
        console.log(Object.values(priorities))
        console.log(priorities)
        if(Object.keys(priorities).length==0){
            setPriority([e.target.value])
        }else{
            if(Object.values(priorities).includes(e.target.value)){
              var key=  Object.keys(priorities).find(key => priorities[key] === e.target.value)
              priorities[key]=null

            }else{
                var p=priorities
               var index= Object.keys(priorities).reduce((a,b)=>{
                    if(a>=b){
                        return a
                    }else {
                        return b
                    }
                })
                console.log(index)
                p[Number(index+1)]=e.target.value
                setPriority(p)
                
            }
        }
    }
  return (
    <div class="flex w-full bg-gray-600 rounded-md">
        <select onChange={(e)=>{
            console.log(e)
            handleSetPriority(e)
        }}>
                <option value={"NUM_QUESTIONS"}>Total # of Questions</option>
                <option value={"EARLIEST"}>Earliest</option>
                <option value={"LONGEST_STREAK"}>Longest Streak</option>
            </select>

    </div>
  )
}

export default GradingPriorityList