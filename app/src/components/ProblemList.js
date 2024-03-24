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
import { getDoc } from 'firebase/firestore'
//outside
import axios from 'axios'
import ProblemCountMeter from './ProblemCountMeter'
import { useParams } from 'react-router-dom'
import IonIcon from '@reacticons/ionicons'
import { connect } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
function ProblemList({id,reload}) {

  const[problems,setProblems]=useState()
  const[isLoading,setIsLoading]=useState(true)
  
  //search options
  const [ourUser,setOurUser]=useState()
  const[dataStructure,setDataStructure]=useState()
  const[category,setCategory]=useState()
  const[searchByDataStructure,setSearchByDataStructure]=useState(false)
  const[searchByCategory,setSearchByCategory]=useState(false)
  const[searchByDate,setSearchByDate]=useState(false)
  const[problemBad,setProblemBad]=useState()
  const problemsListCollectionRef=collection(db,"problems")
  const[oldest,setOldest]=useState()
  const[oldestIndex,setOldestIndex]=useState(0)

  const[green,setGreen]=useState(false)
  const[orange,setOrange]=useState(false)
  const[red,setRed]=useState(false)
  const[redCount,setRedCount]=useState(0)
  const[greenCount,setGreenCount]=useState(0)
  const[orangeCount,setOrangeCount]=useState(0)
  const dispatch=useDispatch()
  const[full,setFull]=useState()
  const fuller=[]
  const[userDefinedIndex,setUserDefiniedIndex]=useState(false)
  const navigate=useNavigate()
  useEffect(()=>{
    sessionStorage.setItem("green",0)
    sessionStorage.setItem("red",0)
    sessionStorage.setItem("orange",0)
    const dataArr=[]
    const prom=new Promise(async(resolve,reject)=>{
    var RED=0
    var ORANGE=0
    var GREEN=0
    var u=JSON.parse(sessionStorage.getItem("user"))
    const userRef=doc(db,"users",u.userId)
    var use=await getDoc(userRef)
    use=use.data()

    setOurUser(use)

      const getProblemsList=async()=>{

        //READ DATA
        try{
          const titles=[]
          const user=JSON.parse(sessionStorage.getItem("user"))
          const userType=JSON.parse(sessionStorage.getItem("userType"))

        const data=await getDocs(problemsListCollectionRef)
     
        data.docs.map((doc)=>{
          var thing=doc.data()
          const thinger=thing
          thinger.id=doc.id     
              
        
          if(id==null? doc.data().userId==user.userId:doc.data().userId==id){
            titles.push(thing.title) 

            setTimeout(()=>{
             console.log(titles.includes(doc.data().title))
              if(!titles.includes(doc.data().title)){
         
              fuller.push(thinger) 
              }

            },5)
            RED=0;
            ORANGE=0
            GREEN=0
            var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
            "Aug","Sep","Oct","Nov","Dec"];
            var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
            var cDate=new Date()
            var index=1
            var st=doc.data().lastPracticed.seconds !=null?new Date(doc.data().lastPracticed.seconds*1000).toString():doc.data().lastPracticed.split(" ")
          
           
          const currDate=cDate.toString().substring(0,15)
            const startDate=new Date(st[3],monthnum[months.indexOf(st[1])-1],st[2])
            var nextDate=new Date(startDate);
            var nextnext=nextDate.setDate(nextDate.getDate()+1)
            nextDate=new Date(nextnext)
            var index=1;
           
            while(nextDate.toString().substring(0,15)!=currDate && (nextDate<=cDate)){
              var nextnext=nextDate.setDate(nextDate.getDate()+1)
              nextDate=new Date(nextnext)
              index++
           }
           setTimeout(()=>{
            console.log(index)
            if(use.healthyIndex==null){
            if(index<7){
              GREEN=GREEN+1
              sessionStorage.setItem("green",GREEN)
             

            }
            if(index>=7 && index<14){
              ORANGE=ORANGE+1
              sessionStorage.setItem("orange",ORANGE)

            }
            if(index>=14){
              RED=RED+1
              sessionStorage.setItem("red",RED)

            }
            }else{
              
              if(index<=use.healthyIndex.end){
                GREEN=GREEN+1
                sessionStorage.setItem("green",GREEN)
               
  
              }
              if(index>=use.decliningIndex.start && index<use.decliningIndex.end){
                ORANGE=ORANGE+1
                sessionStorage.setItem("orange",ORANGE)
  
              }
              if(index>=use.criticalIndex.start){
                RED=RED+1
                sessionStorage.setItem("red",RED)
  
              }

            }
           },120)
         
         
          
            dataArr.push({problem:doc.data(),id:doc.id})
          } 
        })
        }catch(err){
          console.log(err)
        }
      }
  
      getProblemsList().then(()=>{
       
       // resolve()
        setTimeout(()=>{
          resolve()
        },500)
      })
      
    })

    prom.then(()=>{
      setFull(fuller)
      const r=JSON.parse(sessionStorage.getItem("red"))
      const g=JSON.parse(sessionStorage.getItem("green"))
      const o=JSON.parse(sessionStorage.getItem("orange"))
    
      setGreenCount(g)
      setRedCount(r) 
      setOrangeCount(o)
setTimeout(()=>{


     const prom1=new Promise((resolve1,reject1)=>{
  
      sessionStorage.setItem("problems",JSON.stringify(dataArr))
      setFiltered(dataArr)
      setProblems(dataArr)
      resolve1()
     })

     prom1.then(()=>{
     
      const prom2=new Promise((resolve2,reject2)=>{
    
        resolve2()

      })

      prom2.then(()=>{
        setTimeout(()=>{
          setIsLoading(false)
        },1000)
      })

     })
    },500)

    })
    

  },[reload])

  const[searchText,setSearchText]=useState()
  const[search,setSearch]=useState(false)
  const[filtered,setFiltered]=useState()
  

  const sort=(problems)=>{
    
      const sendProblems=[]
      var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
      "Aug","Sep","Oct","Nov","Dec"];
      var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
    
      problems.map((p)=>{
        var date=Object.keys(p.problem.lastPracticed).length>1?new Date(p.problem.lastPracticed.seconds*1000).toString():p.problem.lastPracticed.split(" ")
  

        date=new Date(date[3],monthnum[months.indexOf(date[1])-1],date[2])
        var dayDate=new Date(date)
        sendProblems.push({id:p.id,last:dayDate})
      })
   
   
  }
  function  myDecoStyle(value) {
  
    return "Rectangle3 w-[43.4px] h-["+value+"px] left-[8.5px] top-[93px] absolute bg-red-500 rounded-b-[15px] border-black border-4";
 }

  async function getIds(){
    const ful=[]
    const getProblemsList=async()=>{

      //READ DATA
      try{
        const title=[]
        const user=JSON.parse(sessionStorage.getItem("user"))
        const userType=JSON.parse(sessionStorage.getItem("userType"))

      const data=await getDocs(problemsListCollectionRef)
   
      data.docs.map((doc)=>{
        //console.log(doc.data())
        var thing=doc.data()
        const thinger=thing
        thinger.id=doc.id     
            
      
        if(doc.data().userId==user.userId){
          title.push(thing.title) 
          console.log(ful)
          setTimeout(()=>{
           // console.log(title)
            ful.push({title:thinger.title,userId:thinger.userId,id:thinger.id}) 
         
          },10)
        
         
        
    
        } 
      })
      }catch(err){
        console.log(err)
      }
      setTimeout(()=>{
        console.log(ful)
        console.log("DIR")
        console.log(ful.slice(0,ful.length/2))
        const p=ful.slice(0,ful.length/3)
        console.log(p[0])
        axios.post("https://leetcodetracker.onrender.com/set-ids",{problems:ful}).then((response)=>{
          console.log(response.data)
        })
        return ful
      },800)
    }

    getProblemsList().then((res)=>{
     console.log(res)
     console.log("DONE")

     // resolve()
      setTimeout(()=>{
        
      },500)
    })

  }
  

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
            if(red){
            console.log("MATCHHHH",ev)
            //console.log(evie.includes(str))
            if(ev.problem.index!=null){
              if(ev.problem.index>=14 ){
                if(!fil.includes(ev))
                 fil.push(ev)
              }
            }
            }else if(green){
              if(ev.problem.index!=null){
                if(ev.problem.index<7){
                  if(!fil.includes(ev))
                   fil.push(ev)
                }
              }

            }else if(orange){
              if(ev.problem.index!=null){
                if(ev.problem.index<=7 && ev.problem.index<14){
                  if(!fil.includes(ev))
                   fil.push(ev)
                }
              }

            }else if(!red && !green && !orange){
              if(!fil.includes(ev)){
                fil.push(ev)
              }

            }
          
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

const handleSearchByRed= () => {
 

  const fil=[]

  const prom = new Promise((resolve,reject) => {
    
  setFiltered([])
  problems.map((ev) => {
   
  
    var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
    "Aug","Sep","Oct","Nov","Dec"];
    var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
    var cDate=new Date()
    var index=1
    var st=ev.problem.lastPracticed.split(" ")
  
   
  const currDate=cDate.toString().substring(0,15)

    const startDate=new Date(st[3],monthnum[months.indexOf(st[1])-1],st[2])
   
    var nextDate=new Date(startDate);
 
    var nextnext=nextDate.setDate(nextDate.getDate()+1)
  
   
    nextDate=new Date(nextnext)
    var index=1;
   
    while(nextDate.toString().substring(0,15)!=currDate && (nextDate<=cDate)){
      var nextnext=nextDate.setDate(nextDate.getDate()+1)
      nextDate=new Date(nextnext)
   
      
      index++
   }
   setTimeout(()=>{
      if(index>14){
        if(searchByCategory){
          if(ev.category==category){
        fil.push(ev) 
          }
        }else if(searchByDataStructure){
          if(ev.dataStructure==dataStructure){
            fil.push(ev) 
              }

        }else if(searchByDate){
          var curr=new Date()
          if(ev.category==curr.toString().substring(0,15)){
            fil.push(ev) 
              }

        }else{
          fil.push(ev)
        }
      }
   },100)
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




const handleSearchByOrange= () => {

  const fil=[]
  const prom = new Promise((resolve,reject) => {
    
  setFiltered([])
  console.log(problems)
  problems.map((ev) => {
   
  
    var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
    "Aug","Sep","Oct","Nov","Dec"];
    var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
    var cDate=new Date()
    var index=1
    var st=ev.problem.lastPracticed.split(" ")
  
   
  const currDate=cDate.toString().substring(0,15)

    const startDate=new Date(st[3],monthnum[months.indexOf(st[1])-1],st[2])
   
    var nextDate=new Date(startDate);
 
    var nextnext=nextDate.setDate(nextDate.getDate()+1)
  
   
    nextDate=new Date(nextnext)
    var index=1;
   
    while(nextDate.toString().substring(0,15)!=currDate && (nextDate<=cDate)){
      var nextnext=nextDate.setDate(nextDate.getDate()+1)
      nextDate=new Date(nextnext)
   
      
      index++
   }
   setTimeout(()=>{
      if(index<14 && index>=7){
        if(searchByCategory){
          if(ev.category==category){
        fil.push(ev) 
          }
        }else if(searchByDataStructure){
          if(ev.dataStructure==dataStructure){
            fil.push(ev) 
              }

        }else if(searchByDate){
          var curr=new Date()
          if(ev.category==curr.toString().substring(0,15)){
            fil.push(ev) 
              }

        }else{
          fil.push(ev)
        }
      }
   },100)
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


const handleSearchByGreen= () => {
 

  const fil=[]

  const prom = new Promise((resolve,reject) => {
    
  setFiltered([])
  problems.map((ev) => {
   
  
    var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
    "Aug","Sep","Oct","Nov","Dec"];
    var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
    var cDate=new Date()
    var index=1
    var st=ev.problem.lastPracticed.split(" ")
  
   
  const currDate=cDate.toString().substring(0,15)

    const startDate=new Date(st[3],monthnum[months.indexOf(st[1])-1],st[2])
   
    var nextDate=new Date(startDate);
 
    var nextnext=nextDate.setDate(nextDate.getDate()+1)
  
   
    nextDate=new Date(nextnext)
    var index=1;
   
    while(nextDate.toString().substring(0,15)!=currDate && (nextDate<=cDate)){
      var nextnext=nextDate.setDate(nextDate.getDate()+1)
      nextDate=new Date(nextnext)
   
      
      index++
   }
   setTimeout(()=>{
      if(index<7){
        if(searchByCategory){
          if(ev.category==category){
        fil.push(ev) 
          }
        }else if(searchByDataStructure){
          if(ev.dataStructure==dataStructure){
            fil.push(ev) 
              }

        }else if(searchByDate){
          var curr=new Date()
          if(ev.category==curr.toString().substring(0,15)){
            fil.push(ev) 
              }

        }else{
          fil.push(ev)
        }
      }
   },100)
  })
  console.log(fil)
    resolve(fil)
  })

  prom.then(() => {
    setFiltered(fil)
    console.log("filtered should be")
    console.log(filtered)
}).catch((err)=>{
  console.log("filter not working",err)

}
)   
}

  

const user=JSON.parse(sessionStorage.getItem("user"))

   
  

  function handleOldest(p,index){
    //console.log("Handling oldest:"+index+" problem:"+p.problem.title)
    if(oldest==null){
      setOldest(p)
      setOldestIndex(index)
    }else{
      if(index>=oldestIndex){
        setOldest(p)
        setOldestIndex(index)
      }
    }
  }

  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  if(isLoading){
    
    return(
      <div class="flex w-full justify-center ">
          <div class="flex-col justify-end  ">
          <div class="loading-spinner"/>
      </div>
    
    </div>
    )
  }
  if(!isLoading && problems!=null){
    sort(problems)

    const redPX= JSON.parse(sessionStorage.getItem("red"))
    
   if(problems==null){
    

    setProblems(JSON.parse(sessionStorage.getItem("problems")))
   }
   
   /*
<button class="p-3 w-1/2 bg-green-400" onClick={()=>{
      sort(problems)
    }}>
      Click
    </button>

   */
  return (
    <div class="bg-gray-400 w-1/2  p-3 z-10">
      <div class="flex w-1/2 justify-end">
        <button class="" onClick={()=>{
          
        }}>
          <IonIcon name="refresh-outline" fill="white" size="medium"/>
        </button>
      </div>
      <p class="text-xl text-center font-bold">
        Your Questions ({problems.length})
      </p>
    
      <p class="text-center font-bold text-md mt-2"> last practiced:</p>
      <div class="flex  justify-around">

        <div class="flex-col mt-2" >
          {green?
          <button class="flex-col p-2 "  onClick={()=>{
            setGreen(false)
          }}>
           <ProblemCountMeter setRed={setRed} setOrange={setOrange} setGreen={setGreen} count={JSON.parse(sessionStorage.getItem("green"))} color={"green"}/>
           <p  class="text-center text-sm font-bold">{" < 7 days ago"}</p>

          </button>
          :
          <button class="flex-col p-2"onClick={()=>{
            const prom=new Promise((resolve,reject)=>{
              handleSearchByGreen()
              setTimeout(()=>{
                  resolve()
              },100)
            })

              prom.then(()=>{
              
              setGreen(true)
              setRed(false)
              setOrange(false)
          
             })
            }}>
           <ProblemCountMeter  count={JSON.parse(sessionStorage.getItem("green"))} color={"green"} />
           {user.decliningIndex!=null?
           <p  class="text-center text-sm font-bold">{` < ${user.decliningIndex.start} days ago`}</p>
           :
           <p  class="text-center text-sm font-bold">{` < 7 days ago`}</p>

           }
           
          </button>

          }
        </div>
        <div class="flex-col mt-2">
        {orange?
          <button class="flex-col p-2 "  onClick={()=>{
            setGreen(false)
          }}>
           <ProblemCountMeter setRed={setRed} setOrange={setOrange} setGreen={setGreen} count={JSON.parse(sessionStorage.getItem("orange"))} color={"orange"}/>
           <p  class="text-center text-xs font-bold">{` < ${user.criticalIndex!=null ?user.criticalIndex.start:"14"}days ago`}</p>
           <p  class="text-center text-xs font-bold">{` > ${user.decliningIndex!=null ?user.criticalIndex.start:"14"} days ago`}</p>
          </button>
          :
          <button class="flex-col p-2"onClick={()=>{
            const prom=new Promise((resolve,reject)=>{
              handleSearchByOrange()
              setTimeout(()=>{
                  resolve()
              },100)
            })

              prom.then(()=>{
              
              setGreen(false)
              setRed(false)
              setOrange(true)
          
             })
            }}>
           <ProblemCountMeter  count={JSON.parse(sessionStorage.getItem("orange"))} color={"orange"} />
           <p  class="text-center text-xs font-bold">{" < 14 days ago"}</p>
           <p  class="text-center text-xs font-bold">{" > 7 days ago"}</p>


          </button>

          }
        </div>
        <div class="mt-2 flex-col">
        {red?
          <button class="flex-col p-2 "  onClick={()=>{
            setRed(false)
          }}>
           <ProblemCountMeter setRed={setRed} setOrange={setOrange} setGreen={setGreen} count={JSON.parse(sessionStorage.getItem("red"))} color={"red"}/>
           <p  class="text-center text-sm font-bold"> ${">14 days ago"}</p>

          </button>
          :
          <button class="flex-col p-2"onClick={()=>{
            const prom=new Promise((resolve,reject)=>{
              handleSearchByRed()
              setTimeout(()=>{
                  resolve()
              },100)
            })

              prom.then(()=>{
              
              setGreen(false)
              setRed(true)
              setOrange(false)
          
             })
            }}>
           <ProblemCountMeter setRed={setRed} setOrange={setOrange} setGreen={setGreen}  count={JSON.parse(sessionStorage.getItem("red"))} color={"red"} />
           <p  class="text-center text-sm font-bold">${" >14 days ago"}</p>
          </button>

          }
        </div>
      </div>
      {
        oldest!=null?
        <p class="text-center"><span class="font-semibold">Most Neglected Question</span>:{oldest.problem.title}</p>
        :
        <p></p>
      }
      <div class="flex justify-center">
        <button class="bg-white p-2 rounded-md m-2 flex w-1/4 justify-center" onClick={()=>{
          setFiltered(problems)
          setGreen(false)
          setOrange(false)
          setRed(false)
          setSearchByCategory(false)
          setSearchByDataStructure(false)
          setSearchByDate(false)
        }}>
           <p class="text-black text-center font-semibold">Reset</p>
         </button>
         <button class="bg-white p-2 rounded-md m-2 flex w-1/4 justify-center" onClick={()=>{
          var position=Math.floor(randomNumber(0,problems.length-1))
          console.log(problems[position])
          if(id==null){
            navigate("/practice/"+problems[position].id+"/"+problems[position].problem.index)
          }else{
            navigate("/practice/"+problems[id].id+"/"+problems[position].problem.index+"/"+id)
          }
        }}>
           <p class="text-black text-center font-semibold">Generate Random Question</p>
         </button>
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
   
      <input type="text" class="p-3 w-full  rounded-md"onFocus={()=>{
        setSearch(true)
      }} onChange={(e)=>{
        if(e.currentTarget.value!=null || e.currentTarget.value.length>0){
          const prom=new Promise((resolve,reject)=>{
            setSearchText(e.target.data)
            handleSearch(e)
           
            setTimeout(()=>{
              resolve()
            },300)
          })

          prom.then(()=>{
            console.log("search:"+search)
            console.log(filtered)
          })
        }else{
          console.log("setting search false")
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

          }
       
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
         <div class="h-screen overflow-y-scroll overflow-hidden bg-gray-400 m-2 p-3 ">
         { filtered.map((p)=>{
          console.log(p)
          if(p.problem.dataStructure==dataStructure){
           return(<ProblemListItem problem={p} handleOldest={handleOldest} id={id==null?null:id}/>)
          }
           })
         }
      </div>:<div></div>

      }
        {!search&& !searchByCategory && !searchByDataStructure&& searchByDate&&filtered!=null?
         <div class="h-screen overflow-y-scroll overflow-hidden bg-gray-400 m-2 p-3">
         { filtered.map((p)=>{
          console.log(p)
          const cDate=new Date()
          const currDate=cDate.toString().substring(0,15)
          if(p.problem.lastPracticed.substring(0,15)==currDate){
           return(<ProblemListItem problem={p} handleOldest={handleOldest} id={id==null?null:id}/>)
          }
           })
         }
      </div>:<div></div>

      }
      {!search&& searchByCategory && !searchByDataStructure&&!searchByDate&& filtered!=null?
         <div class="overflow-y-scroll h-[60vh] overflow-hidden h-screen p-4 ">
         { filtered.map((p)=>{
          console.log(p)
          if(p.problem.category==category){
           return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
          }
           })
         }
      </div>:<div></div>

      }
      {search&& !searchByCategory && !searchByDataStructure&& !searchByDate&& filtered!=null?
       <div class="h-[55vh] overflow-y-scroll overflow-hidden  m-4 p-3">
       { filtered.map((p)=>{
        console.log(p)
         return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
         })
       }
    </div>:
    <div></div>
      }
  
      {
        !search && !searchByCategory && !searchByDataStructure?
        <div class="overflow-y-scroll overflow-hidden h-[60vh] p-4 ">
        {filtered.map((p)=>{
         return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
        })}
     </div>:
     <div></div> 
      }
      
      
    </div>
  )
}if(problems!=null && red && !orange&& !green&& !search&& !searchByCategory && !searchByDataStructure&& !searchByDate&& filtered!=null){
 
    return(<div class="h-[55vh] overflow-y-scroll overflow-hidden bg-gray-400 m-4 p-3">
    { filtered.map((p)=>{
     console.log(p)
      return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
      })
    }
 </div>)
 
}
if(problems!=null && !red && orange && !green&& !search&& !searchByCategory && !searchByDataStructure&& !searchByDate&& filtered!=null){
 
  return(<div class="h-[55vh] overflow-y-scroll overflow-hidden bg-gray-400 m-4 p-3">
  { filtered.map((p)=>{
   console.log(p)
    return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
    })
  }
</div>)

}
if(problems!=null && !red && !orange && green&& !search&& !searchByCategory && !searchByDataStructure&& !searchByDate&& filtered!=null){
 
  return(<div class="h-[55vh] overflow-y-scroll overflow-hidden bg-gray-400 m-4 p-3">
  { filtered.map((p)=>{
   console.log(p)
    return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
    })
  }
</div>)

}
if(problems!=null && !red && !orange && !green&& !search && !searchByCategory && !searchByDataStructure&& !searchByDate&& filtered!=null){
 
  return(<div class="h-[55vh] overflow-y-scroll overflow-hidden bg-gray-400 m-4 p-3">
  { filtered.map((p)=>{
   console.log(p)
    return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
    })
  }
</div>)

}
if(problems!=null && red && !orange && !green&& search && !searchByCategory && !searchByDataStructure&& !searchByDate&& filtered!=null){
 
  return(<div class="h-[55vh] overflow-y-scroll overflow-hidden bg-gray-400 m-4 p-3">
  { filtered.map((p)=>{
   console.log(p)
    return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
    })
  }
</div>)

}else{
  return(<div class="h-[55vh] overflow-y-scroll overflow-hidden bg-gray-400 m-4 p-3">
  { filtered.map((p)=>{
   console.log(p)
    return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
    })
  }
</div>)
}
 if( problems==null){

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


const mapStateToProps = (state, props) => {
  var reload= state.leetcodeProblem.reload

  return {
   reload:reload
  };
};

export default connect(mapStateToProps)(ProblemList)