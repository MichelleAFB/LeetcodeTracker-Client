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
  const[language,setLanguage]=useState(JSON.stringify({id:4,name:"Java"}))

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

  const valid=[
    ,{
      "id":4,
      "name":"Java (OpenJDK 14.0.1)"
      },
    {
      "id":1,
      "name":"C (Clang 10.0.1)"
      },{
      "id":2,
      "name":"C+ (Clang 10.0.1)"
      },{
      "id":3,
      "name":"C3 (lates)"
      },{
      "id":5,
      "name":"Java text (OpenJDK 14.0.1, JUnit Platform Console StandAlone 1.6.2)"
      },{
      "id":6,
      "name":"MPI (OPENRTE 3.1.3 with C (GCC 8.4.0)"
      },{
            "id": 7,
              "name": "MPI (OpenRTE 3.1.3) with C++ (GCC 8.4.0)"
          },
      {
          "id": 8,
            "name": "MPI (OpenRTE 3.1.3) with Python (3.7.7)"
      },{
          "id": 9,
              "name": "Nim (stable)"
      },{
       "id": 10,
              "name": "Python for ML (3.7.7)"
          }
      ,{
         "id": 11,
           "name": "Bosque (latest)"
      },{
              "id": 12,
              "name": "C++ Test (GCC 8.4.0, Google Test 1.8.1)"
          },
       {
              "id": 13,
              "name": "C (Clang 9.0.1)"
          }, {
              "id": 14,
              "name": "C++ (Clang 9.0.1)"
          },{
              "id": 15,
              "name": "C++ Test (Clang 10.0.1, Google Test 1.8.1)"
          },
        {
              "id": 20,
              "name": "Visual Basic.Net (vbnc 0.0.0.5943)"
          },
           {
              "id": 21,
              "name": "C# (.NET Core SDK 3.1.406)"
          },
      
      {
              "id": 22,
              "name": "C# (Mono 6.12.0.122)"
          },
      {
              "id": 23,
              "name": "C# Test (.NET Core SDK 3.1.406, NUnit 3.12.0)"
          },
      
       {
              "id": 24,
              "name": "F# (.NET Core SDK 3.1.406)"
          },
      {
              "id": 25,
              "name": "Python for ML (3.11.2)"
          },
       {
              "id": 26,
              "name": "Python 2.7 (PyPy 7.3.12)"
          },
      {
              "id": 27,
              "name": "Python 3.9 (PyPy 7.3.12)"
          },
       {
              "id": 28,
              "name": "Python 3.10 (PyPy 7.3.12)"
          }
      
      
  ]
const lang=[

{

  "id": 45,
  "name": "Assembly (NASM 2.14.02)",
  "is_archived": false
},
{
  "id": 2,
  "name": "Bash (4.0)",
  "is_archived": true
},
{
  "id": 1,
  "name": "Bash (4.4)",
  "is_archived": true
},
{
  "id": 46,
  "name": "Bash (5.0.0)",
  "is_archived": false
},
{
  "id": 3,
  "name": "Basic (fbc 1.05.0)",
  "is_archived": true
},
{
  "id": 47,
  "name": "Basic (FBC 1.07.1)",
  "is_archived": false
},
{
  "id": 15,
  "name": "C++ (g++ 4.8.5)",
  "is_archived": true
},
{
  "id": 14,
  "name": "C++ (g++ 4.9.4)",
  "is_archived": true
},
{
  "id": 13,
  "name": "C++ (g++ 5.4.0)",
  "is_archived": true
},
{
  "id": 12,
  "name": "C++ (g++ 6.3.0)",
  "is_archived": true
},
{
  "id": 11,
  "name": "C++ (g++ 6.4.0)",
  "is_archived": true
},
{
  "id": 10,
  "name": "C++ (g++ 7.2.0)",
  "is_archived": true
},
{
  "id": 9,
  "name": "C (gcc 4.8.5)",
  "is_archived": true
},
{
  "id": 8,
  "name": "C (gcc 4.9.4)",
  "is_archived": true
},
{
  "id": 7,
  "name": "C (gcc 5.4.0)",
  "is_archived": true
},
{
  "id": 6,
  "name": "C (gcc 6.3.0)",
  "is_archived": true
},
{
  "id": 5,
  "name": "C (gcc 6.4.0)",
  "is_archived": true
},
{
  "id": 4,
  "name": "C (gcc 7.2.0)",
  "is_archived": true
},
{
  "id": 48,
  "name": "C (GCC 7.4.0)",
  "is_archived": false
},
{
  "id": 52,
  "name": "C++ (GCC 7.4.0)",
  "is_archived": false
},
{
  "id": 49,
  "name": "C (GCC 8.3.0)",
  "is_archived": false
},
{
  "id": 53,
  "name": "C++ (GCC 8.3.0)",
  "is_archived": false
},
{
  "id": 50,
  "name": "C (GCC 9.2.0)",
  "is_archived": false
},
{
  "id": 54,
  "name": "C++ (GCC 9.2.0)",
  "is_archived": false
},
{
  "id": 18,
  "name": "Clojure (1.8.0)",
  "is_archived": true
},
{
  "id": 17,
  "name": "C# (mono 5.2.0.224)",
  "is_archived": true
},
{
  "id": 16,
  "name": "C# (mono 5.4.0.167)",
  "is_archived": true
},
{
  "id": 51,
  "name": "C# (Mono 6.6.0.161)",
  "is_archived": false
},
{
  "id": 55,
  "name": "Common Lisp (SBCL 2.0.0)",
  "is_archived": false
},
{
  "id": 19,
  "name": "Crystal (0.23.1)",
  "is_archived": true
},
{
  "id": 56,
  "name": "D (DMD 2.089.1)",
  "is_archived": false
},
{
  "id": 20,
  "name": "Elixir (1.5.1)",
  "is_archived": true
},
{
  "id": 57,
  "name": "Elixir (1.9.4)",
  "is_archived": false
},
{
  "id": 21,
  "name": "Erlang (OTP 20.0)",
  "is_archived": true
},
{
  "id": 58,
  "name": "Erlang (OTP 22.2)",
  "is_archived": false
},
{
  "id": 44,
  "name": "Executable",
  "is_archived": false
},
{
  "id": 59,
  "name": "Fortran (GFortran 9.2.0)",
  "is_archived": false
},
{
  "id": 60,
  "name": "Go (1.13.5)",
  "is_archived": false
},
{
  "id": 22,
  "name": "Go (1.9)",
  "is_archived": true
},
{
  "id": 24,
  "name": "Haskell (ghc 8.0.2)",
  "is_archived": true
},
{
  "id": 23,
  "name": "Haskell (ghc 8.2.1)",
  "is_archived": true
},
{
  "id": 61,
  "name": "Haskell (GHC 8.8.1)",
  "is_archived": false
},
{
  "id": 25,
  "name": "Insect (5.0.0)",
  "is_archived": true
},

{
  "id": 4,
  "name": "Java (OpenJDK 14.0.3)",
  "is_archived": true
},

{
  "id": 26,
  "name": "Java (OpenJDK 9 with Eclipse OpenJ9)",
  "is_archived": true
},

{
  "id": 64,
  "name": "Lua (5.3.5)",
  "is_archived": false
},
{
  "id":9,
  "name":"Nim (stable)" //GODD

},
{
  "id": 65,
  "name": "OCaml (4.09.0)",
  "is_archived": false
},


{
  "id": 33,
  "name": "Pascal (fpc 3.0.0)",
  "is_archived": true
},
{
  "id": 67,
  "name": "Pascal (FPC 3.0.4)",
  "is_archived": false
},
{
  "id": 68,
  "name": "PHP (7.4.1)",
  "is_archived": false
},
{
  "id": 43,
  "name": "Plain Text",
  "is_archived": false
},
{
  "id": 69,
  "name": "Prolog (GNU Prolog 1.4.5)",
  "is_archived": false
},
{
  "id": 37,
  "name": "Python (2.6.9)",
  "is_archived": true
},
{
  "id": 70,
  "name": "Python (2.7.17)",
  "is_archived": false
},
{
  "id": 36,
  "name": "Python (2.7.9)",
  "is_archived": true
},
{
  "id": 35,
  "name": "Python (3.5.3)",
  "is_archived": true
},
{
  "id": 34,
  "name": "Python (3.6.0)",
  "is_archived": true
},
{
  "id": 71,
  "name": "Python (3.8.1)",
  "is_archived": false
},
{
  "id": 41,
  "name": "Ruby (2.1.9)",
  "is_archived": true
},
{
  "id": 40,
  "name": "Ruby (2.2.6)",
  "is_archived": true
},
{
  "id": 39,
  "name": "Ruby (2.3.3)",
  "is_archived": true
},
{
  "id": 38,
  "name": "Ruby (2.4.0)",
  "is_archived": true
},
{
  "id": 72,
  "name": "Ruby (2.7.0)",
  "is_archived": false
},
{
  "id": 42,
  "name": "Rust (1.20.0)",
  "is_archived": true
},
{
  "id": 73,
  "name": "Rust (1.40.0)",
  "is_archived": false
},
{
  "id": 74,
  "name": "TypeScript (3.7.4)",
  "is_archived": false
}
]
function archived(valid,arr){
  valid.map((l)=>{
    const language=JSON.parse(l)
    
      arr.push(JSON.parse(l))
    
    setTimeout(()=>{
      return lang
    },700)
  })
}
const arr=[]

  useEffect(()=>{

    const prom=new Promise((resolve,reject)=>{
      setIsloading(false)
    })
    /*
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
      

   /*   axios.get(options).then((response)=>{
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
    */
   setIsloading(false)
  },[])
  

  if(!isLoading){
   // console.log("languages",lang)
  return (
    <div class="flex w-full "> 
   
          <select class="flex w-full rounded-sm pb-2 pt-2 pr-4"
          default={JSON.stringify({id:4,name:'Jave (JDK (OpenJDK 14.0.1'})}
          onChange={(e)=>{
            //console.log(Object.keys(e.target.value))
            handleSelectedLanguage(e.target.value)
          }}>
            { 
              valid.map((l)=>{
                //const value=JSON.parse(l)
               // console.log(l)

                return(
                  <option value={JSON.stringify(l)} label={l.name}/> 
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
