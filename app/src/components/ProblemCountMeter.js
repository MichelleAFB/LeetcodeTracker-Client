import React, { useState } from 'react'
import { useEffect } from 'react'
function ProblemCountMeter({color,count,backgroundColor,hideCount,index}) {

  const[countString,setCountString]=useState()
  const[isLoading,setIsLoading]=useState(true)
  function getLevel(count){
    return count>15 && count<100? count+60 :count+30
  }
  useEffect(()=>{
    const prom=new Promise((resolve,reject)=>{
   
      setTimeout(()=>{
        resolve()
      },250)
    })

    prom.then(()=>{
      const c=JSON.parse(sessionStorage.getItem(color.toString()))
      console.log("c"+c+" "+typeof(c))
      var level=count>0 ? getLevel(c):0
      setCountString(level.toString())
    
      setTimeout(()=>{
        setIsLoading(false)
      },250)
     
    })
  },[])

  if(!isLoading){
  console.log(color+": "+countString)
  if(color=="green"){
  return (

    <div>     
      <div class={`Frame1 w-[125px] h-[175px] relative ${backgroundColor!=null? backgroundColor:"bg-gray-400"}`}>
        <div class="Group1 w-[62px] h-36 left-[33px] top-[9px] absolute ">
     <div class="Rectangle1 w-[58px] h-36 left-0 top-0 absolute bg-neutral-50 rounded-[25px]"></div>
     <div class="Rectangle2 w-[47px] h-[130px] left-[6px] top-[9px] absolute bg-white rounded-[20px] border-4 border-black"></div>
     {hideCount?
     <div></div>:
     <div class="z-20  top-[20.50px] relative"><p class="text-sm font-bold">{JSON.parse(sessionStorage.getItem("green"))}</p></div>  
  }  
   {count>100?
    <div class={`Rectangle3 w-[43.4px] h-[122px] left-[8.5px] bottom-[8px] rounded-tl-[15%] rounded-tr-[15%] absolute bg-green-500 rounded-b-[15px] border-black border-4`}>.</div>
   :
   <div>
     {
    count<=100 && count>50 ?
    <div class={`Rectangle3 w-[43.4px] h-[80px] left-[8.5px] bottom-[8px] absolute bg-green-500 rounded-b-[15px] border-black border-4`}>.</div>
    :

    <div>
       { count <=50  && count>25?
         <div class={"Rectangle3 w-[43.4px] h-[60px] left-[8.5px] bottom-[8px] absolute bg-green-500 rounded-b-[15px] border-black border-4"}>.</div>
      :
      <div>
       { count<=25 && count>15?
          <div class={`Rectangle3 w-[43.4px] h-[40px] left-[8.5px] bottom-[8px] absolute bg-green-500 rounded-b-[15px] border-black border-4`}>.</div>
          :
          <div>
            {
              count<=15 && count!=0?
          <div class={`Rectangle3 w-[43.4px] h-[20px] left-[8.5px] bottom-[8px] absolute bg-green-500 rounded-b-[15px] border-black border-4`}>.</div>
            :
            <div class={`Rectangle3 w-[43.4px] h-[${countString}px] left-[8.5px] bottom-[8px] absolute bg-green-500 rounded-b-[15px] border-black border-4`}>.</div>


        }
          </div>
        }
      </div>
      }
  
    </div>
   }
   </div>

  }

 
     
  
    <div class="Line1 w-[25.02px] h-[0px] left-[25.99px] top-[125.50px] absolute border border-black"></div>
       <div class="Line2 w-8 h-[0px] left-[20px] top-[80px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[75px] absolute border border-black"></div>
       <div class="Line2 w-7 h-[0px] left-[25px] top-[70px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[100px] absolute border border-black"></div>
       <div class="Line2 w-8 h-[0px] left-[20px] top-[65px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[60px] absolute border border-black"></div>
       <div class="Line2 w-8 h-[0px] left-[20px] top-[55px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[50px] absolute border border-black"></div>
       <div class="Line2 w-7 h-[0px] left-[25px] top-[45px] absolute border border-black"></div>

       <div class="Line2 w-5 h-[0px] left-[29px] top-[90px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[15px] top-[100px] absolute border border-black"></div>
       <div class="Line2 w-7 h-[0px] left-[25px] top-[110px] absolute border border-black"></div>

       <div class="Line2 w-5 h-[0px] left-[15px] top-[90px] absolute border border-black"></div>

       <div class="Line2 w-5 h-[0px] left-[29px] top-[95px] absolute border border-black"></div>

       <div class="Line2 w-7 h-[0px] left-[25px] top-[84px] absolute border border-black"></div>

       <div class="Line2 w-8 h-[0px] left-[20px] top-[114px] absolute border border-black"></div>
       <div class="Line3 w-5 h-[0px] left-[29px] top-[105px] absolute border border-black"></div>
       <div class="Line3 w-5 h-[0px] left-[29px] top-[120px] absolute border border-black"></div>
     
   </div>
 </div>
      
   

   </div>
  )
  }else if(color=="orange"){
    return   (

      <div>
  
            
        <div class={`Frame1 w-[125px] h-[175px] relative ${backgroundColor!=null? backgroundColor:"bg-gray-400"}`}>
          <div class="Group1 w-[62px] h-36 left-[33px] top-[9px] absolute ">
       <div class="Rectangle1 w-[58px] h-36 left-0 top-0 absolute bg-neutral-50 rounded-[25px]"></div>
       <div class="Rectangle2 w-[47px] h-[130px] left-[6px] top-[9px] absolute bg-white rounded-[20px] border-4 border-black"></div>
       {hideCount?
       <div>
        </div>:
       <div class="z-20   top-[20.50px] relative"><p class="text-sm font-bold">{JSON.parse(sessionStorage.getItem("orange"))}</p></div>   
      }
       {count>100?
    <div class={`Rectangle3 w-[43.4px] h-[122px] left-[8.5px] bottom-[8px] rounded-tl-[15%] rounded-tr-[15%] absolute bg-orange-500 rounded-b-[15px] border-black border-4`}>.</div>
   :
   <div>
     {
    count<=100 && count>50 ?
    <div class={`Rectangle3 w-[43.4px] h-[80px] left-[8.5px] bottom-[8px] absolute bg-orange-500 rounded-b-[15px] border-black border-4`}>.</div>
    :

    <div>
       { count <=50  && count>25?
         <div class={"Rectangle3 w-[43.4px] h-[60px] left-[8.5px] bottom-[8px] absolute bg-orange-500 rounded-b-[15px] border-black border-4"}>.</div>
      :
      <div>
           { count<=25 && count>15?
          <div class={`Rectangle3 w-[43.4px] h-[40px] left-[8.5px] bottom-[8px] absolute bg-orange-500 rounded-b-[15px] border-black border-4`}>.</div>
          :
          <div>
            {
              count<=15 && count!=0?
          <div class={`Rectangle3 w-[43.4px] h-[20px] left-[8.5px] bottom-[8px] absolute bg-orange-500 rounded-b-[15px] border-black border-4`}>.</div>
            :
            <div class={`Rectangle3 w-[43.4px] h-[0px] left-[8.5px] bottom-[8px] absolute bg-orange-500 rounded-b-[15px] border-black border-4`}>.</div>


        }
          </div>
        }
      </div>
      }
  
    </div>
   }
   </div>

  }
    
    
    <div class="Line1 w-[25.02px] h-[0px] left-[25.99px] top-[125.50px] absolute border border-black"></div>
       <div class="Line2 w-8 h-[0px] left-[20px] top-[80px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[75px] absolute border border-black"></div>
       <div class="Line2 w-7 h-[0px] left-[25px] top-[70px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[100px] absolute border border-black"></div>
       <div class="Line2 w-8 h-[0px] left-[20px] top-[65px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[60px] absolute border border-black"></div>
       <div class="Line2 w-8 h-[0px] left-[20px] top-[55px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[50px] absolute border border-black"></div>
       <div class="Line2 w-7 h-[0px] left-[25px] top-[45px] absolute border border-black"></div>

       <div class="Line2 w-5 h-[0px] left-[29px] top-[90px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[15px] top-[100px] absolute border border-black"></div>
       <div class="Line2 w-7 h-[0px] left-[25px] top-[110px] absolute border border-black"></div>

       <div class="Line2 w-5 h-[0px] left-[15px] top-[90px] absolute border border-black"></div>

       <div class="Line2 w-5 h-[0px] left-[29px] top-[95px] absolute border border-black"></div>

       <div class="Line2 w-7 h-[0px] left-[25px] top-[84px] absolute border border-black"></div>

       <div class="Line2 w-8 h-[0px] left-[20px] top-[114px] absolute border border-black"></div>
       <div class="Line3 w-5 h-[0px] left-[29px] top-[105px] absolute border border-black"></div>
       <div class="Line3 w-5 h-[0px] left-[29px] top-[120px] absolute border border-black"></div>

    
     </div>
   </div>
        
     
  
     </div>
    )
  }else if(color=="red"){

    return    (

      <div>
  
            
        <div class={`Frame1 w-[125px] h-[175px] relative ${backgroundColor!=null? backgroundColor:"bg-gray-400"}`}>
          <div class="Group1 w-[62px] h-36 left-[33px] top-[9px] absolute ">
       <div class="Rectangle1 w-[58px] h-36 left-0 top-0 absolute bg-neutral-50 rounded-[25px]"></div>
       <div class="Rectangle2 w-[47px] h-[130px] left-[6px] top-[9px] absolute bg-white rounded-[20px] border-4 border-black"></div>
       {hideCount?
       <div>
        </div>:<div class="z-20   top-[20.50px] relative"><p class="text-sm font-bold">{JSON.parse(sessionStorage.getItem("red"))}</p></div> 
    }  

 
    
{count>100?
    <div class={`Rectangle3 w-[43.4px] h-[122px] left-[8.5px] bottom-[8px] rounded-tl-[15%] rounded-tr-[15%] absolute bg-red-500 rounded-b-[15px] border-black border-4`}>.</div>
   :
   <div>
     {
    count<=100 && count>50 ?
    <div class={`Rectangle3 w-[43.4px] h-[80px] left-[8.5px] bottom-[8px] absolute bg-red-500 rounded-b-[15px] border-black border-4`}>.</div>
    :

    <div>
       { count <=50  && count>25?
         <div class={"Rectangle3 w-[43.4px] h-[60px] left-[8.5px] bottom-[8px]  absolute bg-red-500 rounded-b-[15px] border-black border-4"}>.</div>
      :
      <div>
          { count<=25 && count>15?
          <div class={`Rectangle3 w-[43.4px] h-[40px] left-[8.5px] bottom-[8px] absolute bg-red-500 rounded-b-[15px] border-black border-4`}>.</div>
          :
          <div>
            {
              count<=15 && count!=0?
          <div class={`Rectangle3 w-[43.4px] h-[20px] left-[8.5px] bottom-[8px] absolute bg-red-500 rounded-b-[15px] border-black border-4`}>.</div>
            :
            <div class={`Rectangle3 w-[43.4px] h-[${countString}px] left-[8.5px] bottom-[8px] absolute bg-red-500 rounded-b-[15px] border-black border-4`}>.</div>


        }
          </div>
        }
      </div>
      }
  
    </div>
   }
   </div>
  }
       {hideCount?
       <div></div>:
        <div class={"Rectangle3 w-[43.4px] h-["+JSON.parse(sessionStorage.getItem("red")).toString()+"px] left-[8.5px] bottom-[8px] absolute bg-red-500 rounded-b-[15px] border-black border-4"}></div>
      }
      
     <div></div>
       <div class="Line1 w-[25.02px] h-[0px] left-[25.99px] top-[125.50px] absolute border border-black"></div>
       <div class="Line2 w-8 h-[0px] left-[20px] top-[80px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[75px] absolute border border-black"></div>
       <div class="Line2 w-7 h-[0px] left-[25px] top-[70px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[100px] absolute border border-black"></div>
       <div class="Line2 w-8 h-[0px] left-[20px] top-[65px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[60px] absolute border border-black"></div>
       <div class="Line2 w-8 h-[0px] left-[20px] top-[55px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[29px] top-[50px] absolute border border-black"></div>
       <div class="Line2 w-7 h-[0px] left-[25px] top-[45px] absolute border border-black"></div>

       <div class="Line2 w-5 h-[0px] left-[29px] top-[90px] absolute border border-black"></div>
       <div class="Line2 w-5 h-[0px] left-[15px] top-[100px] absolute border border-black"></div>
       <div class="Line2 w-7 h-[0px] left-[25px] top-[110px] absolute border border-black"></div>

       <div class="Line2 w-5 h-[0px] left-[15px] top-[90px] absolute border border-black"></div>

       <div class="Line2 w-5 h-[0px] left-[29px] top-[95px] absolute border border-black"></div>

       <div class="Line2 w-7 h-[0px] left-[25px] top-[84px] absolute border border-black"></div>

       <div class="Line2 w-8 h-[0px] left-[20px] top-[114px] absolute border border-black"></div>
       <div class="Line3 w-5 h-[0px] left-[29px] top-[105px] absolute border border-black"></div>
       <div class="Line3 w-5 h-[0px] left-[29px] top-[120px] absolute border border-black"></div>
     </div>
   </div>
        
     
  
     </div>
    )


  }
}else{
  return(<div></div>)
}
}

export default ProblemCountMeter