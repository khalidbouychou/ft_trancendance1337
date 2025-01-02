import { Routes, Route} from "react-router-dom";
import style from "./App.module.css";
import Layout from "./Layout.jsx";
import Games from "./components/Game/Game.jsx";
import PingPongGames from "./components/Game/components/PingGame/PingGame.jsx";
import LocalGame from "./ponggame/localpong/LocalGame.jsx";
import LocalTeamGame from "./ponggame/teampong/LocalTeamGame.jsx";
import OnlineGame from "./ponggame/onlinepong/OnlineGame.jsx";
// import XO from "./xo_game/online.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Setting from "./Setting/Setting.jsx";
import Notificationz from "./components/Notification/Notification.jsx";
import FriendGame from "./ponggame/friendpong/FriendGame.jsx";
import LoginSignup from "./Login/SignupSignin/SignupSignin.jsx";
import PageNotFound from "./Login/PageNotFound/PageNoteFound.jsx";
import Twofa from "./Login/2fa/twofa.jsx";
import Otplogin from "./Login/OtpLogin/Otplogin.jsx";
import { ToastContainer } from "react-toastify";
import Network from "./Login/Network/Network.jsx";
import { useTranslation } from "react-i18next";
import AuthProvider from "./UserContext/Context.jsx";

function App() {
  return (
    <AuthProvider>
      <div className={style.EntirePage}>
        <div className={style.MainContent}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="games" element={<Games />} />
              <Route path="pingpong-games" element={<PingPongGames />} />
              <Route path="games/localpong" element={<LocalGame />} />
              <Route path="friend-game" element={<FriendGame />} />
              <Route path="games/localteampong" element={<LocalTeamGame />} />
              <Route path="games/onlinepong" element={<OnlineGame />} />
              <Route path="chat" element={<h1>No Chat Yet -_-</h1>} />
              <Route path="profile/:username" element={<Profile />} />
              <Route path="setting" element={<Setting />} />
              <Route path="twofa" element={<Twofa />} />
              <Route path="otp" element={<Otplogin />} />
              <Route path="network" element={<Network />} />
            </Route>

            <Route path="/login" element={<LoginSignup />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        stacked
      />
      </AuthProvider>
  );
}

export default App;
