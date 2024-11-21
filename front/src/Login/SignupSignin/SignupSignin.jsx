import { useState } from "react";
import "./SignupSignin.css";
import Signup from "./Signup";
import Signin from "./Signin";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
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
