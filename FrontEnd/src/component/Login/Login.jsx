import axios from "axios";
// import styl from "./login.module.css";
import { useContext, useEffect, useState } from "react";
import img from "../../../public/img/videTabl.jpg";
import "./test.css";
import { authContext } from "../Context/Context";

// const Login = () => {
const PongParadise = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    async function auth_intra42() {
      const response = await axios.get("http://localhost:8000/api/auth_intra/");
      try {
        if (response.status === 200) {
          setUrl(response.data.url);
        }
      } catch (error) {
        console.log(error);
      }
    }
    auth_intra42();
    
  }, []);

  return (
    <div
      className="pong-paradise-container"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="pong-paradise-card">
        <h1 className="pong-paradise-title">Welcome to Pong Paradise!</h1>
        <p className="pong-paradise-description">
          Experience the thrill of classic gaming with a modern twist.
          <br />
          Join players worldwide in fast-paced matches, tournaments and
          challenges. <br />
          Ready to dominate the Pong arena? Let's play!
        </p>
        <div className="pong-paradise-logo">
          <a href={url}>
            <img src="/img/42logo.png" alt="pong paradise" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PongParadise;
