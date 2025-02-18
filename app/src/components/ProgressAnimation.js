
import React from 'react'
import {useState,useEffect} from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { start } from '@cloudinary/url-gen/qualifiers/textAlignment';
import { useDispatch } from 'react-redux';
import { setCompletedDays, setPercent, setStartingPoint } from '../redux/streakProgress/streak-actions';
const Progress = ({done,completedDays,labels,startingPoint}) => {
    const [style, setStyle] = useState({});
    const[isLoading,setIsLoading]=useState(true)
    const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  
   
    const dispatch=  useDispatch()
    

    useEffect(()=>{
        console.log("/n\n\nPRoGRESS")
        const user=JSON.parse(sessionStorage.getItem("user"))
        if(user!=null){
        const prom=new Promise((resolve,reject)=>{
            try{
            var streakAnimation=JSON.parse(sessionStorage.getItem("streakAnimation"))
            
            if(streakAnimation!=null){
            if(startingPoint!=null){
                console.log("AAA")
        if(streakAnimation.completedDays!=completedDays || startingPoint!=streakAnimation.start || done!=streakAnimation.otherPercent){
                console.log("UPDATE")
                console.log("ABA")
               var anim={
                start:startingPoint,
                completedDays:completedDays,
                otherPercent:streakAnimation.otherPercent,
                opacity: 1,
                width: done,
                marginLeft:streakAnimation.start==0? `${(streakAnimation.start)}px`:`${(streakAnimation.start+(((streakAnimation.completedDays)*40)*.1))}px`
            }
                //sessionStorage.setItem("streakAnimation",JSON.stringify(anim))
                setStyle(style)
                console.log(anim,"done",done)
                /*
            const newStyle = {
                opacity:1,
                width: `${done}%`,
               marginLeft:startingPoint==0? `${startingPoint}px`:`${(startingPoint+(((7-completedDays)*40)*.1))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
              }
          
              setStyle(newStyle);
              */
            }else{
                console.log("BAA",{
                    opacity:1,
                    width:`${streakAnimation.otherPercent*(2.3*completedDays)}px`,
                    marginLeft:streakAnimation.start==0? `${(streakAnimation.start)}px`:`${(streakAnimation.start+(((streakAnimation.completedDays)*40)*.1))}px`
                })
                setStyle({
                    opacity:1,
                    width:`${streakAnimation.otherPercent*(2.3*completedDays)}px`,
                    marginLeft:streakAnimation.start==0? `${(streakAnimation.start)}px`:`${(streakAnimation.start+(((streakAnimation.completedDays)*40)*.1))}px`
                })
            }
           resolve()
        }else{
            console.log("AAB")
            axios.get("http://localhost:3022/streak-animation/"+user.userId).then((response)=>{
               console.log(response)
               const anim = {
                startingPoint:response.data.start,
                completedDays:response.data.completedDays,
                opacity: 1,
                width: `${response.data.otherPercent*(2.3*completedDays)}px`,
                marginLeft:response.data.starting==0?(0):(response.data.start+(((response.data.completedDays)*40)*.1))//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
              }
            dispatch(setCompletedDays(response.data.completedDays))
            dispatch(setPercent(response.data.otherPercent))
            dispatch(setStartingPoint(response.data.start))
              sessionStorage.setItem("streakAnimation",JSON.stringify(response.data.animation))
              setStyle({
                opacity: 1,
                width: `${response.data.otherPercent*(2.3*response.data.completedDays)}px`,
                marginLeft:response.data.start==0? `${(response.data.start)}px`:`${(response.data.start+(((response.data.completedDays)*40)*.1))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
              });
              setTimeout(() => {
                resolve()
                }, 200)
            })
           

        }
        }else{
            axios.get("http://localhost:3022/streak-animation/"+user.userId).then((response)=>{
               
                console.log(response)
                const anim = {
                    startingPoint:response.data.start,
                    completedDays:response.data.completedDays,
                    opacity: 1,
                    width: `${response.data.otherPercent*(2.3*response.data.completedDays)}px`,
                    marginLeft:response.data.start==0?(0):(response.data.start+(((response.data.completedDays)*40)*.1))//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
                  }
                  sessionStorage.setItem("streakAnimation",JSON.stringify(response.data))
                  dispatch(setCompletedDays(response.data.completedDays))
                  dispatch(setPercent(response.data.otherPercent))
                  dispatch(setStartingPoint(response.data.start))
                  setStyle({
                    opacity: 1,
                    width: `${response.data.otherPercent*(2.3*response.data.completedDays)}px`,
                    marginLeft:response.data.start==0? `${(response.data.start)}px`:`${(response.data.start+(((response.data.completedDays)*40)*.1))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
                  });
                  setTimeout(() => {
                    resolve()
                    }, 200)
             })
             
            }
            
          
}catch(err){

    axios.get("http://localhost:3022/streak-animation/"+user.userId).then((response)=>{
        console.log(response)
        const anim = {
            startingPoint:response.data.start,
            completedDays:response.data.completedDays,
            opacity: 1,
            width: response.data.otherPercent+8,
            marginLeft:response.data.start==0?(0):(response.data.start+(((response.data.completedDays)*40)*.1))//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
          }
          dispatch(setCompletedDays(response.data.completedDays))
          dispatch(setPercent(response.data.otherPercent))
          dispatch(setStartingPoint(response.data.start))
          sessionStorage.setItem("streakAnimation",JSON.stringify(response.data))
          setStyle({
            opacity: 1,
            width: `${response.data.otherPercent*(2.3*response.data.completedDays)}px`,
            marginLeft:response.data.start==0? `${(response.data.start)}px`:`${(response.data.start+(((response.data.completedDays)*40)*.1))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
          });
          setTimeout(() => {
            resolve()
            }, 1000)
        })
    }
        })
        prom.then(()=>{
            setIsLoading(false)
        })
    }
      

    },[completedDays,done])
    if(!isLoading){
        console.log("PROGROESS",style)
    return (
          <div className="progress">
     
              <div className="progress-done" style={style}>
                  {style.width}%
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
        if(us!=null){
        setUser(us)
      
        const prom=new Promise((resolve,reject)=>{
            console.log("\n\n\nset object")
            console.log(streaksObject)
            var anim={
                startingPoint:startingPoint,
                completedDays:completedDays,
                opacity:1,
                 width: `${percent*(2.3*completedDays)}px`,
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
    }
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
        <Progress done={startingPercent} labels={days} completedDays={completedDays} startingPoint={startingPoint}/>
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
