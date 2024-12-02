import { Routes, Route, Link } from "react-router-dom";
import style from "./App.module.css";
// import LoginSignup from "./Login/SignupSignin/SignupSignin.jsx";
// import Layout from "./Layout.jsx";

// import PageNotFound from "./Login/PageNotFound/PageNoteFound.jsx";
// import Twofa from "./Login/2fa/twofa.jsx";
// import Settings from "./Setting/Setting.jsx";
// import Otplogin from "./Login/OtpLogin/Otplogin.jsx";
import Game from "./Login/game/local/game.jsx";
// import Turnoi from "./Login/game/turnoi/game.jsx"; 
import Remote from "./Login/game/remote/game.jsx";
function App() {
  return (
    <div className={style.EntirePage}>
      <div className={style.MainContent}>
        <Routes>
          {/* <Route path="/" element={<Layout />}>
            <Route path="home" element={<h1>home</h1>} />
            <Route path="chat" element={<h1>chat</h1>} />
            <Route path="profile" element={<h1>profile</h1>} />
            <Route path="games" element={<h1>games</h1>} />
            {/* <Route path="setting" element={<h1>settings</h1>} /> */}
            {/* <Route path="notification" element={<h1>notification</h1>} /> */}
            {/* <Route path="twofa" element={<Twofa />} /> */}
            {/* <Route path="setting" element={<Settings />} /> */}
            {/* <Route path="otp" element={< Otplogin/>} /> */}
          {/* </Route> */}
          {/* <Route path="/login" element={<LoginSignup />} />
          <Route path="/*" element={<PageNotFound />} /> */}
          <Route path="/game" element={
            <>
              <div className={style.link_container}>

                <Link to="local">Local</Link>
                <Link to="turnoi">Turnoi</Link>
                <Link to="remote">Remote</Link>

              </div>
            </>
          } />
          <Route path="/game/remote" element={<Remote />} />
          <Route path="/game/turnoi" element={<Game />} />
          <Route path="/game/local" element={<Game />} />
          <Route path="/" element={
            <>
            <h1>home</h1>
            <Link to="/game">Game</Link> 
            </>
        } />
        </Routes>
      </div>
    </div> );
}

export default App;
