import { getDocs,collection,doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect,useState } from "react";
import AllUsersItem from "./AllUsersItem";
import ProgressAnimation from "./ProgressAnimation";



function AllUsers() {

    const[users,setUsers]=useState()
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
      const us=[]
  const prom=new Promise(async(resolve,reject)=>{
    try{
    var allUsers=collection(db,"users")
    allUsers=await getDocs(allUsers)
      var i=0
      while(i<allUsers.docs.length){
        var id=allUsers.docs[i].id
        var u=allUsers.docs[i].data()
        
        us.push(u)
        i++
        if(i>=allUsers.docs.length){
         resolve()
        
         // resolve()
        }
      }
    
   
    
        }catch(err){ 
}
  })

  prom.then(()=>{
    setUsers(us)
    setTimeout(()=>{
      setIsLoading(false)
    },500)
    
  })

    },[])
  

  
    if(!isLoading){
  
    return (
      <div class="flex-col">
        
      <div class="flex  p-2 justify-between border-b-2 border-gray-500 bg-gray-200">
      <ProgressAnimation/>  
        {users.map((u)=>{
             
              const self=JSON.parse(sessionStorage.getItem("user"))
              try{
              if(u.data().userId!=self.userId){
                return(
                 
        <AllUsersItem u={u}/>
                )
              }
            }catch(err){
            
                return(
                   
                  <AllUsersItem u={u}/>
                          )
              

            }
        })}
      </div>
      </div>
    )
    }else{
      return(
        <div >
      </div>
      )
    }
  
  
  }
  

export default AllUsers;