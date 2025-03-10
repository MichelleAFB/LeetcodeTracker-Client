
import React from 'react'
import {useState,useEffect} from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { start } from '@cloudinary/url-gen/qualifiers/textAlignment';
import { useDispatch } from 'react-redux';
import { setCompletedDays, setLastDate, setPercent, setStartingPoint } from '../redux/streakProgress/streak-actions';
const Progress = ({lastDate,done,completedDays,labels,startingPoint}) => {
    const [style, setStyle] = useState({});
    const[isLoading,setIsLoading]=useState(true)
    const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  
   
    const dispatch=  useDispatch()
    

    const widths={
        "Sun":45,
        "Mon":90,
        "Tue":130,
        "Wed":190,
        "Thu":230,
        "Fri":275,
        "Sat":290
      }
    function getWidth(day){
        var w=widths[Object.keys(widths)[(day.getDay())]]
      
        return w
    }
   

    useEffect(()=>{
    
        const user=JSON.parse(sessionStorage.getItem("user"))
        if(user!=null){
            var streakAnimation=JSON.parse(sessionStorage.getItem("streakAnimation"))
        const prom=new Promise((resolve,reject)=>{
            try{
                if(lastDate!=null){
                    console.log("A")
                if(streakAnimation!=null && streakAnimation.percent!=null){
                    //check lastDate
                    console.log("AA")
                    if(completedDays!=streakAnimation.completedDays || lastDate!=streakAnimation.lastDate || streakAnimation.start!=startingPoint){
                        console.log("AAA")
                        console.log("UPDATED STREAK")
                        var anim=streakAnimation
                        anim.done=getWidth(lastDate)
                        anim.lastDate=lastDate
                        anim.completedDays=completedDays
                        anim.start=startingPoint
                        anim.marginLeft= startingPoint==0? `${(startingPoint)}`:`${(startingPoint+(((completedDays)*40)*.1))}`
                        sessionStorage.setItem("streakAnimation",JSON.stringify(streakAnimation))
                        setStyle({
                            opacity: 1,
                            width: getWidth(lastDate),
                            marginLeft:startingPoint==0? `${(startingPoint)}`:`${(startingPoint+(((completedDays)*40)*.1))}`

                        })
                        setTimeout(()=>{
                            resolve()
                        },300)
                        //reset streakAnimation data

                    }else{
                        console.log("AAB")
                        setStyle({
                            opacity: 1,
                            width: getWidth(new Date(streakAnimation.lastDate)),
                            marginLeft:streakAnimation.start==0? `${0}`:`${(streakAnimation.start+(((streakAnimation.completedDays)*40)*.1))}`

                        })
                        setTimeout(()=>{
                            resolve()
                        },300)
                        //set style normally
                    }
                }else{
                    axios.get("http://localhost:3022/streak-animation/"+user.userId).then((response)=>{
                        console.log("AAB")
                        console.log(response)
                        var d=new Date(response.data.lastDate)
                        var width= getWidth(d)
                        const anim = {
                         start:response.data.start,
                         completedDays:response.data.completedDays,
                         opacity: 1,
                         lastDate:response.data.lastDate,
                         done:getWidth(new Date(response.data.lastDate)),
                         percent:response.data.otherPercent,
                         width: `${response.data.otherPercent}`,
                         marginLeft:response.data.start==0?(0):(response.data.start+(((response.data.completedDays)*40)*.1))//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
                       }
                     dispatch(setCompletedDays(response.data.completedDays))
                     dispatch(setPercent(response.data.otherPercent))
                     dispatch(setLastDate(response.data.lastDate))
                     dispatch(setStartingPoint(response.data.start))
                       sessionStorage.setItem("streakAnimation",JSON.stringify(anim))
                       setStyle({
                         opacity: 1,
                         width: `${width}`,
                         marginLeft:response.data.start==0? `${(response.data.start)}px`:`${(response.data.start+(((response.data.completedDays)*40)*.1))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
                       });
                       setTimeout(() => {
                         resolve()
                         }, 200)
                     })

                }
            }else{
                console.log("B")
                axios.get("http://localhost:3022/streak-animation/"+user.userId).then((response)=>{
                  
                    console.log(response)
                    var d=new Date(response.data.lastDate)
                    var width= getWidth(d)
                    const anim = {
                     start:response.data.start,
                     completedDays:response.data.completedDays,
                     opacity: 1,
                     lastDate:response.data.lastDate,
                     done:getWidth(new Date(response.data.lastDate)),
                     percent:response.data.otherPercent,
                     width: `${response.data.otherPercent}`,
                     marginLeft:response.data.start==0?(0):(response.data.start+(((response.data.completedDays)*40)*.1))//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
                   }
                 dispatch(setCompletedDays(response.data.completedDays))
                 dispatch(setPercent(response.data.otherPercent))
                 dispatch(setLastDate(response.data.lastDate))
                 dispatch(setStartingPoint(response.data.start))
                   sessionStorage.setItem("streakAnimation",JSON.stringify(anim))
                   setStyle({
                     opacity: 1,
                     width: `${width}px`,
                     marginLeft:response.data.start==0? `${(response.data.start)}px`:`${(response.data.start+(((response.data.completedDays)*40)*.1))}px`//${(startingPoint)+((7-(completedDays))*40)}px`:${(startingPoint)+((completedDays)*40)}px`
                   });
                   setTimeout(() => {
                     resolve()
                     }, 200)
                 })
            }

            
        }catch(e){
            console.log("C")
            resolve()

        }
            
        })
        prom.then(()=>{
            setIsLoading(false)
        })
    }
      

    },[completedDays,done,lastDate])
    if(!isLoading){
        var anim=JSON.parse(sessionStorage.getItem("streakAnimation"))
    
    return (
          <div className="progress">
     
              <div className="progress-done" style={style}>
                  {done}
              </div>
           
           
          </div>
      )
  }else{
    return(<div></div>)
  }
}
function ProgressAnimation({sessionStatus,lastDate,reload,percent,startingPercent,completedDays,streaksObject,startingPoint}) {
    const[isLoading,setIsLoading]=useState(true)
    const[user,setUser]=useState()
    const[days,setDays]=useState(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"])
    const[ourPercent,setOurPercent]=useState()
    useEffect(()=>{
        const us=JSON.parse(sessionStorage.getItem("user"))
        if(us!=null){
        setUser(us)
      
        const prom=new Promise((resolve,reject)=>{
        
            var anim={
                startingPoint:startingPoint,
                completedDays:completedDays,
                opacity:1,
                 width: `${percent*(2.3*completedDays)}`,
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
    },[reload,completedDays,startingPercent,sessionStatus])
    const widths={
        "Sun":45,
        "Mon":90,
        "Tue":130,
        "Wed":190,
        "Thu":230,
        "Fri":275,
        "Sat":290
      }
    function getWidth(day){
       
        var w=widths[Object.keys(widths)[(day.getDay())]]
   
        return w
    }
if (!isLoading && sessionStatus=="USER_LOGGED_IN"){
    var streakAnimation=JSON.parse(sessionStorage.getItem("streakAnimation"))
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
        <Progress lastDate={lastDate} done={getWidth(lastDate==null?new Date(sessionStorage.lastDate):lastDate)} labels={days} completedDays={completedDays} startingPoint={startingPoint}/>
    </div>
  )
}else{
    return(
    <div>
     <Progress lastDate={lastDate} done={getWidth(lastDate==null?new Date(sessionStorage.lastDate):lastDate)}  labels={days} completedDays={completedDays}  startingPoint={startingPoint}/>
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
    var lastDate=state.streaks.lastDate
    var sessionStatus=state.userSession.sessionStatus
    const start=state.streaks.startingPoint
  
    return {
     reload:reload,
     streaksObject:streaksObject,
     percent:percent,
     startingPercent:sPercent,
     completedDays:completedDays,
     startingPoint:start,
     lastDate:lastDate,
     sessionStatus:sessionStatus
    };
  };
  
  export default connect(mapStateToProps)(ProgressAnimation)
