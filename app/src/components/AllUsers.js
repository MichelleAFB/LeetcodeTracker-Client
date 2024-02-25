import { getDocs,collection,doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect,useState } from "react";
import AllUsersItem from "./AllUsersItem";



function AllUsers() {

    const[users,setUsers]=useState()
    const [isLoading,setIsLoading]=useState(true)

    useEffect(()=>{
  const prom=new Promise(async(resolve,reject)=>{
    try{
    var allUsers=collection(db,"users")
    allUsers=await getDocs(allUsers)
    console.log(allUsers.docs)
    console.log("HERE")
    const us=allUsers.docs.filter(async(d)=>{
      console.log(d.data())
      const u=doc(d)
      console.log(u.data())
      
      return u
    })
    console.log(us)
    setUsers(us)
   setTimeout(()=>{
    resolve()
   },300)
        }catch(err){
    console.log("err",err)
}
  })

  prom.then(()=>{
    setIsLoading(false)
  })

    },[])
  

  
    if(!isLoading){
      console.log(users)
    return (
      <div class="flex  p-2 justify-between">
        {users.map((u)=>{
              console.log(u.data())
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
    )
    }else{
      return(
        <div >
      </div>
      )
    }
  
  
  }
  

export default AllUsers;