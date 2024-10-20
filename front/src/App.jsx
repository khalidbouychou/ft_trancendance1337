
import { Routes, Route } from 'react-router-dom';
import style from './App.module.css';
import Login from './Login/intra/Login.jsx';
// import Settings from './components/Setting/Setting.jsx';
function App() {
  

  return (
    <div className={style.EntirePage}>
      <div className={style.MainContent}>
        <Routes>
            <Route path="/" element={<h1>le7waaa</h1>} />
            <Route path="/home" element={<h1>Home</h1>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
     // </BrowserRouter>
  );
}

export default App;
