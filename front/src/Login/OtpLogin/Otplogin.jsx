import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../2fa/twofa.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../UserContext/Context";
const Otplogin = () => {

  const navigate = useNavigate();
    const { user, get_auth_user } = useContext(AuthContext);
    
    useEffect(() => {
       get_auth_user();
    }
        , []);

  const renderInputs = () => {
    return Array.from({
      length: 6
    }).map((_, i) => (
      <input key={i} type="text" className="otp-input" maxLength={1} />
    ));
  };
    
    const verifyotp = async () => {
        const inputs = document.getElementsByClassName("otp-input");
        const otp = Array.from(inputs)
          .map((input) => input.value)
            .join("");
        console.log("---------------> otp", otp);
        console.log("---------------> otp", user);

        navigate('/home');

        // Add your code here to verify the OTP
    }
    return (

            <div className="container otp-container">
            <h1> Enter the OTP </h1>
            <div className="inputs-container">{renderInputs()}</div>
            <div className="btns">
                <button className="btn-verify-top" onClick={verifyotp}>
                Verify
                </button>
            </div>
        </div>

  );
};

export default Otplogin;
