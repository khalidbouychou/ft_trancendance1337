import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIntra, setLoggedIntra] = useState(false);

  async function auth_intra42() {
    const response = await axios.get("http://localhost:8000/api/auth_intra/", {
      withCredentials: true
    });
    try {
      if (response.status === 200) {
        setUrl(response.data.url);
      }
    } catch (error) {
      console.log("auth_intra42", error);
    }
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
        const res = await axios.post(
          `http://localhost:8000/api/login/`,
          params,
          {
            withCredentials: true
          }
        );
        if (res.status === 200) {
          setUser(res.data);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          if (res.data.otp_login) {
            toast.success("login success", {
              position: "top-right",
              autoClose: 1000,
              closeOnClick: true
            });
          }
          navigate(`/profile/${res.data.user.profile_name}`);
        }
      }
    } catch (error) {
      toast.error("login failed", {
        position: "top-right",
        autoClose: 1000
      });
      navigate(`/profile/${res.data.user.profile_name}`);
    } finally {
      setLoading(false);
    }
  }

  async function get_auth_user() {
    try {
      const res = await axios.get(`http://localhost:8000/api/user/`, {
        withCredentials: true
      });

      if (res.status === 200) {
        setUser(res.data);
        !res.data.user.bool_login &&
          res.data.user.two_factor &&
          res.data.user.otp_verified &&
          navigate("/otp");
        if (window.location.pathname === "/login") {
          // navigate("/home");
          navigate(`/profile/${res.data.user.profile_name}`);
        }
      }
    } catch (error) {
      console.log("user", error);
      setUser(null);
      navigate("/login");
    }
  }

  async function Logout() {
    try {
      const res = await axios.get(`http://localhost:8000/api/logout/`, {
        withCredentials: true
      });

      if (res.status === 200) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.log("logout", error);
      setUser(null);
    }
  }

  useEffect(() => {
    Login()
    
  }, []);
  useEffect(
    () => {
      !user && get_auth_user();
    },
    [location.pathname]
  );
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
        get_auth_user,
        setLoggedIntra,
        loggedIntra
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
