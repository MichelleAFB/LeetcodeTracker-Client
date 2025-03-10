import { useState,useEffect } from "react" 
import AddedTag from "./addedTag"


function AddQuestionTags({updateTopicTags,allTags,defaultTags}) {
    const [added,setAdded]=useState(defaultTags)
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
        console.log(defaultTags)
        setIsLoading(false)

    },[])
    function handleRemoveTag(t){
        console.log("new tags",t)
        updateTopicTags(t)

    }
    if(!isLoading){
        console.log(defaultTags)
        if(defaultTags!=null){
  return (
    <div class={`w-full ${defaultTags.length>4?'over-flow-hidden overflow-x-scroll':'w-full'}`}>
    <input type="text" list="categories" class="m-2  w-full text-gray-900 text-sm rounded-md border-l bg-gray-300 p-1" onChange={(e)=>{
         // console.log(e.target.value)
         
         // console.log(e.target.type,e.target.list,e.target.class)
          if(allTags.includes(e.target.value) && !added.includes(e.target.value) ){
          setAdded((prev)=>[...prev,e.target.value])
          setTimeout(()=>{
            e.target.value=null
          },100)
         
          }
    }} />
                    <datalist id="categories"
                
                   class=' m-2  w-full text-white text-sm rounded-md border-l bg-gray-900 p-1'
                         onChange={(e)=>{
                            if(!added.includes(e.target.value) && allTags.includes(e.target.value)){
                               // setAdded((prev)=>[...prev,e.target.value])
                                }
                         }} >   
                       {
                        allTags.map((t)=>{
                          
                            var val=t.name!=null?t.name:t
                            return(<option value={val}>value={val}</option>)
                        })
                       }
                </datalist>
                <div class="flex w-full overflow-x-scroll ">
                    {
                        added.map((a)=>{
                            //console.log(a)
                            return(<AddedTag tag={a.toString()} addedTags={added} updateTags={handleRemoveTag}/>)
                        })
                    }
                </div>
       </div>
  )
}else{
    return(
        <div class={`w-full ${'w-full'}`}>
        <input type="text" list="categories" class="m-2  w-full text-gray-900 text-sm rounded-md border-l bg-gray-300 p-1" onChange={(e)=>{
             // console.log(e.target.value)
             
             // console.log(e.target.type,e.target.list,e.target.class)
              if(allTags.includes(e.target.value) && !added.includes(e.target.value) ){
              setAdded((prev)=>[...prev,e.target.value])
              setTimeout(()=>{
                e.target.value=null
              },100)
             
              }
        }} />
                        <datalist id="categories"
                    
                       class=' m-2  w-full text-white text-sm rounded-md border-l bg-gray-900 p-1'
                             onChange={(e)=>{
                                if(!added.includes(e.target.value) && allTags.includes(e.target.value)){
                                   // setAdded((prev)=>[...prev,e.target.value])
                                    }
                             }} >   
                           {
                            allTags.map((t)=>{
                            
                                var val=t.name!=null?t.name:t
                              return(<option value={val}>value={val}</option>)
                            })
                           }
                    </datalist>
                    <div class="flex w-full overflow-x-scroll ">
                        {added!=null?
                         <div class="flex w-full overflow-x-scroll ">
                            {added.map((a)=>{
                                //console.log(a)
                                return(<AddedTag tag={a.toString()} addedTags={added} updateTags={handleRemoveTag}/>)
                            })}
                            </div>:
                            <div></div>
                        }
                    </div>
           </div>
    )
}
}else{
    <div>AddQuestionTags</div>

}
}

export default AddQuestionTags