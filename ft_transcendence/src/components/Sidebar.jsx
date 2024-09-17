import { Link } from 'react-router-dom';
// import './Sidebar.Module.css';

// function Sidebar() {
//     return (
//         <div className="side-nav">
//             <div className="user"><Link to="/profile">
//                 <img src="assets/icons/user.svg" className="user-img" alt="User Icon" />
//                 <div>
//                     <h2>Mohammed Reda</h2>
//                     <p>redaeljirari@gmail.com</p>
//                 </div>
//                 </Link>
//             </div>
//             <ul>
//                 <li><Link to="/"><img src="assets/icons/home.svg"/><p>Home</p></Link></li>
//                 <li><Link to="/chat"><img src="assets/icons/chat.svg"/><p>Chat</p></Link></li>
//                 <li><Link to="/game"><img src="assets/icons/logo.svg"/><p>Game</p></Link></li>
//                 <li><Link to="/achievement"><img src="assets/icons/achievement.svg"/><p>Achievement</p></Link></li>
//                 <li><Link to="/notification"><img src="assets/icons/notification.svg"/><p>Notification</p></Link></li>
//             </ul>
//             <ul>
//                 <li><Link to="/setting"><img src="assets/icons/setting.svg" alt="Settings Icon"/><p>Settings</p></Link></li>
//             </ul>
//         </div>
//     );
// }

// export default Sidebar;

import React, {useState, useEffect} from 'react'
import styl from './Sidebar.module.css'
import pinglogo from './pinglogo.png'
import pingname from './pingname.png'
import { FaAnglesLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoLogoGameControllerB } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { BiLogOut } from 'react-icons/bi';
import CmpCard from './CmpCard/CmpCard';


const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [hasNotification, setHasNotification] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024)
                setIsOpen(false)
            else
                setIsOpen(true)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

  return (
    <div className={styl.Sidebar} style={{ width: isOpen ? '300px' : '80px' }}>
        <Link to='/'><div className={styl.Card} style={{top: '0%'}}>
            <div className={styl.icon}>
                <img src={pinglogo}/>
            </div>
            <div className={styl.gameName} style={{display: isOpen ? 'flex' : 'none'}}><p >ping pong</p></div>
        </div>
        </Link>
        <div className={styl.cont} >
            {/* <div className={styl.icons}>
                <Link to="/"><img src={pinglogo}/></Link>
                <hr />
                <div className={styl.allIcon}>
                    <button >
                        <Link to="/profile"><CgProfile className={styl.icon}/></Link>
                    </button>
                    <button >
                        <Link to="/chat"><IoChatbubbleEllipsesOutline className={styl.icon}/></Link>
                    </button>
                    <button >
                        <Link to="/game"><IoLogoGameControllerB className={styl.icon}/></Link>
                    </button>
                    <button >
                        <div className={styl.notification}>
                            <Link to="/notification"><IoIosNotifications className={styl.icon}/></Link>
                            {hasNotification && <div className={styl.circle}></div>}
                        </div>
                    </button>
                    <button >
                        <Link to="/setting"><CiSettings className={styl.icon}/></Link>
                    </button>
                </div>
                <button className={styl.logoutlogo}>
                    <AiOutlineLogout className={styl.icon}/>
                </button>
            </div>
            <div className={styl.pageName} style={{ transform: isOpen ? 'translateX(0)' :
                'translateX(-190px)',opacity: isOpen ? 1 : 0}}>
                <div className={styl.cmpName} style={{display: isOpen ? 'flex' : 'none'}}>
                    <div className={styl.gameName}>
                        <p >Ping Pong</p>
                    </div>
                    <hr />
                    <div className={styl.iconName}>
                        <p >My Profile</p>
                        <p >Chat</p>
                        <p >Game</p>
                        <p >Notification</p>
                        <p >Settings</p>
                    </div>
                    <p className={styl.logoutName}>Log Out</p>
                </div>
            </div> */}
            <CmpCard isOpen={isOpen} ICON={CgProfile} name={'Profile'} link={'/profile'}/>
            <CmpCard isOpen={isOpen} ICON={IoChatbubbleEllipsesOutline} name={'Chat'} link={'/chat'}/>
            <CmpCard isOpen={isOpen} ICON={IoLogoGameControllerB} name={'Game'} link={'/game'}/>
            <CmpCard isOpen={isOpen} ICON={IoIosNotifications} name={'Notification'} link={'/notification'}/>
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

