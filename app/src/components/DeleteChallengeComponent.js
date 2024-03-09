import { doc,collection, getDocs,deleteDoc,updateDoc, Firestore } from 'firebase/firestore'
import React from 'react'
import { db } from '../firebase/firebase'
import { useEffect,useState } from 'react'
import axios from 'axios'
function DeleteChallengeComponent({challenge}) {

  const[isLoading,setIsLoading]=useState(true)
  const[key,setKey]=useState()
  
  
  useEffect(()=>{

    const ref=collection(db,"users")
   
    var length
    const user=JSON.parse(sessionStorage.getItem("user"))
    challenge.userId=user.userId
    var arr=[]
    var allChallenges
    var matched=false
    var foundKey
    const prom=new Promise(async(resolve,reject)=>{
      const data=await getDocs(ref)
      data.docs.map((d)=>{
        const data=d.data()
        
        if(data.userId==user.userId){
          length=data.challenges!=null && data.challenges.length>0?data.challenges.length:0

          if(data.challenges!=null && data.challenges.length>0 ){
          length=data.challenges!=null && data.challenges.length>0?data.challenges.length:0
          allChallenges=data.challenges
            data.challenges.map((c)=>{
              
              if(c.title==challenge.title){
                  foundKey=data.challenges.indexOf(c)
                  if(data.challenges!=null && data.challenges.length>0)   
                  {
                    data.challenges.map((c)=>{
                      if(c.title==challenge.title && c.userId==user.userId){
                     
                        matched=true
                      }
                    })

                  }else{
                  
                  } 
              }
            })
          }else{
            console.log("\n\nNO CHALLENGES")
           
  
          }
        }
      })
      setTimeout(()=>{
        resolve()
      },500)
    })

    prom.then(()=>{
      const prom=new Promise(async(resolve,reject)=>{
        var userref=collection(db,"users")
        const data=await getDocs(userref)
        
          console.log("foundKey",foundKey)
            setKey(foundKey)
            data.docs.map(async(m)=>{
             const u=m.data()
         
         
    
           if(u.userId==user.userId ){
             
              const update=doc(userref,m._key.path.segments[m._key.path.segments.length-1])
             
              if((u.challenges==null || u.challenges.length==0 ) || u.challenges[0]==null  ){
                const updateDocu=await updateDoc(update,{
                  "challenges":[challenge]
                })
              }else{
                      const already=u.challenges.map((o)=>{
            if(o.title==challenge.title){
              return true
            }
          })
          
                
                if(!already.includes(true)){
                  u.challenges[u.challenges.length]=challenge
                setTimeout(async()=>{
                 const updateDocu=await updateDoc(update,{
                    "challenges":u.challenges
                  })
                },100)
              }
              }
              
             }
             

           })
           setTimeout(()=>{
            resolve()
           },800)
        
      })

      prom.then(()=>{
          setIsLoading(false)
      })


    })
    /*data.docs.map((d)=>{
      const data=d.data()
      if(data.userId==user.userId){
       
        if(data.challenges!=null && data.challenges.length>0 ){
        
          data.challenges.map((c)=>{
            console.log(c.title)
            if(c.title==challenge.title){
                console.log("MATCH")

            }
          })
        }else{

        }
      }
    })
    */


  },[])

if(!isLoading){
  return (
    <div class="flex w-full p-2 bg-gray-200 rounded-md m-2 align-middle">
      <div class="flex w-4/5 justify-start align-middle">
        <p class="font-semibold">{challenge.title}</p>
      </div>
      <div class="w-1/5 flex ">
        <button class="bg-red-500 rounded-md p-2 flex w-1/3 h-1/2  shadow-xl" onClick={async()=>{
          const ref=collection(db,"users")
          const data=await getDocs(ref)
          const user=JSON.parse(sessionStorage.getItem("user"))
          data.docs.map((d)=>{
            const data=d.data()
            if(data.userId==user.userId){
             
              if(data.challenges!=null ){
                data.challenges.map((c)=>{
              
                  if(c.title==challenge.title){
                      console.log("MATCH")
                      console.log(c.title,challenge.title)
                      axios.post("http://localhost:3022/delete-challenge",{})

                  }
                })
              }
            }
          })

        }}>
          <p class="text-white font-bold text-center">x</p>
        </button>
      </div>

    </div>
  )
      }else{
        return(<div></div>)
      }
}

export default DeleteChallengeComponent