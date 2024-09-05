import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx';
import Profile from './components/Profile/Profile.jsx';
import Setting from './pages/Setting.jsx';
import Home from './components/Home/Home.jsx';
import Game from './components/Game/Game.jsx';
import Chat from './pages/Chat.jsx';
import Achievement from './pages/Achievement.jsx';
import Notificationz from './components/Notification/Notification.jsx';
import None from './pages/None.jsx';
import style from './App.module.css'

function App() {
  return (
      <BrowserRouter>
      <div className={style.EntirePage}>
        <div className={style.LeftBar}>
          <Sidebar />
        </div>
        <div className={style.MainContent}>
          <Routes>
            <Route path="/"element={<Home />}/>
            <Route path="/game"element={<Game />}/>
            <Route path="/chat"element={<Chat />}/>
            <Route path="/profile"element={<Profile />}/>
            <Route path="/setting"element={<Setting />}/>
            <Route path="/achievement"element={<Achievement />}/>
            <Route path="/notification"element={<Notificationz />}/>
            <Route path="*"element={<None />}/>
          </Routes>
        
        </div>
      </div>
      </BrowserRouter>
  );
}

export default App
