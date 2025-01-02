import axios from "axios";
import { createContext, use, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
 const [code, setCode] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {t} = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem('lang') || 'en')
  }
  , [localStorage.getItem('lang')])

  async function auth_intra42() {
    const response = await axios.get("https://localhost/api/auth_intra/", {
      withCredentials: true
    });
    try {
      if (response.status === 200) {
        setUrl(response?.data?.url);
        window.location.href = response?.data?.url;
      }
    } catch (error) {
      navigate("/login");
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get("error");
    if (error) {
      navigate("/login");
    }
    const code = urlParams.get("code");
    if (code) {
     setCode(code)
    }
  }, []);

  async function Login() {
    try {
      if (code) {
        const params = new URLSearchParams();
        params.append("code", code);
        const res = await axios.post(
          `https://localhost/api/login/`,
          params,
          {
            withCredentials: true
          }
        );
        if (res.status === 200) {
          setUser(res?.data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          if (res?.data?.bool_login) {
            toast.success(`Welcome ${res?.data?.profile_name}`, {
              style: {
                backgroundColor: 'rgb(0, 128, 0)',
                color: 'white',
              }
            });
            navigate(`/`);
          }
        }
        else {
          console.log("---------login----------");
          navigate(`/login`);
        }
      }
    } catch (error) {
      console.log("---------home----------");
      console.log(error);
      navigate(`/`);
      // navigate('/login');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function get_auth_user() {
    try {
      const res = await axios.get(`https://localhost/api/user/`, {
        withCredentials: true
      });

      if (res.status === 200) {
        if (location.pathname === "/otp" || location.pathname === "/login") {
          navigate(`/`);
        }
        setUser(res.data);
        !res.data.user.bool_login &&
          res.data.user.two_factor &&
          res.data.user.otp_verified &&
          navigate("/otp");
      }
    } catch (error) {
      setUser(null);
      navigate("/login");
    }
  }

  async function Logout() {
    try {
      const res = await axios.get(`https://localhost/api/logout/`, {
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
     code && Login()
  }, [code]);
  
  // useEffect(() => {
  //   if (
  //     window.location.pathname !== "/login" &&
  //     window.location.pathname !== "/logout"
  //   ) {
  //     get_auth_user();
  //   }
  // }, [user,location.pathname]);

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
