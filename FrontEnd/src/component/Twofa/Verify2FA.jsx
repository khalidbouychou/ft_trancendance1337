import React, { useState } from 'react';
import axios from 'axios';

const Verify2FA = () => {
  const [token, setToken] = useState('');

  const verify2FA = async () => {
    try {
      const response = await axios.post('/api/verify-2fa/', { token });
      if (response.data.success) {
        alert('2FA verified');
        // Proceed to authenticated section
      } else {
        alert('Invalid 2FA code');
      }
    } catch (error) {
      console.error('Error verifying 2FA', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter 2FA token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={verify2FA}>Verify 2FA</button>
    </div>
  );
};

export default Verify2FA;
