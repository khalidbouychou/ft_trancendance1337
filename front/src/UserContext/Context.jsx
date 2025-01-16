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
  const [enable, setEnable] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const {t} = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem('lang') || 'en')
  }
  , [localStorage.getItem('lang')])


  const renderInputs = () => {
    return Array.from({ length: 6 }).map((_, i) =>
      <input key={i} type="text" className="otp-input" maxLength={1} />
    );
  };

  const verifyotp = async () => {
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs).map(input => input.value).join("");
    try {
      await get_auth_user();
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_IP}/api/otpverify/`,
        { otp: otp },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.cookie
              .split("; ")
              .find(row => row.startsWith("csrftoken="))
              .split("=")[1]
          }
        }
      );
      if (res.status === 200) {
        toast.success(t("OTP Verified Successfully"), {
          style: {
            backgroundColor: "rgb(0, 128, 0)",
            color: "white"
          }
        });
        setEnable(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      toast.error(t(`${err.response.data.error}`));
    }
  };

  async function auth_intra42() {
    const backend_ip = import.meta.env.VITE_BACKEND_IP
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/api/auth_intra/`, {
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
          `${import.meta.env.VITE_BACKEND_IP}/api/login/`,
          params,
          {
            withCredentials: true
          }
        );
        if (res.status === 200) {
          setUser(res?.data);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          if (res?.data?.bool_login) {
            toast.success(t("login success"), {
              style: {
                backgroundColor: 'rgb(0, 128, 0)',
                color: 'white'
              }
            });
            setTimeout(() => {
              navigate("/");
            }, 1500);
          }
        }
      }
    } catch (error) {
      toast.error(t(error?.response?.data?.error));
      navigate(`/`);
    } finally {
      setLoading(false);
    }
  }
  async function get_auth_user() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/api/user/`, {
        withCredentials: true
      });

      if (res.status === 200) {
        setUser(res.data);
        if (res?.data?.user?.two_factor && !res?.data?.user?.otp_verified)
         navigate("/otp");
        else if ((location.pathname === "/login" || location.pathname === "/otp")) {
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
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_IP}/api/logout/`, {
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
        t,
        verifyotp,
        renderInputs
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
