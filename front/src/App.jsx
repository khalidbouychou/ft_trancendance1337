import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/SideBar/Sidebar.jsx';
import Games from './components/Game/Game.jsx';

import PingPongGames from './components/Game/components/PingGame/PingGame.jsx';
import XOGames from './components/Game/components/TicTac/TicTac.jsx';

import Home from './components/Home/Home.jsx';
import Chat from './pages/Chat.jsx';
import Profile from './components/Profile/Profile.jsx';
import Setting from './components/Setting/Setting.jsx';
import Achievement from './pages/Achievement.jsx';
import Notificationz from './components/Notification/Notification.jsx';
import None from './pages/None.jsx';
import LocalGame from './pages/LocalGame.jsx';
import LocalTeamGame from './pages/LocalTeamGame.jsx';
import OnlineGame from './pages/OnlineGame.jsx';
import Tournament from './pages/Tournament.jsx';
import AuthProvider from './UserContext/Context.jsx';
import style from './App.module.css';

import Login from './Login/Login.jsx';

import { AuthContext } from './UserContext/Context.jsx';

import ProtectedRoutes from './protectedRoutes.jsx';

function App() {
  const {islogin, user} = useContext(AuthContext);

  useEffect(() => {
    console.log('islogin', islogin, 'user', user);
  }
  , [islogin]);
  return (
    // <BrowserRouter>

      <div className={style.EntirePage}>
        {window.location.pathname !== '/login' && <Sidebar />}
        <div className={style.MainContent}>
          <Routes>
            <Route path="/" element={<ProtectedRoutes />} > 
              {/* <Route path="/home" element={<Home />} /> */}
              <Route path="games" element={<Games />} />
              <Route path="pingpong-games" element={<PingPongGames />} />
              <Route path="xo-games" element={<XOGames />} />
              <Route path="games/localpong" element={<LocalGame />} />
              <Route path="games/localteampong" element={<LocalTeamGame />} />
              <Route path="games/onlinepong" element={<OnlineGame />} />
              <Route path="games/tournament" element={<Tournament />} />
              <Route path="chat" element={<Chat />} />
              <Route path="profile" element={<Profile />} />
              <Route path="setting" element={<Setting />} />
              <Route path="achievement" element={<Achievement />} />
              <Route path="notification" element={<Notificationz />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<None />} />
          </Routes>
        </div>
      </div>
        
     // </BrowserRouter>
  );
}

export default App;
