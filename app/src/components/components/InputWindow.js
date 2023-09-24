import React from 'react'

function InputWindow() {
  return (
    <div class="flex align-center justify-start">
    <p class="text-white text-start mr-2">Use test Case</p>

    {
      useTestCase?
      <button class="flex bg-white p-1 rounded-[10px] mt-2" onClick={()=>{
        console.log("FALSE TEST")
        setUseTestCase(false)
      }}>
        <div class="bg-green-500 h-[8px] w-[8px] rounded-[8px] "/>
        
      </button>
      :
      <button  class="bg-white p-3 rounded-[10px] h-[10px] w-[10px] mt-2" onClick={()=>{
        console.log("TRUE TEST")
        setUseTestCase(true)
      }}>
        
      </button>
    }
    </div>
  {useParams?

  <div class="flex-col ">
    <div class="flex align-center items-start">
    <select class="bg-white mr-2 rounded-sm p-3 mt-3" onChange={(e)=>{
       setCurrentVariable(prev=>({
        ...prev,
        dataType:e.target.value
      }))
      
    }}>
      <option valiue="String">String</option>
      <option value="int">int</option>
      <option value="boolean">boolean</option>
      <option value="char">char</option>
      <option value="double">double</option>
      <option value="Array">Array</option>
      <option value="Matrix">Matrix</option>
      
    </select>
    {
      currentVariable.dataType=="Array" || currentVariable.dataType=="Matrix"?
    <div class="flex-col">
        <select class="bg-white mr-2 rounded-sm p-3 mt-3"default="String" onChange={(e)=>{
          console.log(currentVariable)
            setCurrentVariable(prev=>({
          ...prev,
          auxDataType:e.target.value
          }))

          setCurrentVariable(prev=>({
            ...prev,
            value:new Array()
            }))
            
          
        }}>
            <option valiue="String">String</option>
              <option value="int">int</option>
              <option value="boolean">boolean</option>
              <option value="char">char</option>
              <option value="double">double</option>
         </select>
         {
          currentVariable.dataType=="Array"?
          <div>
             <input type="number" class=" flex w-2/3 p-3 rounded-sm mt-2" onChange={(e)=>{
                     setCurrentVariable(prev=>({
                      ...prev,
                      arrayLength:Number(e.target.value)
                      }))
            }} placeholder="rows"/>
          </div>
            :
          <div>
          </div>
         }
         {
          currentVariable.dataType=="Matrix"?
          <div class="flex-col">
            <input type="number" class=" flex w-2/3 p-3 rounded-sm mt-2 mr-2" onChange={(e)=>{
                     setCurrentVariable(prev=>({
                      ...prev,
                      arrayLength:Number(e.target.value)
                      }))
                      
                        
            }} placeholder="rows"/>
            <input type="number" class=" flex w-2/3 p-3 rounded-sm mt-2"onChange={(e)=>{
             
                     setCurrentVariable(prev=>({
                      ...prev,
                      arrayHeight:Number(e.target.value)
                      }))
                    const arr=structure
                    console.log("value in cols",arr)
                    var i=Number(e.target.value)
                    while(i>0){
                      arr[i-1]=new Array()
                      i--
                    }
                      setTimeout(()=>{
                        console.log("value",arr)
                        setStructure(arr)

                      },900)
                      
                        
            }} placeholder="columns"/>
          </div>
            :
          <div>
          </div>
         }
     </div>
     :
    <p></p>

    }
    <textarea  class=" flex-col align-center bg-white mr-2 mt-3 rounded-sm text-center grow-0 flex-start" placeholder={"payperdays"}onChange={(e)=>{
      setCurrentVariable(prev=>({
        ...prev,
        name:e.target.value
      }))
      console.log(currentVariable)
    }}/>
   { currentVariable.dataType!="Matrix" && currentVariable.dataType!="Matrix"?
   <textarea row="5" cols="20" class="rounded-sm mt-3" placeholder={"int [] payperdays=[2,4,5,7]"} onChange={(e)=>{
      console.log(e.target.value)
      setCurrentVariable(prev=>({
        ...prev,
        value:e.target.value
      }))

      
    }}/>
    :
    <div></div>
  }
   { currentVariable.dataType=="Matrix" ?
        <div class="flex-col ">
          {Array(currentVariable.arrayLength)
          .fill(0)
          .map((x, idx) => (
            <div class="flex  justify-between m-2 ">
              <p class="text-white p-1  font-bold">{`${"{"}`}</p>
                 {Array(currentVariable.arrayHeight)
                   .fill(0)
                    .map((y, yidx) => (
                      <div class="align-bottom justify-between flex">
                        <input type="number" class="h-[25px] w-[60px] bg-white rounded-sm ml-1 text-center" placeholder={currentVariable.auxDataType=="int"? "0":"ac"} onChange={(e)=>{
                          console.log(structure)
                          console.log(typeof(e.target.value))
                          const arr=structure
                          arr[idx][yidx]=e.target.value
                          
                          setTimeout(()=>{
                            setStructure(arr)

                          },500)
                          
                          
                        }}/>
                        <p class="text-white font-bold m-1">{yidx!=currentVariable.arrayHeight-1? `${" , "}`:``} </p>
                      </div>
                  ))}
                <p class="text-white font-bold p-1">{idx!=currentVariable.arrayLength-1?`${"},"}`:`${"}"}`}</p>
            </div>
          ))}
        </div>
    :
    <div></div>
  }
    <button class="bg-green-500 p-2 mt-3 ml-2 rounded-sm" onClick={()=>{
      console.log(currentVariable)
      console.log(structure)

      if((currentVariable.dataType=="Matrix" || currentVariable.dataType=="Array") &&currentVariable.dataType!=null && currentVariable.name!=null ){
        console.log(params)
        if(params==null){
          setParams([{name:currentVariable.name,datatType:currentVariable.dataType,auxDataType:currentVariable.auxDataType,value:structure}])

        }else{
          setParams(prev=>
            [...prev,{name:currentVariable.name,datatType:currentVariable.dataType,auxDataType:currentVariable.auxDataType,value:structure}]
            
          )
          
        }
      }else{
        console.log("NOT FULL")
      }
    }}>
      <p class="text white font-bold">+</p>
    </button>
    </div>
    <div class="flex m-2">
      {params.length>0?
      <input class="bg-white rounded-sm p-2 mr-2" type="text" placeholder="mergeintervals()" onChange={(e)=>{
        setMethod(e.target.value)
      }}/>
      :
      <p></p>
    }
     {
      method!=null && method.includes("(") && method.includes(")")?
      <p class="text-white">{method.split("(")[0]} {`${"("}`} {params[0].name} {`${")"}`}
      </p>
      :
      <p class="text-white"></p> 
     }
    </div>
    </div>
    :
    <div class="flex">
    <textarea row="5" cols="30" class="rounded-sm mt-3" placeholder={"int [] arr ={1,2,4,5}\n String"} onChange={(e)=>{
      console.log(e.target.value)
     // setTestCase(e.target.value)
    }}/>
    </div>
    
  }
  )
}

export default InputWindow