// import styl from "./HomePage.module.css";
// import WelcomeMessageAndImage from "./Component/WelcomeMessageAndImage/WelcomeMessageAndImage.jsx";
// import LeaderboardAndFriends from "./Component/LeaderboardAndFriends/LeaderboardAndFriends.jsx";
// import { useEffect } from "react";

import { Link, Outlet } from "react-router-dom";

// import { useContext } from "react";
// import { AuthContext } from "../UserContext/Context";
// import {  Navigate, Outlet } from "react-router-dom";

// import Login from "../Login/Login";
const HomePage = () => {
  // const {user} = useContext(AuthContext);
  
 
  // return user.token ? <Outlet/> : <Navigate to={<Login/>}/>
  return (
    <>
      <h1>HomePage</h1>
      <Link to="/chat">chat</Link>
      <br />
      <Link to="/game">game</Link>
      <br />
      <Link to="/profil">profil</Link>
      <br />
      <Link to="/setting">setting</Link>
      <br />
      <Link to="/otp">otp</Link>
      <Outlet/>
    </>
  );

};

export default HomePage;
