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
  const[prArr,setProbArr]=useState()
  //search options
  const [ourUser,setOurUser]=useState()
  const[dataStructure,setDataStructure]=useState()
  const[category,setCategory]=useState()
  const[searchByDataStructure,setSearchByDataStructure]=useState(false)
  const[searchByCategory,setSearchByCategory]=useState(false)
  const[searchByDate,setSearchByDate]=useState(false)
  const[byAddDate,setOrderByAddDate]=useState(false)
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
  const[orderedByAddProblems,setOrderedByAddProblems]=useState()
  const navigate=useNavigate()
  var dateObje={
    "Jan":"01",
    "Feb":"02",
    "Mar":"03",
    "Apr":"04",
    "May":"05",
    "Jun":"06",
    "Jul":"07",
    "Aug":"08",
    "Sep":"09",
    "Oct":"10",
    "Nov":"11",
    "Dec":"12"
  }
  useEffect(()=>{
    sessionStorage.setItem("green",0)
    sessionStorage.setItem("red",0)
    sessionStorage.setItem("orange",0)
    const dataArr=[]
    const pbs=[]
    const prom=new Promise(async(resolve,reject)=>{
    var RED=0
    var ORANGE=0
    var GREEN=0
    var u=JSON.parse(sessionStorage.getItem("user"))
    const userRef=doc(db,"users",u.userId)
    var use=await getDoc(userRef)
    use=use.data()

    setOurUser(use)

      const getProblemsList=async(pbs,i)=>{

        //READ DATA
        try{
          const titles=[]
          const user=JSON.parse(sessionStorage.getItem("user"))
          const userType=JSON.parse(sessionStorage.getItem("userType"))

        const data=await getDocs(problemsListCollectionRef)
    
        data.docs.map(async(d)=>{
          var thing=d.data()
          if(typeof thing.lastPracticed=="string"){
            console.log("\n\n",thing.title," ",thing.lastPracticed)
            var date=thing.lastPracticed.split(" ")
            var month=parseInt(dateObje[date[1]],10)-1
            var day=parseInt(date[2])
            var year=parseInt(date[3])
            date=new Date(year,month,day)
            console.log(date)
            console.log(date.getTime())
         
            const problemRef=doc(db,"problems",d.id)
            await updateDoc(problemRef,{
             lastPracticed:date
            }).then(()=>{
              console.log(doc(db,"problems",d.id))
            })


            console.log("STRING DATE")
          }else{
            //console.log("TIMES",new Date(d.data().lastPracticed.seconds*1000))
          }
        
          const thinger=thing
          thinger.id=doc.id   
          
              
        
          if(id==null? d.data().userId==user.userId:d.data().userId==id){
        
            titles.push(thing.title) 
            try{
            if(i<data.docs.length){
              pbs.push({id:d.id,title:thing.title,time:thing.createdAt})  
              i++
            }
            }catch(e){
              console.log(e)
            }
              

            setTimeout(()=>{
             console.log(titles.includes(d.data().title))
              if(!titles.includes(d.data().title)){
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
            var st=d.data().lastPracticed.seconds !=null?new Date(d.data().lastPracticed.seconds*1000).toString():d.data().lastPracticed.split(" ")
          
           
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
          
            dataArr.push({problem:d.data(),id:d.id})
          }else if(d.data().title=="Longest Common Subsequence"){
            console.log("\n\n\nPROBLEM with "+thing.title+ " "+d.data().userId)
            console.log(d.data(),"\n\n")
          } 
        })
        }catch(err){
          console.log(err)
        }
      }
      var i=0
      getProblemsList(pbs,i).then(()=>{
       
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
      setProbArr(pbs)
      setFiltered(dataArr)
      setProblems(dataArr)
      setTimeout(()=>{
        resolve1()
      },200)
      
     })

     prom1.then(()=>{
     
      const prom2=new Promise((resolve2,reject2)=>{
    
        resolve2()

      })

      prom2.then(()=>{
        setTimeout(()=>{
          setIsLoading(false)
        },500)
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
  
        const p=ful.slice(0,ful.length/3)
        console.log(p[0])
        axios.post("https://leetcodetracker.onrender.com/set-ids",{problems:ful}).then((response)=>{
          console.log(response.data)
        })
        return ful
      },800)
    }

    getProblemsList().then((res)=>{
   

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
    const already=[]
    const prom = new Promise((resolve,reject) => {
      
    setFiltered([])
    
    problems.map((ev) => {
     
    
      var str=e.target.value.toUpperCase()
      var evie=ev.problem.title.toUpperCase()
      evie=evie.replace(/ /g,"")
      str=str.replace(/ /g,"")
      //console.log(evie)
      //console.log(str)
      const evieSplit=evie.split(" ")
      
      
      const eve=ev.problem.title
      //console.log("\n\n")
      //console.log(eve)
      //console.log(eve)
      //console.log(evie.includes(str))
      if(evie.includes(str)){ 
        evieSplit.map((o) => {
          if(o.includes(str)){
            if(!already.includes(eve)){
              console.log("ADD "+eve)
              already.push(eve)
              fil.push(ev)
            }
            /*
            console.log("MATCH",ev.problem.title)
            if(red && !orange && !green){
              console.log("RED")
            console.log("MATCHHHH",ev)
            //console.log(evie.includes(str))
            if(ev.problem.index!=null){
              if(ev.problem.index>=14 ){
                if(!fil.includes(ev))
                 fil.push(ev)
              }
            }
            }else if(green && !red && !orange){
              if(ev.problem.index!=null){
                if(ev.problem.index<7){
                  if(!fil.includes(ev))
                   fil.push(ev)
                }
              }

            }else if(orange && !green && !red){
              if(ev.problem.index!=null){
                if(ev.problem.index<=7 && ev.problem.index<14){
                  if(!fil.includes(ev))
                   fil.push(ev)
                }
              }

            }else if(red){
              if(ev.problem.index!=null){
                if( ev.problem.index>=14){
                  if(!fil.includes(ev))
                   fil.push(ev)
                }
              }

            }else if(!red && !green && !orange){
              if(!already.includes(eve)){
                console.log("ADD "+eve)
                fil.push(ev)
              }

            }*/
          
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
    console.log(problems.length)
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
function indexOfItem(arr,a){
  console.log(a)
  var i=0
  while(i<arr.length){
    var val=Object.keys(a)
    var j=0
    while(j<val.length){
      if(val[j]==arr[i])
     
      j++
    }
    i++
  }
}
function daysBetween(date1, date2) {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}
const orderByAddDate = () => {

   // const fil=problems
   // setFiltered(problems)
  

  const fil=[]
 const newProbs=[]
  const prom = new Promise((resolve,reject) => {
    
 // setFiltered([])
 var i=0
 while(i<problems.length){
   var u=problems.reduce((a,b) => {
    try{
      if(a.problem!=null && b.problem!=null){
    console.log("a: "+a.problem.createdAt.toDate())
    console.log( "b: "+b.problem.createdAt.toDate())
    indexOfItem(problems,a.problem)
    indexOfItem(problems,b.problem)
   if(a.problem.createdAt.toDate()<b.problem.createdAt.toDate()){
   
    indexOfItem(problems,a.problem)
    return a.toDate()
   }else {
    indexOfItem(problems,b.problem)

    return b.toDate()
   }
  }else{
    return a
  }
  }catch(e){
    console.log(a,b)
    return b
  }
   
  })
 //newProbs.append(u)
   
  i++
  if(i>=problems.length){
    resolve()
   }
}
  console.log(newProbs)
   // resolve(fil)
  })

  prom.then(() => {
   // setFiltered(fil)
    console.log("filtered should be")
    console.log(newProbs)
}).catch(
  console.log("filter not working")
)   
}

const handleSearchByRed= () => {
 console.log("\n\nsearch red")

  const fil=[]
var i=0
  const prom = new Promise((resolve,reject) => {
    
  setFiltered([])
  var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
    "Aug","Sep","Oct","Nov","Dec"];
    var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
    var cDate=new Date()
    while(i<problems.length){
  
   
 var  ev=problems[i]
 if(ev.problem.lastPracticed!=null){
  
    var index=1
    if(typeof ev.problem.lastPracticed == 'string'){
     
      
    var st=ev.problem.lastPracticed.split(" ")
  
   
  const currDate=cDate.toString().substring(0,15)

    const startDate=new Date(st[3],monthnum[months.indexOf(st[1])-1],st[2])
   
  
   
    var index=daysBetween(startDate,new Date())
    console.log("NUMDAYS",index)
    
  
    

      if(index>=14){
        console.log(ev.problem.title + "RED",ev.problem.lastPracticed)
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
 
 
  }else{
    const currDate=cDate.toString().substring(0,15)

    const startDate=new Date(ev.problem.lastPracticed.seconds*1000)
    
    var index=daysBetween(startDate,new Date())
   console.log("NUMDAYS",index)
   
    console.log(ev.problem.title + "RED",ev.problem.lastPracticed)
      if(index>=14){
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
 

  } 
  }
  i++
  if(i>=problems.length){
    console.log("FILL",fil)
    resolve(fil)
  }

    }
  
   // resolve(fil)
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

  console.log("\n\nserach red")

  const fil=[]
var i=0
  const prom = new Promise((resolve,reject) => {
    
  setFiltered([])
  var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
    "Aug","Sep","Oct","Nov","Dec"];
    var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
    var cDate=new Date()
    while(i<problems.length){
  
   
 var  ev=problems[i]
 if(ev.problem.lastPracticed!=null){
 
    var index=1
    if(ev.problem.lastPracticed!=null){

    var currDate=new Date(ev.problem.lastPracticed.seconds*1000)
    const startDate=new Date(ev.problem.lastPracticed.seconds*1000)
   
  
    var index=daysBetween(startDate,new Date());
    
  
   
      if(index<14 && index>=7){
        console.log(ev.problem.title+"\nnumDays",index)
        console.log(ev.problem.title + "ORANGE",ev.problem.lastPracticed)
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
   

  } 
  }
  i++
  if(i>=problems.length){
    var prob=JSON.parse(sessionStorage.getItem("problems"))
    if(prob==null){
    sessionStorage.setItem("problems",JSON.stringify(fil))
    }
    console.log("FILL",fil)
    resolve(fil)
  }

   
}
  
   // resolve(fil)
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
 
  console.log("\n\nserach GREEN")

  const fil=[]
var i=0
  const prom = new Promise((resolve,reject) => {
    
  setFiltered([])
  var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
    "Aug","Sep","Oct","Nov","Dec"];
    var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
    var cDate=new Date()
    while(i<problems.length){
  
   
 var  ev=problems[i]
 if(ev.problem.lastPracticed!=null){
  
    var index=1
    if(typeof ev.problem.lastPracticed == 'string'){
      
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
        console.log(ev.problem.title + "GREEN",ev.problem.lastPracticed)
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
 
  }else{
    console.log("OBJECT DATE",ev.problem.lastPracticed)
    var currDate=new Date(ev.problem.lastPracticed.seconds/1000)
    var nextnext=nextDate.setDate(nextDate.getDate()+1)
  
   
    nextDate=new Date(nextnext)
    var index=1;
   
   setTimeout(()=>{
      if(index<7){
        console.log(ev.problem.title + "GREEN",ev.problem.lastPracticed)
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

  } 
  }
  i++
  if(i>=problems.length){
    console.log("FILL",fil)
    resolve(fil)
  }

    }
  
   // resolve(fil)
  })

  prom.then(() => {
    setFiltered(fil)
    console.log("filtered should be")
    console.log(filtered)
}).catch(
  console.log("filter not working")
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
  function indexOfProblem(problems,a,ids){
    var i=0
    var found=false
    while(i<problems.length && found==false){
      
      try{
      var check=problems[i]
      
      if(check.id==a.id && !ids.includes(a.id)){
        console.log(check.id," a"+a.problem.createdAt.toDate())
        found=true
        i++
        return i
      }else{
        i++
      }
    }catch(e){
    //  console.log(e)
      i++
    }
      
      if(i>=problems.length){
        return null
      }

      

    }
  }
  const ids=[]
  async function doit(problems,ids){
    const probs=await orderByAdded(problems,ids)
  }
  function orderByAdded(problems,ids){
    const probs=[]
   
    const oldProbs=problems
    var j=0
    var oLength=problems.length
    const badOnes=[]
    while( j<problems.length){
      if(j>=oLength-2){
        return probs
      }
 var u=oldProbs.reduce((a,b)=>{
  try{
   
    if(a!=null && b!=null){
  if(a.problem.createdAt!=null && b.problem.createdAt!=null){
    console.log("GOOD")
    if(a.problem.createdAt.toDate()<b.problem.createdAt.toDate()){
      console.log("a less")
         probs.push({title:a.problem.title,time:a.problem.createdAt.toDate().toString()})
      var index=indexOfProblem(oldProbs,a.ids)
      index=index==null?j:index
      ids.push(oldProbs[index])
      oldProbs.splice(index,1)
      j++
      return a
    }else{
      console.log("b less")
         probs.push({title:b.problem.title,time:b.problem.createdAt.toDate().toString()})
      var index=indexOfProblem(oldProbs,b,ids)
    index=index==null?j:index
    ids.push(oldProbs[index])
     oldProbs.splice(index,1)
     
    
      j++
      return b
    }
    

  }else if(a.problem.createdAt==null && b.problem.createdAt!=null){
       probs.push({title:b.problem.title,time:b.problem.createdAt.toDate().toString()})
    var index=indexOfProblem(oldProbs,b,ids)
    index=index==null?j:index
    ids.push(oldProbs[index])
   oldProbs.splice(index,1)
  
    j++
    return b


  }else if(a.problem.createdAt!=null && b.problem.createdAt==null){
       probs.push({title:a.problem.title,time:a.problem.createdAt.toDate().toString()})
    var index=indexOfProblem(oldProbs,a,ids)
    index=index==null?j:index
    ids.push(oldProbs[index])
   oldProbs.splice(index,1)
    j++
    return a
    
    
  }else{
       probs.push({title:a.problem.title,time:a.problem.createdAt.toDate().toString()})
    var index=indexOfProblem(oldProbs,a,ids)
    index=index==null?j:index
    ids.push(oldProbs[index])
oldProbs.splice(index,1)
    j++
    return a
    

  }
}else if(a==null && b!=null){
  console.log("ANULL")
  badOnes.push(a)
  var index=indexOfProblem(oldProbs,b,ids)
  index=index==null?j:index
  ids.push(oldProbs[index])
  oldProbs.splice(index,1)
  j++
  return b
}else if(a!=null && b==null){
  console.log("BNULL")
  badOnes.push(b)
  var index=indexOfProblem(oldProbs,a,ids)
  index=index==null?j:index
  ids.push(oldProbs[index])
  oldProbs.splice(index,1)
  j++
}else{
  console.log("A and B NULL")
  badOnes.push(a)
  badOnes.push(b)
  j++
}
}catch(e){
 // console.log("\n\n",e)
  try{
  console.log("a",Object.keys(a)," ",a.problem.createdAt,"\n\n")
  console.log("b",Object.keys(b)," ",b.problem.createdAt,"\n\n")
  
  }catch(e){
    try{
    console.log("bad",a.problem)
    console.log("BAD b",b.problem)
    if(a==null){
      const index = oldProbs.findIndex((p) => p.id === a.id);
      console.log("SPLICE",a)

    }
    
  }catch(e){
    if(probs.length>=oLength-10){
      console.log("POPO",probs)
      setOrderedByAddProblems(probs)
      j=problems.length
    }

  }

  }
 // j++
 
}
console.log(j)
console.log("plength",probs.length)
if(probs.length>=oLength-10){ 
  console.log("\n\n\n\nFINISHED",probs)
 // j++
}
 })
  probs.push(u.problem.createdAt)
  console.log("oldprobs length",oldProbs.length)
  console.log(oldProbs)
  console.log("probs length",probs.length)
  console.log(probs)
  console.log(j)
  while(probs.length<oLength){
  setTimeout(async()=>{
    if(probs.length>=oLength-10){
      console.log("POO",probs)
      setOrderedByAddProblems(probs)
      j=problems.length
    }

  },2500)
}
 
    }
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
   if(orderedByAddProblems==null){
  //  orderByAdded(problems)
   }
  
    var months= ["Jan","Feb","Mar","Apr","May","Jun","Jul",
      "Aug","Sep","Oct","Nov","Dec"];
      var monthnum=["01","02","03","04","05","06","07","08","09","10","11","12"]
  return (
    <div class="bg-gray-400   p-3 z-10">
      <div class="flex w-1/2 justify-end">
        <button class="" onClick={()=>{
          
        }}>
          <IonIcon name="refresh-outline" fill="white" size="medium"/>
        </button>
      </div>
      <p class="text-xl text-center font-bold">
        Your Questions ({problems.length})
      </p>
    <button class="bg-green-600 p-3 " onClick={async()=>{
         const data=await getDocs(problemsListCollectionRef)
     
    console.log(data)
  
         data.docs.map((dod)=>{
           //var thing=doc
          var thing=dod.data()
          const  ref=doc(db,"problems",dod.id)
          //console.log(ref)
          
           var attempts=thing.attempts
           if(thing.createdAt==null || !(thing.createdAt.toDate() instanceof Date)){
           var date=null
           var i=0
           console.log("\n\nFIrst",attempts[0].date+"\n")
           attempts.map(async(a)=>{
            var d=a.date
            console.log(d)
            if(d.length>2){
              d=d.split(" ")
             // console.log(d)
              var ndate=new Date(d[3],monthnum[months.indexOf(d[1])-1],d[2])
             // console.log(ndate)
              date= (date==null? ndate:(ndate<date?ndate:date))
              if (date==null){
                if(! ndate instanceof Date){
  
                }else{
                  date=ndate
                }
              }else{
                if(! ndate instanceof Date){
  
                }else{
                  if(ndate<date){
                  date=ndate
                  }
                }
  
              }
              i++
              if(i>=attempts.length){
                console.log("FINAL DATE:",date.toString()+" for problem "+thing.title)
                try{
                  await updateDoc(ref,{
                    createdAt:date
                  })
                 
                }catch(err){
                  console.log(err)
                }
                
              }
            }else{
              i++
              if(i>=attempts.length){
                console.log("FINAL DATE:",date.toString()+" for problem "+thing.title)
                try{
                 await updateDoc(ref,{
                    createdAt:date
                  })
                 
                }catch(err){
                  console.log(err)
                }
              }
            }
  
           })
          }else {
            console.log(thing.title,thing.createdAt.toDate())
          }
         })
  
    }}>
      <p class="text-white">Generate CreatedAt</p>
    </button>
    <button class="bg-pink-400 p-2" onClick={()=>{
      const ids=[]
      console.log(prArr)
      axios.post("http://localhost:3022/sorted-by-added",{problems:prArr}).then((response)=>{
        console.log(response)
      })
    }}>
      <p>fire FInd</p>
    </button>
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
            setOrange(false)
            //setRed(false)
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
          var position=Math.floor(randomNumber(0,filtered.length>0?filtered.length-1:problems.length-1))
          console.log(problems[position])
          if(id==null){
            navigate("/practice/"+problems[position].id+"/"+(filtered.length>0?filtered[position].problem.index:problems[position].problem.index))
          }else{
            navigate("/practice/"+problems[id].id+"/"+(filtered.length>0?filtered[position].problem.index:problems[position].problem.index)+"/"+id)
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
                console.log(doc.data().userId,doc.data().title)
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
             
              var index=0
              var at=0
            
             
            })
            console.log(allObjects)
  
            allObjects.map((o)=>{
     
  
              var washingtonRef = doc(db, "problems", o.id);
  
       
        
              
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
            byAddDate?<button class="bg-green-600 border-gray-400 p-2 rounded" onClick={()=>{
             setOrderByAddDate(!byAddDate)
             orderByAddDate()
              console.log(search)
              console.log(searchByDataStructure)
            }}>
            <p class="text-white font-bold">Add Date</p>
          </button>:
          <button  class="bg-gray-200 border-gray-400 p-2 rounded"
          onClick={()=>{
            orderByAddDate()
           /* setOrderByAddDate(!byAddDate)
            setSearchByDataStructure(false)
            setSearchByCategory(false)
            setSearchByDate(false)*/
  
          }}>
           Add Date
          </button>
          }
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
         <div class="h-screen overflow-y-scroll overflow-hidden bg-purple-400 m-2 p-3 ">
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
          try{
          if(p.problem.lastPracticed.substring(0,15)==currDate){
           return(<ProblemListItem problem={p} handleOldest={handleOldest} id={id==null?null:id}/>)
          }
        }catch(e){
          try{
          console.log(Object.keys(p.problem.lastPracticed))
         var last=new Date(p.problem.lastPracticed.seconds*1000)
          if(last.toString().substring(0,15)==currDate.toString().substring(0,15)){
          return(<ProblemListItem problem={p} handleOldest={handleOldest} id={id==null?null:id}/>)
          }
        }catch(e){
          console.log("TODAY FILTER ERR",e)
        }
        }
           })
         }
      </div>:<div></div>
  
      }
      {!search&& searchByCategory && !searchByDataStructure&&!searchByDate&& filtered!=null?
         <div class="overflow-y-scroll h-[60vh] overflow-hidden bg-pink-400 h-screen p-4 ">
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
       <div class="h-[55vh] overflow-y-scroll overflow-hidden bg-orange-400  m-4 p-3">
       { filtered.map((p)=>{
        console.log(p)
         return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
         })
       }
    </div>:
    <div></div>
      }
  
      {
        !search && !searchByCategory && !searchByDataStructure && !searchByDate?
        <div class="overflow-y-scroll overflow-hidden  h-[60vh] p-4 ">
        {filtered.map((p)=>{
         return(<ProblemListItem id={id==null?null:id} problem={p} green={green} orange={orange} red={red} setRed={setRed} setGreen={setGreen} setOrange={setOrange} handleOldest={handleOldest}/>)
        })}
     </div>:
     <div></div> 
      }
      
      
    </div>
  )
  
  }/*if(problems!=null && red && !orange&& !green&& !search&& !searchByCategory && !searchByDataStructure&& !searchByDate&& filtered!=null){
  
    return(<div class="h-[55vh] overflow-y-scroll overflow-hidden bg-gray-400 m-4 p-3">
    { filtered.map((p)=>{
      console.log("\n\nREDDD")
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
  }*/
 if( problems==null){

  console.log(problems)
return (
  <div class="bg-gray-400 m-2  p-3 rounded-md">
    <div class="overflow-y-scroll overflow-hidden h-[250px]">
     <p class="text-center">No problems yet</p>
  </div>
  </div>
)
}else{
  return(<p>hi</p>)
}

}


const mapStateToProps = (state, props) => {
  var reload= state.leetcodeProblem.reload

  return {
   reload:reload
  };
};

export default connect(mapStateToProps)(ProblemList)