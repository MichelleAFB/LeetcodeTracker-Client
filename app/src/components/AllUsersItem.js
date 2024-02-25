import { useNavigate } from "react-router-dom"
import {useState} from 'react'
import { Link } from "react-router-dom"
function AllUsersItem({u}){
    const navigate=useNavigate()
    console.log(u)
    const[user,setUser]=useState(u.data())
    const self=JSON.parse(sessionStorage.getItem("user"))
    return(
        <div class="p-2 flex-col">
            <div class="flex">
                <button class="p-1 flex" onClick={()=>{
                   
                    if(user.userId.stringValue!=null){
                    navigate("/user/"+user.userId)
                    }else{
                        navigate("/user/"+user.userId)
                    }
                }}>
                    <p class="font-bold hover:text-green-400">{user.firstname} {user.lastname}</p>
                </button>
            </div>
        </div>
    )

}

export default AllUsersItem