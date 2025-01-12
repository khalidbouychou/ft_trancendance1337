import React, { useContext, useEffect, useState } from "react";
import "../2fa/twofa.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../UserContext/Context";
import axios from "axios";

const Otplogin = () => {
  const navigate = useNavigate();
  const { t,get_auth_user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(
    () => {
      get_auth_user();
    },
    [location.pathname]
  );

  const renderInputs = () => {
    return Array.from({ length: 6 }).map((_, i) =>
      <input key={i} type="text" className="otp-input" maxLength={1} />
    );
  };

  const verifyotp = async () => {
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs).map(input => input.value).join("");
    try {
      await get_auth_user();
      const res = await axios.post(
        "http://e3r1p9.1337.ma:8000/api/otpverify/",
        { otp: otp },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.cookie
              .split("; ")
              .find(row => row.startsWith("csrftoken="))
              .split("=")[1]
          }
        }
      );
      if (res.status === 200) {
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
    }
  };

  return (
    <div className="container otp-container">
      <h1> {t("Enter the OTP")}</h1>
      <div className="inputs-container">
        {renderInputs()}
      </div>
      <div className="btns">
        <button className="btn-verify-top" onClick={verifyotp}>
          {t("Verify")}
        </button>
      </div>
    </div>
  );
};

export default Otplogin;
