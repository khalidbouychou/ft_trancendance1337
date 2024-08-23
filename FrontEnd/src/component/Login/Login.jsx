import axios from "axios";
import styl from "./login.module.css";
import "./Login.css";
import { useEffect, useState } from "react";

const Login = () => {
  const [url, setUrl] = useState("");
useEffect(() => {
  async function auth_intra42() {

    const response = await axios.get('http://localhost:8000/api/auth_intra/');
    try {
      if (response.status === 200) {
        setUrl(response.data.url);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  auth_intra42();
}, [])

  return (
    // <div className={styl.all}>
    //   <div className={styl.log}>
    //     <a
    //       href={url}
    //     >
    //       <img src="./img/42logo.png" />
    //     </a>
    //   </div>
    // </div>

    <div className="hh">
      <div className="split-container">

      <div className="text-side">
        <h1>Pong Game: Atari</h1>
        <div>Sign in with your 42 Intra account to play the game</div>
        <a
          href={url}
          >
        <img src="./img/42logo.png" alt="42 Intra Logo" className="logo-small" />
        </a>
      </div>
      </div>
    </div>
  );
};

export default Login;
