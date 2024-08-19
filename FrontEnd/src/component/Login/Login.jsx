import axios from "axios";
import styl from "./login.module.css";
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
    <div className={styl.all}>
      <div className={styl.log}>
        <a
          href={url}
        >
          <img src="./img/42logo.png" />
        </a>
      </div>
    </div>
  );
};

export default Login;
