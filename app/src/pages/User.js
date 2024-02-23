import { useParams } from "react-router-dom"
import {useState,useEffect} from 'react'
import { db } from "../firebase/firebase"
import { collection,doc,getDoc,query,where,getDocs } from "firebase/firestore"
import ProblemList from "../components/ProblemList"
function User(){
    const id=useParams().id
    const [user,setUser]=useState()
    const [createTime,setCreateTime]=useState()
    const[notFound,setNotFound]=useState(false)
    const[isLoading,setIsLoading]=useState(true)

    console.log(typeof(id))

    useEffect(()=>{
        const ref=doc(db,"users",id.toString())
        const prom=new Promise(async(resolve,reject)=>{
            console.log(ref)
            const us=await getDoc(ref)
            console.log(us)
            console.log(us._document)
            console.log(us._document.data)
            if(us._document!=null){
                console.log(us._document)
            setUser(us._document.data.value.mapValue.fields)
            setCreateTime(new Date(us._document.createTime.timestamp.seconds*1000))
            setTimeout(()=>{
                resolve()
            },500)
            }else{
                reject()
            }
        })

        prom.then(()=>{
           setIsLoading(false)
        })

        prom.catch(()=>{
            setIsLoading(false)
            setNotFound(true)
        })

    },[id])

    if(isLoading){
        return(
            <div class="h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div class="flex-col justify-end  ">
                <div class="loading-spinner"/>
            </div>
          </div>
        )
    }
    if(!isLoading){
        if(!notFound){
    return(
        <div class="w-full flex min-h-screen ">
           <div class="flex-col w-full bg-gray-300 p-3">
            <div class="flex w-full">
                <div class="flex-col">
                    <p class="text-4xl font-bold">{user.firstname.stringValue} {user.lastname.stringValue}</p>
                    <p class="text-md font-semibold">joined {createTime.toLocaleString('en-EN',{month:'long'})} {createTime.getUTCFullYear()}</p>

                </div>
                <button class="bg-pink-400 p-2" onClick={async()=>{
                    const ref=collection(db,"problems")
                    const problem=await getDocs(ref)
                    problem.docs.map((c)=>{
                        console.log(c._document.data.value.mapValue.fields.userId.stringValue)
                    })
                }}>
                    <p>Switch</p>
                </button>
            </div>
            <div class="flex w-full">
                <div class="flex w-1/2">
                    <ProblemList id={id}/>
                </div>
            </div>
           </div>
        </div> 
    )
        }else{
            return(
                <div class="w-full flex min-h-screen ">
                    Not found
                 </div>   
            )
        }
    }

}

export default User