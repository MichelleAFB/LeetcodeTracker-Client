import React from 'react'
import {useState,useEffect} from 'react'

//outside
import axios from 'axios'
import AllProblemsItem from './AllProblemsItem'
import { connect } from 'react-redux'

function AllProblems() {

  const[isLoading,setIsLoading]=useState()
  const[problems,setProblems]=useState()
  const[filtered,setFiltered]=useState([])
  const[search,setSearch]=useState(false)
  const[url,setUrl]=useState()
  const[useDifficulty,setUseDifficulty]=useState(false)
  const[useFiltered,setUseFiltered]=useState(filtered.length>0?true:false)
  
  const[difficulty,setDifficulty]=useState(null)
  const[searchByCategory,setSearchByCategory]=useState(false)
  const[tags,setTags]=useState()
  const[category,setCategory]=useState(null)
  const[categoryCount,setCategoryCount]=useState()
  const[prevSearch,setPrevSearch]=useState()
  const[searchString,setSearchString]=useState("")
  const[currentList,setCurrentList]=useState()
  const[prevList,setPrevList]=useState()
  useEffect(()=>{
    var fill
   var list=JSON.parse(sessionStorage.getItem("allProblems"))
   var tagList=JSON.parse(sessionStorage.getItem("allTags"))
    setProblems(list)
      setCurrentList(list)
      setTags(tagList)
    const getProblems=async()=>{
      axios.get("http://localhost:3022/problems").then((response)=>{
        sessionStorage.setItem("allProblems",JSON.stringify(response.data.problems))
        sessionStorage.setItem("allTags",JSON.stringify(response.data.tags))
        setProblems(response.data.problems)
        setCurrentList(response.data.problems)
        console.log(response)
        list=response.data.problems
        setTags(response.data.tags)
        setProblems(response.data.problems)
        setCurrentList(response.data.problems)
        fill=response.data.problems
       // setFiltered(response.data.problems)
        
        setTimeout(()=>{
          return response.data.problems
        },1200)
       
   
      
      })
    }

    const prom=new Promise((resolve,reject)=>{
      if(problems==null || tags==null){
        console.log("LIST IS NULL")
        
      getProblems().then((response)=>{
        console.log(list)
        var notSet=problems==null?true:false
        
        var i=0

        //causes chrome overload if allowed to run
        /*
        while(notSet && i<4){
          setTimeout(()=>{
            console.log("NOTSET:"+notSet)
            notSet=problems==null?true:false
            i++
          if(notSet==false|| i>=4){
            resolve(problems)
          }

          },200)
         
      }*/

      
        resolve(response)
      })
    }else{
      setProblems(list)
      setCurrentList(list)
      setTimeout((currentList)=>{
       
        resolve()
      },1000)
    }
    })

    prom.then(()=>{
    
     if(currentList!=null && problems!=null){
      setIsLoading(false)
     }
    })

  },[])
const handleSearch1=(e,input)=>{
  
  
  const fil=input==null || input==""?problems:[]
  //const focus=filtered.length>0?filtered:problems
  const already=[]
  //if last search ==curr search, dont search for 
  // //difficulty hard when filter only holds difficulty orange
  console.log("PREVSEARCH",prevSearch,"CURR SEARCH",e," useFiltered",useFiltered)
  console.log("CATEGORY:"+category+" DIFFICULTY:"+difficulty+ " SEARCH"+input+"\n\n")
  var refreshList=false
if(prevSearch!=null){
  console.log(e)
  if(e.toUpperCase()==prevSearch.toUpperCase())
  console.log(" PREV SEARCH+++CURR SEARCJ",e,prevSearch)
}
  const focus=prevSearch!=null?prevSearch.toUpperCase()==e.toUpperCase()?problems:useFiltered?filtered:problems:problems
  
  if(input==null || input==""){
    
    setCategory(null)
    setFiltered(problems)
  }else{
    setFiltered([])
  }
  const prom = new Promise((resolve,reject) => {
    //setCategory(input)
    var catIndex=0
    
  
    if(e=="CATEGORY"){
      console.log("USE CATEGORY",input+ " "+category,' search'+ search+ " "+searchString+ " searchDifficulty"+ useDifficulty)
     
      while(catIndex<focus.length){
        var p=focus[catIndex]
        var found=p.title.toUpperCase().includes(input.toUpperCase())
       input=input.split("-")[0]
        if(p.tags!=null){
          if(p.tags.length>0){
          
            if(!already.includes(p.title) && p.tags.includes(input)){
              console.log(p.title)
              if(useDifficulty && !search){
               // console.log("NO SEARCH,DIFFICULTY")
                //use diff
                
                if(p.level.toUpperCase()==difficulty.toUpperCase() || p.level.toUpperCase()==input.toUpperCase()){
                  console.log("ADD "+p.title)
                  if(!prevList.includes(p.title) && refreshList==false){
                    refreshList=true
                  }
                  fil.push(p)
                  already.push(p.title)
                
                }
                catIndex++
              }else if(search && !useDifficulty){
                //use search 
                if(found){
                  if(!prevList.includes(p.title) && refreshList==false){
                    refreshList=true
                  }
                  fil.push(p)
                  already.push(p.title)
                }
               // console.log("CATEGORY, SEARCH,NO DIFFICULTY")
                catIndex++
              }else if(useDifficulty && search){
                if(found && (p.level.toUpperCase()==input.toUpperCase() ||  p.level.toUpperCase()==difficulty.toUpperCase())){
                //console.log(" CATEGORY, SEARCH,DIFFICULTY")
                fil.push(p)
                already.push(p.title)
                if(!prevList.includes(p.title) && refreshList==false){
                  refreshList=true
                }
                //use both
                }
               catIndex++
              }else{
                //console.log(" CATEGORY, SEARCH,DIFFICULTY")
                //console.log("ADD "+p.title)
                fil.push(p)
                already.push(p.title)
                if(!prevList.includes(p.title) && refreshList==false){
                  refreshList=true
                }
                catIndex++
    
              }
              if(catIndex>=focus.length){
                resolve(fil)
              }
    
            }else{
              catIndex++
              if(catIndex>=focus.length){
                resolve(fil)
              }
            }
    
          }else{
            console.log(p.title+" has no tags")
            catIndex++
            if(catIndex>=focus.length){
              resolve(fil)
            }
          }
    
        }else{
          catIndex++
          if(catIndex>=focus.length){
            resolve(fil)
          }
        }
      }
    }else if(e=="DIFFICULTY"){
      console.log("USE CATEGORY",input+ " "+category,' search'+ search+ " "+searchString+ " searchDifficulty"+ useDifficulty)

      //console.log("USE DIFFICULTY",input,' search'+ search+ " useCategory"+searchByCategory)
      
      while(catIndex<focus.length){
        var p=focus[catIndex]
        var found=p.title.toUpperCase().includes(input.toUpperCase())

       
         var pDiff=p.level!=null?p.level:p.difficulty!=null?p.difficulty:null
            try{
            if(!already.includes(p.title) && ( p.level.toUpperCase()==input.toUpperCase())){
              console.log("Check",p.title)
             
              if(searchByCategory && !search){
                //use diff
               
               if(p.tags!=null){
                if(p.tags.includes(category)){
                  console.log("CATEGORY,NO SEARCH,DIFFICULTY")
                  console.log("ADD",p.tags,category,p.title)
                  if(!prevList.includes(p.title) && refreshList==false){
                    refreshList=true
                  }
                    fil.push(p)
                    already.push(p.title)
                   
              
                }
              }
             
              }else if(search && !searchByCategory){
                //use search
               // console.log("NO CATEGORY, SEARCH,DIFFICULTY")
               if(found){
                console.log(p.title)
                if(!prevList.includes(p.title) && refreshList==false){
                  refreshList=true
                }
                already.push(p.title)
                fil.push(p)
               }
               catIndex++
              
              }else if(search&& searchByCategory){
                //use both
               // console.log(" CATEGORY, SEARCH,DIFFICULTY")
                if(p.level.toUpperCase()==difficulty.toUpperCase() || p.level.toUpperCase()==input.toUpperCase()){
                  fil.push(p)
                  already.push(p.title)
                  if(!prevList.includes(p.title) && refreshList==false){
                    refreshList=true
                  }
              }
              
            
    
            }else{
              fil.push(p)
              //console.log(" CATEGORY, SEARCH,DIFFICULTY")
                console.log("ADD "+p.title)
                if(!prevList.includes(p.title) && refreshList==false){
                  refreshList=true
                }
              already.push(p.title)
           
            
            }
          }
          catIndex++
        }catch(e){
          console.log("NULL LEVEL")
          catIndex++
          if(catIndex>=focus.length){
            resolve(fil)
          }
        }
        if(catIndex>=focus.length){
          resolve(fil)
        }
      
      
    }
    }else if(e=="SEARCH"){
    //console.log("USE SEARCH ",input,' useDIFFCULTY'+ useDifficulty+ " useCategory"+searchByCategory)
    console.log("USE CATEGORY",input+ " "+category,' search'+ search+ " "+searchString+ " searchDifficulty"+ useDifficulty)

    var inp=input.toUpperCase() 
    
      while(catIndex<focus.length){
        var p=focus[catIndex]
        var values=p.title.toUpperCase().split(" ")
        var found=false
        found=p.title.toUpperCase().includes(inp) ? true :false    
           inp=inp.toUpperCase()
        values.map((v)=>{
          if(v.includes(inp)){
            found=true
          }
        })
   
        if((values.includes(inp) || found==true) && !already.includes(p.title)){
        
        if(!searchByCategory && !useDifficulty){
        
          fil.push(p)
          already.push(p.title)
          
          if(prevList!=null){
          if(!prevList.includes(p.title) && refreshList==false){
            refreshList=true
          }
        }
        

          catIndex++
        }else if(useDifficulty &&!searchByCategory){
       
          try{
            if(p.level.toUpperCase()==difficulty.toUpperCase() || p.level==inp.toUpperCase()){
              console.log(p.title, p.level)
              fil.push(p)
              if(!prevList.includes(p.title) && refreshList==false){
                refreshList=true
              }
              already.push(p.title)
              catIndex++
            }else{
              catIndex++
            }

          }catch(e){
            catIndex++
          }
          
        }else if(searchByCategory && useDifficulty){
          if(p.tags!=null){
            if(p.tags.includes(category)){
              if(p.level!=null){
                if(p.level.toUpperCase()==difficulty.toUpperCase() || p.level.toUpperCase()==input.toUpperCase()){
                  console.log("ADD",p.title)
                  already.push(p.title)
                  if(!prevList.includes(p.title) && refreshList==false){
                    refreshList=true
                  }
                  fil.push(p)
                }
              }

            }

          }
          catIndex++
        }else if(p.tags!=null){
          if(p.tags.includes(category)){
          console.log("ADD "+p.title)
          already.push(p.title)
          if(!prevList.includes(p.title) && refreshList==false){
            refreshList=true
          }
          fil.push(p)
          catIndex++
          }
        }else{
          catIndex++
        }
      }else{
        catIndex++
      }
       // catIndex++
        if(catIndex>=focus.length){
          resolve(fil)
        }
      }
    
    }
    
 
  })

  prom.then((fil)=>{
    console.log("FINISH FIL",fil)
    console.log("REFRESHLIST",refreshList)
    if(fil.length>0 ){
      setPrevList(already)
      setPrevSearch(e)
      setUseFiltered(true)
      setFiltered(fil)
      console.log("filtered should be")
      console.log(filtered)
      }else{
        console.log("\n\n\n DONT REFRESH")
        setUseFiltered(false)
      }
  })

}
  const handleSearch = (e,tag) => {
    if(e.target.value==null || e.target.value==""){
      const fil=problems
      setFiltered(problems)
    }

    const fil=[]

    const prom = new Promise((resolve,reject) => {
      
    setFiltered([])
    problems.map((ev) => {
     
    
      var str=e.target.value.toUpperCase()
      var evie=ev.title.toUpperCase()
      str=str.replace(/ /g,"")
      evie=evie.replace(/ /g,"")
   
      const evieSplit=evie.split(" ")
      
      
      const eve=ev.title
      console.log(ev.tags)
      if(tag==null ){
      if(evie.includes(str)){ 
        evieSplit.map((o) => {
          if(o.includes(str)){
            //console.log(evie.includes(str))
          
          
            if(!fil.includes(ev))
            fil.push(ev)
          }
        })
        
      }
    }else if(tag!=null && tag.length>0){
      if(evie.includes(str) ){ 
        if(ev.tags.includes(tag)){
        evieSplit.map((o) => {
          if(o.includes(str)){
            //console.log(evie.includes(str))
          
          
            if(!fil.includes(ev))
            fil.push(ev)
          }else{
            fil.push(ev)
          }
        })
      }
      }

    }
    })
      resolve(fil)
    })

    prom.then(() => {
      if(fil.length>0){
      setUseFiltered(true)
      setFiltered(fil)
      console.log("filtered should be")
      console.log(filtered)
      }else{
        setUseFiltered(false)
      }
  }).catch(
    console.log("filter not working")
  )   
}
 const already=[]
 const fil=[]

  if(!isLoading &&  problems!=null){
    
  return ( 
    <div class="flex h-screen w-full flex-col border-gray-100 bg-gray-100 border-b-2 rounded-md m-4 p-3 z-auto">
      <p class="text-2xl text-center font-bold">Problems from Leetcode</p>
      <p class="font-bold text-center text-purple-500 text-xl">{currentList.length} Questions</p> 
      <input class="flex bg-white rounded-sm p-2 w-full" onChange={(e)=>{
        setUrl(e.target.value)

      }}/>
      <button class="bg-red-700 p-1" onClick={()=>{
        setUseFiltered(false)
        setSearch(false)
        setSearchByCategory(false)
        setUseDifficulty(false)
      }}>
        <p class="text-white">RESET</p>
      </button>
      <button class="bg-purple-500 p-2 rounded-sm" onClick={()=>{
        axios.post("http://localhost:3022/leetcode-problem-from-url",{url:url}).then((response)=>{
          console.log(response)
        })
      }}>
        <p class="text-white">Find</p>
      </button>
      <input type="text" class="flex w-full p-2 rounded-md" onChange={(e)=>{
         if(e.target.value=="" ||e.target.value.length<2){
          setSearch(false)
         }else{
          setSearch(true)
          setSearchString(e.target.value.toUpperCase())
          handleSearch1("SEARCH",e.target.value)
         }
        
      }}/>
    <div class="flex">
  
 
      <div class="flex-col">
        <div class="flex">
        <div class="flex-col">
        <p class="font-bold">Category:</p>
      <input list="tag-list" class="flex-wifull border-gray-500 rounded-sm m-2" onSelect={(e)=>{
        console.log(e.target.value)
        var v=e.target.value.split("-")
        try{
        if(v[0].length==0){
         // setCategory(null)
          setSearchByCategory(false)

        }else{
          setCategory(v[0])
          console.log(parseInt(v[1]))
          console.log(v[0])
          setSearchByCategory(true)
          setCategoryCount(Number(v[1]))
      
        setTimeout(()=>{
          handleSearch1("CATEGORY",e.target.value)
        },200)
      }
    }catch(e){
     // setCategory(null)
      setSearchByCategory(false)
    }
      }}/>
      <datalist id="tag-list" name="tag-list">
        {
          tags.map((t)=>{
            return(<option value={t.name+"-"+t.count} >{`${t.name}- ${t.count}`}</option>)
          })
        }
      </datalist>
      <div class="flex-col">
            {
              useDifficulty?
              <button class="bg-cyan-700 p-1 h-min" onClick={()=>{
                setUseDifficulty(!useDifficulty)
              }}>
                <p> Use Difficulty</p>
              </button>
              :
              <button class="bg-cyan-500 p-1 h-min" onClick={()=>{
                setUseDifficulty(!useDifficulty)
              }}>
              <p> Use Difficulty</p>
            </button>
            }
      {
        useDifficulty?
        <div class="flex justify-apart w-full">
      
          <label text="Easy"  class="text-green-600 m-2 font-bold">
            Easy
            <input type="radio" name="question" onChange={()=>{
              setDifficulty("EASY")
              handleSearch1("DIFFICULTY","EASY")
            }}/>
             
          </label>
            <label text="Medium" class="text-orange-600 m-2 font-bold">
              Medium
            <input type="radio" name="question" class="text-orange-600" onChange={()=>{
              setDifficulty("MEDIUM")
              handleSearch1("DIFFICULTY","MEDIUM")

            }}/>
               
            </label>
            <label text="Hard" class="text-red-600 m-2 font-bold">
              Hard
              <input type="radio" name="question" onChange={()=>{
              setDifficulty("HARD")
              handleSearch1("DIFFICULTY","HARD")

            }}/>
             
            </label>
      
        
      </div>
      :<div></div>
      }
      </div>
    
      </div>
      </div>
      {useFiltered?
      <p>Question {`Questions length ${filtered.length} CATCOUNT:${categoryCount}`}</p>
      :
      <p class="">{category==null && search==false?`${problems.length} Questions `:  category!=null? `${filtered.length} Questions (${category})- LENGTH:${filtered.length} CATCOUNT:${categoryCount}`:`${filtered.length} Questions -LENGTH:${filtered.length} CATCOUNT:${categoryCount}`}</p>
      }
      </div>
    
     
    </div>
    <p>USE FILTERED {useFiltered?`TRUE`:`FALSE`}</p>
    {useFiltered?
    <div class=" h-full overflow-y-scroll overflow-hidden  z-10 m-4 p-3">
      {
       filtered.map((p)=>{
          return(<AllProblemsItem problem={p}/>)
        })
      }
    </div>
    :
    <div class=" h-full overflow-y-scroll overflow-hidden  z-10 m-4 p-3">
      {
        problems.map((p)=>{
          return(<AllProblemsItem problem={p}/>)
        })
      }
    </div>
  }
    </div>
  )
  }else{
  
    return(
      <div>...problems</div>
    )
  }
}

/*
    {!useFiltered?
    <div>
    {
      !search && !searchByCategory && !useDifficulty?
      <div class=" h-full overflow-y-scroll overflow-hidden  z-10 m-4 p-3">
        {focus.map((p)=>{
          if(p.prompt!=null){
          return(<AllProblemsItem problem={p}/>)
          }
        })}
      </div>
      :
      <div>
     {search || searchByCategory || useDifficulty?
      <div>
        {
          search?
          <div class=" h-full overflow-y-scroll overflow-hidden  z-10 m-4 p-3">
           {
            !useDifficulty && !searchByCategory?
            <div>
            NO USE DIFF + NO USE CATEGORY  && SEARCH
            </div>
            :
            <div>
            {
              useDifficulty && !searchByCategory?
              <div>
                 USE DIFF + NO USE CATEGORY  && SEARCH
              </div>:
              <div>
                {
                  !useDifficulty && searchByCategory?
                  <div>
                     NO USE DIFF +  USE CATEGORY  && SEARCH
                  </div>:
                  <div>
                     USE DIFF +  USE CATEGORY  && SEARCH
                  </div>
                }
              </div>
            }
            </div>
           }
        </div>:
          <div>
            {
              useDifficulty && searchByCategory?
              <div>
                USE DIFF + USE CATEGORY  && NO SEARCH
                {
                  focus.map((p)=>{
                    console.log("cat count"+categoryCount)
                    if(already.includes(p.title) && p.tags.includes(category) && p.level.toUpperCase()==difficulty){
                      console.log(p.title)
                      already.push(p.title)
                      fil.push(p)
                      return(<AllProblemsItem problem={p}/>)
                    }
                  })

                }
                
              </div>
              :
              <div>
                {
                  useDifficulty && !searchByCategory?
                  <div>
                    useDifficulty && NO searchByCategory  && NO SEARCH
                  </div>
                  :
                  <div>
                     {
                  !useDifficulty && searchByCategory?
                  <div>
                    NO useDifficulty && searchByCategory  && NO SEARCH
                  </div>
                  :
                  <div>
                      NO useDifficulty && NO searchByCategory && NO SEARCH
                     {problems.map((p)=>{
                      if(p.prompt!=null){
                      return(<AllProblemsItem problem={p}/>)
                      }
                    })}

                  </div>
                }
                    </div>
                }
              </div>
            }
          </div>
        }
      </div>
      :
      <div>
      </div>
      }
      </div>
      
      
    }
    </div>
    :
    <div>
      !search && !searchByCategory && !useDifficulty?
<div class=" h-full overflow-y-scroll overflow-hidden  z-10 m-4 p-3">
  {focus.map((p)=>{
    if(p.prompt!=null){
    return(<AllProblemsItem problem={p}/>)
    }
  })}
</div>
:
<div>
{search || searchByCategory || useDifficulty?
<div>
  {
    search?
    <div class=" h-full overflow-y-scroll overflow-hidden  z-10 m-4 p-3">
     {
      !useDifficulty && !searchByCategory?
      <div>
      NO USE DIFF + NO USE CATEGORY  && SEARCH
      </div>
      :
      <div>
      {
        useDifficulty && !searchByCategory?
        <div>
           USE DIFF + NO USE CATEGORY  && SEARCH
        </div>:
        <div>
          {
            !useDifficulty && searchByCategory?
            <div>
               NO USE DIFF +  USE CATEGORY  && SEARCH
            </div>:
            <div>
               USE DIFF +  USE CATEGORY  && SEARCH
            </div>
          }
        </div>
      }
      </div>
     }
  </div>:
    <div>
      {
        useDifficulty && searchByCategory?
        <div>
          USE DIFF + USE CATEGORY  && NO SEARCH
          {
            focus.map((p)=>{
              console.log("cat count"+categoryCount)
              if(already.includes(p.title) && p.tags.includes(category) && p.level.toUpperCase()==difficulty){
                console.log(p.title)
                already.push(p.title)
                fil.push(p)
                return(<AllProblemsItem problem={p}/>)
              }
            })

          }
          
        </div>
        :
        <div>
          {
            useDifficulty && !searchByCategory?
            <div>
              useDifficulty && NO searchByCategory  && NO SEARCH
              {focus.map((p)=>{
                if(p.prompt!=null){
                try{
                  if(!already.includes(p.title) && p.level.toUpperCase()==difficulty.toUpperCase()){
                    already.push(p.title)
                    fil.push(p)
                return(<AllProblemsItem problem={p}/>)
                  }
                }catch(e){
                  console.log(e,p.level)
                }
                }
              })}
            </div>
            :
            <div>
               {
            !useDifficulty && searchByCategory?
            <div>
              NO useDifficulty && searchByCategory  && NO SEARCH
              {focus.map((p)=>{
                if(p.prompt!=null){
                  if(!already.includes(p.title) && p.tags.includes(category)){
                    console.log(p.title)
                    already.push(p.title)
                    fil.push(p)
                return(<AllProblemsItem problem={p}/>)
                  }
                }
              })}
            </div>
            :
            <div>
                NO useDifficulty && NO searchByCategory && NO SEARCH
               {focus.map((p)=>{
                if(p.prompt!=null){
                return(<AllProblemsItem problem={p}/>)
                }
              })}

            </div>
          }
              </div>
          }
        </div>
      }
    </div>
  }
</div>
:
<div>
</div>
}
</div>
    </div>
  }

*/

export default AllProblems