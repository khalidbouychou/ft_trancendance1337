import React from "react";
import "./twofa.css";
import Off from "./Off";
import Twofa from "./twofa";
import { AuthContext } from "../../UserContext/Context";
import {useContext} from "react";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Desable2fa = (props) => {
  const { get_auth_user } = useContext(AuthContext);
  const renderInputs = () => {
    return Array.from({
      length: 6
    }).map((_, i) =>
      <input key={i} type="text" className="otp-input" maxLength={1} />
    );
  };

  const handlverify = async () => {
    await get_auth_user();
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs)
      .map((input) => input.value)
      .join("");
    console.log("---------------> otp", otp);
    try {
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
              .find((row) => row.startsWith("csrftoken="))
              .split("=")[1]
          }
        }
      );
      if (res.status === 200) {
        props.setVerified(false);
        props.setEnable(false);
        toast.success("2FA verified", {
          position: "top-right",
          autoClose: 1000,
          closeOnClick: true
        });
        console.log("2FA verified");
      }
    } catch (test) {
      toast.error("OTP code is not correct", {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true
      });
      // console.error("Error verifying 2FA:", error);
    }
  };

  return props.isEnable ?
    <div className="container">
        {console.log("------------->", props.isEnable)}
        <h2>
          {props.message}{" "}
        </h2>
        <div className="inputs-container"> 
          {renderInputs()}
        </div>
        <div className="btns">
          <button className="disable-2fa" onClick={handlverify}>
           Disable Two Factor Authentication (2FA)
          </button>
        </div>
    </div>
    :
    <>
      {console.log("------------->", props.isEnable)}
    <h1>2fa desabled </h1>;
    </>
};

export default Desable2fa;
