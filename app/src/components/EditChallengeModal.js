import React from 'react'
import { connect } from 'react-redux';
import {useState,useEffect} from 'react'
import { DateRangePicker } from 'react-date-range';
import { collection,updateDoc,getDocs,doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import axios from 'axios';
function EditChallengeModal({visibility,challenge}) {
  
    const[isLoading,setIsLoading]=useState(true)

      const[endDate,setEndDate]=useState()
      const[startDate,setStartDate]=useState()
      const selectionRange={
        startDate:startDate,
        endDate:endDate,
        key:"selection"
      }

    useEffect(()=>{
        const prom=new Promise((resolve,reject)=>{
            if(visibility && challenge!=null){
                console.log(new Date(challenge.startDate))
               setTimeout(()=>{
                setStartDate(new Date(challenge.startDate))
                setEndDate(new Date(challenge.endDate))
                resolve()
               },500)
            }
        })

        prom.then(()=>{
            setIsLoading(false)
        })

    },[visibility])

    function handleSelect(selection){
    console.log(selection)
  const today=new Date()
  if(selection.selection.endDate>today && selection.selection.startDate.toString().substring(0,15)==startDate.toString().substring(0,15)){
    setEndDate(selection.selection.endDate)
  }

  }

  const submit=async()=>{
    console.log("\n\n\nSUBMITTING")
    console.log(startDate.toString().substring(0,15),"   ",endDate.toString().substring(0,15))
    const challengesRef=collection(db,"users")
    const users=await getDocs(challengesRef,challenge.userId)
    users.docs.map(async(u)=>{
        const found=await doc(db,"users",u._key.path.segments[u._key.path.segments.length-1])
        const user=u.data()
        if(user.userId==challenge.userId){
            console.log("\n\n",endDate.toISOString())
            console.log(user)
            const update=await updateDoc(found,{
                "currentChallenge.endDate":endDate.toISOString()
                
            })
            axios.post("http://localhost:3022/update-challenge",{challenge:challenge,endDate:endDate}).then((response)=>{
                console.log(response.data)
                if(response.data.success){
                    alert("SUCCESSFULLY UPDATED")
                }
            })
            console.log(update)
        }
    })

  }

    if(!isLoading){
  return (
    <div class='bg-gray-200' data-testId="modal-public">
    <div class='h-screen w-full fixed ml-0 mr-0 mt-0 mb-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
      <main id='content' role='main' class='w-full max-w-lg mx-auto h-[80vh] overflow-y-scroll overflow-hidden rounded-md'>
        <div class=' bg-white  rounded-md shadow-lg bg-white dark:border-gray-700 mb-5 flex flex-col p-5'>
         
            <div class="flex-col w-full">
                <div class="flex w-full justify-between">
                    <p class="text-2xl font-bold">{challenge.title}</p>
                    <button class="p-1 bg-red-600 rounded-sm">
                        <p class="text-white">x</p>
                    </button>
                </div>
          
                
            </div>
            <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} 
             minDate={startDate} 
             />
            {
                endDate.toString()!=new Date(challenge.endDate).toString()?
                <button class="bg-green-600 p-2 flex w-full justify-center" onClick={submit}>
                <p class="text-white font-bold text-center">
                    Submit
                </p>
             </button>
             :<div></div>
            }
         </div>
         </main>
        </div>
     </div>
  )
    }else{
        return(<div></div>)
    }
}

const mapStateToProps = (state, props) => {
    var visibility= state.editChallenge.visibility
    var challenge=state.editChallenge.challenge
    console.log("visibility"+visibility)
  
    return {
     visibility:visibility,
    challenge:challenge
    };
  };
export default connect(mapStateToProps)(EditChallengeModal)