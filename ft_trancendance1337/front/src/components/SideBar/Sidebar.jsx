import { Link, Navigate, useLocation } from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react'
import styl from './Sidebar.module.css'
import pinglogo from './assets/pinglogo.png'
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
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [hasNotification, setHasNotification] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState('300px');
    const { notif } = useNotificationWS();
    const { currentLocation } = useLocationContext();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

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
        setIsOpen(!isOpen)
    }

    useEffect(() => {
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

    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchSearchResults = async () => {
          if (searchQuery.trim()) {
            const response = await fetch(
              `http://10.13.6.3:8000/api/search/?q=${searchQuery}`
            );
            const data = await response.json();
            console.log(data);
            setSearchResults(data);
          } else {
            setSearchResults([]);
          }
        };
    
        fetchSearchResults();
      }, [searchQuery]);

      const handleSearch = () => {
        if (searchQuery.trim()) {
          navigate(`/search?q=${searchQuery}`);
        }
      };

      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      };

  return (
    <div className={styl.Sidebar} style={{ width: isOpen ? '300px' : sidebarWidth }}>
        <div className={styl.search}>
            <div className={styl.iconSearch }>
                <FaSearchengin style={{width: '50%', height: '50%'}}/>
            </div>
            <div className={styl.inputSearch}>
                <input type="text" placeholder='Search...' onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown}/>
            </div>
            <div className={styl.searchResult}>
            {searchResults.length > 0 && (
              <div className={styl.searchResult}>
                {searchResults.map((user) => (
                  <SearchCard key={user.id} user={user} />
                ))}
              </div>
            )}
            {searchResults.length === 0 && searchQuery.trim() !== "" && (
              <div className={styl.noResult}>
                <p>No results found</p>
              </div>
            )}
          </div>
        </div>
        <Link to='/'><div className={styl.Card} style={{top: '0%'}}>
            <div className={styl.icon}>
                <img src={pinglogo}/>
            </div>
            <div className={styl.gameName} style={{display: isOpen ? 'flex' : 'none'}}><p >ping pong</p></div>
        </div>
        </Link>
        <div className={styl.cont} >
            <CmpCard isOpen={isOpen} ICON={MdOutlineHome} name={'Home'} link={'/home'}/>
            {/* <CmpCard isOpen={isOpen} ICON={MdOutlineHome} name={'Home'} link={'/search'}/> */}
            <CmpCard isOpen={isOpen} ICON={CgProfile} name={'Profile'} link={`/profile/${user?.user?.profile_name}`}/>
            <CmpCard isOpen={isOpen} ICON={IoChatbubbleEllipsesOutline} name={'Chat'} link={'/chat'}/>
            <CmpCard isOpen={isOpen} ICON={IoLogoGameControllerB} name={'Game'} link={'/games'}/>
            {/* <CmpCard isOpen={isOpen} ICON={IoIosNotifications} name={'Notification'} link={'/notification'}/> */}
            <CmpCard isOpen={isOpen} ICON={hasNotification ? MdNotificationImportant : MdNotifications} name={'Notification'} link={'/notification'}/>
            <CmpCard isOpen={isOpen} ICON={CiSettings} name={'Setting'} link={'/setting'}/>
            <CmpCard isOpen={isOpen} ICON={AiOutlineLogout} name={'Log Out'} top={'43%'}/>
        </div>
        <button className={styl.cirButton} onClick={handleClick} style={{left: isOpen ? '96%' : '85%'}}>
            <FaAnglesLeft style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)'}}/>
        </button>
    </div>
  )
}

export default Sidebar

