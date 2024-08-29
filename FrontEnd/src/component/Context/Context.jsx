import axios from "axios";
import { createContext, useEffect, useState } from "react";
import {  Link, useLocation, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

export const authContext = createContext();

export default function ContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [islogged, setLogged] = useState(false);
  const [twofa, setTwofa] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    async function auth() {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        if (code && !token) {
          const params = new URLSearchParams();
          params.append("code", code);
          const res = await axios.post(`http://localhost:8000/api/login/`, params, {
            withCredentials: true
          });
          if (res.status === 200 && res.statusText === "OK")
            {
              navigate('/home');
              localStorage.setItem("is_logged", true);
              setLogged(localStorage.getItem("is_logged"));
            }
        }
      } catch (error) {
        console.log(error);
      }
    }
    auth();
  }, []);

  return (
    <authContext.Provider
      value={{
        token,
        islogged,
        setToken,
        setLogged,
        twofa
      }}
    >
      <>
        {children}
      </>
    </authContext.Provider>
  );
}
