import { useState } from "react";
import "./SignupSignin.css";
import Signup from "./Signup";
import Signin from "./Signin";
import { SyncLoader } from "react-spinners";
import { useEffect } from "react";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }
  , []);

  if (loading) {
    return (
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
  return (
      <>
      <div className="container">
      <div className="form-wrapper">
        <div className="switch-button">
          <button
            className={`switch-option ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
            >
            Login
          </button>
          <button
            className={`switch-option ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
            >
            Signup
          </button>
        </div>

        {
          isLogin ? (<Signin />) : (<Signup isLogin={isLogin} setIsLogin={setIsLogin} />)
        }
      </div>
      </div>
    </>
  );
}
