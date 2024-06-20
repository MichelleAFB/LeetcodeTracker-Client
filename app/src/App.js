import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

//pages
import Auth from './pages/Auth';
import Home from './pages/Home';
import PracticePage from './pages/PracticePage';
import PracticePageOtherUser from './pages/PracticePageOtherUser';
import Header from './components/layout/Header';
import AddLeetcodeProblemModal from './components/AddLeetcodeProblemModal';
import EditProblemModal from './components/EditProblemModal';
import EditProblemModal2 from './components/EditProblemModal2';
import AnalyticsPage from './pages/AnalyticsPage';
import User from './pages/User'
import {useState,useEffect} from "react"
import {connect} from 'react-redux'
import ChallengesPage from './pages/ChallengesPage';
import SettingsPage from './pages/SettingsPage';
import UpdateUserSuccess from './pages/UpdateUserSuccess';
import AllUsers from './components/AllUsers';
import SettingsModal from './components/SettingsModal';
import EditChallengeModal from './components/EditChallengeModal';
import ShowFFModal from './components/ShowFFModal';
import AddOtherUsersProblemModal from './components/AddOtherUsersProblemModal';
import ChallengeRequestModal from './components/ChallengeRequestModal';
import axios from 'axios';
import { socket } from './socket';
import { setSocket } from './redux/socket/socket-actions';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

function App({user,visibility,socket}) {
const dispatch=useDispatch()

  
const[isLoading,setIsLoading]=useState(true)
const[connected,setConnected]=useState(false)
const[ourRoom,setOurRoom]=useState()
const [ourSocket,setOurSocket]=useState()

 
  useEffect(()=>{
    const user=JSON.parse(sessionStorage.getItem("user"))
    const prom=new Promise((resolve,reject)=>{
      console.log("in app",socket)
      if(socket!=null){
      if(!socket.connected){
      var socket=io.connect("http://localhost:3042")
      console.log(Object.keys(socket))
      if(user!==null){
      socket.emit("NEW_USER_SESSION",{user:user,message:"hi",room:socket.id})
      console.log("IN app",socket)
        setOurSocket(socket)
        dispatch(setSocket(socket))
      setTimeout(()=>{
        console.log("SOCKET SET")
        resolve()
      },200)
    }else{
      resolve()
    }
    }else{
      console.log("socket GOOD",socket)
      resolve()
    }
  }else{
    console.log("SOCKET GOOD",socket)
    var s=io.connect("http://localhost:3042")
    dispatch(setSocket(s))
    setOurSocket(s)
    setTimeout(()=>{
      resolve()
    },500)
  }
      



    })
    prom.then(()=>{
      console.log("here")
      setIsLoading(false)
    })
    

  },[visibility]) 
  
if(!isLoading){
  socket.emit("NEW_USER_SESSION",{user:user,id:socket.id,source:"APP"},()=>{
    console.log("DONE")
  })

  return (
    <div class="flex-col ">

    <Router>
      <EditProblemModal/>
      <AddLeetcodeProblemModal/>
      <SettingsModal/>
      <EditChallengeModal/>
      <ShowFFModal/>
      <AddOtherUsersProblemModal/>
      <ChallengeRequestModal/>


      <Header  />
      <AllUsers/>
      <Routes>
       

        <Route path="/" element={<Auth/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/practice/:problemId/:timeIndex" element={<PracticePage/>}/>
        <Route path="/practice/:problemId/:timeIndex/:id" element={<PracticePageOtherUser/>}/>
        <Route path="/analytics" element={<AnalyticsPage/>}/>
        <Route path="/challenges" element={<ChallengesPage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/payment/success/:subscription" element={<UpdateUserSuccess/>}/>
        <Route path="/user/:id" element={<User/>}/>

      
        
      </Routes>
    </Router>
    </div>
  );
}else{
  return(<div></div>)
}
}

const mapStateToProps = (state, props) => {
  var visibility= state.user.visibility;
  var user=state.user.user
  var socket=state.socket.socket
  console.log("visibility in APP.JS"+visibility,socket)
  if(user==null){
    user=JSON.parse(sessionStorage.getItem("user"))
  }
  if(visibility==null){
    visibility=JSON.parse(sessionStorage.getItem("headerVisibility"))
    
    console.log(visibility)
  }

  return {
   visibility:visibility,
   user:user,
   socket:socket
  
  };
};

export default connect(mapStateToProps)(App);
