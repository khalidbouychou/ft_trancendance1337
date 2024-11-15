import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  async function auth_intra42() {
    const response = await axios.get("http://127.0.0.1:8000/api/auth_intra/", {
      withCredentials: true
    });
    try {
      if (response.status === 200) {
        setUrl(response.data.url);
      }
    } catch (error) {}
  }

  async function Login() {
    try {
      const urlParams = new URLSearchParams(location.search);
      const error = urlParams.get("error");
      if (error) {
        navigate("/login");
      }
      const code = urlParams.get("code");
      if (code) {
        const params = new URLSearchParams();
        params.append("code", code);
        const res = await axios.post(`http://127.0.0.1:8000/api/login/`, params, {
          withCredentials: true
        });
        if (res.status === 200) {
          setUser(res.data);
          toast.success("login success", {
            position: "top-right",
            autoClose: 1200,
            closeOnClick: true
          });
          setTimeout(() => {
            // if (res.data.otp_verified === true && res.data.two_factor === true) {
            //   navigate("/otp");
            // } else {
            navigate("/home");
            // }
          }, 1200);
        }
      }
    } catch (error) {
      toast.error("login failed", {
        position: "top-right",
        autoClose: 1000
      });
      setTimeout(() => {
        navigate("/");
      }, 500);
    } finally {
      setLoading(false);
    }
  }

  async function get_auth_user() {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/user/`, {
        withCredentials: true
      });

      if (res.status === 200) {
        setUser(res.data);
        console.log("user", res.data.user);
        !res.data.user.bool_login && res.data.user.two_factor && res.data.user.otp_verified && navigate("/otp");
        if (window.location.pathname === "/login") {
          navigate("/");
        }
      }
    } catch (error) {
      setUser(null);
      navigate("/login");
    }
  }

  async function Logout() {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/logout/`, {
        withCredentials: true
      });

      if (res.status === 200) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      setUser(null);
      // navigate("/login");
    }
  }

  useEffect(() => {
    Login();
  }, []);
  useEffect(() => {
    !user && get_auth_user();
  }, [location.pathname]);
  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        url,
        Logout,
        setUser,
        Login,
        auth_intra42,
        get_auth_user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
