import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Profile from "./components/Profile/Profile.jsx";
// import Setting from "./components/Setting/Settings.jsx";
import Home from "./components/Home/Home.jsx";
// import Achievement from "./pages/Achievement.jsx";
// import Notificationz from "./components/Notification/Notification.jsx";
// import None from './pages/None.jsx';
import style from "./App.module.css";

import Login from "./components/khbouych/Login/Login.jsx";
import PrivateRoutes from "./components/khbouych/PrivateRoutes/PrivateRoutes.jsx";
function App() {
  return (
    <>
      <div className={style.EntirePage}>
        {window.location.pathname !== "/login" && <Sidebar />}
        <div className={style.MainContent}>
          <Routes>
          <Route path='/' element={<PrivateRoutes/>}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
