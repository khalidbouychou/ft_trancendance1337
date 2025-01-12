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
  // const [twofa, setTwofa] = useState(false);
  const [qrcode, setQrcode] = useState("");
  const { t,user, get_auth_user ,setUser,verifyotp,renderInputs} = useContext(AuthContext);
  const [isEnable, setEnable] = useState(false);
  const [verified, setVerified] = useState(user?.user?.otp_verified);

  const location = useLocation();

  const numInputs = 6;

  const QR_CODE_URL = `http://e3r1p9.1337.ma:8000/api/qrcode/`;
  const USER_STATUS_URL = `http://e3r1p9.1337.ma:8000/api/user_status/`;

  // const renderInputs = () => {
  //   return Array.from({ length: numInputs }).map((_, i) => (
  //     <input key={i} type="text" className="otp-input" maxLength={1} />
  //   ));
  // };

  // useEffect(() => {
  //   const fetchTwofaStatus = async () => {
  //     // await get_auth_user();
  //     const res = await axios.get(USER_STATUS_URL, { withCredentials: true });
  //     if (res.status === 200) {
  //       setUser(res?.data?.user);
  //       setVerified(res?.data?.user?.otp_verified);
  //       // setTwofa(res?.data?.user?.two_factor);
  //       setEnable(res?.data?.user?.two_factor);
  //       if (res?.data?.user?.qrcode_path) {
        
  //         setTimeout(() => {
  //           setQrcode(`${res?.data?.user?.qrcode_path}`);
  //         }, 2000);
  //       }
  //     }
     
  //   };
  //   fetchTwofaStatus();
  // }, [location.pathname]);


  const Offswitch = async () => {
    console.log("off switch",isEnable);

    setQrcode("");
    setEnable(false);
    // if (user?.user?.two_factor)
    // {

    //   try {
    //     const res = await axios.get(`http://e3r1p9.1337.ma:8000/api/clearqrcode/`, { withCredentials: true });
    //     if (res.status === 200){
    //       await get_auth_user();
    //       setQrcode(res.data?.qrcode_path);
    //       // setQrcode("");
    //     };
    //   }
    //   catch (err){setQrcode("");}
    // }
  }

  const Onswitch = async () => {
    console.log("on switch",isEnable);
    // await get_auth_user();
    setEnable(true);
    // console.log(user);
    const usertofa = user?.user?.two_factor | user?.two_factor
    console.log(usertofa);
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
      console.log(error);
        }    }
  }


  // const handleSwitch = async (e) => {
  //   const isOn = e.target.value === t("On");
  //   setEnable(isOn);
  //   const url = isOn && QR_CODE_URL;
  //   // await get_auth_user();
  //   console.log(user?.user?.two_factor);
  //   if (user?.user?.two_factor) {
  //       try {
  //         const res = await axios.get(`http://e3r1p9.1337.ma:8000/api/clearqrcode/`, { withCredentials: true });
  //         if (res.status === 200){
        
  //           await get_auth_user();
  //           setQrcode(res.data?.qrcode_path);
  //           // setQrcode("");
  //         };
  //       }
  //       catch (err){setQrcode("");}
  //   }
  //  else {
  //     try {
  //       await get_auth_user();
  //       setQrcode("");
  //       if (!user?.user?.two_factor)
  //         {
  //             const res = await axios.get(QR_CODE_URL, { withCredentials: true });
  //             if (res.status === 200) { 
  //               setTimeout(() => {
  //               setQrcode(`${res.data?.user?.qrcode_path}`);
  //               }, 1000);
  //           }
  //         }
  //     } catch (error) {
  //       // setQrcode("");
  //     }
  //   }
  // };

  const handlverify = async () => {
    // await get_auth_user();
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs)
      .map((input) => input.value)
      .join("");
      try {
        const res = await axios.post(
        `http://e3r1p9.1337.ma:8000/api/otpverify/`,
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
        setVerified(res?.data?.user?.otp_verified);
        setQrcode("");
        toast.success(t("2FA verified"), {
          style: {
            backgroundColor: 'rgb(0, 128, 0)',
            color: 'white'
          }
        });
      }
    } catch (error) {
      toast.error(t("OTP code is not correct"), {
        style: {
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'white'
        }
      });
    }
  };

  return (
    <>
      {/* <div className="container"> */}
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
                // onClick={handleSwitch}
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
                // onClick={handleSwitch}
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
                  {/* <div className="content"> */}
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
                  {/* </div> */}
                </>
              )}
            </>
          )}
        </div>
      {/* </div> */}
    </>
  );
};

export default Twofa;
