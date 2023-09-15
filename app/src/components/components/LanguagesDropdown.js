import React from "react";
import axios from 'axios'
import { customStyles } from "../constants/customStyles";
import { languageOptions } from "../constants/languageOptions";
import { useState,useEffect } from "react";
import Select from "react-select";
const LanguagesDropdown = ({ onSelectChange,handleSelectedLanguage }) => {

  const [languages,setLanguages]=useState()
  const[isLoading,setIsloading]=useState(true)
  const[ids,setIds]=useState()
  const[language,setLanguage]=useState({id:4,name:"Java"})

  const tryIt=async()=>{
    const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/languages',
  headers: {
    'content-type': 'application/octet-stream',
    'X-RapidAPI-Key': '00f165d168msh14ee358d2258223p12aa97jsne2c06db3d539',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
  return response.data
  } catch (error) {
	console.error(error);
}
  }

  useEffect(()=>{
    var l
    const arr=[]
    var id=[]
    console.log("LANGUAGE DROP")
    const options = {
      method: 'GET',
      url: 'https://judge0-ce.p.rapidapi.com/languages',
      headers: {
        'X-RapidAPI-Key': '00f165d168msh14ee358d2258223p12aa97jsne2c06db3d539',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    };
    const prom=new Promise((resolve,reject)=>{
      

      axios.get("https://judge0-ce.p.rapidapi.com/languages",{header:{   'X-RapidAPI-Key': '00f165d168msh14ee358d2258223p12aa97jsne2c06db3d539',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'},
    }).then((response)=>{
        console.log(response)
        setLanguages(response.data)
        console.log(response)
        response.data.map((l)=>{
          console.log(typeof(l))
          arr.push({value:{id:l.id,name:l.name},label:l.name})
        })

        setTimeout(()=>{
          resolve()
        },500)
      })
      

    })

    prom.then(()=>{
      const prom1=new Promise((resolve1,reject1)=>{
        setLanguages(arr)
        setTimeout(()=>{
          resolve1()
        },500)

      })

      prom.then(()=>{
        setIsloading(false)

      })

    })
  },[])
  

  if(!isLoading){
  return (
    <div class="flex w-full "> 
   
          <select class="flex w-full rounded-sm pb-2 pt-2 pr-4"
          default={JSON.stringify({id:4,name:'Jave (JDK (OpenJDK 14.0.1'})}
          onChange={(e)=>{
            //console.log(Object.keys(e.target.value))
            handleSelectedLanguage(e.target.value)
          }}>
            {
              languages.map((l)=>{
                return(
                  <option value={JSON.stringify(l.value)} label={l.label}/> 
                )
              })
            }
          </select>
  </div>

  
  
  );
  }else{
    return(
      <div></div>
    )
  }
  
};

export default LanguagesDropdown;
