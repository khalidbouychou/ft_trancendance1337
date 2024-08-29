import React, { useState } from 'react';
import axios from 'axios';

const Setup2FA = () => {
  const [qrCode, setQrCode] = useState('');

  const setup2FA = async () => {
    try {
      const response = await axios.post('/api/setup-2fa/');
      setQrCode(response.data.qr_code);
    } catch (error) {
      console.error('Error setting up 2FA', error);
    }
  };

  return (
    <div>
      <button onClick={setup2FA}>Setup 2FA</button>
      {qrCode && <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />}
    </div>
  );
};

export default Setup2FA;
