
import { Routes, Route, useNavigate } from 'react-router-dom';
import style from './App.module.css';

import AuthProvider from './UserContext/Context.jsx';

// import Settings from './components/Setting/Setting.jsx';
import LoginSignup from './Login/SignupSignin/SignupSignin.jsx';
import { useContext, useEffect } from 'react';
function App() {
  
  // const {user} = useContext(AuthProvider);
  // const navigate = useNavigate();
  // useEffect (() => {

  //   if (!user)
  //     navigate('/login');
  //   console.log(user);
  // }

  // , [user, navigate]);

  return (
    <div className={style.EntirePage}>
      <div className={style.MainContent}>
      
        {/* <Layout /> */}
        <Routes>
            <Route path="/" element={<h1>main page</h1>} />
            <Route path="/home" element={<h1>Home</h1>} />
            <Route path="/login" element={<LoginSignup />} />
          </Routes>
        </div>
      </div>
     // </BrowserRouter>
     
  );
}

export default App;
