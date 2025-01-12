import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const {t} = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem('lang') || 'en')
  }
  , [localStorage.getItem('lang')])

  async function auth_intra42() {
    const response = await axios.get("http://e3r1p9.1337.ma:8000/api/auth_intra/", {
      withCredentials: true
    });
    try {
      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      navigate("/login");
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
      let res = null;
      if (code) {
        const params = new URLSearchParams();
        params.append("code", code);
        res = await axios.post(
          `http://e3r1p9.1337.ma:8000/api/login/`,
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
              style: {
                backgroundColor: 'rgb(0, 128, 0)',
                color: 'white'
              }
            });
          }
          navigate(`/`);
        }
      }
    } catch (error) {
      navigate(`/`);
    } finally {
      setLoading(false);
    }
  }
  async function get_auth_user() {
    try {
      const res = await axios.get(`http://e3r1p9.1337.ma:8000/api/user/`, {
        withCredentials: true
      });

      if (res.status === 200) {
        setUser(res.data);
        !res.data.user.bool_login &&
          res.data.user.two_factor &&
          res.data.user.otp_verified &&
          navigate("/otp");
        if (window.location.pathname === "/login") {
          navigate(`/`);
        }
      }
    } catch (error) {
      setUser(null);
      navigate("/login");
    }
  }

  async function Logout() {
    try {
      const res = await axios.get(`http://e3r1p9.1337.ma:8000/api/logout/`, {
        withCredentials: true
      });

      if (res.status === 200) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      setUser(null);
    }
  }

  useEffect(() => {
    !user && Login()
  }, []);
  useEffect(
    () => {
      if (!user) {
        get_auth_user();
      }
    },
    [user]
  );
  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        Logout,
        setUser,
        Login,
        auth_intra42,
        get_auth_user,
        t
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
