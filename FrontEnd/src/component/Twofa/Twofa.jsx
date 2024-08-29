import React from 'react'
import { useEffect } from 'react';

import Setup2FA from './Setup2FA';
import Verify2FA from './Verify2FA';

const Twofa = () => {
    return (
        <div>
            <Setup2FA />
            <Verify2FA />
        </div>
    )
}

export default Twofa
