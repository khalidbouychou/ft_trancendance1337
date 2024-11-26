import { Link, useNavigate} from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import styl from "./Sidebar.module.css";
import pinglogo from "./assets/pinglogo.png";
import { MdNotifications, MdNotificationImportant } from "react-icons/md";
import { AuthContext } from "../../UserContext/Context";
import { FaSearchengin } from "react-icons/fa";
import SearchCard from "./components/searchCard/SearchCard.jsx";
import userImage from "./assets/nouahidi.jpeg";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const settRef = useRef(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const[openNotf, setOpenNotf] = useState('none');
  const[openSet, setOpenSet] = useState('none');
  const [gameColor, setGameColor] = useState('white')
  const [chatColor, setChatColor] = useState('white')
  const [profileColor, setProfileColor] = useState('yellow')

  const handelNotifOpen = () => {
    setOpenNotf(openNotf === "none" ? "flex" : "none");
  }

  const handelSetOpen = () => {
    setOpenSet(openSet === "none" ? "flex" : "none");
  }

  const handlGameColor = () => {
    setProfileColor("white");
    setGameColor("yellow")
    setChatColor("white")
  }
  const handlProfileColor = () => {
    setProfileColor("yellow");
    setGameColor("white")
    setChatColor("white")
  }
  const handlChatColor = () => {
    setProfileColor("white");
    setGameColor("white")
    setChatColor("yellow")
  }

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
    };

    fetchSearchResults();
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
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
      if (searchResults.length > 0)
        navigate(`/profile/${searchResults[0].profile_name}`);
    }
  };

  return (
    <div className={styl.navBar}>
      <div className={styl.logo}>
        <img src={pinglogo}/>
        <p >Ping Pong</p>
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
        <div className={styl.components}>
        <Link to={`/profile/${user?.user?.profile_name}`} onClick={handlProfileColor}><button style={{color: profileColor}}>Profile</button></Link>
        <Link to={'/games'} onClick={handlGameColor}><button style={{color: gameColor}}>Game</button></Link>
        <Link to={'/chat'} onClick={handlChatColor}><button style={{color: chatColor}}>Chat</button></Link>
        </div>
        <hr />
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
          <button className={styl.intImg}
          onClick={handelSetOpen}
          ref={settRef}
          >
              <div className={styl.extImg}>
                <img src={userImage}/>
              </div>
          </button>
          <div className={styl.settings} style={{display: openSet}}></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
