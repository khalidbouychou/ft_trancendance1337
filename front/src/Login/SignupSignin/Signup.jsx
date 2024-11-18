import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Signup = ({ isLogin, setIsLogin }) => {
  const [username, setUsername] = useState("");
  const [displayname, setDisplayname] = useState("");
  const [password, setPassword] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://10.13.10.12:8000/api/signup/", {
        username,
        profile_name: displayname,
        password
      });
      if (res.status === 201) {
        toast.success("Account created successfully", {
          position: "top-right",
          autoClose: 2000
        });
        setTimeout(() => {
          setIsLogin(true);
        }, 1000);
      }
    } catch (err) {
      toast.error("Opps something went wrong", {
        position: "top-right",
        autoClose: 1000
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
      <ToastContainer />
    </>
  );
};

export default Signup;
