import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../UserContext/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signin = () => {
  const { url, auth_intra42 , setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handelogin = async (e) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        toast.error("Please fill all the fields",
        {
          position: "top-right",
          autoClose: 1000,
        });
        return;
      }
        const response = await axios.post("http://localhost:8000/api/singin/", {
        username,
        password,
      }, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.user);
        toast.success("login success",
        {
          position: "top-right",
          autoClose: 1000,
          closeOnClick: true,
        });
        setTimeout(() => {
          navigate("/");
          
        }, 1300);
      }
    } catch (err) {
      toast.error("login failed",
      {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    if (!url) {
      auth_intra42();
    }
  }, [url, auth_intra42]);
 

  return (
    <>
      <form className="form login-form" onSubmit={handelogin}>
        <input
          type="text"
          placeholder="Username"
          className="input"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="button sign-in">SIGN IN</button>
        <div className="separator">
          <hr />
          <span>OR</span>
        </div>
        <button
          className="button intra" 
          onClick={() => {
            window.location.href = url;
          }}
        >
          INTRA 42
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default Signin;
