import 'bulma/css/bulma.min.css';
import { useState } from 'react';
import {Routes, Route} from "react-router-dom";
import AuthContextProvider from './context/AuthContext';
import ProtectedRoutes from './ProtectedRoutes';
import Navbar from './components/Navbar/Navbar';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import RedirectToLogin from './components/Home/RedirectToLogin';
import Profile from './components/Profile/Profile';
import ProfileUpdate from './components/Profile/ProfileUpdate';
import ArticleByIdView from './components/Articles/ArticleByIdView';
import UpdateArticleView from './components/Articles/UpdateArticleView';
import AdminPageView from './components/Admin/AdminPageView';
import ArticlesToModerateView from './components/Admin/ArticlesToModerateView';
import CommentsToModerateView from './components/Admin/CommentsToModerateView';

function App() {
  const [ infoMessage, setInfoMessage ] = useState(null);

  return (
    <div className="has-navbar-fixed-top pt-6">
      <AuthContextProvider>
        <Navbar setInfoMessage={setInfoMessage}/>
        <Routes>
          <Route path="/signup" element={<Signup setInfoMessage={setInfoMessage}/>} />
          <Route path="/login" element={<Login infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/articles" element={<Home infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
            <Route path="/admin" element={<AdminPageView />} >
              <Route path="/admin/moderate-posts" element={<ArticlesToModerateView infoMessage={infoMessage} setInfoMessage={setInfoMessage} />}/>
              <Route path="/admin/moderate-comments" element={<CommentsToModerateView infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
            </Route>
            <Route path="/article/:id" element={<ArticleByIdView infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
            <Route path="/article/:id/update" element={<UpdateArticleView infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
            <Route path="/profile" element={<Profile infoMessage={infoMessage} setInfoMessage={setInfoMessage} />} />
            <Route path="/profile/update" element={<ProfileUpdate setInfoMessage={setInfoMessage} />} />
          </Route>
          <Route path="*" element={<RedirectToLogin />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
