import './App.css';

import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import TellUsMore from './components/TellUsMore';
import DiningHall from './components/DiningHall';
import { CoursePage } from './components/CoursePage';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<LandingPage/>}/>
      <Route exact path='/Login' element={<LoginPage/>}/>
      <Route exact path='/SignUp' element={<SignUpPage/>}/>
      <Route exact path='/TellUsMore' element={<TellUsMore/>}/>
      <Route exact path='/DiningHall' element={<DiningHall/>}/>
      <Route exact path='/Course' element={<CoursePage/>}/>
    </Routes>
  );
}

export default App;
