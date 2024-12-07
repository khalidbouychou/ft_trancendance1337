import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const AuthContext = createContext(null)

export default function AuthProvider ({ children }) {
  const [user, setUser] = useState(null)
  const [url, setUrl] = useState('')
  const [islogin, setIslogin] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  async function auth_intra42 () {
    console.log('auth_intra42')
    const response = await axios.get('http://localhost:8000/api/auth_intra/', {withCredentials: true});
    try {
      if (response.status === 200) {
        setUrl(response.data.url)
        console.log('response.data.url:', response.data.url)
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
        console.log('code:', code)
        const params = new URLSearchParams()
        params.append('code', code)
        console.log("testing");
        const res = await axios.post('http://localhost:8000/api/login/',params,{withCredentials: true});
        if (res.status === 200) {
          console.log('res.data:', res.data)
          const token = res.data.user.token
          localStorage.setItem('token', token)
          setUser(res.data)
          setIslogin(true)
          
          navigate('/home')
        } else {
          console.log('res:', res)
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
    <AuthContext.Provider
      value={{ islogin, user, url, setUser, Login, auth_intra42 }}
    >
      {children}
    </AuthContext.Provider>
  )
}
