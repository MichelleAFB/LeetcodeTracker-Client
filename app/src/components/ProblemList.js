import React from 'react'
import { useState,useEffect } from 'react'
//firebase
import { db } from '../firebase/firebase'
import {getDocs,collection,doc,updateDoc} from 'firebase/firestore'
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'
import ProblemListItem from './ProblemListItem'

//outside
import axios from 'axios'
function ProblemList() {

  const[problems,setProblems]=useState()
  const[isLoading,setIsLoading]=useState(false)

  //search options
  const[dataStructure,setDataStructure]=useState()
  const[category,setCategory]=useState()
  const[searchByDataStructure,setSearchByDataStructure]=useState(false)
  const[searchByCategory,setSearchByCategory]=useState(false)
  const[searchByDate,setSearchByDate]=useState(false)
  const[problemBad,setProblemBad]=useState()
  const problemsListCollectionRef=collection(db,"problems")

  useEffect(()=>{

    const dataArr=[]
    const prom=new Promise((resolve,reject)=>{

      const getProblemsList=async()=>{

        //READ DATA
        try{
          const user=JSON.parse(sessionStorage.getItem("user"))
          const userType=JSON.parse(sessionStorage.getItem("userType"))

        const data=await getDocs(problemsListCollectionRef)
        data.docs.map((doc)=>{
          
        
          if(doc.data().userId==user.userId){
           
          console.log(doc.data().title)
          console.log("prompt:"+doc.data().prompt)
         console.log(doc.data().examples)
          
            dataArr.push({problem:doc.data(),id:doc.id})
          } 
        })
        }catch(err){
          console.log(err)
        }
      }
  
      getProblemsList().then(()=>{
        resolve()
      })
      
    })

    prom.then(()=>{
      
     const prom1=new Promise((resolve1,reject1)=>{
      console.log(dataArr)
      sessionStorage.setItem("problems",JSON.stringify(dataArr))
      setFiltered(dataArr)
      setProblems(dataArr)
      resolve1()
     })

     prom1.then(()=>{
      setIsLoading(false)

     })
    })
    

  },[])

  const[searchText,setSearchText]=useState()
  const[search,setSearch]=useState(false)
  const[filtered,setFiltered]=useState()
  

  const handleSearch = (e) => {
    if(e.target.value==null || e.target.value==""){
      const fil=problems
      setFiltered(problems)
    }

    const fil=[]

    const prom = new Promise((resolve,reject) => {
      
    setFiltered([])
    problems.map((ev) => {
     
    
      var str=e.target.value.toUpperCase()
      var evie=ev.problem.title.toUpperCase()
      evie=evie.replace(/ /g,"")
      str=str.replace(/ /g,"")
      console.log(evie)
      console.log(str)
      const evieSplit=evie.split(" ")
      
      
      const eve=ev.problem.title
      console.log("\n\n")
      console.log(eve)
      //console.log(eve)
      console.log(evie.includes(str))
      if(evie.includes(str)){ 
        evieSplit.map((o) => {
          if(o.includes(str)){
            //console.log(evie.includes(str))
          
            console.log("\n\n")
            if(!fil.includes(ev))
            fil.push(ev)
          }
        })
        
      }
    })
    console.log(fil)
      resolve(fil)
    })

    prom.then(() => {
      setFiltered(fil)
      console.log("filtered should be")
      console.log(filtered)
  }).catch(
    console.log("filter not working")
  )   
}
const handleSearchByCategory = (e) => {
  if(e.target.value==null || e.target.value==""){
    const fil=problems
    setFiltered(problems)
  }

  const fil=[]

  const prom = new Promise((resolve,reject) => {
    
  setFiltered([])
  problems.map((ev) => {
   
  
    const str=e.target.value.toUpperCase()
    const evie=ev.problem.category.toUpperCase()
    console.log(evie)
    console.log(str)
    const evieSplit=evie.split(" ")
    console.log(evie)
    
    
    const eve=ev.problem.category
    console.log("\n\n")
    console.log(eve)
    //console.log(eve)
    console.log(evie.includes(str))
    if(evie.includes(str)){ 
      evieSplit.map((o) => {
      
        if(o.includes(str)){
          //console.log(evie.includes(str))
         
          if(!fil.includes(ev))
          fil.push(ev)
          console.log(fil)
        }
      })
      
    }
  })
  console.log(fil)
    resolve(fil)
  })

  prom.then(() => {
    setFiltered(fil)
    console.log("filtered should be")
    console.log(filtered)
}).catch(
  console.log("filter not working")
)   
}

const handleSearchByDataStructure = (e) => {
  if(e.target.value==null || e.target.value=="" ){
    const fil=problems
    setFiltered(problems)
  }

  const fil=[]

  const prom = new Promise((resolve,reject) => {
    
  setFiltered([])
  problems.map((ev) => {
   
  
    const str=e.target.value.toUpperCase()
    const evie=ev.problem.dataStructure.toUpperCase()
    console.log(evie)
    console.log(str)
    const evieSplit=evie.split(" ")
    console.log(evie)
    
    
    const eve=ev.problem.dataStructure
  
    //console.log(eve)
    console.log(evie.includes(str))
    if(evie.includes(str)){ 
      evieSplit.map((o) => {
      
        if(o.includes(str)){
          //console.log(evie.includes(str))
      
          if(!fil.includes(ev))
          fil.push(ev)
          console.log(fil)
        }
      })
      
    }
  })
  console.log(fil)
    resolve(fil)
  })

  prom.then(() => {
    setFiltered(fil)
    console.log("filtered should be")
    console.log(filtered)
}).catch(
  console.log("filter not working")
)   
}

  

   
  function fix(problem1,problem2){
    console.log(problem1.problem.attempts)
    console.log(problem2.attempts)
  }


  if(!isLoading && problems!=null){
    
   if(problems==null){
    setProblems(JSON.parse(sessionStorage.getItem("problems")))
   }

    console.log("search:"+search)
    console.log(filtered)
    console.log("search by DS"+searchByDataStructure)
    console.log("search by category"+searchByCategory)
  return (
    <div class="bg-gray-400  p-3 rounded-md m-5">
      <p class="text-xl text-center font-bold">
        Your Questions
      </p>
      <div class="flex flex-col w-full justify-center "><p class="text-xl text-center font-bold">{problems.length}</p></div>
      <div class="flex p-3 m-3 justify-center">
        <div class="m-2 flex">
          <div class="bg-orange-400 w-[10px] p-3">
           </div>
          <p class="font-bold"> -practiced more than a week ago </p>
        </div>
        <div class="m-2 flex">
          <div class="bg-red-600 w-[10px] p-3">
           </div>
          <p class="font-bold"> -practiced more than 2 week ago </p>
        </div>
      </div>
      
     
      <button class="" onClick={()=>{
        const dataArr=[]
          const getProblemsList=async()=>{

            //READ DATA
            try{
              const user=JSON.parse(sessionStorage.getItem("user"))
              const userType=JSON.parse(sessionStorage.getItem("userType"))
    
            const data=await getDocs(problemsListCollectionRef)
            data.docs.map((doc)=>{
              
             
              if(doc.data().userId==user.userId){
                //console.log(doc.data())
              //console.log(doc.id )
                dataArr.push({problem:doc.data(),id:doc.id})
              } 
            })
            }catch(err){
              console.log(err)
            }
          }
      
          getProblemsList().then(()=>{
            console.log(dataArr)
            var attempts={}
            const allObjects=[]
            dataArr.map((m)=>{
              if(m.problem.title.toUpperCase()=="MERGING INTERVALS"){
                console.log("\n\n")
                console.log(m.problem)
              }
              var index=0
              var at=0
            
             
            })
            console.log(allObjects)

            allObjects.map((o)=>{
              console.log(o.attempts)
              console.log(o.id)

              var washingtonRef = doc(db, "problems", o.id);

       if(o.id=='23uxF9agDVVky2xjeFsX'){
       updateDoc(washingtonRef, {
         attempts: o.problem.attempts,
         title:o.problem.title,
         dataStructure:o.problem.dataStructure,
         category:o.problem.category,
         lastPracticed:o.problem.problem.problem.lastPracticed,
         hints:o.problem.hints,
         no_attempts:o.problem.problem.no_attempts,
         attempts:o.problem.attempts,
         solution:o.problem.solution,
         userId:o.problem.userId,
         
        });
      }
        
              
            })
            
            
          })

      }}>
      </button>
   
      <input type="text" class="p-3 w-full m-2 rounded-md"onFocus={()=>{
        setSearch(true)
      }} onChange={(e)=>{
        if(e.currentTarget.value!=null){
          const prom=new Promise((resolve,reject)=>{
            setSearchText(e.target.data)
            handleSearch(e)
           
            setTimeout(()=>{
              resolve()
            },500)
          })

          prom.then(()=>{
            console.log("search:"+search)
            console.log(filtered)
          })
        }else{
          setSearch(false)
        }
      }}/>
      <div class="flex flex-col mt-2  p-3">
        <div class="flex justify-around">
          {
            searchByDataStructure?<button class="bg-green-600 border-gray-400 p-2 rounded" onClick={()=>{
              setSearchByDataStructure(!searchByDataStructure)
              console.log(search)
              console.log(searchByDataStructure)
            }}>
            <p class="text-white font-bold">Data Structure</p>
          </button>:
          <button  class="bg-gray-200 border-gray-400 p-2 rounded"
          onClick={()=>{
            setSearchByDataStructure(!searchByDataStructure)
            setSearchByCategory(false)
            setSearchByDate(false)

          }}>
            Data Structure
          </button>
          }
            {
            searchByCategory ?<button class="bg-green-600 border-gray-400 p-2 rounded" onClick={()=>{
              setSearchByCategory(!searchByCategory)
            }}>
           <p class="text-white font-bold">Category</p> 
          </button>:
          <button  class="bg-gray-200 border-gray-400 p-2 rounded" onClick={()=>{
            setSearchByCategory(!searchByCategory)
            setSearchByDataStructure(false)
            setSearchByDate(false)
          }}>
              Category
          </button>
          }
                 {
            searchByDate ?<button class="bg-green-600 border-gray-400 p-2 rounded" onClick={()=>{
              setSearchByDate(!searchByDate)
            }}>
           <p class="text-white font-bold">Today</p> 
          </button>:
          <button  class="bg-gray-200 border-gray-400 p-2 rounded" onClick={()=>{
            setSearchByDate(!searchByDate)
            setSearchByCategory(false)
            setSearchByDataStructure(false)
          }}>
              Today
          </button>
          }

        </div>
        <div class="flex flex-col mt-1 justify-center">
       
          {
            searchByCategory && !searchByDataStructure?
            <select
            id='category'
             class=' m-2  w-full text-gray-900 text-sm rounded-md border-l border-gray-100 p-1'
                   onChange={(e)=>{
                     console.log(e.target.value)
                     setCategory(e.target.value)
                    // handleSearchByCategory(e)
                     console.log(filtered)
                   }} >   
               <option value="Display Manipulation" selected>Display Manipulation</option>
               <option value ="Find Sub:X Inside">Find Sub:X Inside</option>
               <option value="Sorting">Sorting</option>
               <option value="String to Number/Number to String">String to Number/Number to String</option>
               <option value="Sliding Window">Sliding Window</option>
               <option value="Recursion">Recursion</option>
               <option value="KSmallest">KSmallest/KBiggest</option>
               <option value="Array Processing">Array Processing</option>
               <option value="Math">Math</option>
               <option value="Traverse">Traverse</option>    
        </select>:
        <div></div>
          }
          {
            searchByDataStructure && !searchByCategory?
            <select
            id='category'
             class=' m-2  w-full text-gray-900 text-sm rounded-md border-l border-gray-100 p-1'
                   onChange={(e)=>{
                     console.log(e.target.value)
                     setDataStructure(e.target.value)
                    // handleSearchByDataStructure(e)
                   }} >   
               <option value="ArrayList" selected>ArrayList</option>
                  <option value ="LinkedList">LinkedList</option>
                  <option value="Array">Array</option>
                  <option value ="Matrix">Matrix</option>
                  <option value ="Hash">Hash</option>
                  <option value ="Stack">Stack</option>
                  <option value ="Matrix">Matrix</option>
                  <option value ="BST">BST</option>
                  <option value ="Graph">Graph</option>
                  <option value="Set">Set</option>
                  <option value ="etc">etc</option>  
        </select>:<div></div>
          }
        </div>
        <div class="flex">
          
        </div>
        
        
      </div>
      {!search&& !searchByCategory && searchByDataStructure&& !searchByDate&&filtered!=null?
         <div class="overflow-y-scroll overflow-hidden h-[60vh] p-4 ">
         { filtered.map((p)=>{
          console.log(p)
          if(p.problem.dataStructure==dataStructure){
           return(<ProblemListItem problem={p}/>)
          }
           })
         }
      </div>:<div></div>

      }
        {!search&& !searchByCategory && !searchByDataStructure&& searchByDate&&filtered!=null?
         <div class="overflow-y-scroll overflow-hidden h-[60vh] p-4 ">
         { filtered.map((p)=>{
          console.log(p)
          const cDate=new Date()
          const currDate=cDate.toString().substring(0,15)
          if(p.problem.lastPracticed.substring(0,15)==currDate){
           return(<ProblemListItem problem={p}/>)
          }
           })
         }
      </div>:<div></div>

      }
      {!search&& searchByCategory && !searchByDataStructure&&!searchByDate&& filtered!=null?
         <div class="overflow-y-scroll overflow-hidden h-[60vh] p-4 ">
         { filtered.map((p)=>{
          console.log(p)
          if(p.problem.category==category){
           return(<ProblemListItem problem={p}/>)
          }
           })
         }
      </div>:<div></div>

      }
      {search&& !searchByCategory && !searchByDataStructure&& !searchByDate&& filtered!=null?
       <div class="overflow-y-scroll overflow-hidden h-[60vh] p-4 ">
       { filtered.map((p)=>{
        console.log(p)
         return(<ProblemListItem problem={p}/>)
         })
       }
    </div>:
    <div></div>
      }
      {
        !search && !searchByCategory && !searchByDataStructure?
        <div class="overflow-y-scroll overflow-hidden h-[60vh] p-4 ">
        {filtered.map((p)=>{
         return(<ProblemListItem problem={p}/>)
        })}
     </div>:
     <div></div> 
      }
      
      
    </div>
  )
} if(!isLoading && problems==null){

  console.log(problems)
return (
  <div class="bg-gray-400 m-2  p-3 rounded-md">
    <div class="overflow-y-scroll overflow-hidden h-[250px]">
     <p class="text-center">No problems yet</p>
  </div>
  </div>
)
}
}


/****
 *   <CardBody>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell head={true}>Date</TableCell>
                  <TableCell head={true}>ID</TableCell>
                  <TableCell head={true}>Status</TableCell>
                  <TableCell head={true}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <Badge color={statusColorMap[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
 */
export default ProblemList