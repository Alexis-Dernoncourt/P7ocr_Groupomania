import 'bulma/css/bulma.min.css';
import {Routes, Route} from "react-router-dom";
import ProtectedRoutes from './ProtectedRoutes';
import ProtectedAdminRoutes from './ProtectedAdminRoutes';
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
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <div className="has-navbar-fixed-top pt-6">
        <Navbar />
        <Toaster  
          toastOptions={{
            duration: 4000,
            position: 'top-center',
            style: {
              boxShadow: '0px 0px 25px lightgrey',
              padding: '16px',
            },
          }}
        />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/articles" element={<Home />} />
              <Route element={<ProtectedAdminRoutes />}>
                <Route path="/admin" element={<AdminPageView />} >
                  <Route path="/admin/moderate-posts" element={<ArticlesToModerateView />}/>
                  <Route path="/admin/moderate-comments" element={<CommentsToModerateView />} />
                </Route>
              </Route>
            <Route path="/article/:id" element={<ArticleByIdView />} />
            <Route path="/article/:id/update" element={<UpdateArticleView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/update" element={<ProfileUpdate />} />
          </Route>
          <Route path="*" element={<RedirectToLogin />} />
        </Routes>
    </div>
  );
}

export default App;
