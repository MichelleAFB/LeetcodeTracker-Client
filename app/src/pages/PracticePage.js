import React from 'react'
import { useParams } from 'react-router-dom'
import { useState,useRef,useEffect } from 'react'
//outside
import axios from 'axios'
import Editor from '@monaco-editor/react'
import {SandpackCodeEditor,SandpackLayout,SandpackProvider,SandpackPreview} from "@codesandbox/sandpack-react"
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'




//firebase
import { db } from '../firebase/firebase'
import {getDocs,collection,setDoc,doc,updateDoc, getDoc} from 'firebase/firestore'
import Select from "react-select";
//window
import CodeEditorWindow from "../components/components/CodeEditorWindow";

import { classnames } from "../components/utils/general";
import { languageOptions } from "../components/constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import {connect,useDispatch} from "react-redux"
import { defineTheme } from "../components/lib/defineTheme";
import useKeyPress from "../components/hooks/useKeyPress";
import Footer from "../components/components/Footer";
import OutputWindow from "../components/components/OutputWindow";
import CustomInput from "../components/components/CustomInput";
import OutputDetails from "../components/components/OutputDetails";
import ThemeDropdown from "../components/components/ThemeDropdown";
import LanguagesDropdown from "../components/components/LanguagesDropdown";
import DeleteBoilerTemplateComponents from '../components/components/DeleteBoilerTemplateComponents'
import IonIcon from '@reacticons/ionicons'

import { setGroupChallenges } from '../redux/socket/socket-actions'
import { fireOff, setCompletedDays, setDays,setLastDate,setPercent,setStartingPoint } from '../redux/streakProgress/streak-actions'
const javascriptDefault = `// some comment`;

function PracticePage({socket,percent}) {

const[sendingstreak,setSendingStreak]=useState(false)
const [attempts,setAttempts]=useState()
  const [code, setCode] = useState(javascriptDefault);
  const[examples,setExamples]=useState(null)
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const[boilerCode,setBoilerCode]=useState()
  const[useBoilerCode,setuseBoilerCode]=useState(false)
  const[showAllPrompts,setShowAllPrompt]=useState(false)
  const[setTemplate,setSetTemplate]=useState(false)
  const[currentVariable,setCurrentVariable]=useState({dataType:null, auxDataType:null,arrayLength:null, arrayHeight:null,name:null,value:null})
  const [useTestCase,setUseTestCase]=useState(false)
  const[method,setMethod]=useState()
  const[params,setParams]=useState([])
  const[structure,setStructure]=useState([])
  const[correctTestCaseAnswer,setCorrectTestCaseAnswer]=useState()
  const[groupChallenges,setGroupChallenge]=useState(JSON.parse(sessionStorage.getItem("currentGroupChallenges")))
  const[showTemplates,setShowTemplates]=useState(false)
  const[selectedTemplate,setSelectedTemplate]=useState()
  const [language, setLanguage] = useState(
    {
      id: 4,
      name: "Java (OpenJDK 14.0.1)"
  });
  const[prompt,setPrompt]=useState("none")


  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const {timeIndex}=useParams()
  

  const onSelectChange = (sl) => {
    
    //setLanguage(sl);
  };


  

  const {problemId}=useParams()
  const[show,setShow]=useState(false)
  const [level,setLevel]=useState()
  const[showHint,setShowHint]=useState(false)
  const[problem,setProblem]=useState()
  const[isLoading,setIsLoading]=useState(true)
  const[solution,setSolution]=useState()
  const[seeSolution,setSeeSolution]=useState(false)
  const[seeAttempts,setSeeAttempts]=useState(false)
  const[title,setTitle]=useState()
  const[link,setLink]=useState()
  const[initialBoilerCode,setInitialBoilerCode]=useState()
  const[languages,setLanguages]=useState()
  const [selectedLanguage,setSelectedLanguage]=useState({id:4,name:'Jave (JDK (OpenJDK 14.0.1'})
  const[token,setToken]=useState()
  const[reload,setReload]=useState(true)
  const[user,setUser]=useState()
  const editorRef=useRef()
  const userId=useParams().id
  const problemsListCollectionRef=collection(db,"problems")
  const[boilerCodeTemplates,setBoilerCodeTemplates]=useState()

  
  //console.log("ID LENGHT",userId)


  useEffect(()=>{
    console.log("reloading")
    const prom=new Promise((resolve,reject)=>{
      
      if (enterPress && ctrlPress) {
   
        handleCompile();
      }
      var p
      const getProblemsList=async()=>{

        //READ DATA
        try{
          const use=JSON.parse(sessionStorage.getItem("user"))
          const userRef=doc(db,"users",use.userId)
          const userData=await getDoc(userRef)
          console.log(userData)
          /*axios.post("http://localhost:3022/create-user",{user:userData.data()}).then((response)=>{

          })*/

          setUser(userData.data())
          if(userData.data().boilerCodeTemplates !=null){
            const templates=userData.data().boilerCodeTemplates
            
            if(templates!=null){
              if(templates.length>0){
                templates.push({title:userData.data().title,template:userData.data().boilerCode})
                setBoilerCodeTemplates(templates)
                setSelectedTemplate({title:userData.data().title,template:userData.data().boilerCode})
              }else{
                setBoilerCodeTemplates([{title:userData.data().title,template:userData.data().boilerCode}])
                setSelectedTemplate({title:userData.data().title,template:userData.data().boilerCode})
              }
            }else{
              setBoilerCodeTemplates([{title:userData.data().title,template:userData.data().boilerCode}])
              setSelectedTemplate({title:userData.data().title,template:userData.data().boilerCode})
            }
          }
          await updateDoc(userRef,{
            myTopicTags:[ "Find Sub:X Inside",
            "Sorting",
                   "String to Number/Number to String",
                 "Sliding Window",
                "Recursion",
                "KSmallest/KBiggest",
                "Array Processing",
                   "Math",
                "Traverse"]
           
          })
          /*userDocs.docs.map(async(u)=>{
            const d=doc(u)
            await updateDoc(db,"users",u.id,{
              myTopicTags:[ "Find Sub:X Inside",
              "Sorting",
                     "String to Number/Number to String",
                   "Sliding Window",
                  "Recursion",
                  "KSmallest/KBiggest",
                  "Array Processing",
                     "Math",
                  "Traverse"]
             
            })
          })
          */
        
          const userType=JSON.parse(sessionStorage.getItem("userType"))
        

        const data=await getDocs(problemsListCollectionRef)
        data.docs.map((doc)=>{
        
         
          if(doc.id==problemId){
            const newp=doc.data()
            newp.xid=doc.id
            const theProb=newp
            
            //console.log(solution)
            var prob=doc.data()
            
            setProblem({problem:doc.data(),id:doc.id})
           
            if(doc.data().level!=null){
              setLevel(doc.data().level)
            }else{
              setLevel("Medium")
            }
            if(doc.data().prompt!=null){
            setPrompt(doc.data().prompt)
            }
          
            if(doc.data().boilerCode!=null && doc.data().hasOwnProperty("boilerCode")){
             /* const templates=doc.data().boilerCodeTemplates
              console.log(doc.data())
              if(templates!=null){
                if(templates.length>0){
                  templates.push({title:doc.data().title,template:doc.data().boilerCode})
                  setBoilerCodeTemplates(templates)
                }else{
                  setBoilerCodeTemplates([{title:doc.data().title,template:doc.data().boilerCode}])
                }
              }else{
                setBoilerCodeTemplates([{title:doc.data().title,template:doc.data().boilerCode}])

              }*/
              setBoilerCode(doc.data().boilerCode)
              setInitialBoilerCode(doc.data().boilerCode)
              setCode(doc.data().boilerCode)
            }else{
              setBoilerCode(`public class Main{ 

                public static void main(String[] args){

                }
              }`)
              setInitialBoilerCode(`public class Main{ 

                public static void main(String[] args){

                }
              }`)
              setCode(`public class Main{ 

                public static void main(String[] args){

                }
              }`)
            }
           
            setAttempts(doc.data().attempts.attempts)
            if(doc.data().examples!=null){
              setExamples(doc.data().examples)
            }if(doc.data().examples==null){
              setExamples(["no Examples"])
            }
            if(doc.data().solution!="solution" && doc.data().solution!=null){
              setSolution(doc.data().solution)
            }else{
              setSolution("solution")
            }
         
            if(doc.data().link!=null || doc.data().link!="https://leetcode.com/problemset/all/"){
              setLink(doc.data().link)
            }if(doc.data().link==null){
              setLink("https://leetcode.com/problemset/all/")
            }
            if(doc.data().level!=null ){
              setLevel(doc.data().level)
            }else{
              setLevel("Medium")
            }
          
            setTitle(doc.data().title)
           
           
            setTimeout(()=>{
              return problem
            },500)
            return {problem:doc.data(),id:doc.id}
          } 
        })
        }catch(err){
          console.log(err)
        }
      }
  
      getProblemsList().then((data)=>{
       console.log(data)
        //setProblem(data)
       /* if(data.problem.prompt!=null){
          sessionStorage.setItem("prompt",data.problem.prompt)
          setPrompt(data.problem.prompt)
        }
        */
        resolve()
      })

    })

    prom.then(()=>{
      setIsLoading(false)

    })

  },[])

  function mapObject (obj, fn) {
    return Object.fromEntries(
      Object
        .entries(obj)
        .map(fn)
    )
  }

   const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  
  const handleCompile = async() => {
    setProcessing(true);
    console.log("selectedLanguage",selectedLanguage.id)
    const formData = {
      language_id: selectedLanguage.id,
      // encode source code in base64
       source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: 'POST',
      url: 'https://judge0-extra-ce.p.rapidapi.com/submissions',
      params: {
        base64_encoded: 'true',
        wait: 'true',
        fields: '*'
      },
      headers: {
        
        'Content-Type': 'application/json',
        'X-RapidAPI-Key':'00f165d168msh14ee358d2258223p12aa97jsne2c06db3d539',
        'X-RapidAPI-Host': 'judge0-extra-ce.p.rapidapi.com'
      },
      data:formData
    };

     axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: "https://judge0-extra-ce.p.rapidapi.com/submissions/"+ token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": "00f165d168msh14ee358d2258223p12aa97jsne2c06db3d539",
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
         const st= checkStatus(token);
         console.log(st)
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };












function handleSelectedLanguage(l){
  
  console.log("changing to ",JSON.parse(l))
  setSelectedLanguage(JSON.parse(l))
}




  function handleEditorDidMount(editor,manaco){
    editorRef.current=editor
  }

  

  function resetEditorValue(){
   // return editorRef.current.value=null
  }
  /*

  setInterval(()=>{
    axios.get("https://leetcodetracker.onrender.com").then((response)=>{
      const time=new Date()
      console.log(response.data+" "+time.toString())
    })
  },360000)
  */
 const dispatch=useDispatch()
 socket.on("GROUP_CHALLENGE_UPDATED",(data)=>{
  
  if(data.groupChallenge!=null){
dispatch(setGroupChallenges(data.groupChallenge))
  }
 })
  if(!isLoading && problem!=null){
  
    socket.on("GROUP_CHALLENGE_UPDATED",(data)=>{
      console.log("\n\n\n FROM SOCKET",data)
      if(data.groupChallenge!=null){
    dispatch(setGroupChallenges(data.groupChallenge))
      }
     })
 
    
    const oldAttempts=problem.problem.attempts
    const newAttemptID=parseInt(Object.keys(problem.problem.attempts))+1
     console.log(problem)
    
    
   
  return (
    <div>
   
  
     <div class="bg-gray-900 p-3 rounded-md m-3">
      
      <Link class="justify-start" to="/home"><p class="text-white text-xl">Home</p></Link>  
     <p class="text-white text-center text-2xl font-bold mb-2">{problem.problem.title}</p>
     
     {
        showHint ?
        <div class="flex flex-col p-3 border-white border-2 m-2 border-dashed">
          <p class="text-center text-white text-xl underline mb-2 font-bold">Hint</p>
          <p class="text-center text-white">"{problem.problem.hints}"</p>
         </div>:
         <div></div> 
      }
       {
          problem.problem.level=="Medium"?
          <p class="text-xl text-center m-2 text-orange-300 font-bold">
            {problem.problem.level}
          </p>:
          <p></p>
        }
          {
          problem.problem.level=="Easy"?
          <p class="text-xl text-center text-green-300 font-bold">
            {problem.problem.level}
          </p>:
          <p></p>
        }
             {
          problem.problem.acRate!=null?
          <p class="text-xl text-center text-green-300 font-bold">
            {problem.problem.acRate.toString().substring(0,5)}%
          </p>:
          <p></p>
        }
     
        {
          problem.problem.examples!=null && problem.problem.examples.length>0?
          <div class="flex justify-Around m-2">
          
            </div>:
            <div></div>

        }
      
        <a class="text-green-400 text-center" href={problem.problem.link} rel="noopener noreferrer"  target="_blank">
         <p class="text-green-400 text-center">
         {problem.problem.link}
          </p> 
        </a>
 
      { problem.problem.prompt!=null || problem.problem.prompt!="" &&showAllPrompts?
       <div class="p-3">
         <p class="whitespace-pre-wrap font-bold m-3 text-xs text-white">
              {problem.problem.prompt.replace(/\n\n\n/g,"\n ")}
         </p>
         <button class="flex p-1" onClick={()=>{
           setShowAllPrompt(!showAllPrompts)
         }}>
         <p class="whitespace-pre-wrap font-semibold m-3 text-gray-400" >..See Less</p>
         </button>
       </div>
      :
      <div class="p-3">
        <p class="whitespace-pre-wrap text-xs font-bold m-3 text-white">
             {prompt.replace(/\n\n\n/g,"\n ").substring(0,700)}
        </p>
        <p class="whitespace-pre-wrap font-semibold m-3 text-gray-400" onClick={()=>{
          setShowAllPrompt(!showAllPrompts)
        }}>..See More</p>
      </div>
  }
       
     {
      sendingstreak?
      <div class="w-full flex justify-center m-3">

      <div class="loading-spinner justify-center"></div>
      </div>:
      <div></div>
     }
      
     
      <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
      <div className="flex flex-row">
        <div className="px-4 py-2">
      
          <LanguagesDropdown handleSelectedLanguage={handleSelectedLanguage}/>
          

        </div>
        <div className="px-4 py-2">

          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div> 
        <div class="flex w-full justify-between">
        {userId==null || userId.length==0?
        <div>
        <button class="bg-purple-600 rounded-md p-3 m-3 flex " onClick={()=>{
        
        
        const setData=async(p)=>{
          console.log(code)
          const  docRefer=doc(db,"problems",p.id)
          await updateDoc(docRefer, {
         
            boilerCode:code,
         
           
          }).then((response)=>{
            setBoilerCode(code)
            alert("success: added boilerCode")
        

          });
        }

          const setProblems=async(problem)=>{
           

            //READ DATA

            try{
              const user=JSON.parse(sessionStorage.getItem("user"))
              const userType=JSON.parse(sessionStorage.getItem("userType"))
    
            const data=await getDocs(problemsListCollectionRef)
            data.docs.map((doc)=>{
            
              console.log("\n")
           
              if(doc.id==problem.id && problem.problem.userId==user.userId){
                console.log(code)
                console.log(problem)
                console.log("MATCH")
                setData(problem)
              } 
            
            })

            }catch(err){
              console.log(err)
            }
          }
          setProblems(problem)
        
      }}> 
        <p class="text-white font-bold">Add Boiler Code</p>
      </button>
      <button class="bg-purple-700 rounded-sm p-2" onClick={async()=>{
           
            var dont="import java.util.*;\n         public class Main{\n\n …                        }\n                      }"
            dont.replace(/\s/g,"").toUpperCase()
     
         
          const user=JSON.parse(sessionStorage.getItem("user"))
         const  userRefer=doc(db,"users",user.userId)
        var userData=await getDoc(userRefer)
        var userId=userData.id
        userData=userData.data()
        if(userData.boilerCodeTemplates==null || userData.boilerCodeTemplates.length==0){
          if(problem.problem.boilerCode.replace(/\s/g,"").toUpperCase()!=dont){
            const template={title:problem.problem.title,template:problem.problem.boilerCode}
            console.log(template)
            await updateDoc(userRefer,{
              boilerCodeTemplates:[template]
            }).then(()=>{
              alert("success: New boilerCode template created!")
            })
          }else if(code.replace(/\s/g,"").toUpperCase()!=dont){
            const template={title:problem.problem.title,template:code}
            console.log(template)
            await updateDoc(userRefer,{
              boilerCodeTemplates:[template]
            }).then(()=>{
              alert("success: New boilerCode template created!")
            })
          }
        }else if(userData.boilerCodeTemplates!=null && userData.boilerCodeTemplates.length>0){
          const templates=userData.boilerCodeTemplates
          if(problem.problem.boilerCode.replace(/\s/g,"").toUpperCase()!=dont){

          const template={title:problem.problem.title,template:problem.problem.boilerCode}
          templates.push(template)
          await updateDoc(userRefer,{
            boilerCodeTemplates:templates
          }).then(()=>{
            alert("success: New boilerCode template created!")
          })
        }else if(code.replace(/\s/g,"").toUpperCase()!=dont){
          const template={title:problem.problem.title,template:code}
          templates.push(template)
          await updateDoc(userRefer,{
            boilerCodeTemplates:templates
          }).then(()=>{
            alert("success: New boilerCode template created!")
          })
        }
        }
         // setProblems(problem)


      }}>
        <p class="text-white">
          Add New Boiler Template
        </p>
      </button>
   
      <button class="bg-cyan-500 p-2 rounded-md" onClick={()=>{
          axios.post("http://localhost:3022/generate-use-cases",{problem:problem.problem}).then((response)=>{
            console.log("\n\nresponse from use cases")
            console.log(response)
          })
      }}  >
        <p class="text-white">Generate Examples</p>
      </button>
      {user.boilerCodeTemplates!=null?
      <select class="bg-gray-300 p-2 rounded-md m-2" onClick={(e)=>{
        console.log(e.target.value)
        setCode(e.target.value)
        setSetTemplate(!setTemplate)
      }}>
        {
          boilerCodeTemplates.map((b)=>{
            return(<option class="flex bg-gray-500 flex justify-apart" value={b.template}>{b.title}<button class="" onClick={()=>{
              console.log(b.title)
            }}><IonIcon name="close-outline"></IonIcon></button></option>)
          })
        }
      </select>
      :
      <div></div>
  }
      </div>
      :<div></div>
      }
      {
        selectedTemplate!=null?
        <div class="flex-col" onClick={()=>{
          setShowTemplates(!showTemplates)
        }}>

        </div>
        :
        <div>
        </div>
      }
      {userId==null || userId.length==0?
      <button class="bg-cyan-600 rounded-md p-3 w-1/3 m-2" onClick={(e)=>{
            e.preventDefault()
            
            var p
            const arr=problem.problem.attempts;
            console.log(solution)
            const setDocument=async()=>{
              setSendingStreak(true)

              const  docRefer=doc(db,"problems",problem.id)
             
              //READ DATA
              try{
                const user=JSON.parse(sessionStorage.getItem("user"))
                const userType=JSON.parse(sessionStorage.getItem("userType"))
                const userRef=doc(db,"users",user.userId)
                await updateDoc(userRef,{
                  lastLogin:new Date()
                 })
              const data=await getDocs(problemsListCollectionRef)
              data.docs.map((d)=>{
               
                const date=new Date()
                const oldAttempts=problem.problem.attempts
                //const newAttemptID=parseInt(Object.keys(problem.problem.attempts))+1
               // console.log(newAttemptID)
                
                
                const addDocument=async()=>{
                  const cDate=new Date()
                  const currDate=cDate.toString().substring(0,15)
                 
                  console.log(d.id==problemId)
                  
                
                 
                
                  if(d.id==problemId && (solution!=null && solution!="solution")&& (code!=null && code!=initialBoilerCode)){
                    console.log("FOUND")
                    console.log(d)
                    
                    setSendingStreak(true)
                  // problem.problem.attempts[newAttemptID]=getEditorValue()
                 // problem.problem.attempts.push({attempt:code,date:currDate})
           
                  var id=0
                  var index=0
                  const bigAttempts={attempts:{}}
                  const attempts={}
                  var at=0

                  



           

                 const prev=examples
             
                 const prom1=new Promise((resolve,reject)=>{
                  
                  
                  var today=new Date()
                  problem.problem.attempts.push({date:today.toString().substring(0,15),attempt:code})
                  setTimeout(()=>{
                      resolve()
                  },300)
                 })

                 prom1.then(async()=>{
                  const cDate=new Date()
                  const currDate=cDate.toString().substring(0,15);
                 // bigAttempts.attempts[index]={attempt:code,date:currDate}
                  console.log("SETTING DOC")
                  console.log(bigAttempts)
              
                  await updateDoc(docRefer, {
                    id:problem.id,
                   title:problem.problem.title,
                   dataStructure:problem.problem.dataStructure,
                   category:problem.problem.category,
                   lastPracticed:new Date(),
                   hints:problem.problem.hints,
                   no_attempts:problem.problem.no_attempts+1,
                   attempts:problem.problem.attempts,
                   solution:solution,
                   userId:problem.problem.userId,
                   boilerCode:boilerCode,
                   prompt:prompt,
                   examples:examples,
                   level:level,
                   index:timeIndex,
                 
                 }).then((response)=>{
                  console.log(response)
                   
                   
                   
                   setReload(!reload)
 
                 });
                  
                 })
              } 
                  if(d.id==problemId && (solution!=null && solution!="solution")  && (code==null || code==initialBoilerCode)){
                   // console.log(d.problem.hasOwnProperty(boilerCode))
                   console.log("CODE  NULL |SOLUTION NOT NULL")
                   setSendingStreak(true)
                    console.log("here")
                      const cDate=new Date()
                      const currDate=cDate.toString().substring(0,15)
                      console.log("\n\n\ncode is null.solutuion not nukll")
                  await setDoc(docRefer, {
                    id:problem.id,
                    title:problem.problem.title,
                    dataStructure:problem.problem.dataStructure,
                    category:problem.problem.category,
                    lastPracticed:problem.problem.lastPracticed,
                    hints:problem.problem.hints,
                    no_attempts:problem.problem.no_attempts,
                    attempts:problem.problem.attempts,
                    solution:solution,
                    userId:problem.problem.userId, 
                    boilerCode:boilerCode,
                    prompt:prompt,
                    examples:examples,
                    level:level,
                    index:timeIndex,
                  
                   
                  }).then((response)=>{
                    console.log(response)
                    setReload(!reload)

                  });
                  
               
                  } 
                  
                  if(d.id==problemId && (solution=="solution" || solution==null) && (code!=null  || code!=initialBoilerCode)){
                   // console.log("SOLUTION NULL| CODE NOT NULL")
                   // problem.problem.attempts[newAttemptID]=code
                    console.log("HERE\n\n\n\n")
                    var id=0
                    var index=0
                    var bigAttempts={attempts:{}}
                    const attempts={}
                    var at=0
                    var today=new Date()
                    problem.problem.attempts.push({date:today.toString().substring(0,15),attempt:code})
                   
                 

                   setTimeout(async()=>{
                              // console.log(d.problem.hasOwnProperty(boilerCode))
                   console.log("SETTING DOCUMENT")
                   console.log("SOLUTION NULL| CODE NOT NULL\n")
                    
                    console.log(bigAttempts)
                      const cDate=new Date()
                      const currDate=cDate.toString().substring(0,15)
                     await updateDoc(docRefer, {
                    id:problem.id,
                    title:problem.problem.title,
                    dataStructure:problem.problem.dataStructure,
                    category:problem.problem.category,
                    lastPracticed:new Date(),
                    hints:problem.problem.hints,
                    no_attempts:problem.problem.no_attempts+1,
                    attempts:problem.problem.attempts,
                    solution:problem.problem.solution,
                    
                    boilerCode:boilerCode,
                   
                    index:timeIndex,
                   
                   
                  }).then((response)=>{
                    console.log(response)
                    setReload(!reload)

                  });

                   },400)
                  } 

                }
               addDocument()

              })
              }catch(err){
                console.log(err)
              }
            }
        
              setSendingStreak(true)
                   var curr=new Date()
                   curr=curr.toString().substring(0,15)
                   console.log(problem.userId)
                   
                   const user=JSON.parse(sessionStorage.getItem("user"))
                   console.log(problem)

                   console.log(user)
                   console.log({problem:problem.problem,problem,problem_id:problem.id,userId:user.userId,day:curr,currentGroupChallenges:groupChallenges})
                    
                      axios.post("http://localhost:3022/add-to-streak",{problem:problem.problem,problem,problem_id:problem.id,userId:user.userId,day:curr,currentGroupChallenges:groupChallenges}).then((response)=>{
                    
                      console.log(response)
                    var checkAllStreaks=JSON.parse(sessionStorage.getItem("groupChallengesData"))
                      var checkMonthChart=JSON.parse(sessionStorage.getItem("monthChart")) 
                      socket.emit("UPDATE_GROUP_CHALLENGE",{user:user},(cb)=>{
                        console.log("-----CALLBACK",cb)
                        socket.on("GROUP_CHALLENGE_UPDATED",(data)=>{
                          console.log("\n\n\n FROM SOCKET",data)
                          if(data.groupChallenge!=null){
                        dispatch(setGroupChallenges(data.groupChallenge))
                          }
                         })   
                      }) 
                      console.log(response.data)
                      if(response.data.message!=null){
                       
                       
                        alert(response.data.message)
                    
                        setSendingStreak(false)

                      }else if(response.data.success){
                        const user =JSON.parse(sessionStorage.getItem("user"))
                     
                     
                      
                        var day=new Date()
                        const date=day.toString().substring(0,15)
                       
                        setDocument().then((response)=>{
                          //resetEditorValue()
                          console.log(response)
                          console.log(p) 
                       
                         
                            axios.get("http://localhost:3022/streak-animation/"+user.userId).then((response)=>{
                              console.log("RESPONSE STREAK ANIMATION",response)
                              if(response.data.streakExists){
                                
                                dispatch(setLastDate(new Date(response.data.lastDate)))
                                dispatch(setPercent(response.data.percent))
                                dispatch(setDays(response.data.days))
                                dispatch(setCompletedDays(response.data.completedDays))
                                dispatch(setStartingPoint(response.data.start))
                                setTimeout(()=>{
                                  dispatch(fireOff())
                                  alert("SUCCESS+++")
                                },500)
                              }else{
                                alert("SUCCESS+++")
                                
                              }
                            })
                          
                           setSendingStreak(false)

                        })
                      }
                      
                     })

          }}>
           <p class="font-bold text-white ">Submit </p> 
          </button>
          :<div></div>
          }
        </div>
      </div>
      {problem.problem.testCases!=null?
      <div class="flex-col">
        {
          Object.keys(problem.problem.testCases).forEach((k)=>{
            return(<p>k</p>)
          })
        }

      </div>
      :
      <div>

      </div>
     }
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-3/4 h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            setTemplate={setTemplate}
            onChange={onChange} 
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-1/4 flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
           
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
          
        </div>
      
      </div>
      <div class="flex flex-col p-3 rounded-md bg-yellow-700 m-2">
        
        <div class="flex w-full ">       
         <button class="bg-green-500 p-2 flex justify-center m-2 rounded-md w-1/2" onClick={()=>{
          setSeeSolution(!seeSolution)
          setSeeAttempts(false)
        }}>
          <p class="text-white font-bold">See Solution</p>
        </button>
    
        <button class="bg-orange-400  p-2 flex justify-center m-2 rounded-md w-1/2" onClick={()=>{
          setSeeAttempts(!seeAttempts)
          setSeeSolution(false)
          console.log(problem.problem.attempts)
        }}>
          <p class="text-white text-center font-bold">See Attempts</p>
        </button>
        </div>

        {
          seeSolution? 
          <div class="flex-col bg-white rounded">
            <p class="text-2xl font-bold text-center">Solution</p>
            <p class="whitespace-pre-wrap text-black font-bold m-2">{problem.problem.solution.length<3?"No solution":problem.problem.solution}</p>
            </div>:<p></p>
        }
        {seeSolution && userId==null?
        <div class="flex-col  w-full">
          <p class="text-center text-white font-bold text-2xl">Add Solution</p>
        <textarea class="whitespace-pre-wrap p-3 mt-2 rounded-md flex w-full" name="textarea" rows="5" cols="40" placeholder="//Solution" onChange={(e)=>{
          console.log(e.target.value)
          if(e.target.value.length>0){
            
            setSolution(e.target.value)
            console.log(solution)
          }
          console.log(solution)
        }}></textarea>
        <button class="bg-green-600 p-2 w-full flex rounded-md mt-2 justify-center" onClick={async()=>{
          const ref= doc(db,"problems",problem.id)
          try{
          await updateDoc(ref,{
            solution:solution
          })
          alert("SUCCESS: solution set for problem "+problem.problem.title+" !!")
        }catch(err){
          console.log(err)
        }


        }}>
          <p class="text-white  font -bold text-center">Submit Solution</p>
        </button>
        </div>
        :
        <div></div>
      }


        {
          seeAttempts && problem.problem.attempts!=null? 
          <div>
            
            <div class="flex w-full bg-white">
              <div class=" h-[60vh] overflow-y-scroll overflow-hidden w-full">
              
            {
            problem.problem.attempts.map((a)=>{
          
              return(
                <div class="flex-col w-full p-3 m-3 bg-gray-600">
                  <p class="font-bold text-center text-white">{a.date}</p>
                  <p class=" whitespace-pre text-white">{a.attempt}</p>
                </div>
              )
            })
            
           
            }
              </div>
            </div>
         
        
          </div>:<div>
            
          </div>
        }




         
        
      </div>
         
      </div>
    </div>
  )
  console.log(problem.problem.attempts)
}else{
  return(<div></div>)
}
}
const mapStateToProps = (state, props) => {
  var socket=state.socket.socket
  var percent=state.streaks.percent

  return {
   socket:socket,
   percent:percent
  };
};
export default connect(mapStateToProps)(PracticePage)