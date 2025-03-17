import { useState,useEffect } from "react" 
import AddedTag from "./addedTag"


function AddQuestionTags({updateTopicTags,allTags,defaultTags}) {
    const [added,setAdded]=useState(defaultTags!=null?defaultTags:[])
    const[tagNames,setTagNames]=useState()
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
        console.log("ALLTAGS",allTags)
        var i=0
        const tagnames=[]
        while(i<allTags.length){
            var t=allTags[i]
            tagnames.push(t.name)
            i++
            if(i>=allTags.length){
                setTagNames(tagnames)
                setTimeout(()=>{
                    setIsLoading(false)

                },200)
                //setIsLoading(false)

            }
        }
       // setIsLoading(false)

    },[])
    function handleRemoveTag(t){
        console.log("new tags",t)
        updateTopicTags(t)

    }
    if(!isLoading){
        console.log(defaultTags)
        console.log("added:",added)
        if(defaultTags!=null){
  return (
    <div class={`w-full ${defaultTags.length>4?'over-flow-hidden overflow-x-scroll':'w-full'}`}>
    <input type="text" list="categories" class="m-2  w-full text-gray-900 text-sm rounded-md border-l bg-gray-300 p-1" onChange={(e)=>{
                                     console.log("curr added",added)
                                     console.log("allTags includes",tagNames.includes(e.target.value), " e",e.target.value)
          if(tagNames.includes(e.target.value) && !added.includes(e.target.value) ){
         // setAdded((prev)=>[...prev,e.target.value])
          setTimeout(()=>{
            e.target.value=null
          },100)
         
          }
    }} />
                    <datalist id="categories"
                
                   class=' m-2  w-full text-white text-sm rounded-md border-l bg-gray-900 p-1'
                         onChange={(e)=>{
                            console.log("curr added",added," tagNames",tagNames)
                            var tag=e.target.value
                            console.log("allTags includes",tagNames.includes(e.target.value), " e",e.target.value)
                            if(!added.includes(tag) && tagNames.includes(tag)){
                                setAdded((prev)=>[...prev,tag])
                                e.target.value=null
                                }
                         }} >   
                       {
                        allTags.map((t)=>{
                          

                            var val=t.name!=null?t.name:t
                         

                            return(<option value={val}>{val}</option>)
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
                  console.log("curr added",added," tagNames",tagNames)
                  var tag=e.target.value
                  console.log("allTags includes",tagNames.includes(e.target.value), " e",e.target.value)
                  if(!added.includes(tag) && tagNames.includes(tag)){
                      setAdded((prev)=>[...prev,tag])
                      e.target.value=null
                      }
        }} />
                        <datalist id="categories"
                    
                       class=' m-2  w-full text-white text-sm rounded-md border-l bg-gray-900 p-1'
                             onChange={(e)=>{
                                console.log("curr added",added)
                            console.log("allTags includes",allTags.includes(e.target.value), " e",e.target.value)
                                if(!added.includes(e.target.value) && allTags.includes(e.target.value)){
                                   setAdded((prev)=>[...prev,e.target.value])
                                    }
                             }} >   
                           {
                            allTags.map((t)=>{
                                var val=t.name!=null?t.name:t
                              return(<option value={val}>{val}</option>)
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