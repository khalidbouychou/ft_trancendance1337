import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function auth() {
      try {
        const urlParams =  new URLSearchParams(location.search);
        const error =  urlParams.get("error");
        if (error) {
          navigate("/login");
        }
        const code =  urlParams.get("code");
        if (code) {
          const params = new URLSearchParams();
          params.append("code", code);
          const res = await axios.post(
            `http://localhost:8000/api/login/`,
            params,
            {
              withCredentials: true,
            }
          );
          if (res.status === 200) {
            console.log("res.data:", res.data);
            setUser(res.data);
            // setToken(res.data.access_token);
            // setLogged(true);
            // if (res.data.twofa === true) {
            //   setTwofa(true);
            // }
            navigate("/home");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    auth();
  }, []);

  return (
      <>
        <AuthContext.Provider value={{ user, setUser}}>
          {children}
        </AuthContext.Provider>
      </>
  );
}
