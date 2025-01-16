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

  const validateInput = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/; // Only letters, numbers, underscores, 3-30 characters
    const displayNameRegex = /^[a-zA-Z0-9 _-]{3,50}$/; // Letters, numbers, spaces, underscores, hyphens, 3-50 characters
    const passwordRegex = /^.{6,50}$/; // At least 6 characters, up to 50

    if (!usernameRegex.test(username)) {
      console.log("Username must be 3-30 characters long and contain only letters, numbers, or underscores.");
      toast.error(t("Username must be 3-30 characters long and contain only letters, numbers, or underscores."), {
        style: { backgroundColor: "rgb(255, 0, 0)", color: "white" }
      });
      return false;
    }

    if (!displayNameRegex.test(displayname)) {
      console.log("Display name must be 3-50 characters long and can contain letters, numbers, spaces, underscores, or hyphens.");  
      toast.error(t("Display name must be 3-50 characters long and can contain letters, numbers, spaces, underscores, or hyphens."), {
        style: { backgroundColor: "rgb(255, 0, 0)", color: "white" }
      });
      return false;
    }

    if (!passwordRegex.test(password)) {
      console.log("Password must be at least 6 characters long.");
      toast.error(t("Password must be at least 6 characters long."), {
        style: { backgroundColor: "rgb(255, 0, 0)", color: "white" }
      });
      return false;
    }

    return true;
  };

  const handleForm = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_IP}/api/signup/`, {
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
