import { Link} from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react'
import styl from './Sidebar.module.css'
// import pinglogo from './assets/pinglogo.png'
import { FaAnglesLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoLogoGameControllerB } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineHome } from "react-icons/md";
import CmpCard from '../CmpCard/CmpCard';

import { MdNotifications, MdNotificationImportant } from "react-icons/md";

// import {useNavigate} from 'react-router-dom';
import { AuthContext } from '../../UserContext/Context';
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [hasNotification, setHasNotification] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState('300px');
    // const [avatar, setAvatar] = useState('');
    // const navigate = useNavigate();
    const { user , get_auth_user} = useContext(AuthContext);

    const {Logout } = useContext(AuthContext);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        get_auth_user();
        const handleResize = () => {
            if (window.innerWidth <= 1024)
                setIsOpen(false)
            else
                setIsOpen(true)
            if (window.innerWidth <= 768)
                setSidebarWidth('50px')
            else
                setSidebarWidth('80px')
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

  return (
    <div
      className={styl.Sidebar}
      style={{ width: isOpen ? "300px" : sidebarWidth }}
    >
      <Link to="/">
        <div className={styl.Card} style={{ top: "0%" }}>
          <div className={styl.icon}>
            <img style={{ width: !isOpen && "70px" }} src={user.user?.avatar} />
            <p style={{ display: !isOpen && "none" }}>
              {user.user?.profile_name}
            </p>
          </div>
        </div>
      </Link>
      <div className={styl.cont}>
        <CmpCard
          isOpen={isOpen}
          ICON={MdOutlineHome}
          name={"Home"}
          link={"/home"}
        />
        <CmpCard
          isOpen={isOpen}
          ICON={CgProfile}
          name={"Profile"}
          link={"/profile"}
        />
        <CmpCard
          isOpen={isOpen}
          ICON={IoChatbubbleEllipsesOutline}
          name={"Chat"}
          link={"/chat"}
        />
        <CmpCard
          isOpen={isOpen}
          ICON={IoLogoGameControllerB}
          name={"Game"}
          link={"/game"}
        />
        <CmpCard
          isOpen={isOpen}
          ICON={hasNotification ? MdNotificationImportant : MdNotifications}
          name={"Notification"}
          link={"/notification"}
        />
        <CmpCard
          isOpen={isOpen}
          ICON={CiSettings}
          name={"Setting"}
          link={"/setting"}
        />
      </div>
      <div onClick={Logout}>
        {" "}
        <CmpCard
          isOpen={isOpen}
          ICON={AiOutlineLogout}
          name={"Log Out"}
          top={"0%"}
        />{" "}
      </div>
      <button
        className={styl.cirButton}
        onClick={handleClick}
        style={{ left: isOpen ? "96%" : "85%" }}
      >
        <FaAnglesLeft
          style={{ transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
        />
      </button>
    </div>
  );
}

export default Sidebar

