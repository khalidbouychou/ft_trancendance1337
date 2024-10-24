import { useContext } from "react";
import { AuthContext } from "../../UserContext/Context";
import { useEffect } from "react";
const Signin = () => {
  const { url, auth_intra42 ,Login } = useContext(AuthContext);

  useEffect(() => {
    console.log("***************************");
    !url && auth_intra42();
  }, []);

  return (
    <div className="form login-form">
      <input type="text" placeholder="username" className="input" />
      <input type="password" placeholder="password" className="input" />
      <button className="button sign-in">SIGN IN</button>
      <div className="separator">
        <hr />
        <span>OR</span>
      </div>
      <button
        className="button intra"
        onClick={() => {
          window.location.href = url;
        }}
      >
        INTRA 42
      </button>
    </div>
  );
};

export default Signin;
