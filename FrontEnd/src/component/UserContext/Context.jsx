// import axios from "axios";
// import { createContext, useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// // import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext(null);

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     async function auth() {
//       try {
//         const urlParams =  new URLSearchParams(location.search);
//         const error =  urlParams.get("error");
//         if (error) {
//           navigate("/login");
//         }
//         const code =  urlParams.get("code");
//         if (code) {
//           const params = new URLSearchParams();
//           params.append("code", code);
//           const res = await axios.post(
//             `http://localhost:8000/api/login/`,
//             params,
//             {
//               withCredentials: true,
//             }
//           );
//           if (res.status === 200) {
//             console.log("res.data:", res.data);
//             setUser(res.data);
//             navigate("/home");
//             // setToken(res.data.access_token);
//             // setLogged(true);
//             // if (res.data.twofa === true) {
//             //   setTwofa(true);
//             // }
//           }
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     auth();
//   }, []);

//   useEffect(() => {
//     if  (user && user.token) {
//       // navigate("/home");
//     }
//     console.log("user  1337 ", user);
// }
// , [user]);

//   return (
//       <>
//         <AuthContext.Provider value={{ user, setUser}}>
//           {children}
//         </AuthContext.Provider>
//       </>
//   );
// }

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Initialize user state from localStorage
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
    async function auth() {
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
            {
              withCredentials: true,
            }
          );
          if (res.status === 200 && res.data.is_logged === true) {
            // setIsAuthenticated(true);
            console.log("res.data:", res.data);
            setUser(res.data);
            navigate("/");
          } else {
            navigate("/login");
            // setIsAuthenticated(false);
          }
        }
      } catch (error) {
        // setIsAuthenticated(false);
        navigate("/login");
        console.log(error);
      }
    }
    // auth();
  // }, []);
  
  // Effect to run when `user` state changes (e.g., logging out or login)

  return (
    <AuthContext.Provider value={{ user, setUser , auth}}>
      {children}
    </AuthContext.Provider>
  );
}
