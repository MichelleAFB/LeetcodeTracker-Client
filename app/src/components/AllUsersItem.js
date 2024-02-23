import { useNavigate } from "react-router-dom"
import {useState} from 'react'
import { Link } from "react-router-dom"
function AllUsersItem({u}){
    const navigate=useNavigate()
    const[user,setUser]=useState(u._document.data.value.mapValue.fields)

    return(
        <div class="p-2 flex-col">
            <div class="flex">
                <button class="p-1 flex" onClick={()=>{
                    console.log(user)
                    navigate("/user/"+user.userId.stringValue)
                }}>
                    <p class="font-bold hover:text-green-400">{user.firstname.stringValue} {user.lastname.stringValue}</p>
                </button>
            </div>
        </div>
    )

}

export default AllUsersItem