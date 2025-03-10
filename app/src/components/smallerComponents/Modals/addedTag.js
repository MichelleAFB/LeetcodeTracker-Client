import React from 'react'

function AddedTag({addedTags,tag,updateTags}) {

   
  
  
    return(<div class="p-1 m-1 bg-cyan-600 flex">
        <button onClick={()=>{
            var newTags=addedTags
            
            newTags.splice(newTags.indexOf(tag),1)
            //const newAdded=newTags
            updateTags(newTags)
        }}>
            <p class="text-red-600">x</p>
        </button>
        <p class="text-white text-xs">{tag.toString()}</p>
        </div>)

  
}

export default AddedTag