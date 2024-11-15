import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../2fa/twofa.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../UserContext/Context";
import axios from "axios";
import { toast } from "react-toastify";
const Otplogin = () => {
  const navigate = useNavigate();
  const { user, get_auth_user } = useContext(AuthContext);
  const location = useLocation();
  useEffect(
    () => {
      get_auth_user();
    },
    [location.pathname]
  );

  const renderInputs = () => {
    return Array.from({
      length: 6
    }).map((_, i) =>
      <input key={i} type="text" className="otp-input" maxLength={1} />
    );
  };

  const verifyotp = async () => {
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs).map(input => input.value).join("");
    try {
      await get_auth_user();
      const res = await axios.post(
        "http://127.0.0.1:8000/api/otpverify/",
        {
          otp: otp
        },
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
        // setVerified(true);
       navigate("/home");
        console.log("--------------2FA verified++++++++++++");
      }
    } catch (error) {
      // toast.error("OTP code is not correct", {
      //   position: "top-right",
      //   autoClose: 1000,
      //   closeOnClick: true
      // });
    }
  };
  return (
    <div className="container otp-container">
      <h1> Enter the OTP </h1>
      <div className="inputs-container">
        {renderInputs()}
      </div>
      <div className="btns">
        <button className="btn-verify-top" onClick={verifyotp}>
          Verify
        </button>
      </div>
    </div>
  );
};

export default Otplogin;
