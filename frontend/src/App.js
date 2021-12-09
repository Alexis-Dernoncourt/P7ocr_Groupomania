import './App.css';
import { useState } from 'react';
import {Routes, Route} from "react-router-dom";
import Header from './components/Header/Header';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import RedirectToLogin from './components/Home/RedirectToLogin';
import Profile from './components/Profile/Profile';
import ProfileUpdate from './components/Profile/ProfileUpdate';
import AuthContextProvider from './context/AuthContext';
import ProtectedRoutes from './ProtectedRoutes';

function App() {
  const [ infoMessage, setInfoMessage ] = useState(null);

  return (
    <div className="App">
      <AuthContextProvider>
        <Header />
        <Routes>
          <Route path="/signup" element={<Signup setInfoMessage={setInfoMessage}/>} />
          <Route path="/login" element={<Login infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
          {/* <Route path="/posts" element={} /> */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Home setInfoMessage={setInfoMessage} />} />
            <Route path="/profile" element={<Profile infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
            <Route path="/profile-update" element={<ProfileUpdate setInfoMessage={setInfoMessage} />} />
          </Route>
          <Route path="*" element={<RedirectToLogin />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
