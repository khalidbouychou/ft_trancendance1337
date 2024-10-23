import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const AuthContext = createContext(null)

export default function AuthProvider ({ children }) {
  const [user, setUser] = useState(null)
  const [url, setUrl] = useState('')
  const navigate = useNavigate()
  const location = useLocation()


  async function auth_intra42() {
    const response = await axios.get("http://localhost:8000/api/auth_intra/" , {
      withCredentials: true
    });
    try {
      if (response.status === 200) {
        setUrl(response.data.url);
        console.log("url---------:", url);
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function Login () {
    try {
      const urlParams = new URLSearchParams(location.search)
      const error = urlParams.get('error')
      if (error) {
        navigate('/login')
      }
      const code = urlParams.get('code')
      if (code) {
        const params = new URLSearchParams();
        params.append("code", code);
        const res = await axios.post(`http://localhost:8000/api/login/`,params,{
          withCredentials: true
        });
        if (res.status === 200)
          {
          const token = res.data.user.token;
          console.log("token:", token);
          // localStorage.setItem('token', token);
          setUser(res.data);
          navigate("/");
        } else {
          navigate('/login')
        }
      }
    } catch (error) {
      navigate('/login')
      console.log(error)
    }
  }

  useEffect(() => {
    Login()
  }, [])

  return (
    <AuthContext.Provider value={{ user,url, setUser , Login , auth_intra42}}>
      {children}
    </AuthContext.Provider>
  )
}
