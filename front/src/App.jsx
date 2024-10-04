import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import Profile from './pages/Profile.jsx';
import Setting from './pages/Setting.jsx';
import Achievement from './pages/Achievement.jsx';
import Notificationz from './pages/Notification.jsx';
import None from './pages/None.jsx';
import Game from './pages/Game.jsx';
import LocalGame from './pages/LocalGame.jsx';
import LocalTeamGame from './pages/LocalTeamGame.jsx';
import OnlineGame from './pages/OnlineGame.jsx';
import Tournament from './pages/Tournament.jsx';
import AuthProvider from './UserContext/Context.jsx';
import style from './App.module.css';

function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
        <div className={style.EntirePage}>
            <Sidebar/>
          <div className={style.MainContent}>
            <Routes>
              <Route path="/" element={<Home />} >
                <Route path="game" element={<Game />} />
                <Route path="localpong" element={<LocalGame />} />
                <Route path="localteampong" element={<LocalTeamGame />} />
                <Route path="onlinepong" element={<OnlineGame />} />
                <Route path="tournament" element={<Tournament />} />
                <Route path="chat" element={<Chat />} />
                <Route path="profile" element={<Profile />} />
                <Route path="setting" element={<Setting />} />
                <Route path="achievement" element={<Achievement />} />
                <Route path="notification" element={<Notificationz />} />
              </Route>
              <Route path="*" element={<None />} />
            </Routes>
          </div>
        </div>
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
}

export default App;
