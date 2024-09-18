import axios from "axios";
import { createContext ,useEffect,useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";// Add missing import statement
// import { useNavigate } from "react-router-dom";

export const authContext = createContext();

export default function ContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


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
          if (res.data.status === 200 ) 
          {
            navigate("/home");
            setUser(res.data.user);
          }
          else
          {
            navigate("/login");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(() => {
      auth();
    }, []);

  async function verifytoken() {
   await axios.post("http://localhost:8000/api/verifytoken/", {
    user : user
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application / json", 
   }
    }).then((res) => {
      if (res.data.status === 200) {
        setUser(res.data.user);
      } else {
       return navigate("/login");
      }
    }
    ).catch((err) => {
      console.log(err);
      return navigate("/login");
    });
  
  }





  return (
    <authContext.Provider
      value={{
        auth,
        verifytoken,
      }}
    >
      <>{children}</>
    </authContext.Provider>
  );
}
