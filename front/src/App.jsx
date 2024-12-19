import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react"
import AuthProvider from "./UserContext/Context.jsx";
import style from "./App.module.css";
import Layout from "./Layout.jsx";
import Home from "./components/Home/Home.jsx";
// import Chat from "./Chat/Chat.jsx";
import Games from "./components/Game/Game.jsx";
import PingPongGames from "./components/Game/components/PingGame/PingGame.jsx";
import LocalGame from "./ponggame/localpong/LocalGame.jsx";
import LocalTeamGame from "./ponggame/teampong/LocalTeamGame.jsx";
import OnlineGame from "./ponggame/onlinepong/OnlineGame.jsx";
import Chat from "./Chat/Chat.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Setting from "./Setting/Setting.jsx";
import Notificationz from "./components/Notification/Notification.jsx";
import FriendGame from "./ponggame/friendpong/FriendGame.jsx";
import LoginSignup from "./Login/SignupSignin/SignupSignin.jsx";
import PageNotFound from "./Login/PageNotFound/PageNoteFound.jsx";
import Twofa from "./Login/2fa/twofa.jsx";
import Otplogin from "./Login/OtpLogin/Otplogin.jsx";
import { use, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { color } from "chart.js/helpers";
import i18n from "./i18n.js";
import { ToastContainer } from "react-toastify";
import Network from "./Login/Network/Network.jsx";  
import { AuthContext } from "./UserContext/Context.jsx";
import LocalTournament from "./ponggame/tournamentpong/Tournament.jsx";
import RemoteTournament from "./ponggame/remotetournement/RemoteTournament.jsx";
import Newpong from "./ponggame/pong3d/newpong.jsx";

function App() {
  const {t} = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem('lang') || 'en')
  }
  , [localStorage.getItem('lang')])


  return (
    <AuthProvider>
      <div className={style.EntirePage}>
        <div className={style.MainContent}>
          <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="games" element={<Games />} />
                <Route path="pingpong-games" element={<PingPongGames />} />
                <Route path="games/localpong" element={<LocalGame />} />
                <Route path="friend-game" element={<FriendGame />} />
                <Route path="games/localteampong" element={<LocalTeamGame />} />
                <Route path="games/onlinepong" element={<OnlineGame />} />
                <Route path="profile" element={<RedirectToMyProfile />} />
                <Route path="profile/:profile_name" element={<Profile />} />
                <Route path="setting" element={<Setting />} />
                <Route path="games/pong3d" element={<Newpong />} />
                <Route path="chat" element={<Chat />} />
                <Route path="notification" element={<Notificationz />} />
                <Route path="twofa" element={<Twofa />} />
                <Route path="games/localtournament" element={<LocalTournament />} />
               <Route path="games/remotetournament" element={<RemoteTournament />} />
                <Route path="home" element={<Home />} />
                <Route path="lang" element={<Language/>} />
                <Route path="otp" element={< Otplogin/>} />
                <Route path="network" element={< Network/>} />
              </Route>

              <Route path="/login" element={<LoginSignup />} />
              <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        stacked
      />
    </AuthProvider>
  );
}

const RedirectToMyProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user || !user.user || !user.user.profile_name) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/profile/${user.user.profile_name}`} replace />;
};


const Language = () => {
  const {t} = useTranslation();
  const {user, get_auth_user} = useContext(AuthContext);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  }
  return (
    <div>
                    <div style={
                      {
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        marginTop: '10px',
                        marginBottom: '10px',
                        color: 'red',
                        width: '100%'
                      }
                    }>
                    <button style={
                      {
                        color: 'black',
                        backgroundColor: 'white',
                        border: '1px solid red',
                        padding: '5px',
                        borderRadius: '5px',
                        width : '100px',
                        fontSize: '20px'
                      }
                    }
                    onClick={()=>{
                      localStorage.setItem('lang', 'en')
                      i18n.changeLanguage(localStorage.getItem('lang'))

                    }
                    }
                    >en</button>
                    <button style={
                      {
                        color: 'black',
                        backgroundColor: 'white',
                        border: '1px solid red',
                        padding: '5px',
                        borderRadius: '5px',
                        width : '100px',
                        fontSize: '20px'
                      }
                    }
                    onClick={()=>{
                      localStorage.setItem('lang', 'fr')
                      i18n.changeLanguage(localStorage.getItem('lang'))
                    }
                    }
                    >fr</button>
                    <button style={
                      {
                        color: 'black',
                        backgroundColor: 'white',
                        border: '1px solid red',
                        padding: '5px',
                        borderRadius: '5px',
                        width : '100px',
                        fontSize: '20px'
                      }
                    }
                    onClick={()=>{
                      localStorage.setItem('lang', 'it')
                      i18n.changeLanguage(localStorage.getItem('lang'))
                    }
                    }
                    >it</button>
                    </div> 

                    <h1 style={
                      {color: 'red'}
                    }> {t("fristname lastname")}</h1>
                  </div>
  )
}
export default App;
