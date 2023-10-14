import React, { useState } from 'react'
import { useEffect } from 'react'
function ProblemCountMeter({color,count,backgroundColor,hideCount,index}) {

  const[countString,setCountString]=useState()
  const[isLoading,setIsLoading]=useState(true)
  useEffect(()=>{
    const prom=new Promise((resolve,reject)=>{
      setCountString(count.toString())
      if(count<=15 && count!=0){
        count=count+5
      }else if(count>15){
        count=count+15
      }
      setTimeout(()=>{
        resolve()
      },40)
    })

    prom.then(()=>{
      console.log("countString:"+countString)
      setIsLoading(false)
    })
  },[])

  if(!isLoading){
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
   
     {
    count<100 && count>15 && count!=0?
    <div class={`"Rectangle3 w-[43.4px] h-["+${count}+"px] left-[8.5px] bottom-[8px] absolute bg-green-500 rounded-b-[15px] border-black border-4"`}>.</div>
    :
    <div>
  
    </div>
   }

  { count <=15 && count>8 && count!=0?
         <div class={"Rectangle3 w-[43.4px] h-[10px] left-[8.5px] bottom-[8px] absolute bg-green-500 rounded-b-[15px] border-black border-4"}>.</div>
      :
      <div>
           <div class={"Rectangle3 w-[43.4px] h-["+count+"px] left-[8.5px] bottom-[8px] absolute bg-green-500 rounded-b-[15px] border-black border-4"}>.</div>
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
       {
    count<100 && count>10 && count!=0?
    <div class={`Rectangle3 w-[43.4px] h-[${count}px] left-[8.5px] bottom-[8px] absolute bg-orange-500 rounded-b-[15px] border-black border-4`}>.</div>
    :
  <div></div>
    
   }
        {
    count<100 && count<=10 && count!=0?
    <div class={`Rectangle3 w-[43.4px] h-[10px] left-[8.5px] bottom-[8px] absolute bg-orange-500 rounded-b-[15px] border-black border-4`}></div>
    :
    <div class={`Rectangle3 w-[43.4px] h-[${count}px] left-[8.5px] bottom-[8px] absolute bg-orange-500 rounded-b-[15px] border-black border-4`}></div>
    
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
    console.log("red:"+count)
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

 
    
    {
    count<100 && count>15 && count!=0?
    <div class={"Rectangle3 w-[43.4px] h-["+count+"px] left-[8.5px] bottom-[8px] absolute bg-red-500 rounded-b-[15px] border-black border-4"}>.</div>
    :
    <div>
      {count <=15 && count!=0?
      <div class={"Rectangle3 w-[43.4px] h-["+count+"px] left-[8.5px] bottom-[8px] absolute bg-red-500 rounded-b-[15px] border-black border-4"}></div>
      :
      <div>
        <div class={"Rectangle3 w-[43.4px] h-["+count+"px] left-[8.5px] bottom-[8px] absolute bg-red-500 rounded-b-[15px] border-black border-4"}></div>
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