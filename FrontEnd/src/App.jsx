import "./App.css";
import Sidebar from "./component/Sidebar/Sidebar";
import {Route, Routes} from "react-router-dom";
import Otp from "./component/Otp/Otp";
import { useEffect, useState } from "react";
import Login from "./component/Login/Login";


function App() {


  // const [is_logged, setLogged] = useState(localStorage.getItem("is_logged"));

  // useEffect(() => {
  //  console.log("is_logged:", is_logged);
  // }
  // , );

  return (
        <Routes>
          <Route path='/' element={<Sidebar />} >
            <Route  path='otp' element={<Otp />} />
            <Route  path='login' element={<Login />} />
            <Route  path='home' element={<h1> hello home </h1>} />
          </Route>
        </Routes>
  );

}

export default App;
