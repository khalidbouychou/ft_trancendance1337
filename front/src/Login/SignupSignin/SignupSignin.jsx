import { useContext, useState } from "react";

import {AuthContext} from "../../UserContext/Context";
import { useEffect } from "react";

import "./SignupSignin.css";
import { Link } from "react-router-dom";
export default function LoginSignup() {
  const [avatar, setAvatar] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const {url , auth_intra42 } = useContext(AuthContext);

  useEffect(() => {
    !url && auth_intra42();
  }, []);

  const handleAvatarUpload = (event) => {
    console.log(event.target)
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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

        {isLogin ? (
          <div className="form login-form">
            <input type="text" placeholder="username" className="input" />
            <input type="password" placeholder="password" className="input" />
            <button className="button sign-in">SIGN IN</button>
            <div className="separator">
              <hr />
              <span>OR</span>
            </div>
            <button className="button intra" onClick={() => {
                window.location.href = url;
            }}  > INTRA 42</button>
          </div>
        ) : (
          <div className="form signup-form">
            <div className="avatar-upload">
              <div className="avatar-placeholder">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="avatar-image" />
                ) : (
                  <img className="avatar-plus"
                     src="../../../public/donkey.jpeg" alt="Plus"
                  />
                )}
              </div>
              <label className="button upload-avatar">
                upload
                <input
                  type="file"
                  className="hidden-input"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            <input
              type="text"
              name="username"
              placeholder="username"
              className="input signup-input"
            />
            <input
              type="text"
              name="displayname"
              placeholder="displayname"
              className="input signup-input"
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              className="input signup-input"
            />
            <button className="button sign-up" onClick={() => setIsLogin(true)}>SIGN UP</button>
            <div className="separator">
              <hr />
            </div>
            <div className="message">
                <h5 className="error">error</h5>
                <h5 className="success">success</h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
