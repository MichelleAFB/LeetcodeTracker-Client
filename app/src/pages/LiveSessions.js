import React, { useEffect } from 'react'

function LiveSessions() {
    const[isLoading,setIsLoading]=useState(true)
    useEffect(()=>{
        const prom=new Promise((resolve,reject)=>{
            resolve()
        })
        prom.then(()=>{
            setIsLoading(false)
        })
    },[])
    if(!isLoading){
  return (
    <div>LiveSessions</div>
  )
}else{
    return(<div></div>)
}
}

export default LiveSessions