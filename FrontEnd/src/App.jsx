import "./App.css";
import Sidebar from "./component/Sidebar/Sidebar";
import {Route, Routes} from "react-router-dom";
import Otp from "./component/Otp/Otp";
import { useEffect, useState } from "react";
import Login from "./component/Login/Login";
import Error from "./component/Error/Error";
import Layout from "./component/Layout/Layout";


const Profil = () => {
  return (
    <div>
      <h1>profil</h1>
    </div>
  );
}

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

function App() {


  // const [is_logged, setLogged] = useState(localStorage.getItem("is_logged"));

  // useEffect(() => {
  //  console.log("is_logged:", is_logged);
  // }
  // , );

  return (
        <Routes>
            <Route path='/' element={<Layout />} >
              <Route path='otp' element={<Otp />} />
              <Route path='login' element={<Login/>}/>
              <Route  path='home' element={<Home/>} />
              <Route  path='profile' element={<Profil/>} />
            </Route>
            <Route path='*' element={<Error/>} />
        </Routes>
  );

}

export default App;
