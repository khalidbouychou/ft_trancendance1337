import "./App.css";
// import Sidebar from "./component/Sidebar/Sidebar";
import {Route, Routes} from "react-router-dom";
// import Login from "./component/Login/Login";
// import HomePage from "./component/HomePage/HomePage";
// import Error from "./component/Error/Error";
// import { useContext, useEffect } from "react";
// // import axios from "axios";
// import { Link } from "react-router-dom";
// import Loader from "./component/Loader/Loader";
// import axios from "axios";
// import { authContext } from "./component/Context/Context";
import Otp from "./component/Otp/Otp";
// import { useEffect } from "react";

function App() {

  // const {islogged} = useContext(authContext);
  // const location = useLocation();

  // useEffect (() => {
  //   console.log("islogged", islogged);
  //   async function fetchData() {
  //     try {
  //       const response = await axios.get("http://localhost:8000/api/getusers/", {
  //         withCredentials: true,
  //       });
  //       console.log("data  " ,response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchData();
  // }, []);


  return (
    // localStorage.getItem("is_logged") && location.pathname !== "/login" ? (
    //     <div className="all">
    //     {(location.pathname !== ("/login")) && <Sidebar />}
        <Routes>
          <Route exact path="/otp" element={<Otp />} />
    {/* //       <Route exact path="/game" element={<div>game .... </div>} />
    //       <Route exact path="/home" element={<HomePage />} />
    //       <Route exact path="/" element={<HomePage />} />
    //       <Route exact path="/profil" element={<div>profile .... </div>} />
    //       <Route */}
    {/* //         exact
    //         path="/notification"
    //         element={<div>notification .... </div>}
    //         />
    //       <Route exact path="/chat" element={<div>chat .... </div>} />
    //       <Route exact path="/setting" element={<div>setting .... </div>} />
    //       <Route exact path="/login" element={ localStorage.getItem("is_logged") === true ? <Login /> */}
    {/* //         : <Navigate to="/home" /> */}
    {/* //     } /> */}
    {/* //       <Route exact path="/page404" element={<Error/>}/>
    //       <Route exact path="*" element={<Navigate to='/page404' />} /> */}
        </Routes>
    //   </div>
    //   ) : (
    //           <Login />
    //   )
  );
}

export default App;
