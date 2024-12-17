import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../UserContext/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useRef } from "react";

const Signin = () => {
  const {  auth_intra42, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loggedIntra = useRef(false);
  const REDIRECT_URI="http://localhost:5173"
  const C_ID="u-s4t2ud-86ebf6e58c1ee7b72120758624f1bdf92ef623b1d8a560e86efb6b4952fafdb9"
  console.log("---->", C_ID, REDIRECT_URI)
  const url = `https://api.intra.42.fr/oauth/authorize?client_id=${C_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`
  // https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-86ebf6e58c1ee7b72120758624f1bdf92ef623b1d8a560e86efb6b4952fafdb9&redirect_uri=http://localhost:5173&response_type=code
  const handelogin = async (e) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        toast.error("Please fill all the fields", {
          style: {
            backgroundColor: 'rgb(255, 0, 0)',
            color: 'white'
          }
        });
        return;
      }
      const response = await axios.post(
        "http://localhost:8000/api/singin/",
        {
          username,
          password
        },
        {
          withCredentials: true
        }
      );
      if (response.status === 200) {
        setUser(response.data.user);
        toast.success("login success", {
          style: {
            backgroundColor: 'rgb(0, 128, 0)',
            color: 'white'
          }
        });
        setTimeout(() => {
          navigate("/");
        }, 1300);
      }
    } catch (err) {
      toast.error("login failed", {
        style: {
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'white'
        }
      });
    }
  };

  // useEffect(() => {
  //   if (!url && loggedIntra.current) {
  //     auth_intra42();
  //     loggedIntra.current = false;
  //   }
  // }, [url]);

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
        <button type="submit" className="button sign-in">
          SIGN IN
        </button>
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

    </>
  );
};

export default Signin;
