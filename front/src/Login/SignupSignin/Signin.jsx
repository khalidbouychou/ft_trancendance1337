import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../UserContext/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Signin = () => {
  const { t, auth_intra42, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handelogin = async (e) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        toast.error(t("Please fill all the fields"));
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_IP}/api/singin/`,
        {
          username,
          password
        },
        {
          withCredentials: true
        }
      );
   
      if (response.status === 200) {
        setUser(response.data.user);
        toast.success(t(`Welcome ${response.data.user.username}`), {
          style: {
            backgroundColor: 'rgb(0, 128, 0)',
            color: 'white'
          }
        });
        setTimeout(() => {
          navigate("/");
        }, 1300);
      }
    } catch (err) {
      toast.error(t(err?.response?.data?.error));
    }
  };

  return (
    <>
      <form className="form login-form" onSubmit={handelogin}>
        <input
          type="text"
          placeholder={t("Username")}
          className="input"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("Password")}
          className="input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="button sign-in">
          {t("SIGN IN")}
        </button>
        <div className="separator">
          <hr />
          <span>{t("OR")}</span>
        </div>
        <button
          className="button intra"
          onClick={auth_intra42}
        >
          {t("INTRA 42")}
        </button>
      </form>

    </>
  );
};

export default Signin;
