
import React from 'react'
import {useState,useEffect} from 'react'
import axios from 'axios';
const Progress = ({done,labels}) => {
    const [style, setStyle] = useState({});
  
    setTimeout(() => {
      const newStyle = {
        opacity: 1,
        width: `${done}%`
      }
  
      setStyle(newStyle);
    }, 200)
  
    return (
          <div className="progress">
     
              <div className="progress-done" style={style}>
                  {done}%
              </div>
           
           
          </div>
      )
  }
function ProgressAnimation() {
    const[isLoading,setIsLoading]=useState(true)
    const[user,setUser]=useState()
    const[days,setDays]=useState(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
    const[percent,setPercent]=useState()
    useEffect(()=>{
        const us=JSON.parse(sessionStorage.getItem("user"))
        setUser(us)
        const prom=new Promise((resolve,reject)=>{
            axios.get("http://localhost:3022/streak-animation/"+us.id).then((response)=>{
                console.log(response)
                setPercent(response.data.percent)
                resolve()
            })
        })
        prom.then(()=>{
            setIsLoading(false)
        })
    },[])
if (!isLoading){
  return (
    <div>
            <div class="flex justify-between w-[300px]">
               <p>Sun</p>
               <p>Mon</p>
               <p>Tue</p>
               <p>Wed</p>
               <p>Thu</p>
               <p>Fri</p>
               <p>Sat</p>
            </div>
        <Progress done={percent} labels={days}/>
    </div>
  )
}else{
    return(
    <div>
     <Progress done="70"/>
</div>
)
}
}

export default ProgressAnimation