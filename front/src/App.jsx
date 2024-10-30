import { Routes, Route } from "react-router-dom";
import style from "./App.module.css";
import LoginSignup from "./Login/SignupSignin/SignupSignin.jsx";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import Layout from "./Layout.jsx";

import PageNotFound from "./Login/PageNotFound/PageNoteFound.jsx";

import Twofa from "./Login/2fa/twofa.jsx";
const originalConsoleError = console.error;
console.error = (...args) => {
  // Check if the error is related to your API calls
  const isApiError = args.some(
    (arg) =>
      typeof arg === "string" &&
      (arg.includes("http://10.13.1.9:8000/api/user") ||
        arg.includes("api/signup"))
  );

  // Don't log API-related errors
  if (!isApiError) {
    originalConsoleError.apply(console, args);
  }
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [window.location.pathname]);

  return !loading ? (
    <div className={style.EntirePage}>
      <div className={style.MainContent}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<h1>home</h1>} />
            <Route path="chat" element={<h1>chat</h1>} />
            <Route path="profile" element={<h1>profile</h1>} />
            <Route path="games" element={<h1>games</h1>} />
            <Route path="setting" element={<h1>settings</h1>} />
            <Route path="notification" element={<h1>notification</h1>} />
            <Route path="twofa" element={<Twofa/>} />
          </Route>
          <Route path="/login" element={<LoginSignup />} />
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
