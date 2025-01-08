// import React from "react";
import PropTypes from "prop-types"; // Add missing import

import "./twofa.css";
import { AuthContext } from "../../UserContext/Context";
import { useContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const Desable2fa = ({  message, setVerified }) => {
  const { user, get_auth_user } = useContext(AuthContext);
  const [formsg, setFormsg] = useState(false);
  const {t} = useTranslation()

  useEffect(() => {
    get_auth_user();
  
    setFormsg(user?.user?.otp_verified);
  }, [user?.user?.otp_verified]);

  const renderInputs = () => {
    return Array.from({
      length: 6
    }).map((_, i) => (
      <input key={i} type="text" className="otp-input" maxLength={1} />
    ));
  };
  // useEffect(() => {
  //   i18n.changeLanguage("en");
  // }, []);

  const Disable_twofa = async () => {
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs)
      .map((input) => input.value)
      .join("");
    try {
      const res = await axios.post(
        `http://${import.meta.env.VITE_IP_HOST}:8000/api/d_2fa/`,
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
      if (res.status === 200) {
        setVerified(res.data.otp_verified);
        setFormsg(res.data.otp_verified);
        toast.success("2FA Disabled", {
          style: {
            backgroundColor: 'rgb(0, 128, 0)',
            color: 'white'
          }
        });
      }
    } catch (error) {
      toast.error("OTP code is not correct", {
        style: {
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'white'
        }

      });
    }
  };

  return formsg ? (
    <div className="container">
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
      <h1>{t("2fa desabled")} </h1>
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
