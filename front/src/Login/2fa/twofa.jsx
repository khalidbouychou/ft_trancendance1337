import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./twofa.css";
import { AuthContext } from "../../UserContext/Context";
import { useLocation } from "react-router-dom";
import Desable2fa from "./Desable2fa";
import Off from "./Off";
const Twofa = () => {
  const [twofa, setTwofa] = useState(false);
  const [qrcode, setQrcode] = useState("");
  const { user, setUser, get_auth_user } = useContext(AuthContext);
  const [isEnable, setEnable] = useState(false);
    const location = useLocation();
  const numInputs = 6;

  const QR_CODE_URL = "http://localhost:8000/api/qrcode/";
  const DISABLE_2FA_URL = "http://localhost:8000/api/d_2fa/";
  const USER_STATUS_URL = "http://localhost:8000/api/user_status/";


  const renderInputs = () => {
    return Array.from({ length: numInputs }).map((_, i) => (
      <input key={i} type="text" className="otp-input" maxLength={1}  />
    ));
  };

  useEffect(() => {
    const fetchTwofaStatus = async () => {
      const res = await axios.get(USER_STATUS_URL, { withCredentials: true });
        if (res.status === 200) {
          setTwofa(res.data.user.two_factor); // Set the 2FA status from the backend
          if (res.data.user.two_factor && res.data.user.qrcode_path) {
            setQrcode(`http://localhost:8000/${res.data.user.qrcode_path}`);
          }
        }
    };
     fetchTwofaStatus();
  }, [location.pathname]);

  
  const handleSwitch = async (e) => {
    e.preventDefault();
    const isOn = e.target.value === "On";
    // setTwofa(isOn);
    setTwofa(isOn);
    
    try {
      const url = isOn ? QR_CODE_URL : DISABLE_2FA_URL;
      const res = await axios.get(url, { withCredentials: true });
      
      if (res.status === 200) {
        setUser(res.data.user);
        if (isOn) {
          // setTwofa(true);
          setEnable(true);
          setQrcode(`http://localhost:8000/${res.data.user.qrcode_path}`);
        } else {
          // setTwofa(false);
          setEnable(false);
          setQrcode("");
        }
        // await get_auth_user();
        // setTwofa(user.two_factor);
        // console.log("userrrrrr....", user);
      }
    } catch (error) {
      console.error("Error toggling 2FA:", error);
    }
  };


  const handlverify = async () => {
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs)
      .map((input) => input.value)
      .join("");
    console.log("---------------> otp", otp);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/otpverify/",
        {
          otp,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.cookie
              .split("; ")
              .find((row) => row.startsWith("csrftoken="))
              .split("=")[1],
          },
        }
      );
      if (res.status === 200) {
        console.log("------------>", res.data);
        console.log("2FA verified");
        // setTwofa(true);
        // await get_auth_user();
        // setTwofa(user.two_factor);
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error);
    }
  };
  
  return (
    <div className="container">
      <div className="qrcode-container">
        <div className="switch-container">
          <div className="on">
          <label htmlFor="qrcode-on">ON</label>
          <input
            type="radio"
            id="qrcode-on"
            name="qrcode"
            value="On"
            checked={twofa}
            onClick={handleSwitch}
            />
          </div>
          <div className="off">

          <label htmlFor="qrcode-off">OFF</label>
          <input
            type="radio"
            id="qrcode-off"
            name="qrcode"
            value="Off"
            checked={!twofa}
            onClick={handleSwitch}
            />
          </div>
        </div>

        {!twofa ? (
           <Desable2fa message="If you want to desable 2fa entre OTP code" isEnabel={isEnable} setEnable={setEnable} setTwofa={setTwofa} twofa={twofa} />
        ) : (
            <>
              {/* <h1>Already Enabled √ </h1> */}
             
            <h1>Scan the QR code</h1>
              <div className="content">
                <div className="cont">
              <div className="qr">
                <img
                  src={
                    qrcode ||
                    "https://plus.unsplash.com/premium_photo-1682310093719-443b6fe140e8?q=80&w=5112&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt="QR Code"
                  />
                <h1>Enter the OTP code</h1>
                <div className="inputs-container">{renderInputs()}</div>
                <div className="btns">
                  <button className="btn btn-verify" onClick={handlverify}>Verify</button>
                </div>
              </div>
              <div className="instructions">
                <p>
                  1. Open your authenticator app and scan the QR code.<br />
                  2. Enter the 6-digit code displayed on the app.<br />
                  3. Click on Verify.
                </p>
              </div>
          </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Twofa;
