import './App.css';
import {Routes, Route} from "react-router-dom";
import Header from './components/Header/Header';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Home2 from './components/Home/Home2';
import Profile from './components/Profile/Profile';
import ProfileUpdate from './components/Profile/ProfileUpdate';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home2 />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-update" element={<ProfileUpdate />} />
        <Route path="/*" element={<Home2 />} />
      </Routes>
    </div>
  );
}

export default App;
