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
const Logout = (loading) => {
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
