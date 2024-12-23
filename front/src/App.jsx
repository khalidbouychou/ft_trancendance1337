import { Routes, Route } from "react-router-dom";
import AuthProvider from "./UserContext/Context.jsx";
import style from "./App.module.css";
import Layout from "./Layout.jsx";
import Games from "./components/Game/Game.jsx";
import PingPongGames from "./components/Game/components/PingGame/PingGame.jsx";
import LocalGame from "./ponggame/localpong/LocalGame.jsx";
import LocalTeamGame from "./ponggame/teampong/LocalTeamGame.jsx";
import OnlineGame from "./ponggame/onlinepong/OnlineGame.jsx";
import XO from "./xo_game/online.jsx";
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
import Anonymized from "./Anonymizeds/Anonymized.jsx";
// import { use } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

function App() {
  const {t} = useTranslation();
  return (
    <>
      <div className={style.EntirePage}>
        <div className={style.MainContent}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* <Route path="home" element={<Profile />} /> */}
              <Route path="games" element={<Games />} />
              <Route path="pingpong-games" element={<PingPongGames />} />
              <Route path="xo" element={<XO invite={false} />} />
              <Route path="xo_with_invitation" element={<XO invite={true} />} />
              <Route path="games/localpong" element={<LocalGame />} />
              <Route path="friend-game" element={<FriendGame />} />
              <Route path="games/localteampong" element={<LocalTeamGame />} />
              <Route path="games/onlinepong" element={<OnlineGame />} />
              <Route path="chat" element={<h1>No Chat Yet -_-</h1>} />
              <Route path="profile/:username" element={<Profile />} />
              <Route path="setting" element={<Setting />} />
              <Route path="notification" element={<Notificationz />} />
              <Route path="twofa" element={<Twofa />} />
              <Route
                path="lang"
                element={
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "10px",
                        marginBottom: "10px",
                        color: "red",
                        width: "100%"
                      }}
                    >
                      <button
                        style={{
                          color: "black",
                          backgroundColor: "white",
                          border: "1px solid red",
                          padding: "5px",
                          borderRadius: "5px",
                          width: "100px",
                          fontSize: "20px"
                        }}
                        onClick={() => {
                          localStorage.setItem("lang", "en");
                          i18n.changeLanguage(localStorage.getItem("lang"));
                        }}
                      >
                        en
                      </button>
                      <button
                        style={{
                          color: "black",
                          backgroundColor: "white",
                          border: "1px solid red",
                          padding: "5px",
                          borderRadius: "5px",
                          width: "100px",
                          fontSize: "20px"
                        }}
                        onClick={() => {
                          localStorage.setItem("lang", "fr");
                          i18n.changeLanguage(localStorage.getItem("lang"));
                        }}
                      >
                        fr
                      </button>
                      <button
                        style={{
                          color: "black",
                          backgroundColor: "white",
                          border: "1px solid red",
                          padding: "5px",
                          borderRadius: "5px",
                          width: "100px",
                          fontSize: "20px"
                        }}
                        onClick={() => {
                          localStorage.setItem("lang", "it");
                          i18n.changeLanguage(localStorage.getItem("lang"));
                        }}
                      >
                        it
                      </button>
                    </div>

                    <h1 style={{ color: "red" }}> {t("fristname lastname")}</h1>
                  </div>
                }
              />
              <Route path="otp" element={<Otplogin />} />
              <Route path="network" element={<Network />} />
            </Route>

            <Route path="/login" element={<LoginSignup />} />
            <Route path="/anonymized" element={<Anonymized />} />
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

      </>
  );
}

export default App;
