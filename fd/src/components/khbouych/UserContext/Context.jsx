import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  const [url, setUrl] = useState("");
  // const [islogged, setLogged] = useState(document.cookie.includes("access"));
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //---------------------------------auth_intra42---------------------------------
  async function auth_intra42() {
    const response = await axios.get("http://localhost:8000/api/auth_intra/");
    try {
      if (response.status === 200) {
        setUrl(response.data.url);
      }
    } catch (error) {
      console.log(error);
    }
  }
  //---------------------------------Login---------------------------------
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
          { withCredentials:true }
        );
        if (res.status === 200) {
          console.log("login ---> ",res.data);
          setUser(res.data)
          navigate("/");
        } 
      }
    } catch (error) {
      navigate("/login");
      console.log(error);
    }
  }

  
  //---------------------------------Logout---------------------------------
  async function Logout() {
    try {
      const res = await axios.get(`http://localhost:8000/api/logout/`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }
  //---------------------------------User_state---------------------------------
  async function Userstate() {
    try {
      const res = await axios.get(`http://localhost:8000/api/userstate/`, {
        withCredentials:true,
      });
      if (res.status === 200 ) {
        setUser(res.data.user);
      }
    } catch (e) {
      setUser("");
      console.log(e);
    }
  }
  useEffect(() => {
    Login();
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        url,
        setUser,
        Login,
        auth_intra42,
        Userstate,
        Logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
