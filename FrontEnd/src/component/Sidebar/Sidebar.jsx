import {useEffect, useState } from "react";
import "./sidebar.css";
import { Link, Outlet, useNavigate, } from "react-router-dom";
import imgprofil from "/icons/profile.png"
import imgnotif from  "/icons/notification.png"
import imggame from "/icons/game.png"
import imgchat from "/icons/chat.png"
import imgsetting from "/icons/setting.png"
import imglogo from "/icons/logo6.png"
import imglogout from "/icons/logout.png";
import axios from "axios";





function Sidebar()  {
  const navigate = useNavigate();
  const [pathname, setPathname] = useState(window.location.pathname);
  const [icons] = useState([
    {
      id: 1,
      titel: "profil",
      urlImg: imgprofil,
      url: "/profil",
    },
    {
      id:2,
      titel: "notification",
      urlImg:imgnotif,
      url: "/notification",
    },
    {
      id:3,
      titel: "game",
      urlImg: imggame,
      url: "/game",
    },
    {
      id :4,
      titel: "chat",
      urlImg: imgchat,
      url: "/chat",
    },
    {
      id:5,
      titel: "setting",
      urlImg:imgsetting,
      url: "/setting",
    },
  ]);

  const [active, setActive] = useState("");



  useEffect(() => {
    const handlePopstate = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  useEffect(() => {
  }, [active, pathname]);


  const handleLogout = async () => {
    try {

      await axios.get('http://localhost:8000/api/logout', {
        withCredentials: true,
      }).then((res) => {
        console.log(res);
        localStorage.clear();
        navigate('/login');
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
        console.error('Logout error:', error);
    }
};


  return (
    <div className="Sidebar">
      <div className="logo">
      <Link to="/home">
        <img src={imglogo} alt="" />
        </Link> 
      </div>
      <div className="icc" >
      {icons.map(
        (val,id) => (
          <div 
          onClick={() => setActive(val.url)}
          className={ `allicon ${val.url === window.location.pathname  ? "active" : ""}`}
          key={id}>
          <Link to={val.url}>
            <img src={val.urlImg}alt=""/>
            </Link> 
          </div>
        )

      )}
      </div>

        <div className="logout">
          <img  onClick={handleLogout} src={imglogout}alt="" />
        </div>
      </div>
  );
}

export default Sidebar;
