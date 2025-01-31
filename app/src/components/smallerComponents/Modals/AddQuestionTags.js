import { useState,useEffect } from "react" 
import AddedTag from "./addedTag"


function AddQuestionTags({updateTopicTags,allTags,defaultTags}) {
    const [added,setAdded]=useState(defaultTags)
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
        setIsLoading(false)

    },[])
    function handleRemoveTag(t){
        console.log("new tags",t)
        updateTopicTags(t)

    }
    if(!isLoading){
  return (
    <div class={`w-full ${added.length>4?'over-flow-hidden overflow-x-scroll':'w-full'}`}>
    <input type="text" list="categories" class="m-2  w-full text-gray-900 text-sm rounded-md border-l bg-gray-300 p-1" onChange={(e)=>{
          console.log(e.target.value)
          console.log(e.target.value.length)
          if(!added.includes(e.target.value) && e.target.value.length>1){
          setAdded((prev)=>[...prev,e.target.value])
          }
    }} />
                    <datalist id="categories"
                
                   class=' m-2  w-full text-white text-sm rounded-md border-l bg-gray-900 p-1'
                         onChange={(e)=>{
                          
                         }} >   
                       {
                        allTags.map((t)=>{
                          return(<option value={t.toString()}>{t.toString()}</option>)
                        })
                       }
                </datalist>
                <div class="flex w-full overflow-x-scroll ">
                    {
                        added.map((a)=>{
                            console.log(a)
                            return(<AddedTag tag={a.toString()} addedTags={added} updateTags={handleRemoveTag}/>)
                        })
                    }
                </div>
       </div>
  )
}else{
    <div>AddQuestionTags</div>

}
}

export default AddQuestionTags