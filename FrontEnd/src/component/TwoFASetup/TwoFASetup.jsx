import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './TwoFAHandler.module.css';
import { Link, useNavigate } from 'react-router-dom';
const TwoFAHandler = () => {
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const check2FAStatus = async () => {
            const response = await axios.get('/api/check-2fa-status/');
            setIs2FAEnabled(response.data.is_2fa_enabled);

            if (!response.data.is_2fa_enabled) {
                const qrResponse = await axios.post('/api/generate-otp/');
                setQrCodeUrl(qrResponse.data.qr_code_url);
            }
        };

        check2FAStatus();
    }, []);

    const verifyOTP = async () => {
        const response = await axios.post('/api/verify-otp/', { otp });
        if (response.data.success) {
            // Redirect to profile or another page

            // <Link  to='/profile'></Link>
            navigate('/profile');
        } else {
            setError('Invalid OTP!');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{is2FAEnabled ? '2FA is enabled' : 'Scan the QR Code'}</h2>
            {is2FAEnabled ? (
                <div>
                    <input
                        className={styles.inputField}
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button className={styles.button} onClick={verifyOTP}>Verify OTP</button>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </div>
            ) : (
                <img className={styles.qrCode} src={qrCodeUrl} alt="QR Code" />
            )}
        </div>
    );
};

export default TwoFAHandler;