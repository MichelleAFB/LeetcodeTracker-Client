import React from 'react'
import { useParams } from 'react-router-dom'
import { useState,useRef,useEffect } from 'react'
import { setGroupChallenges } from '../redux/socket/socket-actions'
import { fireOff, setCompletedDays, setDays,setPercent,setStartingPoint } from '../redux/streakProgress/streak-actions'

//outside
import axios from 'axios'
import Editor from '@monaco-editor/react'
import {SandpackCodeEditor,SandpackLayout,SandpackProvider,SandpackPreview} from "@codesandbox/sandpack-react"
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'

import { connect,useDispatch} from 'react-redux'


//firebase
import { db } from '../firebase/firebase'
import {getDocs,collection,setDoc,doc,updateDoc,getDoc, query, where, addDoc} from 'firebase/firestore'

//window
import CodeEditorWindow from "../components/components/CodeEditorWindow";

import { classnames } from "../components/utils/general";
import { languageOptions } from "../components/constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";

import { defineTheme } from "../components/lib/defineTheme";
import useKeyPress from "../components/hooks/useKeyPress";
import Footer from "../components/components/Footer";
import OutputWindow from "../components/components/OutputWindow";
import CustomInput from "../components/components/CustomInput";
import OutputDetails from "../components/components/OutputDetails";
import ThemeDropdown from "../components/components/ThemeDropdown";
import LanguagesDropdown from "../components/components/LanguagesDropdown";

const javascriptDefault = `// some comment`;
 
function PracticePageOtherUser({socket}) {
  const dispatch=useDispatch()
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

  const[currentVariable,setCurrentVariable]=useState({dataType:null, auxDataType:null,arrayLength:null, arrayHeight:null,name:null,value:null})
  const [useTestCase,setUseTestCase]=useState(false)
  const[method,setMethod]=useState()
  const[params,setParams]=useState([])
  const[structure,setStructure]=useState([])
  const[correctTestCaseAnswer,setCorrectTestCaseAnswer]=useState()

  const [language, setLanguage] = useState(
    {
      id: 4,
      name: "Java (OpenJDK 14.0.1)"
  });
  const[prompt,setPrompt]=useState("none")


  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const {timeIndex}=useParams()
  console.log("tineIndex:",timeIndex)

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
  const[alreadyHave,setAlreadyHave]=useState(false)
  const[alreadyHaveQuestionIds,setAlreadyHaveQuestionIds]=useState()
  const editorRef=useRef()
  const userId=useParams().id
  const problemsListCollectionRef=collection(db,"problems")

  
  


  useEffect(()=>{
    
    const prom=new Promise((resolve,reject)=>{

      if (enterPress && ctrlPress) {
   
        handleCompile();
      }
      var p
      var already=false
      const alreadyTitles=[]
      var alreadyQuestionId
      var alreadyObject={}
      var ourTitle
      const getProblemsList=async()=>{

        //READ DATA
        try{
          const user=JSON.parse(sessionStorage.getItem("user"))
          const userType=JSON.parse(sessionStorage.getItem("userType"))

        const data=await getDocs(problemsListCollectionRef)
        
        data.docs.map((doc)=>{
        
          if(doc.data().userId==user.userId){
            alreadyObject[doc.data().title]=doc.id
            console.log(doc.data())
            alreadyTitles.push(doc.data().title)
          }
          if(doc.id==problemId){
            ourTitle=doc.data().title
            
            const newp=doc.data()
            newp.xid=doc.id
            const theProb=newp
           
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
            console.log(doc.data().attempts)
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
      // console.log(data)
       if(alreadyTitles.includes(ourTitle)){
        setAlreadyHave(true)
        setAlreadyHaveQuestionIds(alreadyObject)
        console.log("AlreadyObject",alreadyObject)
       }
        //setProblem(data)
       /* if(data.problem.prompt!=null){
          sessionStorage.setItem("prompt",data.problem.prompt)
          setPrompt(data.problem.prompt)
        }
        */
       setTimeout(()=>{
        resolve()
       })
        //resolve()
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


console.log(params)

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
  socket.on("GROUP_CHALLENGE_UPDATED",(data)=>{
    console.log("\n\n\n FROM SOCKET",data)
    if(data.groupChallenge!=null){
  
    }
   })
  if(!isLoading && problem!=null){

  
    
    const oldAttempts=problem.problem.attempts
    const newAttemptID=parseInt(Object.keys(problem.problem.attempts))+1
     
    console.log(problem.problem)
    console.log("otherUser",userId)
    const user=JSON.parse(sessionStorage.getItem("user"))
    console.log("our user",user)
    
   
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
            {problem.problem.acRate}
          </p>:
          <p></p>
        }
        <p>{problem.problem.acRate}</p>
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
         <p class="whitespace-pre-wrap font-bold m-3 text-white">
              {problem.problem.prompt.replace(/\n\n\n/g,"\n ")}
         </p>
         <p class="whitespace-pre-wrap font-semibold m-3 text-gray-400" onClick={()=>{
           setShowAllPrompt(!showAllPrompts)
         }}>..See Less</p>
       </div>
      :
      <div class="p-3">
        <p class="whitespace-pre-wrap font-bold m-3 text-white">
             {prompt.replace(/\n\n\n/g,"\n ").substring(0,700)}
        </p>
        <p class="whitespace-pre-wrap font-semibold m-3 text-gray-400" onClick={()=>{
          setShowAllPrompt(!showAllPrompts)
        }}>..See More</p>
      </div>
  }
       {
        alreadyHave?
        <p class="text-green-400 text-2xl text-center">
          YOU ALREADY HAVE THIS PROBLEM
        </p>
        :
        <p></p>
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
        {userId!=null || userId.length!=0?
        <button class="bg-purple-600 rounded-md p-3 m-3 flex " onClick={()=>{
        
        
        const setData=async(p)=>{
         // console.log(code)
          const  userRefer=doc(db,"users",user.userId)
          console.log(userRefer)
          console.log(userRefer.data)
          console.log(user)
          console.log(p)
          const ref=doc(db,"users",user.userId)
          var i=0
          if(user.boilerCodeTemplates!=null){
            var already=false
            while(i<user.boilerCodeTemplates.length){
              var temp=user.boilerCodeTemplates[i]
              if(temp.title==p.problem.title){
                already=true
                alert("YOU ALREADY HAVE THIS TEMPLATE")
                i++
                break
              }else{
              i++
              if(i>=user.boilerCodeTemplates.length() && already==false){
                const boilerCodeTemplates=user.boilerCodeTemplates
            boilerCodeTemplates.push({title:p.problem.title,template:p.problem.boilerCode})
            const up=await updateDoc(ref,{boilerCodeTemplates:boilerCodeTemplates})
            alert("SUCCESS:ADDED NEW BOILERCODE TEMPLATE TO YOUR TEMPLATES")
            sessionStorage.setItem("user",JSON.stringify(user))

              }
              }
            }
            
          }else{
            console.log("BOILER TEMP==NULL")
           const  boilerCodeTemplates=[{title:p.problem.title,template:p.problem.boilerCode}]
         console.log(boilerCodeTemplates)
         const up=await updateDoc(ref,{boilerCodeTemplates:boilerCodeTemplates})
         alert("SUCCESS:ADDED NEW BOILERCODE TEMPLATE TO YOUR TEMPLATES")
         user.boilerCodeTemplates=boilerCodeTemplates
         sessionStorage.setItem("user",JSON.stringify(user))
          }
         
            //  const up=await updateDoc(ref,{firstname:firstname})
          
        
         
         /* await updateDoc(docRefer, {
         
            boilerCode:code,
         
           
          }).then((response)=>{
            setBoilerCode(code)
            alert("success: added boilerCode")
        

          });*/

        }

          const setProblems=async(problem)=>{
           

            //READ DATA
            const user=JSON.parse(sessionStorage.getItem("user"))
            const userType=JSON.parse(sessionStorage.getItem("userType"))
            
            const userDocRefer=collection(db,"users")
            console.log(userDocRefer)
            const data=await getDocs(userDocRefer)
           
            try{
             
            data.docs.map((doc)=>{
            
              console.log("user in add boil",user.userId)
           
              if(doc.id==user.userId ){
                
                setData(problem)
              } 
            
            })

            }catch(err){
              console.log(err)
            }
          }
          setProblems(problem)
        
      }}> 
        <p class="text-white font-bold">Add Boiler Code Template</p>
      </button>
      :<div></div>
      }
              {userId!=null && userId.length!=0 && alreadyHave?
        <button class="bg-purple-600 rounded-md p-3 m-3 flex " onClick={()=>{
        
        
        const setData=async(p)=>{
          console.log(code)
          const  docRefer=doc(db,"problems",p.id)
          console.log(docRefer)
          console.log(p)
          /*
          await updateDoc(docRefer, {
         
            boilerCode:code,
         
           
          }).then((response)=>{
            setBoilerCode(code)
            alert("success: added boilerCode")
        

          });
          */

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
      :<div></div>
      }
   
       <button class="bg-orange-600 rounded-md p-3 w-1/2 m-2" onClick={async(e)=>{
            e.preventDefault()
            setSendingStreak(true)
            var p
            const arr=problem.problem.attempts;
            
            const otherUser=collection(db,"users")
            const userData=await getDocs(otherUser)
            const us=JSON.parse(sessionStorage.getItem("user"))
            /*
           userData.docs.map(async(d)=>{
        
            if(d.data().userId==us.userId){
              console.log(d.data().userId,us.userId)
              console.log(d.data())
             // console.log(problem)
              const prob=problem.problem
              const problemsRef=query(collection(db,"problems"),where("userId","==",us.userId))
              const problems=await getDocs(problemsRef)
              console.log(prob)
              var found=false
              problems.docs.map((p)=>{
                
                if(p.data().title==prob.title){
                  found=true
                }
              })
              if(found){
                console.log("FOUND")
              }else{
                const cDate=new Date()
                const currDate=cDate.toString().substring(0,15)
                const newProblem={
                 
                  title:prob.title,
                  dataStructure:prob.dataStructure,
                  category:prob.category,
                  lastPracticed:new Date(),
                  hints:prob.hints,
                  link:prob.link!=null? prob.link:null,
                  acRate:prob.acRate!=null?prob.acRate:0,
                  no_attempts:1,
                  page:prob.page!=null?prob.page:1,
                  attempts:[{attempt:code,date:currDate}],
                  solution:prob.solution,
                  titleSlug:prob.titleSlug!=null? prob.titleSlug:"",
                  userId:us.userId,
                  tags:prob.tags!=null? prob.tags:[], 
                  topicTags:prob.tags!=null? prob.tags:[], 
                  boilerCode:prob.boilerCode,
                  prompt:prob.prompt,
                  examples:prob.examples,
                  level:prob.level,
                  difficulty:prob.level,
                  index:0
                }
                
                const added=await addDoc(collection(db,"problems"),newProblem).then(()=>{
                  axios.post("http://localhost:3022/add-to-streak",{problem:newProblem,problem_id:newProblem.id,userId:us.userId,day:currDate}).then((response)=>{
                    if(response.data.message!=null){
                      alert(response.data.message)
                      setSendingStreak(false)
                      alert("SUCCESS+++")
                    }
                    if(response.data.streak){
                      setSendingStreak(false)
                      alert("SUCCESS+++")
                    }
                  })
                })
                console.log("\n\nNEW PROBLEM",newProblem)
              }
              
            }
           })*/
            const setDocument=async()=>{
              setSendingStreak(true)

              const  docRefer=doc(db,"problems",problem.id)
              //READ DATA
              try{
                const user=JSON.parse(sessionStorage.getItem("user"))
                const userType=JSON.parse(sessionStorage.getItem("userType"))
      
              const data=await getDocs(problemsListCollectionRef)
              data.docs.map((d)=>{
               
                const date=new Date()
                const oldAttempts=problem.problem.attempts
                //const newAttemptID=parseInt(Object.keys(problem.problem.attempts))+1
               // console.log(newAttemptID)
                
                
                const addDocument=async()=>{
                  const cDate=new Date()
                  const currDate=cDate.toString().substring(0,15)
                 
                  
                 if(alreadyHaveQuestionIds[problem.problem.title]==d.id){
                  console.log("FOUND the problem:",d.id,d.data()," our problem",problem.problem.title,alreadyHaveQuestionIds[problem.problem.title])
                  const  docRefer=doc(db,"problems",d.id)
                  var att=d.data().attempts
                  var today=new Date()
                  att.push({date:today.toString().substring(0,15),attempt:code})
                  console.log(d.data())
                  console.log(att)
                  if(att.length>0){
                    att.push({date:new Date().toString().substring(0,15),attempt:code})
                    console.log(att)
                    await updateDoc(docRefer, {
                    
                      lastPracticed:new Date().toString().substring(0,15),
                      
                      no_attempts:d.data().no_attempts+1,
                      attempts:att,
                      
                    
              
                      index:timeIndex,
                    }).then((response)=>{
                     console.log(response)
                      
                      
                      
                      setReload(!reload)
    
                    });
                  }
                  
                 
                  /*
                   await updateDoc(docRefer, {
                    id:d.id,
                   title:problem.problem.title,
                   dataStructure:problem.problem.dataStructure,
                   category:problem.problem.category,
                   lastPracticed:currDate,
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
 
                 });*/
                 
                }
                  
                /*
                 if(!alreadyHave){
                
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
                   lastPracticed:currDate,
                   hints:problem.problem.hints,
                   no_attempts:problem.problem.no_attempts+1,
                   attempts:problem.problem.attempts,
                   solution:solution,
                   userId:problem.problem.userId,
                   boilerCode:boilerCode,
                   prompt:prompt,
                   examples:examples,
                   level:level,
                   index:timeIndex
                  
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
                    index:timeIndex
                   
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
                     await setDoc(docRefer, {
                    id:problem.id,
                    title:problem.problem.title,
                    dataStructure:problem.problem.dataStructure,
                    category:problem.problem.category,
                    lastPracticed:currDate,
                    hints:problem.problem.hints,
                    no_attempts:problem.problem.no_attempts,
                    attempts:problem.problem.attempts,
                    solution:problem.problem.solution,
                    userId:problem.problem.userId, 
                    boilerCode:boilerCode,
                    prompt:prompt,
                    examples:examples,
                    level:level,
                    index:timeIndex
                   
                  }).then((response)=>{
                    console.log(response)
                    setReload(!reload)

                  });

                   },400)
                  } 
                }*/

                }
                /*
                 if(alreadyHave){
                    console.log(problem.problem)
                   var findProbId=alreadyHaveQuestionIds[problem.problem.title]
                  }else{
                    
                  }
                */
               if(alreadyHave){
               addDocument()
               }else{
                return true
               }

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
                   axios.post("http://localhost:3022/add-to-streak",{problem:problem.problem,problem,problem_id:problem.id,userId:user.userId,day:curr/*,currentGroupChallenges:groupChallenges*/}).then((response)=>{
                    
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
                      axios.get("http://localhost:3022/streak-animation/"+user.userId).then((response)=>{
                        console.log("RESPONSE STREAK ANIMATION",response)
                        if(response.data.streakExists){
                          dispatch(setPercent(response.data.percent))
                          dispatch(setDays(response.data.days))
                          dispatch(setCompletedDays(response.data.completedDays))
                          dispatch(setStartingPoint(response.data.start))
                          setTimeout(()=>{
                            dispatch(fireOff())
                            if(alreadyHave){
                            setDocument().then((response)=>{
                              //resetEditorValue()
                              console.log(response)
                              console.log(p) 
                             alert("SUCCESS+++")
                             
                              
                              
                               setSendingStreak(false)
      
                            })
                          }else{
                            alert("SUCCESS+++")
                          }
                          
                          },500)
                        }else{
                          if(alreadyHave){
                          setDocument().then((response)=>{
                            //resetEditorValue()
                            console.log(response)
                            console.log(p) 
                           alert("SUCCESS+++")
                           
                            
                            
                             setSendingStreak(false)
    
                          })
                        }else{
                          alert("SUCCESS+++")
                        }
                          
                        }
                      })
                     
                    
                    }
                    
                   })
                   /*
                   if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                      const latitude = position.coords.latitude;
                      const longitude = position.coords.longitude;
                      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    });
                  } else {
                    console.log("Geolocation is not supported by this browser.");
                  }
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                      const latitude = position.coords.latitude;
                      const longitude = position.coords.longitude;
                      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                      axios.post("http://localhost:3022/add-to-streak",{problem:problem.problem,problem,problem_id:problem.id,userId:user.userId,day:curr,currentGroupChallenges:groupChallenges,latitude:latitude,longitude:longitude}).then((response)=>{
                      
                      console.log(response)
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
                          alert("SUCCESS+++")
                           setSendingStreak(false)
                    
                          
                        })
                        
                      

                      }
                      
                     })
                    });
                  } else {
                    alert("Geolocation is not supported by this browser.");
                  }*/
                    
           
            
          }}>
           <p class="font-bold text-white ">Submit</p> 
          </button>
   
        </div>
        <div class="flex w-full justify-between">
       
   
       
   
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-3/4 h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
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
            <p class="whitespace-pre-wrap text-white font-bold m-2">{problem.problem.solution.length<3?"No solution":problem.problem.solution}</p>
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
              console.log(a)
              return(
                <div class="flex-col w-full p-3">
                  <p class="font-bold text-center">{a.date}</p>
                  <p class=" whitespace-pre">{a.attempt}</p>
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

  return {
   socket:socket
  };
};
export default connect(mapStateToProps)(PracticePageOtherUser)