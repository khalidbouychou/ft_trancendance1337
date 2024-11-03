import React, { useContext } from "react";
import "./twofa.css";
import { useState } from "react";
import axios from "axios";
import { AuthContext } from "../../UserContext/Context";

const Twofa = () => {
  const [twofa, setTwofa] = useState(false);
  const [qrcode, setQrcode] = useState("");
  const {user}= useContext(AuthContext);
  const numInputs = 6;

  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < numInputs; i++) {
      inputs.push(
        <input key={i} type="text" className="otp-input" maxLength={1} />
      );
    }
    return inputs;
  };
   async function  handleOnSwitch(e) {
    if (e.target.value === "On") {
      setTwofa(true);
      const res = await axios.get(`http://localhost:8000/api/qrcode/`, {
        withCredentials: true
      });
          console.log("handleon user", user);
      if (res.status === 200) {
        console.log(res.data.path);
        setQrcode("http://localhost:8000/"+res.data.path);
      }
    } else {
      setTwofa(false);
    }
  };

  async function handleOffSwitch(e) {
    if (e.target.value === "Off") {
      setTwofa(false);
      const res = await axios.get(`http://localhost:8000/api/d_2fa/`, {
        withCredentials: true
      });
      console.log("handleoff user", user);

      if (res.status === 200) {
        setQrcode("");
        setTwofa(false);
      }
    } else {
      setTwofa(true);
    }
  };
    return <div className="container">
        <div className="qrcode-container">
        <div style={
          {
            display: "flex",
            justifyContent: "center", 
            alignItems: "center",
            flexDirection: "row",
            marginBottom: "20px",
            gap: "30px"

          }
        }>
          <label>ON</label>
          <input type="radio" id="qrcod radio" name="qrcode" value="On"  onClick={handleOnSwitch} /> 
          <label>OFF</label>
          <input type="radio" id="qrcod radio" name="qrcode" value="Off" defaultChecked onClick={handleOffSwitch} /> 
        </div>
        {!twofa ?
          <h1> 2FA is disabled</h1>
          : 
          <>
             <h1>Scan the QR code</h1>
          <div className="Content">
            <div className="qr">
                <img src={qrcode} alt="qrcode" />
              <h1>Enter the OTP code</h1>
              <div className="inputs-container" style={{ marginTop: "20px" }}>
                {renderInputs()}
              </div>
              <div className="btns">
                <button className="btn btn-verify">Verify</button>
                <button className="btn btn-cancel">Cancel</button>
              </div>
            </div>
            <div className="paragh">
              <p>
                1. Open your authenticator app and scan the QR code.<br />
                2. Enter the 6-digit code displayed on the app.<br />
                3. Click on Verify.
              </p>
            </div>
          </div>
          </>
        }
        </div>
      </div>;
};

export default Twofa;
