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

  // const renderInputs = () => {
  //   return Array.from({ length: 6 }).map((_, i) =>
  //     <input key={i} type="text" className="otp-input" maxLength={1} />
  //   );
  // };

  // const verifyotp = async () => {
  //   const inputs = document.getElementsByClassName("otp-input");
  //   const otp = Array.from(inputs).map(input => input.value).join("");

  //   if (!isNaN(otp)){
  //   try {
  //     await get_auth_user();
  //     const res = await axios.post(
  //       `https://e3r1p1.1337.ma/api/otpverify/`,
  //       { otp: otp },
  //       {
  //         withCredentials: true,
  //         headers: {
  //           "Content-Type": "application/json",
  //           "X-CSRFToken": document.cookie
  //             .split("; ")
  //             .find(row => row.startsWith("csrftoken="))
  //             .split("=")[1]
  //         }
  //       }
  //     );
  //     if (res.status === 200) {
  //       toast.success(t("OTP Verified Successfully"), {
  //         style: {
  //           backgroundColor: "rgb(0, 128, 0)",
  //           color: "white"
  //         }
  //       });
  //       setTimeout(() => {
  //         navigate("/home");
  //       }, 1000);
  //     }
  //   } catch (err) {
  //     toast.error(t(`${err.response.data.error}`));
  //   }
  // }
  // else {
  //   toast.error(t("Please enter a valid OTP"));
  // }
  // };

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
