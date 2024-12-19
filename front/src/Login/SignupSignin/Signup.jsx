import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Signup = ({ isLogin, setIsLogin }) => {
  const [username, setUsername] = useState("");
  const [displayname, setDisplayname] = useState("");
  const [password, setPassword] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://localhost/api/signup/", {
        username,
        profile_name: displayname,
        password
      });
      if (res.status === 201) {
        toast.success("Account created successfully", {
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
      let errmsg = err.response.data.error || "player with this username already exists."; 
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
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="input signup-input"
        />
        <input
          type="text"
          required
          name="displayname"
          placeholder="Display Name"
          className="input signup-input"
          onChange={(e) => setDisplayname(e.target.value)}
          value={displayname}
        />
        <input
          type="password"
          required
          name="password"
          placeholder="Password"
          className="input signup-input"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button type="submit" className="button sign-up">
          SIGN UP
        </button>
        <div className="separator">
          <hr />
        </div>
      </form>
    </>
  );
};

export default Signup;
