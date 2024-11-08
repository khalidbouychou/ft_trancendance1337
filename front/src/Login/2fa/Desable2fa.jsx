import React from "react";
import "./twofa.css";
import Off from "./Off";
import Twofa from "./twofa";

const Desable2fa = ({ message, isEnabel, setEnable, setTwofa, twofa }) => {
  const renderInputs = () => {
    return Array.from({
      length: 6
    }).map((_, i) =>
      <input key={i} type="text" className="otp-input" maxLength={1} />
    );
  };

  const handlverify = async () => {
    const inputs = document.getElementsByClassName("otp-input");
    const otp = Array.from(inputs).map(input => input.value).join("");
    console.log("---------------> otp", otp);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/otpverify/",
        { otp },
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
        console.log("------------>", res.data);
        console.log("2FA verified");
        // setTwofa(true);
        // await get_auth_user();
        // setTwofa(user.two_factor);
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error);
    }
  };

  return (
    <div className="container">
      <h2>
        {message}{" "}
      </h2>
      <div className="inputs-container">
        {renderInputs()}
      </div>
      <div className="btns">
        <button
          onClick={handlverify}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "14px 20px",
            margin: "8px 0",
            border: "none",
            cursor: "pointer",
            width: "450px"
          }}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default Desable2fa;
