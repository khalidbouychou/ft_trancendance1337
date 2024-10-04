import React, { useContext, useEffect } from 'react';

import './Home.Module.css'
import { AuthContext } from '../UserContext/Context';

import { Navigate, Outlet } from 'react-router-dom';

import Cookies from 'js-cookie';

export default function Home() {
  console.log('i may send u to login');
  return (
    <>
      <div>This is the home page</div>
    </>
  );
}
