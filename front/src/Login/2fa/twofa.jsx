import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./twofa.css";
import { AuthContext } from "../../UserContext/Context";
import { useLocation } from "react-router-dom";
const Twofa = () => {
  const [twofa, setTwofa] = useState(false);
  const [qrcode, setQrcode] = useState("");
  const { user, setUser, get_auth_user } = useContext(AuthContext);
    const location = useLocation();
  const numInputs = 6;

  const QR_CODE_URL = "http://localhost:8000/api/qrcode/";
  const DISABLE_2FA_URL = "http://localhost:8000/api/d_2fa/";
  const USER_STATUS_URL = "http://localhost:8000/api/user_status/";

  const renderInputs = () => {
    return Array.from({ length: numInputs }).map((_, i) => (
      <input key={i} type="text" className="otp-input" maxLength={1} />
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
          setQrcode(`http://localhost:8000/${res.data.user.qrcode_path}`);
        } else {
          // setTwofa(false);
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
  
  // useEffect(() => {
  //   get_auth_user();
  //   console.log("userrrr", user);
  //   setTwofa(user.two_factor);
  //   console.log("twofa", twofa);
  // }, [location.pathname]);
  return (
    <div className="container">
      <div className="qrcode-container">
        <div className="switch-container">
          <label htmlFor="qrcode-on">ON</label>
          <input
            type="radio"
            id="qrcode-on"
            name="qrcode"
            value="On"
            checked={twofa}
            onClick={handleSwitch}
          />
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

        {!twofa ? (
          <h1>2FA is disabled</h1>
        ) : (
          <>
            <h1>Scan the QR code</h1>
            <div className="content">
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
                  <button className="btn btn-verify">Verify</button>
                  <button className="btn btn-cancel">Cancel</button>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Twofa;
