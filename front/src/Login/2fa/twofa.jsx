import React from "react";
import "./twofa.css";

const Twofa = () => {
    const numInputs = 6;

    const renderInputs = () => {
        const inputs = [];
        for (let i = 0; i < numInputs; i++) {
            inputs.push(
                <input
                    key={i}
                    type="text"
                    className="otp-input"
                    maxLength={1}
                />
            );
        }
        return inputs;
    };

    return (
        <div className="container">
            <div className="qrcode-container">
                <div className="qr">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HelloWorld" alt="qrcode" />
                    <h1>Enter the OTP code</h1>
            <div className="inputs-container" style={{ marginTop: "20px" }}>
                {renderInputs()}
                </div>
                <button className="btn">Verify</button>
            </div>
            </div>
            </div>
    );
};

export default Twofa;
