import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import styl from "./Sidebar.module.css";
import pinglogo from "./assets/pinglogo.png";
import { MdNotifications } from "react-icons/md";
import { AuthContext } from "../../UserContext/Context";
import { FaSearchengin } from "react-icons/fa";
import SearchCard from "./components/searchCard/SearchCard.jsx";
import userImage from "./assets/nouahidi.jpeg";
import { CiSettings, CiLogout } from "react-icons/ci";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const settRef = useRef(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
        const response = await fetch(
          `http://localhost:8000/api/search/?q=${searchQuery}`
        );
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
      <Link to="/" className={styl.logo} onClick={() => setActiveTab("home")}>
        <img src={pinglogo} alt="Ping Pong Logo" />
        <p>Ping Pong</p>
      </Link>
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
        <Link to="/" onClick={() => setActiveTab("home")}>
          <button style={{ color: buttonColors.home }}>Home</button>
        </Link>
        <Link
          to={`/profile/${user?.user?.profile_name}`}
          onClick={() => setActiveTab("profile")}
        >
          <button style={{ color: buttonColors.profile }}>Profile</button>
        </Link>
        <Link to="/games" onClick={() => setActiveTab("game")}>
          <button style={{ color: buttonColors.game }}>Game</button>
        </Link>
        <Link to="/chat" onClick={() => setActiveTab("chat")}>
          <button style={{ color: buttonColors.chat }}>Chat</button>
        </Link>
      </div>
      <div className={styl.end}>
        <button
          className={styl.notifIcon}
          onClick={toggleNotif}
          ref={notifRef}
        >
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
                  <button style={{ backgroundColor: "#660da56a" }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          className={styl.intImg}
          onClick={toggleMenu}
          ref={settRef}
        >
          <img src={user?.user?.avatar} alt="User Avatar" />
        </button>
        {menuOpen && (
          <div className={styl.settings}>
            <Link className={styl.links} to="/setting">
              <CiSettings /> Settings
            </Link>
            <Link className={styl.links} to="/logout">
              <CiLogout /> Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
