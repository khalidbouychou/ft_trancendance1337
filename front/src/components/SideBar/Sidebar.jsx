import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import styl from "./Sidebar.module.css";
import En from "../../../public/assets/icons/lang-icons/En-lang.png";
import Fr from "../../../public/assets/icons/lang-icons/Fr-lang.png";
import It from "../../../public/assets/icons/lang-icons/It-lang.png";
import { MdNotifications } from "react-icons/md";
import pinglogo from "./assets/pinglogo.png";
import { AuthContext } from "../../UserContext/Context";
import { FaSearchengin } from "react-icons/fa";
import SearchCard from "./components/searchCard/SearchCard.jsx";
import userImage from "./assets/nouahidi.jpeg";
import { CiSettings, CiLogout } from "react-icons/ci";
import i18n from "../../i18n";

const Sidebar = () => {
  const { user, Logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const settRef = useRef(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openNotf, setOpenNotf] = useState('none');
  const [openSet, setOpenSet] = useState('none');
  const [gameColor, setGameColor] = useState('white');
  const [chatColor, setChatColor] = useState('white');
  const [profileColor, setProfileColor] = useState('yellow');
  const [menu, setMenu] = useState(false);

  // Translation functions
  const French = () => i18n.changeLanguage("fr");
  const English = () => i18n.changeLanguage("en");
  const Italian = () => i18n.changeLanguage("it");

  const handelNotifOpen = () => setOpenNotf(openNotf === "none" ? "flex" : "none");

  const handlGameColor = () => {
    setProfileColor("white");
    setGameColor("yellow");
    setChatColor("white");
  };

  const handlProfileColor = () => {
    setProfileColor("yellow");
    setGameColor("white");
    setChatColor("white");
  };

  const handlChatColor = () => {
    setProfileColor("white");
    setGameColor("white");
    setChatColor("yellow");
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const buttonColors = {
    home: activeTab === "home" ? "yellow" : "white",
    profile: activeTab === "profile" ? "yellow" : "white",
    game: activeTab === "game" ? "yellow" : "white",
    chat: activeTab === "chat" ? "yellow" : "white",
  };

  const toggleNotif = () => setNotifOpen(!notifOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        const response = await fetch(`https://localhost/api/search/?q=${searchQuery}`);
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    };

    const debounceFetch = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (settRef.current && !settRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && searchResults.length > 0) {
      navigate(`/profile/${searchResults[0].profile_name}`);
    }
  };

  return (
    <div className={styl.navBar}>
       <div className={styl.logo}>
        <img src={En} onClick={English}/>
        <img src={Fr} onClick={French}/>
        <img src={It}
        onClick={Italian} 
        />
         </div>
      <div className={styl.search} ref={searchRef}>
        <div className={styl.iconSearch}>
          <FaSearchengin style={{ width: "50%", height: "50%" }} />
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styl.inputSearch}
        />
        <div className={styl.searchResult}>
          {searchResults.slice(0, 5).map((user) => (
            <SearchCard key={user.id} user={user} />
          ))}
        </div>
      </div>
      <div className={styl.components}>
        <Link to="/home" onClick={() => setActiveTab("home")}>
          <button style={{ color: buttonColors.home }}>Home</button>
        </Link>
        <Link to={`/profile/${user?.user?.profile_name}`} onClick={() => setActiveTab("profile")}>
          <button style={{ color: buttonColors.profile }}>Profile</button>
        </Link>
        <Link to="/lang">
          <button style={{ color: buttonColors.profile }}>Lang</button>
        </Link>
        <Link to="/network">
          <button style={{ color: profileColor }}>User Status</button>
        </Link>
        <Link to={'/pingpong-games'} onClick={() => setActiveTab("game")}>
          <button style={{ color: buttonColors.game }}>Game</button>
        </Link>
        <Link to={'/chat'} onClick={() => setActiveTab("chat")}>
          <button style={{ color: buttonColors.chat }}>Chat</button>
        </Link>
      </div>
      <hr />
      <div className={styl.end}>
        <button className={styl.notifIcon} onClick={toggleNotif} ref={notifRef}>
          <MdNotifications id={styl.listicon} />
        </button>
        {notifOpen && (
          <div className={styl.notification}>
            <div className={styl.inviteCard}>
              <button className={styl.userImg}>
                <img src={userImage} alt="User" />
              </button>
              <div className={styl.choose}>
                <div className={styl.Sender}>
                  <button>NOUAHIDI</button>
                  <p>sends you an invitation</p>
                </div>
                <div className={styl.butChoose}>
                  <button>Accept</button>
                  <button style={{ backgroundColor: "#660da56a" }}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={styl.sett}>
          <button className={styl.intImg} onClick={() => setMenu(true)} ref={settRef}>
            <div className={styl.extImg}>
              <img src={user?.user?.avatar} alt="User Avatar" />
            </div>
          </button>
          {menu && (
            <div id='menu' className={styl.settings}>
              <div className={styl.links} onClick={() => navigate('/setting')}>
                <CiSettings style={{ width: '20px', height: '20px' }} />
                settings
              </div>
              <div onClick={Logout} className={styl.links}>
                <CiLogout style={{ width: '20px', height: '20px' }} />
                logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;