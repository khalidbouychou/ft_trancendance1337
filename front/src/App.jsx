import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <div className={style.EntirePage}>
        <Sidebar />
        <div className={style.MainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/pingpong-games" element={<PingPongGames />} />
            <Route path="/games/xo-games" element={<XOGames />} />
            <Route path="/localpong" element={<LocalGame />} />
            <Route path="/localteampong" element={<LocalTeamGame />} />
            <Route path="/onlinepong" element={<OnlineGame />} />
            <Route path="/tournament" element={<Tournament />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/achievement" element={<Achievement />} />
            <Route path="/notification" element={<Notificationz />} />
            <Route path="/*" element={<None />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
