
import { Routes, Route } from 'react-router-dom';
import style from './App.module.css';
import Login from './Login/intra/Login.jsx';
import AuthProvider from './UserContext/Context.jsx';
import Layout from './Layout.jsx';
// import Settings from './components/Setting/Setting.jsx';
import LoginSignup from './Login/SignupSignin/SignupSignin.jsx';
function App() {
  

  return (
    <div className={style.EntirePage}>
      <div className={style.MainContent}>
      <AuthProvider>
        {/* <Layout /> */}
        <Routes>
            <Route path="/" element={<h1>main page</h1>} />
            <Route path="/home" element={<h1>Home</h1>} />
            <Route path="/login" element={<LoginSignup />} />
          </Routes>
      </AuthProvider>
        </div>
      </div>
     // </BrowserRouter>
  );
}

export default App;
