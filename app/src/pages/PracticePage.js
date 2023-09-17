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
import {getDocs,collection,setDoc,doc,updateDoc} from 'firebase/firestore'

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
 
function PracticePage() {

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
  const [language, setLanguage] = useState(
    {
      id: 4,
      name: "Java (OpenJDK 14.0.1)"
  });
  const[prompt,setPrompt]=useState("none")


  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  

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
  const editorRef=useRef()

  const problemsListCollectionRef=collection(db,"problems")

  


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
          const user=JSON.parse(sessionStorage.getItem("user"))
          const userType=JSON.parse(sessionStorage.getItem("userType"))

        const data=await getDocs(problemsListCollectionRef)
        data.docs.map((doc)=>{
        
         
          if(doc.id==problemId){
            const newp=doc.data()
            newp.xid=doc.id
            const theProb=newp
            console.log(doc.data())
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
  
console.log(selectedLanguage)
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
  if(!isLoading && problem!=null){

  
    
    const oldAttempts=problem.problem.attempts
    const newAttemptID=parseInt(Object.keys(problem.problem.attempts))+1
     
    
    
   
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
        <button class="bg-purple-600 rounded-md p-3 m-3 flex " onClick={()=>{
        
        
        const setData=async(p)=>{
          console.log(code)
          const  docRefer=doc(db,"problems",p.id)
          await setDoc(docRefer, {
            title:p.problem.title,
            dataStructure:p.problem.dataStructure,
            category:p.problem.category,
            hints:p.problem.hints,
            lastPracticed:p.problem.lastPracticed,
            no_attempts:p.problem.no_attempts,
            attempts:p.problem.attempts,
            solution:solution,
            userId:p.problem.userId,
            boilerCode:code,
            prompt:prompt,
            examples:examples,
            level:level
           
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
                  
                
                 
                
                  if(d.id==problemId && solution!=null && (code!=null && code!=initialBoilerCode)){
                    console.log("FOUND")
                    console.log(d)
                    
                    setSendingStreak(true)
                  // problem.problem.attempts[newAttemptID]=getEditorValue()
                  problem.problem.attempts[newAttemptID]=code
           
                  var id=0
                  var index=0
                  const bigAttempts={attempts:{}}
                  const attempts={}
                  var at=0

                  var min = Object.keys(problem.problem.attempts.attempts).reduce(function (a, b) { return a > b ? a : b; });  
                  console.log("LARGEST INDEX:"+min)
                   bigAttempts.attempts[min+1]={attempt:code,date:currDate}
                   console.log("NEW ATTEMPT")
                   console.log(bigAttempts[min+1])



           

                 const prev=examples
             
                 const prom1=new Promise((resolve,reject)=>{
                  
                  Object.keys(prev).forEach((key)=>{
                  //  console.log(prev[key])
                  })
                  console.log(bigAttempts)
                  setTimeout(()=>{
                    console.log("RESOLVE")
                    console.log(bigAttempts[min+1])
                      resolve()
                  },300)
                 })

                 prom1.then(async()=>{
                  const cDate=new Date()
                  const currDate=cDate.toString().substring(0,15);
                  bigAttempts.attempts[index]={attempt:code,date:currDate}
                  console.log("SETTING DOC")
                  console.log(bigAttempts)
                 
                  await setDoc(docRefer, {
                    id:problem.id,
                   title:problem.problem.title,
                   dataStructure:problem.problem.dataStructure,
                   category:problem.problem.category,
                   lastPracticed:currDate,
                   hints:problem.problem.hints,
                   no_attempts:problem.problem.no_attempts+1,
                   attempts:bigAttempts,
                   solution:solution,
                   userId:problem.problem.userId,
                   boilerCode:boilerCode,
                   prompt:prompt,
                   examples:examples,
                   level:level
                  
                 }).then((response)=>{
                  console.log(response)
                   
                   
                   
                   setReload(!reload)
 
                 });
                  
                 })
              } 
                  if(d.id==problemId && solution!=null  && (code==null || code==initialBoilerCode)){
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
                    level:level
                   
                  }).then((response)=>{
                    console.log(response)
                    setReload(!reload)

                  });
                  
               
                  } 
                  
                  if(d.id==problemId && solution==null && (code!=null  || code!=initialBoilerCode)){
                    console.log("SOLUTION NULL| CODE NOT NULL")
                    problem.problem.attempts[newAttemptID]=code
                    console.log("HERE\n\n\n\n")
                    var id=0
                    var index=0
                    const bigAttempts={attempts:{}}
                    const attempts={}
                    var at=0
                    var min = Object.keys(problem.problem.attempts.attempts).reduce(function (a, b) { return a > b ? a : b; }); 
                    console.log("LARGEST INDEX:"+min)
                     bigAttempts.attempts[min+1]={attempt:code,date:currDate}
                   
                 

                   setTimeout(async()=>{
                              // console.log(d.problem.hasOwnProperty(boilerCode))
                   console.log("SETTING DOCUMENT")
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
                    attempts:bigAttempts,
                    solution:problem.problem.solution,
                    userId:problem.problem.userId, 
                    boilerCode:boilerCode,
                    prompt:prompt,
                    examples:examples,
                    level:level
                   
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
                    axios.post("http://localhost:3022/add-to-streak",{problem:problem.problem,problem,problem_id:problem.id,userId:user.userId,day:curr}).then((response)=>{
                      
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
           
            
          }}>
           <p class="font-bold text-white ">Submit</p> 
          </button>
       
   
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
        <p class="text-center text-white font-bold text-2xl">Solution</p>
        <textarea class="whitespace-pre-wrap p-3 mt-2 rounded-md" name="textarea" rows="5" cols="40" placeholder="//Solution" onChange={(e)=>{
          console.log(e.target.value)
          if(e.target.value.length>0){
            
            setSolution(e.target.value)
            console.log(solution)
          }
          console.log(solution)
        }}></textarea>
        <button class="bg-green-500" onClick={()=>{
          setSeeSolution(!seeSolution)
        }}>
          <p class="text-white">See Solution</p>
        </button>
        {
          seeSolution? <p class="whitespace-pre-wrap text-white font-bold m-2">{problem.problem.solution}</p>:<p></p>
        }
        <button class="bg-orange-400" onClick={()=>{
          setSeeAttempts(!seeAttempts)
        }}>
          <p class="text-white">See Attempts</p>
        </button>
        {
          seeAttempts && attempts!=null? 
          <div class="bg-white">
            {
            Object.keys(attempts).map((k)=>{
              console.log(attempts)
            
              const at=attempts[k]
                if(at!=null){
              
              if(at!=null && typeof(at.attempt)!="object" ){
                console.log(at)
                console.log(typeof(at.attempt))
               
              return(
                <div class="flex flex-col bg-gray-200 rounded-md p-2 m-1">
              <p class="text-center font-bold">{at.date}</p>
              <p class="text-sm whitespace-pre-wrap ">{at.attempt}</p>
            </div>
              )
              }
            }else{
              console.log(attempts)
            }
            })
            
           
            }
        
          </div>:<div>
            {
              console.log(problem.problem.attempts.size)
            }
          </div>
        }
      </div>
         
      </div>
    </div>
  )
}else{
  return(<div></div>)
}
}

export default PracticePage