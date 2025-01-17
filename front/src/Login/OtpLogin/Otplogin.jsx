import React, { useContext, useEffect, useState } from "react";
import "../2fa/twofa.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../UserContext/Context";
import axios from "axios";
import { toast } from "react-toastify";

const Otplogin = () => {
  const navigate = useNavigate();
  const { get_auth_user,t ,verifyotp,renderInputs} = useContext(AuthContext);
  const location = useLocation();

  useEffect(
    () => {
      get_auth_user();
    },
    [location.pathname]
  );

  return (
    <div className="otp-container">
      <h1> {t('Enter the OTP')}</h1>
      <div className="inputs-container">
        {renderInputs()}
      </div>
      <div className="btns">
        <button className="btn-verify-top" onClick={verifyotp}>
          {t('Verify')}
        </button>
      </div>
    </div>
  );
};

export default Otplogin;
