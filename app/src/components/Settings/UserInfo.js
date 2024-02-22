
import{useState,useEffect} from 'react'
import {db} from '../../firebase/firebase'
import {doc,updateDoc,getDoc} from 'firebase/firestore'
function UserInfo(){
    const [user,setUser]=useState(JSON.parse(sessionStorage.getItem("user")))
    const[firstname,setFirstname]=useState(user.firstname)
    const [lastname,setLastname]=useState(user.lastname)
    const[email,setEmail]=useState(user.email)
    const [phone,setPhone]=useState(user.phone)

    return(
        <div class="flex w-full p-5">
            <div class="flex-col w-full">
                <p class="text-3xl">You</p>
                <div class="flex-col mt-5 w-full border-2 border-gray-300">
                    <div class="flex w-full justfy-start p-2">
                    <div class="flex  align-bottom mr-2">
                        <div>
                            <p class="font-bold mr-2">Firstname:</p>
                        </div>
                        <div class="">                            
                            <input placeholder={user.firstname} onChange={(e)=>{
                                    setFirstname(e.target.value)
                                    }} class="rounded-sm p-2 bg-white border-gray-300 border">

                                </input>
                            </div>

                        </div>
                        <div class="flex mr-2 align-bottom">
                        <div class="flex">
                            <p class="font-bold mr-1">Lastname:</p>
                        </div>
                        <div class="flex">                            
                            <input placeholder={user.lastname} onChange={(e)=>{
                                    setLastname(e.target.value)
                                    }} class="rounded-sm p-2 bg-white border-gray-300 border">

                                </input>
                            </div>
                        </div>
                    
                    
                     
                    </div>
                    <div class="flex w-full p-2 align-bottom">
                        <p class="font-bold mr-1">Email:</p>
    
                            <input placeholder={user.email} onChange={(e)=>{
                                setEmail(e.target.value)
                            }} class="rounded-sm p-2 bg-white border-gray-300 border"/>
                    </div>
                    <div class="flex w-full p-2 align-bottom">
                        <p class="font-bold mr-1">Phone:</p>
    
                            <input placeholder={user.phone} onChange={(e)=>{
                                setPhone(e.target.value)
                            }} class={`rounded-sm p-2 bg-white ${user.phone!=null || user.phone!="" || user.phone!=''?"border-red-300":"border-red-300"} border`}/>
                    </div>
                    <div class="flex w-full p-2 align-bottom">
                        <p class="font-bold mr-1">Created:<span class="font-normal">{user.timeCreated.toString()}</span></p>
    
                 </div>
                 <div class="flex w-full justify-center">
                    <button class="bg-green-500 pr-2 pl-2 pt-2 rounded-sm m-2" onClick={async()=>{
                        const id=user.userId
                        const userRef=doc(db,"users",user.userId)
                        const u= await getDoc(userRef)
                        console.log(u)
                        /*if(firstname!=null && firstname!=user.firstname){
                            await updateDoc(userRef,{
                                firstname:firstname
                            })
                        }
                        if(lastname!=null && lastname!=user.lastname){
                            await updateDoc(userRef,{
                              lastname:lastname
                            })
                        }
                       /* if(email!=null && email!=user.email){
                            await updateDoc(userRef,{
                              email:email
                            })
                        }
                        
                        if(phone!=null && phone!=user.phone){
                            await updateDoc(userRef,{
                              phone:phone
                            })
                        }
                        */
                        const update={
                            firstname:firstname!=null && firstname!=user.firstname ? firstname:user.firstname,
                            lastname:lastname!=null && lastname!=user.lastname ? lastname:user.lastname,
                            phone:phone!=null && phone!=user.phone? phone:user.phone,
                            email:email!=null && email!=user.email? email:user.email
                        }
                        console.log(update)
                     

                    }}>
                        <p class="text-white">Submit</p>
                    </button>
                 </div>
                </div>
             
            </div>
        </div>
    )

}
export default UserInfo