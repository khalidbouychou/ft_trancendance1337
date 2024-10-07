import { Route, Routes } from "react-router-dom";
// import Sidebar from "./components/Sidebar.jsx";
import style from "./App.module.css";

import Login from "./components/khbouych/Login/Login.jsx";
import PrivateRoutes from "./components/khbouych/PrivateRoutes/PrivateRoutes.jsx";

import Testhome from "./Testhome.jsx";

function App() {
  return (
    <>
      <div className={style.EntirePage}>
        {/* {window.location.pathname !== "/login" && <Sidebar />} */}
        <div className={style.MainContent}>
          <Routes>
          <Route path='/' element={<PrivateRoutes/>}>
            <Route path="/home" element={<Testhome />} />
          </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
