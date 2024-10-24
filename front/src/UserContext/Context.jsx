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

  async function auth_intra42() {
    const response = await axios.get("http://localhost:8000/api/auth_intra/" , {
      withCredentials: true
    });
    try {
      if (response.status === 200) {setUrl(response.data.url);}
    } catch (error) {
      console.log(error)
    }
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
        console.log(res)
        
        if (res.status === 200)
          {
            const token = res.data.user.token;
            console.log("token:", token);
            navigate("/");
            setUser(res.data);
          } else {
            // navigate('/login')
          }
        }
      } catch (error) {
        // navigate('/login')
    } finally {
      setLoading(false);
    }
  }

  // async function Logout () {
  //   try {
  //     const res = await axios.get(`http://localhost:8000/api/logout/`, {
  //       withCredentials: true
  //     })
  //     if (res.status === 200) {
  //       setUser(null)
  //       navigate('/login')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  
  useEffect(() => {
    Login()
  }, [])

  return (
    <AuthContext.Provider value={{loading, user, url, setUser, Login, auth_intra42 }}>
      {children}
    </AuthContext.Provider>
  )
}