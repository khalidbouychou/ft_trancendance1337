import { Routes, Route } from "react-router-dom";
import AuthProvider from "./UserContext/Context.jsx";
import style from "./App.module.css";
import Layout from "./Layout.jsx";


function App() {
  return (
      <div className={style.EntirePage}>
        <div className={style.MainContent}>
            <Routes>
              <Route path="/" element={<Layout />}>
                
              </Route>
            </Routes>
        </div>
      </div>
  );
}

export default App;
