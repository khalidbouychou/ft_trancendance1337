import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../UserContext/Context";
const Signup = ({ isLogin, setIsLogin }) => {
  const {t} = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [displayname, setDisplayname] = useState("");
  const [password, setPassword] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://e3r1p9.1337.ma:8000/api/signup/`, {
        username,
        profile_name: displayname,
        password
      });
      if (res.status === 201) {
        toast.success(t("Account created successfully"), {
          style: {
            backgroundColor: 'rgb(0, 128, 0)',
            color: 'white'
          }
          
        });
        setTimeout(() => {
          setIsLogin(true);
        }, 1000);
      }
    } catch (err) {
      console.log('--------------------------->',err);
      let errmsg = t(err.response?.data?.error) || t("player with this username already exists."); 
      toast.error(errmsg, {
        style: {
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'white'
        }
      });
    }
  };

  return (
    <>
      <form className="form signup-form" onSubmit={handleForm}>
        <input
          type="text"
          required
          name="username"
          placeholder={t("Username")}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="input signup-input"
        />
        <input
          type="text"
          required
          name="displayname"
          placeholder={t("Display Name")}
          className="input signup-input"
          onChange={(e) => setDisplayname(e.target.value)}
          value={displayname}
        />
        <input
          type="password"
          required
          name="password"
          placeholder={t("Password")}
          className="input signup-input"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button type="submit" className="button sign-up">
          {t("SIGN UP")}
        </button>
        <div className="separator">
          <hr />
        </div>
      </form>
    </>
  );
};

export default Signup;
