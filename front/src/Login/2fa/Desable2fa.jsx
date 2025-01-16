
import PropTypes from "prop-types";

import "./twofa.css";
import { AuthContext } from "../../UserContext/Context";
import { useContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const Desable2fa = ({  setUser,message, setVerified }) => {
  const { user, get_auth_user } = useContext(AuthContext);
  const [formsg, setFormsg] = useState(false);
  const {t} = useTranslation()

  useEffect(() => {
    get_auth_user();
    setFormsg(user?.user?.two_factor);
  }, [user?.user?.two_factor]);

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
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_IP}/api/d_2fa/`,
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
        setUser(res?.data?.user);
        setVerified(res?.data?.two_factor);
        setFormsg(res?.data?.two_factor);
        toast.success("2FA Disabled", {
          style: {
            backgroundColor: 'rgb(0, 128, 0)',
            color: 'white'
          }
        });
      }
    } catch (error) {
      toast.error(t("OTP code is not correct"));
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
      <h1 style={
        {
          color: 'red',
          textAlign: 'center',
          marginTop: '10px',
          border : '1px solid red',
          padding: '10px',
        }
      } >{t("2fa desabled")} </h1>
    </>
  );
};

Desable2fa.propTypes = {
  setVerified: PropTypes.func.isRequired, 
  setEnable: PropTypes.func.isRequired, 
  isEnable: PropTypes.bool.isRequired, 
  message: PropTypes.string.isRequired 
};

export default Desable2fa;
