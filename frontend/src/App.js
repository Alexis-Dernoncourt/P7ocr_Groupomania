import './App.css';
import { useState } from 'react';
import {Routes, Route} from "react-router-dom";
import Header from './components/Header/Header';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Home2 from './components/Home/Home2';
import Profile from './components/Profile/Profile';
import ProfileUpdate from './components/Profile/ProfileUpdate';

function App() {
  const [ infoMessage, setInfoMessage ] = useState(null);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home2 />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup setInfoMessage={setInfoMessage}/>} />
        <Route path="/login" element={<Login infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
        <Route path="/profile" element={<Profile infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
        <Route path="/profile-update" element={<ProfileUpdate setInfoMessage={setInfoMessage} />} />
        <Route path="/*" element={<Home2 />} />
      </Routes>
    </div>
  );
}

export default App;
