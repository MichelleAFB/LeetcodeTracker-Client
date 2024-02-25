import { useNavigate } from "react-router-dom"
import {useState} from 'react'
import { Link } from "react-router-dom"
function AllUsersItem({u}){
    const navigate=useNavigate()
    console.log(u)
    const[user,setUser]=useState(u._document.data.value.mapValue.fields)
    const self=JSON.parse(sessionStorage.getItem("user"))
    return(
        <div class="p-2 flex-col">
            <div class="flex">
                <button class="p-1 flex" onClick={()=>{
                    console.log(user)
                    console.log(u)
                    if(user.userId.stringValue!=null){
                    navigate("/user/"+user.userId.stringValue)
                    }else{
                        navigate("/user/"+user.userId.integerValue)
                    }
                }}>
                    <p class="font-bold hover:text-green-400">{user.firstname.stringValue} {user.lastname.stringValue}</p>
                </button>
            </div>
        </div>
    )

}

export default AllUsersItem