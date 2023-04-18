import './App.css';
import { useState } from 'react';
import { useThemeContext } from './hooks/useThemeContext';

import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import EditProfile from './components/EditProfile';
import DiningHall from './components/DiningHall';
import CoursePage from './components/CoursePage';
import ProfilePage from './components/ProfilePage';
import Group from './components/Group';
import ResetPass from './components/ResetPass';
import ChangePass from './components/ChangePass';
import Error from './components/Error';
import Map from './components/Map';
import ChatPage from './components/chats/ChatPage';
import CreateGroup from './components/CreateGroup';


function App() {
  const { theme } = useThemeContext();
  return (
    <div id={theme}>
      <Routes>
        <Route exact path='/' element={<LandingPage/>}/>
        <Route exact path='/Login' element={<LoginPage/>}/>
        <Route exact path='/SignUp' element={<SignUpPage/>}/>
        <Route exact path='/EditProfile' element={<EditProfile/>}/>
        <Route exact path='/DiningHall' element={<DiningHall/>}/>
        <Route exact path='/Course/:courseName' element={<CoursePage/>}/>
        <Route exact path='/Profile/:username' element={<ProfilePage />}/>
        <Route exact path='/Group' element={<Group />}/>
        <Route exact path="/ResetPass/:token" element={<ResetPass />}/>
        <Route exact path="/ChangePass" element={<ChangePass />}/>
        <Route exact path="/Map" element={<Map />}/>
        <Route exact path="/Chat" element={<ChatPage />}/>
        <Route exact path="/CreateGroup" element={<CreateGroup />}/>
        <Route exact path='*' element={<Error/>}/>
      </Routes>
    </div>
  );
}

export default App;
