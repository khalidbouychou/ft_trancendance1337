import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Setting from "./components/Setting/Settings.jsx";
import Home from "./components/Home/Home.jsx";
import Achievement from "./pages/Achievement.jsx";
import Notificationz from "./components/Notification/Notification.jsx";
// import None from './pages/None.jsx';
import style from "./App.module.css";

import Login from "./components/khbouych/Login/Login.jsx";

import AuthProvider from "./components/khbouych/UserContext/Context.jsx";

function App() {
  return (
    <AuthProvider>
      <div className={style.EntirePage}>
        {window.location.pathname !== "/login" && <Sidebar />}
        <div className={style.MainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/achievement" element={<Achievement />} />
            <Route path="/notification" element={<Notificationz />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="*"element={<None />}/> */}
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
