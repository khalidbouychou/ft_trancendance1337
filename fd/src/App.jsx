import { Route, Routes, BrowserRouter } from "react-router-dom";
import style from "./App.module.css";
import Login from "./components/khbouych/Login/Login.jsx";
// import PrivateRoutes from "./components/khbouych/PrivateRoutes/PrivateRoutes.jsx";
// import Home from "./components/Home/Home.jsx";
// import Games from "./pages/Game.jsx"; 
// import Chat from "./Pages/Chat.jsx";
// import Profile from "./Pages//Profile.jsx";
// import Setting from "./Pages/Setting.jsx";
// import Notificationz from "./Pages/Notification.jsx";
// import None from "./Pages/None.jsx";
// import Sidebar from "./components/Sidebar.jsx";

function App() {
  return (
    // <BrowserRouter>
      <div className={style.EntirePage}>
        {/* {window.location.pathname !== "login" && <Sidebar />} */}
        <div className={style.MainContent}>
          <Routes>
            {/* <Route path="/" element={<PrivateRoutes />}>
              <Route path="home" element={<Home />} />
              <Route path="games" element={<Games />} />
              <Route path="chat" element={<Chat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="setting" element={<Setting />} />
              <Route path="notification" element={<Notificationz />} />
            </Route> */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/*" element={<None />} /> */}
          </Routes>
        </div>
      </div>
    // </BrowserRouter>
  );
}

export default App;
