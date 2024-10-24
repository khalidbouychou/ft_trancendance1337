import { Routes, Route} from "react-router-dom";
import style from "./App.module.css";

import { AuthContext } from "./UserContext/Context.jsx";
import LoginSignup from "./Login/SignupSignin/SignupSignin.jsx";
import { useEffect, useState } from "react";

import Home from "./components/Home/Home.jsx";

import { SyncLoader } from "react-spinners";
import Layout from "./Layout.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    !loading ? (
      <div className={style.EntirePage}>
        <div className={style.MainContent}>
          {( window.location.pathname !== "/login" || window.location.pathname !== "/Logout") && ( <Layout /> )}
          <Routes>
            <Route path="/" element={<h1>home</h1>} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/Logout" element={<Logout />} />
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
    )
  );
}

export default App;