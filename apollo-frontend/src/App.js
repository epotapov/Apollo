import './App.css';

import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import EditProfile from './components/EditProfile';
import DiningHall from './components/DiningHall';
import CoursePage from './components/CoursePage';
import ProfilePage from './components/ProfilePage';
import Error from './components/Error';

function App() {

  return (
    <Routes>
      <Route exact path='/' element={<LandingPage/>}/>
      <Route exact path='/Login' element={<LoginPage/>}/>
      <Route exact path='/SignUp' element={<SignUpPage/>}/>
      <Route exact path='/EditProfile' element={<EditProfile/>}/>
      <Route exact path='/DiningHall' element={<DiningHall/>}/>
      <Route exact path='/Course' element={<CoursePage/>}/>
      <Route exact path='/Profile' element={<ProfilePage />}/>
      <Route exact path='*' element={<Error/>}/>
    </Routes>
  );
}

export default App;
