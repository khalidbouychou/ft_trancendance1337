import React from "react";
import "./twofa.css";

const Twofa = () => {
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

    return (
   
            
    <div className="container">
      <div className="qrcode-container">
        <h1>Scan the QR code</h1>
        <div className="Content">
          <div className="qr">
                <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HelloWorld"
                alt="qrcode"
                />
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
      </div>
    </div>
         
  );
};

export default Twofa;
