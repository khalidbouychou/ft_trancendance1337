// import styl from "./HomePage.module.css";
// import WelcomeMessageAndImage from "./Component/WelcomeMessageAndImage/WelcomeMessageAndImage.jsx";
// import LeaderboardAndFriends from "./Component/LeaderboardAndFriends/LeaderboardAndFriends.jsx";
// import { useEffect } from "react";

import { useContext } from "react";
import { AuthContext } from "../UserContext/Context";
import {  Navigate, Outlet } from "react-router-dom";

import Login from "../Login/Login";
const HomePage = () => {
  const {user} = useContext(AuthContext);
 
  return user.token ? <Outlet/> : <Navigate to={<Login/>}/>
 
};

export default HomePage;
