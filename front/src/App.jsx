import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useContext } from "react"
import style from "./App.module.css";
import Layout from "./Layout.jsx";
import PingPongGames from "./components/Game/components/PingGame/PingGame.jsx";
import LocalGame from "./ponggame/localpong/LocalGame.jsx";
import LocalTeamGame from "./ponggame/teampong/LocalTeamGame.jsx";
import LocalTournament from "./ponggame/tournamentpong/Tournament.jsx";
import RemoteTournament from "./ponggame/remotetournement/RemoteTournament.jsx";
import OnlineGame from "./ponggame/onlinepong/OnlineGame.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Setting from "./Setting/Setting.jsx";
import FriendGame from "./ponggame/friendpong/FriendGame.jsx";
import LoginSignup from "./Login/SignupSignin/SignupSignin.jsx";
import PageNotFound from "./Login/PageNotFound/PageNoteFound.jsx";
import Twofa from "./Login/2fa/twofa.jsx";
import Otplogin from "./Login/OtpLogin/Otplogin.jsx";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home/Home.jsx";

import Chat from "./components/Chat/Chat.jsx";
import AuthProvider from "./UserContext/Context.jsx";

function App() {

  return (
    <BrowserRouter>
    <AuthProvider>
      <div className={style.EntirePage}>
        <div className={style.MainContent}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="games" element={<PingPongGames />} />
              <Route path="games/localpong" element={<LocalGame />} />
              <Route path="games/localteampong" element={<LocalTeamGame />} />
              <Route path="games/onlinepong" element={<OnlineGame />} />
              <Route path="games/localtournament" element={<LocalTournament />} />
              <Route path="games/remotetournament" element={<RemoteTournament />} />
              <Route path="friendgame" element={<FriendGame />} />
              <Route path="chat" element={<Chat />} />
              <Route path="profile" element={<RedirectToMyProfile />} />
              <Route path="profile/:profile_name" element={<Profile />} />
              <Route path="setting" element={<Setting />} />
              <Route path="twofa" element={<Twofa />} />
            </Route>
            <Route path="/otp" element={<Otplogin />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop={false}
        closeOnClick={true}
        pauseOnFocusLoss={true}
        stacked= {true}

       />
      </AuthProvider>
   </BrowserRouter>
  );
}

const RedirectToMyProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user || !user.user || !user.user.profile_name) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/profile/${user.user.profile_name}`} replace />;
};

export default App;
