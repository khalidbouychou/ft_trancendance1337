import { Routes, Route } from "react-router-dom";
import AuthProvider from "./UserContext/Context.jsx";

import style from "./App.module.css";
import Login from "./Login/intra/Login.jsx";
import Layout from "./Layout.jsx";
import Home from "./components/Home/Home.jsx";
import Games from "./components/Game/Game.jsx";
import PingPongGames from "./components/Game/components/PingGame/PingGame.jsx";
import XOGames from "./components/Game/components/TicTac/TicTac.jsx";
import LocalGame from "./ponggame/localpong/LocalGame.jsx";
import LocalTeamGame from "./ponggame/teampong/LocalTeamGame.jsx";
import OnlineGame from "./ponggame/onlinepong/OnlineGame.jsx";

import XO from "./xo_game/online.jsx";

import Chat from "./Chat/Chat.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Setting from "./components/Setting/Setting.jsx";
import Notificationz from "./components/Notification/Notification.jsx";
import None from "./components/None/None.jsx";
import FriendGame from "./ponggame/friendpong/FriendGame.jsx";

function App() {
  return (
    <AuthProvider>
      <div className={style.EntirePage}>
        <div className={style.MainContent}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="home" element={<Home />} />
                <Route path="games" element={<Games />} />
                <Route path="pingpong-games" element={<PingPongGames />} />
                <Route path="xo" element={<XO invite={false} />} />
	              <Route path="xo_with_invitation" element={<XO invite={true} />} />
                <Route path="games/localpong" element={<LocalGame />} />
                <Route path="/friend-game" element={<FriendGame />} />
                <Route path="games/localteampong" element={<LocalTeamGame />} />
                <Route path="games/onlinepong" element={<OnlineGame />} />
                <Route path="chat" element={<Chat />} />
                <Route path="profile/:username" element={<Profile />} />
                <Route path="setting" element={<Setting />} />
                <Route path="notification" element={<Notificationz />} />
              </Route>
              <Route path="/*" element={<None />} />
              <Route path="/login" element={<Login />} />
            </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
