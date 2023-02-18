import './App.css';

import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<LandingPage/>}/>
      <Route exact path='/SignIn' element={<LoginPage/>}/>
    </Routes>
  );
}

export default App;
