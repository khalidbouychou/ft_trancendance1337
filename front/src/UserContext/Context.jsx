import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SyncLoader } from "react-spinners";

export const AuthContext = createContext(null)

export default function AuthProvider ({ children }) {
  const [user, setUser] = useState(null)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()


// Empty dependency array means this runs once on mount

  //--------------------------------------------
  async function auth_intra42() {
    const response = await axios.get("http://localhost:8000/api/auth_intra/" , {
      withCredentials: true
    });
    try {
      if (response.status === 200) {setUrl(response.data.url);}
    } catch (error) {}
  }


  async function Login () {
    try {
      const urlParams = new URLSearchParams(location.search)
      const error = urlParams.get('error')
      if (error) {navigate('/login')}
      const code = urlParams.get('code')
      if (code) {
        const params = new URLSearchParams();
        params.append("code", code);
        const res = await axios.post(`http://localhost:8000/api/login/`,params,{
          withCredentials: true
        });
        if (res.status === 200){navigate("/");}
        }
      } catch (error) {
        navigate('/login')
    } finally {
      setLoading(false);
    }
  }

  async function get_auth_user() {
    try {
      const res = await axios.get(`http://localhost:8000/api/user/`, {
        withCredentials: true
      });
      if (res.status === 200) {
        setUser(res.data);
        if (window.location.pathname === "/login") { navigate("/home");}
      }
      else {
        navigate('/login')
        setUser(null);
      }
    } catch (error) {
      navigate('/login')
      setUser(null);
    }
  }


async function VerifyToken () 
{
  try {
    const res = await axios.get(`http://localhost:8000/api/verifytoken/`, {
    withCredentials: true,
    headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'user': user
    }
  });
    if (res.status !== 200) {
      setUser(null);
      navigate('/login');
    }
  }
  catch (error) {
    setUser(null);
  }
}

async function Logout () {
  console.log("token",user.token)
    try {
      const res = await axios.get(`http://localhost:8000/api/logout/`,{
        withCredentials: true,

      });

      console.log(res)
      if (res.status === 200) {
        console.log("---------------- logout success ----------------")
        navigate('/login')
        setUser(null)
      }
    } catch (error) {
      console.log(error)
    }
  }


  // function that logged the user
  useEffect(() => {Login()}, [window.location.pathname]);
  // fetch user data
  useEffect(() => {
    VerifyToken();
    get_auth_user();
  },[window.location.pathname]);
  
  // useEffect  (() => {
  //   VerifyToken();
  // }
  // ,[window.location.pathname]);

  return (
    <AuthContext.Provider value={{loading, user, url, Logout,setUser, Login, auth_intra42,get_auth_user }}>
      {children}
    </AuthContext.Provider>
  )
}