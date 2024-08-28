import React from 'react'
import { useDrag } from 'react-dnd'
function Option({text,id,index}) {
    const [collected, drag, dragPreview] = useDrag(() => ({
        type,
        item: { id },
        text:{text}
      }))
    useEffect(()=>{

    },[index])
    console.log(collected)
    return collected.isDragging ? (
        <div ref={dragPreview} />
      ) : (
        <div ref={drag} {...collected}>
          ...
        </div>
      )
}

export default Option