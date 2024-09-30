import "./App.css";
import { Route, Routes } from "react-router-dom";
import Otp from "./component/Otp/Otp.jsx";
// import AuthProvider, { AuthContext } from "./component/UserContext/Context.jsx";
import Login from "./component/Login/Login.jsx";
// import NotPageFound from "./component/Layout/NoPageFound/NoPageFound.jsx";
// import Sidebar from "./component/Sidebar/Sidebar.jsx";
import HomePage from "./component/HomePage/HomePage.jsx";
// import { useContext } from "react";
import RequireAuth from "./component/RequireAuth/RequireAuth.jsx";
import Chat from "./component/Chat/Chat.jsx";
import Profile from "./component/Profile/Profile.jsx";

// import Notification from "./component/Notification/Notification.jsx";

// const Profil = () => {
//   return <h1>Profile</h1>;
// };

// const Chat = () => {
//   return <h1>Chat</h1>;
// };

import { Link } from "react-router-dom";
import AuthProvider from "./component/UserContext/Context.jsx";

import Dashboard from "./component/Dashboard/Dashboard.jsx";
function App() {
  return (
    <AuthProvider>

    <Routes>
      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="profil" element={<Profile />} />
          <Route path="otp" element={<Otp />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />

      {/* Public Routes */}
      {/* <Route path="*" element={<NotPageFound />} /> */}
    </Routes>
    </AuthProvider>
  );
}
export default App;
