import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

//pages
import Auth from './firebase/Auth';
import Home from './pages/Home';
import PracticePage from './pages/PracticePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/practice/:problemId" element={<PracticePage/>}/>
      
        
      </Routes>
    </Router>
  );
}

export default App;
