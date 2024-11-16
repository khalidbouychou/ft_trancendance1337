// import React from "react";
import PropTypes from "prop-types"; // Add missing import

import "./twofa.css";
import { AuthContext } from "../../UserContext/Context";
import { useContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";

const Desable2fa = ({  message, setVerified }) => {
  const { user, get_auth_user } = useContext(AuthContext);
  const [formsg, setFormsg] = useState(false);

  useEffect(() => {
    get_auth_user();
    setFormsg(user.user.otp_verified);
  }, []);

  const renderInputs = () => {
    return Array.from({
      length: 6
    }).map((_, i) => (
      <input key={i} type="text" className="otp-input" maxLength={1} />
    ));
  };

  const Disable_twofa = async () => {
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs)
      .map((input) => input.value)
      .join("");
    console.log("---------------> otp", otp);
    try {
      const res = await axios.post(
        "https://127.0.0.1/api/d_2fa/",
        {
          otp:otp
        },
        {
          withCredentials:true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.cookie
              .split("; ")
              .find((row) => row.startsWith("csrftoken="))
              .split("=")[1]
          }
        }
      );
      console.log("res", res.data);
      if (res.status === 200) {
        setVerified(res.data.otp_verified);
        setFormsg(res.data.otp_verified);
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

  return formsg ? (
    <div className="container">
      {console.log("8989", formsg)}
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
      {console.log("----------8989--->", formsg)}
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
