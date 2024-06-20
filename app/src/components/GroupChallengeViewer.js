import axios from 'axios'
import React, {useState, useEffect } from 'react'

function GroupChallengeViewer({challenge }) {
    const[isLoading,setIsLoading]=useState(true)
    const[challenges,setChallenges]=useState()
    const[losers,setLosers]=useState()
    const [winners,setWinners]=useState()
    const[mostProblems,setMostProblems]=useState()
    const[total,setTotal]=useState()
    const[ourProblemCounter,setOurProblemCounter]=useState()
    useEffect(()=>{
        const prom=new Promise((resolve,reject)=>{
            console.log("CHALLENGE",challenge)
            if(challenge!=null){
              axios.get("http://localhost:3022/get-group-challenge-data/"+challenge.challengeId).then((response)=>{
                console.log(response)
                console.log(challenge.problemCounter)
                var problemCounter=challenge.problemCounter
                var top
                var counter=Object.keys(problemCounter).map((c)=>{
                    return{k:c,problems:problemCounter[c]}
                })
                console.log(counter)
                setOurProblemCounter(counter)
                var topProblem=Object.keys(problemCounter).reduce(function (previous, key) {
                    var curr= (problemCounter[previous]> challenge.problemCounter[key]? {id:previous,count:problemCounter[previous]}:{id:key,count:problemCounter[key]})
                    if(top==null){
                        
                    console.log(key+ previous +problemCounter[previous]> challenge.problemCounter[key])
                    top=  (problemCounter[previous]> challenge.problemCounter[key]? {id:previous,count:problemCounter[previous]}:{id:key,count:problemCounter[key]})

                    }else{
                        top=top.count> curr.count? top:curr
                    }
                    //problemCounter[previous]> challenge.problemCounter[key]? {id:previous,count:problemCounter[previous]}:{id:key,count:problemCounter[key]}
                  return  problemCounter[previous]> challenge.problemCounter[key]? {id:previous,count:problemCounter[previous]}:{id:key,count:problemCounter[key]}
                }, 0);
                setMostProblems(top)
                console.log("top",topProblem)
                setTotal(response.data.total)
                setLosers(response.data.losers)
                setWinners(response.data.winners)
                setTimeout(()=>{
                    resolve()

                },500)
              })
            }else{
                setIsLoading(true)
            }
        })

        prom.then(()=>{
            setIsLoading(!isLoading)
        })
    },[challenge])
    function getSuffix(numb){
        if(numb<10){
            if(numb==1){
                return "st"
            }else if(numb==2){
                return "nd"
            }else if(numb==3){
                return "rd"
            }else if(numb==4 || numb==5 || numb==6 || numb==7 || numb==8 || numb==9 ){
                return "th"
            }
        }else{
            numb=numb.toString()
            numb=Number(numb.substring(numb.length-1,numb.length))
            if(numb==1){
                return "st"
            }else if(numb==2){
                return "nd"
            }else if(numb==3){
                return "rd"
            }else if(numb==4 || numb==5 || numb==6 || numb==7 || numb==8 || numb==9 ){
                return "th"
            }
        }
    }
    
    if(!isLoading && challenge!=null){
        console.log(challenge.startDate)
        console.log("winners",winners)
        console.log("challenge:",challenge)
        console.log(mostProblems)
console.log(ourProblemCounter)
        if(new Date()>new Date(challenge.endDate)){
            console.log("here",challenge)
            try{
  return (
    <div class="flex m-2 ">
        {challenge!=null?
        <div class="flex-col border-l-2 border-gray-700 p-2">
           {
            challenge.success?
            <p class="font-bold text-lg">{challenge.title} 
            <span class={`${challenge.success?"text-green-600":"text-red-600"}`}>
                Winner
             </span>
            </p>
            :
            <p class="font-bold text-lg">{challenge.title} 
            <span class={`${challenge.success?"text-green-600":"text-red-600"}`}>
            ranked {(winners.length>0?losers.length-(losers.length-challenge.rank):losers.length-(losers.length-challenge.rank)+getSuffix(losers.length-(losers.length-challenge.rank+1)))+ " of losing contestants"}
            </span>
        </p>
           }
            <div class="flex">
                <p>{new Date(challenge.startDate).toString().substring(0,15)} - {new Date(challenge.endDate).toString().substring(0,15)}  <span class={`${challenge.success==true? "text-green-600":"text-red-600"}`}>{`${challenge.success? "Success":"Failure"}`} {`${challenge.success? "":"on "+ new Date(challenge.dateFailed).toString().substring(0,15)}`}</span></p>
            </div>
           
            {mostProblems!=null?
                <div class="border-2 border-gray-200 p-2">
                   {
                    challenge.userId==mostProblems.id?
                    <div>
                        {
                           <p>{challenge.userStats.firstname} {challenge.userStats.lastname} -{mostProblems.count} problems</p>
                        }
                    </div>
                    :
                    <div>
                          {
                            challenge.selectedContestants.map((c)=>{
                                console.log(c)
                                if(mostProblems.id==c.userId){
                                    console.log(mostProblems)
                                    
                                  return(<p>{c.firstname} {c.lastname} -{Object.keys(mostProblems.count).length>0? mostProblems.count.problems:mostProblems.count} problems</p>)
                                }
                            })
                        }
                    </div>
                   }
                </div>
                :
                <div>
                </div>
                }
            <div class="flex">
               
                    {
                        losers.length>0?
                        <div class="flex-col w-full p-2 border-gray-500 border">
                        <p class="text-lg font-bold">Losers</p>
                        <div class="h-[50vh] overflow-y-scroll overflow-hidden">
                            {
                                losers.map((l)=>{
                                    console.log("losers:",l)
                                 
                               
                                    if(winners.length>0){
                                    return<div class="flex "><p class="text-sm">{l.userStats.firstname} {l.userStats.lastname} {l.rank}{getSuffix(l.rank)}</p></div>
                                    }else{
                                        return<div class="flex "><p class="text-sm">{l.userStats.firstname} {l.userStats.lastname} {l.rank}{getSuffix(l.rank)}</p></div>

                                    }
                                })
                            }
                        </div>
                          </div>
                        :
                        <div>
                        </div>
                    }
              
               
                    {
                        winners.length>0?
                        <div class="flex-col w-full p-2 border-gray-500 border">
                        <p class="text-lg font-bold">Winners</p>
                        <div class="h-[50vh] overflow-y-scroll overflow-hidden">
                            {
                                winners.map((w)=>{
                                    console.log("winners:",w)
                                
                                    return(<div class="flex"><p><p>{w.userStats.firstname} {w.userStats.lastname}{ "("+w.userStats.username+")"}</p> </p></div>)
                                })
                            }
                        </div>
                        </div>  
                        :
                        <div>
                        </div>
                    }
                             
            </div>
        </div>
        :
        <div></div>
    }
    </div>
  )
}catch(err){
    return(<p>heo</p>)
    console.log(err)
}
}else{
    {
        Object.keys(challenge.problemCounter).forEach((k)=>{
            console.log(k ,challenge.problemCounter[k] )
        })
    }
    console.log(ourProblemCounter)
    return(  <div class="flex m-2 ">
  
    <div class="flex-col border-l-2 border-gray-700 p-2">
    <p class="font-bold text-lg">{challenge.title} </p>
    <div class="flex-col">
        <p>Problems</p>
        <ul class="bg-green-500 p-3">
            {
              ourProblemCounter.map((c)=>{
                console.log(c)
                return(<div>hi</div>)
              })
            }
        </ul>
    </div>
        </div>
        </div>)
}
    }else{
        return(
            <div></div>
        )
    }
}

export default GroupChallengeViewer