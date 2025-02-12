
import React from 'react'
import {useState,useEffect} from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { start } from '@cloudinary/url-gen/qualifiers/textAlignment';
const Progress = ({done,completedDays,labels,startingPoint}) => {
    const [style, setStyle] = useState({});
    const[isLoading,setIsLoading]=useState(true)
    const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  
    
    
    console.log("style",style)

    useEffect(()=>{
        console.log("here")
        const prom=new Promise((resolve,reject)=>{
            
            var streakAnimation=JSON.parse(sessionStorage.getItem("streakAnimation"))
            if(startingPoint!=null){
            if(streakAnimation!=null){
                console.log("AAA")
            if(streakAnimation.completedDays!=completedDays){
                console.log("ABA")
               var anim={
                startingPoint:startingPoint,
                completedDays:completedDays,
                opacity: 1,
                width: done,
                marginLeft:startingPoint==0?(startingPoint):(startingPoint+(((completedDays)*40)*.1))
                }
                sessionStorage.setItem("streakAnimation",JSON.stringify(anim))
            const newStyle = {
                opacity:1,
                width: `${done}%`,
               marginLeft:startingPoint==0? `${startingPoint}px`:`${(startingPoint+(((7-completedDays)*40)*.1))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
              }
          
              setStyle(newStyle);
            }else{
                console.log("BAA")
                setStyle({
                    opacity:1,
                    width:`${streakAnimation.width}px`,
                    marginLeft:`${streakAnimation.marginLeft}px`
                })
            }
        }else{
            console.log("AAB")
            const anim = {
                startingPoint:startingPoint,
                completedDays:completedDays,
                opacity: 1,
                width: done+8,
                marginLeft:startingPoint==0?(startingPoint):(startingPoint+(((completedDays)*40)*.1))//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
              }
              sessionStorage.setItem("streakAnimation",JSON.stringify(anim))
              setStyle({
                opacity: 1,
                width: `${done}%`,
                marginLeft:startingPoint==0? `${(startingPoint)}px`:`${(startingPoint+(((completedDays)*40)*.1))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
              });

        }
        }else{
                const anim = {
                    startingPoint:streakAnimation.startingPoint,
                    completedDays:streakAnimation.completedDays,
                    opacity: 1,
                    width: `${streakAnimation.done}%`,
                    marginLeft:streakAnimation.startingPoint==0? `${(streakAnimation.startingPoint+((streakAnimation.completedDays)*40))}px`:`${(streakAnimation.startingPoint+((7-streakAnimation.completedDays)*40))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
                  }
                  sessionStorage.setItem("streakAnimation",JSON.stringify(anim))
                  setStyle({
                    opacity: 1,
                    width: `${streakAnimation.done}%`,
                    marginLeft:streakAnimation.startingPoint==0? `${(streakAnimation.startingPoint+((streakAnimation.completedDays)*40))}px`:`${(streakAnimation.startingPoint+((7-streakAnimation.completedDays)*40))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
                  })

            }
            
            setTimeout(() => {
              resolve()
              }, 200)

        })
        prom.then(()=>{
            setIsLoading(false)
        })
      

    },[completedDays])
    if(!isLoading){
        
    return (
          <div className="progress">
     
              <div className="progress-done" style={style}>
                  {done}%
              </div>
           
           
          </div>
      )
  }else{
    return(<div></div>)
  }
}
function ProgressAnimation({reload,percent,startingPercent,completedDays,streaksObject,startingPoint}) {
    const[isLoading,setIsLoading]=useState(true)
    const[user,setUser]=useState()
    const[days,setDays]=useState(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
    const[ourPercent,setOurPercent]=useState()
    useEffect(()=>{
        const us=JSON.parse(sessionStorage.getItem("user"))
        setUser(us)
      
        const prom=new Promise((resolve,reject)=>{
            console.log("\n\n\nset object")
            console.log(streaksObject)
            var anim={
                startingPoint:startingPoint,
                completedDays:completedDays,
                opacity:1,
                 width: `${completedDays*(100/7)}%`,
                marginLeft:startingPoint==0? `0`:`${(startingPoint+(((7-completedDays)*40)*.1))}px`
            }
            sessionStorage.setItem("streakAnimation",JSON.stringify(anim))
            setOurPercent(percent)
            setTimeout(()=>{
                resolve()
            },1000)
        
        })
        prom.then(()=>{
            setIsLoading(false)
        })
    },[reload,completedDays,startingPercent])
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
        <Progress done={completedDays*(100/7)} labels={days} completedDays={completedDays} startingPoint={startingPoint}/>
    </div>
  )
}else{
    return(
    <div>
     <Progress done={ourPercent} labels={days} completedDays={completedDays}  startingPoint={startingPoint}/>
</div>
)
}
}
const mapStateToProps = (state, props) => {
    var reload= state.streaks.fireOff
    var streaksObject=state.streaks.uponLogin
    var percent=state.streaks.percent
    var sPercent=state.streaks.startingPercent
    var completedDays=state.streaks.completedDays
    const start=state.streaks.startingPoint
  
    return {
     reload:reload,
     streaksObject:streaksObject,
     percent:percent,
     startingPercent:sPercent,
     completedDays:completedDays,
     startingPoint:start
    };
  };
  
  export default connect(mapStateToProps)(ProgressAnimation)
