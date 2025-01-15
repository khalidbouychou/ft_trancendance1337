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
        `https://localhost/api/otpverify/`,
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
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (err) {
      toast.error(t(`${err.response.data.error}`));
    }
  };

  async function auth_intra42() {
    const response = await axios.get(`https://localhost/api/auth_intra/`, {
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
        res = await axios.post(
          `https://localhost/api/login/`,
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
          // if (res.data.otp_login) {
            toast.success("login success", {
              style: {
                backgroundColor: 'rgb(0, 128, 0)',
                color: 'white',
              }
            });
          // }
          navigate(`/`);
        }
      }
    } catch (error) {
      toast.error(t(error?.response?.data?.error), {
        style: {
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'white'
        }
      });
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
        setUser(res.data);
        // !res?.data?.user?.bool_login &&
        //   res?.data?.user?.two_factor &&
        //   res?.data?.user?.otp_verified &&
        //   navigate("/otp");
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
        t,
        verifyotp,
        renderInputs
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
