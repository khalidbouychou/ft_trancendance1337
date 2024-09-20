import React from "react";
import "./App.css";
import {  Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Otp from "./component/Otp/Otp.jsx";

import ContextProvider from "./component/Context/Context.jsx";
import Login from "./component/Login/Login.jsx";
import NotPageFound from "./component/Layout/NoPageFound/NoPageFound.jsx";
import Sidebar from "./component/Sidebar/Sidebar.jsx";
import PrivateRoutes from "./component/PrivateRoutes/PrivateRoute.jsx";


const Home = React.lazy(() => import('./component/Home/Home.jsx'));
const Profiler = React.lazy(() => import('./component/Profiler/Profiler.jsx'));
const Chat = React.lazy(() => import('./component/Chat/Chat.jsx'));
const Game = React.lazy(() => import('./component/Game/Game.jsx'));
const Setting = React.lazy(() => import('./component/Setting/Setting.jsx'));
const Notification = React.lazy(() => import('./component/Notification/Notification.jsx'));

function App() {

  return (
  
      <ContextProvider>
        <Router> 
          <Sidebar/>
        <Routes>
          <Route element={<PrivateRoutes/>}>
            <Route path='/' element={<Home/>} exact/>
            <Route path='/profil' element={<Profiler/>}/>
            <Route path='/chat' element={<Chat/>}/>
            <Route path='/game' element={<Game/>}/>
            <Route path='/setting' element={<Setting/>}/>
            <Route path='/notifications' element={<Notification/>}/>
            <Route path='/otp' element={<Otp/>}/>
          </Route>
          <Route path='*' element={<NotPageFound/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
        </Router>
      </ContextProvider>
  );
}
export default App;
