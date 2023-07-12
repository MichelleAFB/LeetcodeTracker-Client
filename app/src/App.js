import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

//pages
import Auth from './pages/Auth';
import Home from './pages/Home';
import PracticePage from './pages/PracticePage';

import Header from './components/layout/Header';
import AddLeetcodeProblemModal from './components/AddLeetcodeProblemModal';
import EditProblemModal from './components/EditProblemModal';
function App() {
  return (
    <Router>
      <EditProblemModal/>
      <AddLeetcodeProblemModal/>
        <Header/> 
      <Routes>
        <Route path="/" element={<Auth/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/practice/:problemId" element={<PracticePage/>}/>
      
        
      </Routes>
    </Router>
  );
}

export default App;
