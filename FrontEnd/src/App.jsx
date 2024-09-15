
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Profile, Chat, Notifications, Games, Settings, Logout } from '..'; // Import your components
import Sidebar from '../src/component/Sidebar/Sidebar'; // Import your Sidebar component
import PrivateRoute from '../src/component/PrivateRoutes/Pvroutes'; // Import the PrivateRoute component

const App = () => {
  // Placeholder components for each route
  const Profile = () => <div>Profile Content</div>;
  const Chat = () => <div>Chat Content</div>;
  const Notifications = () => <div>Notifications Content</div>;
  const Games = () => <div>Games Content</div>;
  const Settings = () => <div>Settings Content</div>;
  const Logout = () => <div>Logout Content</div>;

  return (
    <Router>
      <div className="app-container">
        {(window.location.pathname !== '/login' ) ? <Sidebar avatarUrl='../public/img/khbouych.jpeg' nickname='khbouych' /> : null}
        <main className="content-area">
          <Routes>
            <Route path="/login" component={<div>Login</div>} />
            <Route path="*" element={<div>Not Found</div>} />
            <PrivateRoute path="/profile" component={Profile}></PrivateRoute>
            <PrivateRoute path="/chat" component={Chat} ></PrivateRoute>
            <PrivateRoute path="/notifications" component={Notifications} ></PrivateRoute>
            <PrivateRoute path="/games" component={Games} ></PrivateRoute>
            <PrivateRoute path="/settings" component={Settings} ></PrivateRoute>
            <PrivateRoute path="/logout" component={Logout} ></PrivateRoute>
            <PrivateRoute path="/" element={<div>home</div>} ></PrivateRoute>

          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;