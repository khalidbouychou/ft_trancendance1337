// import React from "react";
import PropTypes from "prop-types"; // Add missing import

import "./twofa.css";
import { AuthContext } from "../../UserContext/Context";
import { useContext } from "react";

import { toast } from "react-toastify";
import axios from "axios";

const Desable2fa = ({ isEnable ,message ,setEnable ,setVerified }) => {
  const { get_auth_user } = useContext(AuthContext);
  const renderInputs = () => {
    return Array.from({
      length: 6
    }).map((_, i) => (
      <input key={i} type="text" className="otp-input" maxLength={1} />
    ));
  };

  const Disable_twofa = async () => {
    await get_auth_user();
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs)
      .map((input) => input.value)
      .join("");
    console.log("---------------> otp", otp);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/d_2fa/",
        {
          otp: otp
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.cookie
              .split("; ")
              .find((row) => row.startsWith("csrftoken="))
              .split("=")[1]
          }
        }
      );
      if (res.status === 200) {
        // setVerified(false);
        // setEnable(false);
        toast.success("2FA Disabled", {
          position: "top-right",
          autoClose: 1000,
          closeOnClick: true
        });
        console.log("2FA verified");
      }
    } catch (error) {
      // console.log("error", error);
      toast.error("OTP code is not correct", {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true
      });
      // console.error("Error verifying 2FA:", error);
    }
  };

  return isEnable ? (
    <div className="container">
      {console.log("------------->", isEnable)}
      <h2>{message} </h2>
      <div className="inputs-container">{renderInputs()}</div>
      <div className="btns">
        <button className="disable-2fa" onClick={Disable_twofa}>
          Disable Two Factor Authentication (2FA)
        </button>
      </div>
    </div>
  ) : (
    <>
      {console.log("------------->", isEnable)}
      <h1>2fa desabled </h1>
    </>
  );
};

Desable2fa.propTypes = {
  setVerified: PropTypes.func.isRequired, // Add missing prop validation
  setEnable: PropTypes.func.isRequired, // Add missing prop validation
  isEnable: PropTypes.bool.isRequired, // Add missing prop validation
  message: PropTypes.string.isRequired // Add missing prop validation
};

export default Desable2fa;
