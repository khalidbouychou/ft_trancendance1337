
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState("");
  const [islogged, setLogged] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


//---------------------------------auth_intra42---------------------------------
  async function auth_intra42() {
    const response = await axios.get("http://localhost:8000/api/auth_intra/");
    try {
      if (response.status === 200) {
        setUrl(response.data.url);
        console.log("response.data.url:", response.data.url);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("url:", url);
  } , [url]);
//---------------------------------Login---------------------------------
  async function Login() {
    try {
      const urlParams = new URLSearchParams(location.search);
      const error = urlParams.get("error");
      if (error) {navigate("/login");}
      const code = urlParams.get("code");
      if (code) {
        const params = new URLSearchParams();
        params.append("code", code);
        const res = await axios.post(`http://localhost:8000/api/login/`,params,{withCredentials: true,});
        if (res.status === 200 && res.data.is_logged === true)
          {
          console.log("res.data:", res.data);
          setUser(res.data);
          user &&  setLogged(true);
          console.log("++ > user:", user);
        }else {navigate("/login");}
      }
    } catch (error) {
      navigate("/login");
      console.log(error);
    }
  }


  useEffect(() => {
    console.log("-- > user:", user);
    user ? navigate("/home") : navigate("/login");
  }
  , [user]);
//---------------------------------Logout---------------------------------
  async function Logout() {
    try {
      const res = await axios.get(`http://localhost:8000/api/logout/`,{withCredentials: true,});
      if (res.status === 200) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }
//---------------------------------User_state---------------------------------
async function User_state() {
    try {
      const res = await axios.get(`http://localhost:8000/api/user_state/`,{withCredentials: true,});
      if (res.status === 200 && res.data.is_logged === true) {
        setUser(res.data);
      }
      else {navigate("/login");}
    } catch (error) {
      navigate("/login");
      console.log(error);
    }
  }

  //---------------------------------Check2fa---------------------------------
  async function Check2fa() {
    try {
      const res = await axios.get(`http://localhost:8000/api/check2fa/`,{withCredentials: true,});
      if (res.status === 200 && res.data.msg === "enabled") {
        navigate("/twofa");
        setUser(res.data);
      }
      else {navigate("/login");}
    } catch (error) {
      navigate("/login");
      console.log(error);
    }
  }
  return (

    <AuthContext.Provider value={{ user,url,islogged ,setUser , Login , auth_intra42, User_state, Check2fa , Logout}}>
    {children}
   </AuthContext.Provider>
  );
}
