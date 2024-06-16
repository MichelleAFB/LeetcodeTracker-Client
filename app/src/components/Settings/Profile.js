import React from 'react'
import {useState} from 'react'
import {Image, Video, Transformation} from 'cloudinary-react';
import axios from 'axios';
import { db } from '../../firebase/firebase'
import {Cloudinary} from "@cloudinary/url-gen";
import {getDocs,collection,setDoc,doc,updateDoc, getDoc} from 'firebase/firestore'
import { useEffect } from 'react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";

import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
import { sepia } from '@cloudinary/url-gen/actions/effect';
import {AdvancedImage} from '@cloudinary/react';
import {  scale } from "@cloudinary/url-gen/actions/resize";

import { source } from "@cloudinary/url-gen/actions/overlay";
import { byAngle } from "@cloudinary/url-gen/actions/rotate";
import { format } from "@cloudinary/url-gen/actions/delivery";
import { opacity, brightness } from "@cloudinary/url-gen/actions/adjust";
import { image } from "@cloudinary/url-gen/qualifiers/source";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { png } from "@cloudinary/url-gen/qualifiers/format";
import {  compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { face } from "@cloudinary/url-gen/qualifiers/focusOn";
import { max } from "@cloudinary/url-gen/actions/roundCorners";
import { ar1X1 } from "@cloudinary/url-gen/qualifiers/aspectRatio";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { auto } from "@cloudinary/url-gen/actions/resize";

function Profile() {
    const [user,setUser]=useState(JSON.parse(sessionStorage.getItem("user")))
    const[firstname,setFirstname]=useState(user.firstname)
    const [lastname,setLastname]=useState(user.lastname)
    const[email,setEmail]=useState(user.email)
    const [phone,setPhone]=useState(user.phone)
    const[location,setLocation]=useState()
    const[bio,setBio]=useState(user.bio)
    const[profilePic,setProfilePic]=useState(user.profilePicUrl)
    const[avi,setAvi]=useState()
    const[avi1,setAvi1]=useState()
    const[isLoading,setIsLoading]=useState(true)
    const cld = new Cloudinary({
      cloud: {
        cloudName: 'michelle-badu',
        apiKey:'877163957659927',
        apiSecret:'NBk67NDZKIxpnGE06FUDFLSisp8'
      }
    })

    useEffect(()=>{
      const prom=new Promise((resolve,reject)=>{
        if(user.profilePicUrl!=null){
          const arr=user.profilePicUrl.split("/")
          //https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_200,w_200/r_max/f_auto/woman-blackdress-stairs.png
          //https://res.cloudinary.com/michelle-badu/image/upload/s--5Zatamrm--/t_noBackground/cld-sample.jpg
         // https://res.cloudinary.com/michelle-badu/image/upload/s--rL26fQoJ--/c_thumb,h_100,w_100/b_rgb:00000000/c_auto,g_auto,h_100,w_100/c_scale,h_50,w_50/c_crop,h_200,w_200/r_100/cld-sample.jpg
          //https://res.cloudinary.com/michelle-badu/image/upload/s--rL26fQoJ--/t_profile-small/cld-sample.jpg
         const url=arr[0]+"/"+arr[1]+"/"+arr[2]+"/"+arr[3]+"/"+arr[4]+"/"+arr[5]+"/s--GNMp9SB3--/t_final/"+arr[6]+"/"+arr[7]
       
          const a1=cld.image(url);
          console.log(a1)
        const a= new CloudinaryImage(a1).resize(
          auto()
            .width(100)
            .aspectRatio(ar1X1())
            .gravity(autoGravity())
        ).roundCorners(max())
        console.log(a)
        
        a1.effect(sepia()); 
       //a.resize(thumbnail().width(10).height(10).gravity(focusOn(FocusOn.face()))) // Crop the image, focusing on the face.
         // .roundCorners(byRadius(20)))
         // a.resize(thumbnail().width(20).height(20).gravity(focusOn(FocusOn.face())))  // Crop the image, focusing on the face.
        //.roundCorners(byRadius(20))
        setTimeout(()=>{
          setAvi(a)
          setAvi1(a1)
        },200)
      
        }
        setTimeout(()=>{
        
          resolve()
        },1000)
      })

      prom.then(()=>{
        setIsLoading(false)
      })
    },[])
    async function addPhoto(formData){
      const arr=[]
       await axios.post("https://api.cloudinary.com/v1_1/michelle-badu/image/upload/",formData).then(async(response1)=>{
        if(response1.data.secure_url!=null){
         console.log(response1)
         sessionStorage.setItem("url_",response1.data.secure_url)
         console.log(response1)
         //const user=JSON.parse(sessionStorage.getItem("user"))
         const userRef=doc(db,"users",user.userId)
         if( profilePic!=null && bio==null){
         const added= await updateDoc(userRef, {
          profilePicUrl:profilePic!=null?response1.data.secure_url:user.profilePicUrl,
          
          }).then(()=>{
            axios.post("http://localhost:3022/add-profile-info",{userId:user.userId,profilePicUrl:response1.data.secure_url}).then((response)=>{
              if(response.data.success){
                alert(response.data.message)
              
                user.profilePicUrl=response1.data.secure_url
                sessionStorage.setItem("user",JSON.stringify(user))
              }
            })
          })
        }
        if(bio!=null && profilePic==null){
          const added= await updateDoc(userRef, {
           
             bio:bio!=null?bio:user.bio
            }).then(()=>{
              axios.post("http://localhost:3022/add-profile-info",{userId:user.userId,bio:bio}).then((response)=>{
                if(response.data.success){
                  alert("Your bio has been updated!")
                  user.bio=bio;
                 
                  sessionStorage.setItem("user",JSON.stringify(user))
                }
              })
            })
        }
        if(bio!=null && profilePic!=null){
          const added= await updateDoc(userRef, {
            profilePicUrl:profilePic!=null?response1.data.secure_url:user.profilePicUrl,
             bio:bio!=null?bio:user.bio
            }).then(()=>{
              axios.post("http://localhost:3022/add-profile-info",{userId:user.userId,profilePicUrl:response1.data.secure_url,bio:bio}).then((response)=>{
                if(response.data.success){
                  alert(response.data.message)
                  user.bio=bio;
                  user.profilePicUrl=response1.data.secure_url
                  sessionStorage.setItem("user",JSON.stringify(user))
                }
              })
            })
        }

        }

       })
     }
    async function add(){
      if(profilePic!=null){
      const formData=new FormData()
      formData.append('upload_preset','zj9kqmht')
        formData.append('file',profilePic)
        formData.append('cloud_name','michelle-badu')
        formData.append("api_key", "877163957659927")

     
        await addPhoto(formData).then((res)=>{
        
          if(res!=false){
            console.log("\n\n\n"+res)
            
           
           // setRestrictedList(rest)
          }
         
        
         }).then((rest)=>{
          if(rest!=false){
            console.log("\n\n\n"+rest)
            console.log(rest)
            sessionStorage.setItem("profilePicUrl",JSON.stringify(rest))
            
       
           
          }
      

         })
      }
    }
    if(!isLoading){
    return(
    <div class="flex w-full p-5">
    <div class="flex-col w-full">
        <div class="flex-col  w-full justify-start">
            <p class="font-bold text-3xl">{user.firstname +" "+user.lastname +" ("  } {user.username!=null?user.username:""} {")"}</p>
          <div class="flex-col">
          <input class ="m-2 p-3 bg-gray-100 border-gray-400 border flex w-full" type="text" rows={10} default={bio} placeholder={bio} onChange={(e)=>{
              setBio(e.target.value)
            }}/>
            {
              avi!=null?
              <div>
               
                   <Image cloudName="michelle-badu" publicID={avi1.publicID}   crop="limit"
    width="170"
    height="16">
                   <Transformation height={300} crop="scale" quality="auto" fetchFormat="auto" />
                     
                 </Image>
                
              </div>:
              <div>
             
              </div>
            }
           
            <input type="file"  accept="image/*" onChange={(e)=>{
               console.log(e.target.files[0])
              console.log(e.target.files[0].toString('base64'))
              setProfilePic(e.target.files[0])
            }}/>
          
           
          </div>
          <button class="bg-purple-500 p-2 rounded-md" onClick={()=>{
              add()
            }}>
              <p class="text-white">Submit</p>
            </button>
         
        
        </div>

    </div>
</div>
  )
   }else{
    return(<div></div>)
   }
}

export default Profile