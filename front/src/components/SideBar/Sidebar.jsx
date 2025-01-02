import { Link, useNavigate} from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import styl from "./Sidebar.module.css";
import En from "../../../public/assets/icons/lang-icons/En-lang.png";
import Fr from "../../../public/assets/icons/lang-icons/Fr-lang.png";
import It from "../../../public/assets/icons/lang-icons/It-lang.png";
import { MdNotifications, MdNotificationImportant } from "react-icons/md";
import { AuthContext } from "../../UserContext/Context";
import { FaSearchengin } from "react-icons/fa";
import SearchCard from "./components/searchCard/SearchCard.jsx";
import userImage from "./assets/nouahidi.jpeg";
import { CiSettings } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { use } from "react";
import i18n from "../../i18n";
// import { height } from "@mui/system";


const Sidebar = () => {
  const { t,user ,Logout} = useContext(AuthContext);
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
  const [notiColor, setNotifColor] = useState('white')
  const [menu, setMenu] = useState(false)



  //------------Translation----------------
  const French = () => {
    localStorage.setItem("lang", "fr");
    i18n.changeLanguage(localStorage.getItem("lang"));
  }
  const English = () => {
      localStorage.setItem("lang", "en");
      i18n.changeLanguage(localStorage.getItem("lang"));
  }
  const Italian = () => {
    localStorage.setItem("lang", "it");
    i18n.changeLanguage(localStorage.getItem("lang"));
  }
  //------------Translation----------------
  const handelNotifOpen = () => {
    setOpenNotf(openNotf === "none" ? "flex" : "none");
  }

  const handlGameColor = () => {
    setGameColor("yellow")
    setNotifColor("white")
    setProfileColor("white")
    setChatColor("white")
  }
  const handlProfileColor = () => {
    setProfileColor("yellow");
    setNotifColor("white")
    setGameColor("white")
    setChatColor("white")
  }
  const handlChatColor = () => {
    setChatColor("yellow")
    setNotifColor("white")
    setProfileColor("white")
    setGameColor("white")
  }
  const handlNotifColor = () => {
    setNotifColor("yellow")
    setProfileColor("white")
    setGameColor("white")
    setChatColor("white")
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (searchResults.length > 0)
        navigate(`/profile/${searchResults[0]?.profile_name}`);
    }
  };

  const handelClick = (e) => {

    if (settRef.current && !settRef.current.contains(e.target)) {
      setMenu(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handelClick);
    return () => {
      document.removeEventListener("click", handelClick);
    };
  }, []);

  return (
    <div className={styl.navBar}>
      <div className={styl.logo}>
        <img src={En} onClick={English}/>
        <img src={Fr} onClick={French}/>
        <img src={It}
        onClick={Italian} 
        />
      </div>
      <div className={styl.search}>
        <div className={styl.iconSearch}>
          <FaSearchengin style={{ width: "50%", height: "50%" }} />
        </div>
        <div className={styl.inputSearch}>
          <input
            type="text"
            placeholder={t("Search...")}
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
          {/* <Link to={`/anonymized`} onClick={handlProfileColor}><button style={{color: profileColor}}>List Anonymized</button></Link> */}
          {/* <Link to="/lang"><button style={{color: profileColor}}>Lang</button></Link> */}
          <Link to={"/notification"} onClick={handlNotifColor}><button style={{color: notiColor}}>Notification</button></Link>
          <Link to={'/games'} onClick={handlGameColor}><button style={{color: gameColor}}>Games</button></Link>
          <Link to={'/chat'} onClick={handlChatColor}><button style={{color: chatColor}}>Chat</button></Link>
          <div className={styl.sett}>
          <button className={styl.intImg} onClick={()=>{setMenu(true)}} ref={settRef}>
              <div className={styl.extImg}>
                <img src={user?.user?.avatar}/>
              </div>
          </button>
          {menu &&
          <div id='menu' className={styl.settings}>
            <div className="links-container">
              <div className={styl.links} onClick={ ()=> { navigate('/setting')}}>
                <CiSettings style={{width: '20px', height: '20px'}}/> 
                {t("Setting")}
              </div>
              <div onClick={Logout} className={styl.links}>
                <CiLogout style={{width: '20px', height: '20px'}} />
                {t("Logout")}
              </div>
            </div>
          </div>
          }
        </div>
      </div>
        
      {/* <div className={styl.end}> */}
        {/* <button className={styl.notifIcon} onClick={handelNotifOpen} ref={notifRef}> */}
          {/* <MdNotifications id={styl.listicon}/> */}
          {/* <div className={styl.notification} style={{display: openNotf}}> */}
            {/* <div className={styl.inviteCard}> */}
              {/* <button className={styl.userImg}> */}
                {/* <div className={styl.intImg} style={{ width: "50px", height: "55px" }}> */}
                  {/* <div className={styl.intImg} style={{ width: "45px", height: "50px" }}> */}
                    {/* notification image */}
                  {/* <img src={userImage}/> */}
                  {/* </div> */}
                {/* </div> */}
              {/* </button> */}
              {/* <div className={styl.choose}> */}
                {/* <div className={styl.Sender}> */}
                  {/* <button style={{fontSize: '15px', fontWeight: '600'}}>NOUAHIDI</button> */}
                  {/* <p style={{color: 'rgba(255, 255, 255, 0.4)'}}>sends you an invitation</p> */}
                {/* </div> */}
                {/* <div className={styl.butChoose}> */}
                  {/* <button >accept</button> */}
                  {/* <button style={{backgroundColor: '#660da56a'}}>remove</button> */}
                {/* </div> */}
              {/* </div> */}
            {/* </div> */}
          {/* </div> */}
        {/* </button> */}
        
      {/* </div> */}
    </div>
  );
};

export default Sidebar;