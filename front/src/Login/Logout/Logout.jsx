import React from 'react'

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';
import LoginSignup from '../SignupSignin/SignupSignin';
import { Navigate } from 'react-router-dom';

import axios from 'axios';
import { AuthContext } from '../../UserContext/Context';
import { useContext } from 'react';
const Logout = () => {
    const navigate = useNavigate();
    const {user,setUser} = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    async function Logout () {
      console.log("token",user.token)
        try {
          const res = await axios.post(`http://localhost:8000/api/logout/`, {}, {
            withCredentials: true,
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
          }
        )
          console.log(res)
          if (res.status === 200) {
            console.log("---------------- logout success ----------------")
            setUser(null)
            navigate('/login')
          }
        } catch (error) {
          console.log(error)
        }
      }

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //      Logout();
    //       setLoading(false);
    //     }, 1000);
    
    //     return () => clearTimeout(timer);
    //   }, []);
        return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
              }}
            >
              <SyncLoader color="#ffff" loading={loading} height={80} width={8} />
            </div>
          )
}

export default Logout
