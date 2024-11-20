import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext, useRef } from 'react';
import styl from './Sidebar.module.css';
import pinglogo from './assets/pinglogo.png';
import { FaAnglesLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoLogoGameControllerB } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineHome } from "react-icons/md";
import CmpCard from '../CmpCard/CmpCard';
import { useNotificationWS } from '../../contexts/NotifWSContext.jsx';
import { MdNotifications, MdNotificationImportant } from "react-icons/md";
import { useLocationContext } from '../../contexts/LocationContext.jsx';
import { AuthContext } from "../../UserContext/Context";
import { FaSearchengin } from "react-icons/fa";
import SearchCard from '../Home/components/SearchCard/SearchCard.jsx';
import { FaList } from "react-icons/fa";


const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [hasNotification, setHasNotification] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState('300px');
    const { notif } = useNotificationWS();
    const { currentLocation } = useLocationContext();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState('none')

    useEffect(() => {
        if (notif && notif.status === 'pending' && currentLocation !== '/notification') {
            setHasNotification(true);
        }
    }, [notif]);

    useEffect(() => {
        if (currentLocation === '/notification') {
            setHasNotification(false);
        }
    }, [currentLocation]);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handelSetopen = () => {
      setOpen(open === 'none' ? 'flex' : 'none')
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024)
                setIsOpen(false);
            else
                setIsOpen(true);
            if (window.innerWidth <= 768)
                setSidebarWidth('50px');
            else
                setSidebarWidth('80px');
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
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
                console.log('dkhal')
              }
            setOpen('flex');
        };

        fetchSearchResults();
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
                setOpen('none');
            }
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
              setOpen('flex');
          }
      }
  };

    return (
        <div className={styl.Sidebar}>
            <div className={styl.search} ref={searchRef}>
                <div className={styl.iconSearch }>
                    <FaSearchengin style={{width: '50%', height: '50%'}}/>
                </div>
                <div className={styl.inputSearch}>
                    <input 
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <div className={styl.searchResult}>
                    {searchResults.length > 0 && (
                        <div className={styl.searchResult}>
                            {searchResults.slice(0, 5).map((user) => (
                                <SearchCard key={user.id} user={user} />
                            ))}
                        </div>
                    )}
                    {searchResults.length === 0 && searchQuery.trim() !== "" && (
                        <div className={styl.searchResult} style={{height: '40px', width: '200px', display: open, alignItems: 'center'}}>
                            <p >No results found</p>
                        </div>
                    )}
                </div>
            </div>
            <div className={styl.Head}>
                <div className={styl.sett}>
                    <button className={styl.icons}>
                        <FaList className={styl.icon} style={{width: '50%', height: '50%'}}/>
                    </button>
                    <Link to={'/home'}>
                    <button className={styl.logo}>
                        <img src={pinglogo}></img>
                        <p >Ping Pong</p>
                    </button>
                    </Link>
                </div>
            </div>
            <div className={styl.components}>
                <Link to={'/home'}>
                    <button className={styl.componentCard}>
                        <div className={styl.icons} >
                            <MdOutlineHome className={styl.icon}/>
                        </div>
                        <div className={styl.compName}>
                            <p >Home</p>
                        </div>
                    </button>
                </Link>
                <Link to={`/profile/${user?.user?.profile_name}`}><button className={styl.componentCard}>
                    <div className={styl.icons} >
                        <CgProfile className={styl.icon}/>
                    </div>
                    <div className={styl.compName}>
                        <p >Profile</p>
                    </div>
                </button></Link>
                <Link to={'notification'}>
                    <button className={styl.componentCard}>
                        <div className={styl.icons} >
                            <MdNotifications className={styl.icon}/>
                        </div>
                        <div className={styl.compName}>
                            <p >Notification</p>
                        </div>
                    </button>
                </Link>
                <Link to={'games'}>
                    <button className={styl.componentCard}>
                        <div className={styl.icons} >
                            <CgProfile className={styl.icon}/>
                        </div>
                        <div className={styl.compName}>
                            <p >Game</p>
                        </div>
                    </button>
                </Link>
                <Link to={'chat'}>
                    <button className={styl.componentCard}>
                        <div className={styl.icons} >
                            <IoChatbubbleEllipsesOutline className={styl.icon}/>
                        </div>
                        <div className={styl.compName}>
                            <p >Chat</p>
                        </div>
                    </button>
                </Link>
            </div>
            {/* <Link to='/'>
                <div className={styl.Card} style={{top: '0%'}}>
                <div className={styl.icon}>
                    <img src={pinglogo}/>
                </div>
                <div className={styl.gameName} style={{display: isOpen ? 'flex' : 'none'}}><p>ping pong</p></div>
                </div>
            </Link>
            <div className={styl.cont}>
                <CmpCard isOpen={isOpen} ICON={MdOutlineHome} name={'Home'} link={'/home'}/> */}
                {/* <CmpCard isOpen={isOpen} ICON={CgProfile} name={'Profile'} link={`/profile/${user?.user?.profile_name}`}/> */}
                {/* <CmpCard isOpen={isOpen} ICON={IoChatbubbleEllipsesOutline} name={'Chat'} link={'/chat'}/>
                <CmpCard isOpen={isOpen} ICON={IoLogoGameControllerB} name={'Game'} link={'/games'}/>
                <CmpCard isOpen={isOpen} ICON={hasNotification ? MdNotificationImportant : MdNotifications} name={'Notification'} link={'/notification'}/>
                <CmpCard isOpen={isOpen} ICON={CiSettings} name={'Setting'} link={'/setting'}/>
                <CmpCard isOpen={isOpen} ICON={AiOutlineLogout} name={'Log Out'} top={'20%'}/>
            </div> */}
            {/* <button className={styl.cirButton} onClick={handleClick} style={{left: isOpen ? '96%' : '85%'}}>
                <FaAnglesLeft style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)'}}/>
            </button> */}
        </div>
    )
}

export default Sidebar;
