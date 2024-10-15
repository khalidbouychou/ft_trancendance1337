
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  async function fetchUserWithToken() {
    try {
      const token = Cookies.get('token');
      if (!token) {
        // If no token, navigate to login
        console.log("No token found, redirecting to login.");
        navigate("/login");
        return;
      }
<<<<<<< HEAD
      const res = await axios.post(`http://10.13.6.2:8000/api/login/`,params,{
=======
      const res = await axios.post(`http://localhost:8000/api/login/`,params,{
>>>>>>> refs/remotes/origin/master
            withCredentials: true
          });
      if (res.status === 200){
        console.log("res.data!:", res.data.user);
        setUser(res.data);

        navigate("/");
      } else {
        navigate("/login");
      }
      } catch (error) {
      navigate("/login");
      console.log(error);
    }
  }

  async function auth_intra42() {
<<<<<<< HEAD
    const response = await axios.get("http://10.13.6.2:8000/api/auth_intra/");
=======
>>>>>>> refs/remotes/origin/master
    try {
      const response = await axios.get("http://localhost:8000/api/auth_intra/");
      if (response.status === 200) {
        setUrl(response.data.url);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function Login() {
    try {
      const urlParams = new URLSearchParams(location.search);
      const error = urlParams.get("error");
      if (error) {navigate("/login");}
      const code = urlParams.get("code");
      if (code) {
        const params = new URLSearchParams();
        params.append("code", code);
<<<<<<< HEAD
        const res = await axios.post(`http://10.13.6.2:8000/api/login/`,params,{
=======
        const res = await axios.post(`http://localhost:8000/api/login/`,params,{
>>>>>>> refs/remotes/origin/master
          withCredentials: true
        });
        if (res.status === 200)
          {
          console.log("res.data!!:", res.data.user);
          setUser(res.data);

          navigate("/");
        } else {
          navigate("/login");
        }
      }
    } catch (error) {
      navigate("/login");
      console.log(error);
    }
  }

  useEffect(() => {
    Login();
  }
  , []);



  return (
    <AuthContext.Provider value={{ user,url, setUser , Login , auth_intra42, fetchUserWithToken}}>
      {children}
    </AuthContext.Provider>
  );
}
