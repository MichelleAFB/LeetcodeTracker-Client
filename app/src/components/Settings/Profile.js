import React from 'react'
import {useState} from 'react'
function Profile() {
    const [user,setUser]=useState(JSON.parse(sessionStorage.getItem("user")))
    const[firstname,setFirstname]=useState(user.firstname)
    const [lastname,setLastname]=useState(user.lastname)
    const[email,setEmail]=useState(user.email)
    const [phone,setPhone]=useState(user.phone)
  return (
    <div class="flex w-full p-5">
    <div class="flex-col w-full">
        <div class="flex-w-full justify-start">
            <p class="font-bold text-3xl">{user.firstname +" "+user.lastname +" ("  } {user.username!=null?user.username:""} {")"}</p>
        </div>

    </div>
</div>
  )
}

export default Profile