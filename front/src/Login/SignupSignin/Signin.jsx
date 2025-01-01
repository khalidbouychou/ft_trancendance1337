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
        toast.error(t("Please fill all the fields"), {
          style: {
            backgroundColor: 'rgb(255, 0, 0)',
            color: 'white'
          }
        });
        return;
      }
      const response = await axios.post(
        "https://localhost/api/singin/",
        {
          username,
          password
        },
        {
          withCredentials: true
        }
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.user.token);
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
      console.log(err);
      toast.error(err.response.data.error, {
        style: {
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'white',
        }
      });
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
