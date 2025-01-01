import { useContext, useState } from "react";
import "./SignupSignin.css";
import Signup from "./Signup";
import Signin from "./Signin";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../UserContext/Context";
export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const { t } = useContext(AuthContext);

  return (
        <>
      <div className="xx">

      <div className="container">
      <div className="form-wrapper">
        <div className="switch-button">
          <button
            className={`switch-option ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
            >
            {t("Login")}
          </button>
          <button
            className={`switch-option ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
            >
            {t("Sign Up")}
          </button>
        </div>

        {
          isLogin ? (<Signin />) : (<Signup isLogin={isLogin} setIsLogin={setIsLogin} />)
        }
      </div>
      </div>
        </div>
    </>
  );
}
