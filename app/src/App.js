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
function App({user,visibility}) {

  const[isLoading,setIsLoading]=useState(true)
  console.log(visibility)
  useEffect(()=>{


  },[visibility]) 
  

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


      {
        JSON.parse(sessionStorage.getItem("user"))!=null?
        <Header/>
        :
        <Header  />

      }
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
}

const mapStateToProps = (state, props) => {
  var visibility= state.user.visibility;
  var user=state.user.user
  console.log("visibility in APP.JS"+visibility)
  if(user==null){
    user=JSON.parse(sessionStorage.getItem("user"))
  }
  if(visibility==null){
    visibility=JSON.parse(sessionStorage.getItem("headerVisibility"))
    console.log(visibility)
  }

  return {
   visibility:visibility,
   user:user
  };
};

export default connect(mapStateToProps)(App);
