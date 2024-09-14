import styles from './Otp.module.css';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Otp = () => {
  const [otp, setOTP] = useState('');

  const getOTPValue = () => {
    if (otp.length < 5) {
      toast.error('Invalid OTP',{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log('Please enter 5 digit OTP');
      return;
    }
    toast.success('OTP Verified Successfully',{
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    console.log('OTP Value:', otp);
  };

  return (
    <>
    <ToastContainer />
    <div className={styles.container}>
      <div className={styles.otpMessage}>
        <h2>Enter the OTP sent to your school email address</h2>
      </div>
      <div className={styles.otpInputContainer}>
        <input
          type="text"
          className={styles.otpInput}
          maxLength={5}
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          placeholder='Enter OTP'
          />
      </div>
      <button onClick={getOTPValue} className={styles.button}>
        Verify OTP
      </button>
    </div>
    </>
  );
};

export default Otp;