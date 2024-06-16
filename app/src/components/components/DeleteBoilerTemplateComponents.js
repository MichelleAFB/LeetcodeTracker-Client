import IonIcon from '@reacticons/ionicons'
import React, { useEffect, useState } from 'react'

function DeleteBoilerTemplateComponents({onClick,option,template,valid}) {
    const [show,setShow]=useState(true)
    console.log("selected",template.title)
  return (

    <option class="flex justify-apart bg-blue-500" value={template.template} onClick={()=>{
        onClick()
    }}>
        <p class="text-blue-500">{template.title}</p>
        
        <button onClick={()=>{
            console.log("REMOVING "+template.title)
        }}>
            <IonIcon name="close-outline"></IonIcon>
        </button>
        </option>
  )
}

export default DeleteBoilerTemplateComponents