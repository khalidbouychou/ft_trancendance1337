// import "./App.css";
// import {
//   BrowserRouter,
//   Navigate,
//   Outlet,
//   Route,
//   Routes,
// } from "react-router-dom";
// import Otp from "./component/Otp/Otp.jsx";

// import ContextProvider from "./component/Context/Context.jsx";
// // import Layout from "./component/Layout/Layout";
// import Login from "./component/Login/Login.jsx";
// import {  useState } from "react";
// import NotPageFound from "./component/Layout/NoPageFound/NoPageFound.jsx";
// import Sidebar from "./component/Sidebar/Sidebar.jsx";
// // import Twofa from "/goinfre/khbouych/ft_trancendance1337-2/FrontEnd/src/component/Twofa/Towfa";
// function App() {
//   function PrivateRoute() {
//     const [token,setToken] = useState("document.cookie.split('=')[1]");
//     console.log("********************* > ",token)
//     if (!token) return <Navigate to="/login" />;
//     return (
//       <>
//         <Outlet />
//       </>
//     );
//   }

//   return (
//       <BrowserRouter>
//     <ContextProvider>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="*" element={<NotPageFound />} />
  
//           <Route path="/" element={<PrivateRoute />}>
//             <Route path="home" element={<div>home</div>} />
//             <Route path="/otp" element={<Otp />} />
//             {/* <Route path="/twofa" element={<Twofa />} /> */}
//             <Route path="/chat" element={<div>chat</div>} />
//             <Route path="/game" element={<div>game</div>} />
//             <Route path="/profil" element={<div>profil</div>} />
//             <Route path="/setting" element={<div>setting</div>} />
//             <Route path="/notification" element={<div>notification</div>} />
//           </Route>
//         </Routes>
//         <Sidebar avatarUrl="../public/img/khbouych.jpeg"  nickname="Khbouych" />
//     </ContextProvider>
//       </BrowserRouter>
//   );
// }
// export default App;



import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './component/Sidebar/Sidebar';
import './App.css';

// Placeholder components for each route
const Profile = () => <div>Profile Content</div>;
const Chat = () => <div>Chat Content</div>;
const Notifications = () => <div>Notifications Content</div>;
const Games = () => <div>Games Content</div>;
const Settings = () => <div>Settings Content</div>;

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar 
          avatarUrl="../public/img/khbouych.jpeg" 
          nickname="khbouych" 
        />
        <main className="content-area">
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/games" element={<Games />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;