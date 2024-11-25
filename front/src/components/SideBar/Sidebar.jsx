import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import styl from "./Sidebar.module.css";
import pinglogo from "./assets/pinglogo.png";
import { FaAnglesLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoLogoGameControllerB } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineHome } from "react-icons/md";
import CmpCard from "../CmpCard/CmpCard";
import { useNotificationWS } from "../../contexts/NotifWSContext.jsx";
import { MdNotifications, MdNotificationImportant } from "react-icons/md";
import { useLocationContext } from "../../contexts/LocationContext.jsx";
import { AuthContext } from "../../UserContext/Context";
import { FaSearchengin } from "react-icons/fa";
import SearchCard from "./components/searchCard/SearchCard.jsx";
import { FaList } from "react-icons/fa";
import userImage from "./assets/nouahidi.jpeg";
import { CgCheck } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [hasNotification, setHasNotification] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("250px");
  const { notif } = useNotificationWS();
  const { currentLocation } = useLocationContext();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const settRef = useRef(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState("flex");
  const[openCard, setOpenCard] = useState('flex');
  const[openNotf, setOpenNotf] = useState('none');
  const[openSet, setOpenSet] = useState('none');

  // useEffect(() => {
  //   if (
  //     notif &&
  //     notif.status === "pending" &&
  //     currentLocation !== "/notification"
  //   ) {
  //     setHasNotification(true);
  //   }
  // }, [notif]);

  // useEffect(() => {
  //   if (currentLocation === "/notification") {
  //     setHasNotification(false);
  //   }
  // }, [currentLocation]);
  
  const handelNotifOpen = () => {
    setOpenNotf(openNotf === "none" ? "flex" : "none");
  }

  const handelSetOpen = () => {
    setOpenSet(openSet === "none" ? "flex" : "none");
  }

  const handelListOpen = () => {
    setOpenCard((prevOpenCard) => {
      const newState = prevOpenCard === "flex" ? "none" : "flex";
      setSidebarWidth(newState === "none" ? "70px" : "250px");
      if (window.innerWidth <= 900)
        setSidebarWidth(newState === "none" ? "50px" : "150px");
      return newState;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setSidebarWidth('70px')
        setOpenCard('none')
      }
      else
      {
        setOpenCard('flex')
        setSidebarWidth('250px')
      }
      if (window.innerWidth <= 768)
        setSidebarWidth("50px");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        const response = await fetch(
          `http://localhost:8000/api/search/?q=${searchQuery}`
        );
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
        console.log("dkhal");
      }
      setOpen("flex");
    };

    fetchSearchResults();
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setOpen("none");
      }
      if (notifRef.current && !notifRef.current.contains(event.target))
        setOpenNotf('none')
      if (settRef.current && !settRef.current.contains(event.target))
        setOpenSet('none')
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (searchResults.length > 0) {
        navigate(`/profile/${searchResults[0].profile_name}`);
      } else {
        setOpen("flex");
      }
    }
  };

  return (
    <div className={styl.Sidebar} style={{width: sidebarWidth, minWidth: sidebarWidth}}>
      <div className={styl.Head} ref={searchRef}>
        <div className={styl.begin}>
          <button className={styl.listIcon} onClick={handelListOpen}>
            <FaList id={styl.listicon}/>
          </button>
          <Link to={"/home"}>
            <button className={styl.logo}>
              <img src={pinglogo}></img>
              <p>Ping Pong</p>
            </button>
          </Link>
        </div>
        <div className={styl.search}>
          <div className={styl.iconSearch}>
            <FaSearchengin style={{ width: "50%", height: "50%" }} />
          </div>
          <div className={styl.inputSearch}>
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className={styl.searchResult}>
                {searchResults.slice(0, 5).map((user) => (
                  <SearchCard key={user.id} user={user} />
                ))}
            </div>
          </div>
        </div>
        <div className={styl.end}>
          <button className={styl.notifIcon} onClick={handelNotifOpen} ref={notifRef}>
            <MdNotifications id={styl.listicon}/>
            <div className={styl.notification} style={{display: openNotf}}>
              <div className={styl.inviteCard}>
                <button className={styl.userImg}>
                  <div className={styl.intImg} style={{ width: "50px", height: "55px" }}>
                    <div className={styl.intImg} style={{ width: "45px", height: "50px" }}>
                      <img src={userImage}/>
                    </div>
                  </div>
                </button>
                <div className={styl.choose}>
                  <div className={styl.Sender}>
                    <button style={{fontSize: '15px', fontWeight: '600'}}>NOUAHIDI</button>
                    <p style={{color: 'rgba(255, 255, 255, 0.4)'}}>sends you an invitation</p>
                  </div>
                  <div className={styl.butChoose}>
                    <button >accept</button>
                    <button style={{backgroundColor: '#660da56a'}}>remove</button>
                  </div>
                </div>
              </div>
            </div>
          </button>
          <div className={styl.sett}>
            <button className={styl.intImg} style={{ width: "45px", height: "50px", cursor: 'pointer' }}
            onClick={handelSetOpen}
            ref={settRef}
            >
                <div className={styl.intImg} style={{ width: "40px", height: "45px" }}>
                  <img src={userImage}/>
                </div>
            </button>
            <div className={styl.settings} style={{display: openSet}}></div>
          </div>
        </div>
      </div>
      <div className={styl.components}>
        <Link to={"/home"}>
          <button className={styl.componentCard}>
            <div className={styl.icons}>
              <MdOutlineHome className={styl.icon} />
            </div>
            <div className={styl.compName} style={{display: openCard}}>
              <p>Home</p>
            </div>
          </button>
        </Link>
        <Link to={`/profile/${user?.user?.profile_name}`}>
          <button className={styl.componentCard}>
            <div className={styl.icons}>
              <CgProfile className={styl.icon} />
            </div>
            <div className={styl.compName} style={{display: openCard}}>
              <p>Profile</p>
            </div>
          </button>
        </Link>
        <Link to={"games"}>
          <button className={styl.componentCard}>
            <div className={styl.icons}>
              <IoLogoGameControllerB className={styl.icon} />
            </div>
            <div className={styl.compName} style={{display: openCard}}>
              <p>Game</p>
            </div>
          </button>
        </Link>
        <Link to={"chat"}>
          <button className={styl.componentCard}>
            <div className={styl.icons}>
              <IoChatbubbleEllipsesOutline className={styl.icon} />
            </div>
            <div className={styl.compName} style={{display: openCard}}>
              <p>Chat</p>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
