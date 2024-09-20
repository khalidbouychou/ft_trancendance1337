import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Otp from "./component/Otp/Otp.jsx";

import ContextProvider from "./component/Context/Context.jsx";
import Login from "./component/Login/Login.jsx";
// import NotPageFound from "./component/Layout/NoPageFound/NoPageFound.jsx";
import Sidebar from "./component/Sidebar/Sidebar.jsx";

const PrivateRoutes = React.lazy(() =>
  import("./component/PrivateRoutes/PrivateRoutes.jsx")
);

const Home = () => {
  return <h1>Home</h1>;
};

const Profil = () => {
  return <h1>Profile</h1>;
};

const Chat = () => {
  return <h1>Chat</h1>;
};

const Game = () => {
  return <h1>Game</h1>;
};

const Setting = () => {
  return <h1>Setting</h1>;
};

const Notification = () => {
  return <h1>Notification</h1>;
};

const NotPageFound = () => {
  return <h1>NotPageFound</h1>;
}

function App() {
  return (
      <Router>
    <ContextProvider>
        {/* {window.location.pathname !== "/login" && <Sidebar />} */}
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} exact />
            <Route path="/profil" element={<Profil />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/game" element={<Game />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/otp" element={<Otp />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotPageFound />} />
        </Routes>
    </ContextProvider>
      </Router>
  );
}
export default App;
