import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./twofa.css";
import { AuthContext } from "../../UserContext/Context";
import { useLocation } from "react-router-dom";
import Desable2fa from "./Desable2fa";
import { toast } from "react-toastify";
import BounceLoader from "react-spinners/BounceLoader";
import { use } from "react";

const Twofa = () => {
  const [qrcode, setQrcode] = useState("");
  const { t,user ,setUser,renderInputs} = useContext(AuthContext);
  const [isEnable, setEnable] = useState(false);
  const [verified, setVerified] = useState(user?.user?.two_factor);

  const QR_CODE_URL = `${import.meta.env.VITE_BACKEND_IP}/api/qrcode/`;

  const Offswitch = async () => {
    setQrcode("");
    setEnable(false);
  }

  const Onswitch = async () => {
    setEnable(true);
    const usertofa = user?.user?.two_factor | user?.two_factor
    if(!usertofa){
    try {
      const res = await axios.get(QR_CODE_URL, { withCredentials: true });
      if (res.status === 200) {
        setTimeout(() => {
        setQrcode(`${res.data?.user?.qrcode_path}`);
        }, 2000);
    }
    else {
      setQrcode("");
    }
    } catch (error) {
      setQrcode("");
        }    }
  }

  const handlverify = async () => {
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs)
      .map((input) => input.value)
      .join("");
      try {
        const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_IP}/api/otpverify/`,
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
        setVerified(res?.data?.user?.two_factor);
        setQrcode("");
        toast.success(t("2FA verified"), {
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

  return (
    <>
        <div className="qrcode-container">
          <div className="switch-container">
            <div className="on">
              <label htmlFor="qrcode-on">{t("ON")}</label>
              <input
                type="radio"
                id="qrcode-on"
                name="qrcode"
                value={t("On")}
                checked={isEnable}
                onClick={Onswitch}
              />
            </div>
            <div className="off">
              <label htmlFor="qrcode-off">{t("OFF")}</label>
              <input
                type="radio"
                id="qrcode-off"
                name="qrcode"
                value={t("Off")}
                onClick={Offswitch}
                checked={!isEnable}

              />
            </div>
          </div>

          {!isEnable ? (
            <Desable2fa
              setVerified={setVerified}
              message={t("If you want to desable 2fa entre OTP code")}
              setUser={setUser}
            />
          ) : (
            <>
              {verified ? (
                <h1> {t("2fa enabled")} </h1>
              ) : (
                <>
                  <h1>{t("Scan the QR code")}</h1>
                    <div className="cont">
                      <div className="qr">
                        {!qrcode ? (
                          <BounceLoader
                            color={"#fff"}
                            loading={qrcode ? false : true}
                            size={150}
                          />
                        ) : (
                          <img src={qrcode} alt="QR Code" />
                        )}
                        <h1>{t("Enter the OTP code")}</h1>
                        <div className="inputs-container">{renderInputs()}</div>
                        <div className="btns">
                          <button
                            className="btn-verify"
                            onClick={handlverify}
                          
                          >
                            {t("Verify")}
                          </button>
                        </div>
                      </div>
                      <div className="instructions">
                        <p>
                          {t("1. Open your authenticator app and scan the QR code.")}
                          <br />
                          {t("2. Enter the 6-digit code displayed on the app.")}
                          <br />
                          {t("3. Click on Verify.")}
                        </p>
                      </div>
                    </div>
                </>
              )}
            </>
          )}
        </div>
    </>
  );
};

export default Twofa;
