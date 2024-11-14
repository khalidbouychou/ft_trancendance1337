import { Routes, Route } from "react-router-dom";
import style from "./App.module.css";
import LoginSignup from "./Login/SignupSignin/SignupSignin.jsx";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import Layout from "./Layout.jsx";

import PageNotFound from "./Login/PageNotFound/PageNoteFound.jsx";

import Twofa from "./Login/2fa/twofa.jsx";
import Settings from "./Setting/Setting.jsx";
import { useLocation } from "react-router-dom";
import Desable2fa from "./Login/2fa/Desable2fa.jsx";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import Otplogin from "./Login/2fa/otplogin.jsx";
function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log("path", window.location.pathname);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 199);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return !loading ? (
    <div className={style.EntirePage}>
      <div className={style.MainContent}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<h1>home</h1>} />
            <Route path="chat" element={<h1>chat</h1>} />
            <Route path="profile" element={<h1>profile</h1>} />
            <Route path="games" element={<h1>games</h1>} />
            {/* <Route path="setting" element={<h1>settings</h1>} /> */}
            <Route path="notification" element={<h1>notification</h1>} />
            <Route path="twofa" element={<Twofa />} />
            <Route path="setting" element={<Settings />} />
            <Route path="otp" element={< Otplogin/>} />
          </Route>
          <Route path="/login" element={<LoginSignup />} />
          <Route
            path="/alert"
            element={
              <>
                <Stack sx={{ width: "200%" , marginLeft: "600px"}}>
                  <Alert variant="filled" severity="success">
                    This is a filled success Alert.
                  </Alert>
                </Stack>
              </>
            }
          />
          {/* <Route path="/desable" element={<Desable2fa/>} /> */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      <SyncLoader color="#ffff" loading={loading} height={80} width={8} />
    </div>
  );
}

export default App;
