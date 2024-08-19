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
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code && !token) {
          const params = new URLSearchParams();
          params.append("code", code);
          const res = await axios.post(`http://localhost:8000/api/login/`, params, {
            withCredentials: true
          });
          if (res.status === 200 && res.statusText === "OK")
            {
              console.log(res.data);
              if (res.data['twofa'] === true) {
                setTwofa(true);
                navigate("/twofa");
              }
              localStorage.setItem("is_logged", true);
              setLogged(localStorage.getItem("is_logged"));
              navigate("/home");
            }
        }
      } catch (error) {
        console.log(error);
      }
    }
    auth();
  }, []);

  // useEffect(() => {
  //   async function checktoken() {
  //     try {
  //       const res = await axios.get("http://localhost:8000/api/token_status/", {
  //         withCredentials: true
  //       });
  //       console.log("res.data['valid']:", res.data['valid']);
  //         if (res.data['valid'] === false) {
  //           localStorage.clear();
  //           setLogged(false);
  //           navigate("/login");
  //         }
  //     } catch (error) {
  //       console.error("Check token error:", error);
  //     }
  //   }
  //   checktoken();
  // }, [token,islogged,location.pathname,navigate]);



  return (
    <authContext.Provider
      value={{
        token,
        islogged,
        setToken,
        setLogged,
        twofa // Fix the variable name from 'towfa' to 'twofa'
      }}
    >
      <>
        {children}
      </>
    </authContext.Provider>
  );
}
