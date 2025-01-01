import React from 'react'

import { useContext } from 'react';
import { AuthContext } from '../../UserContext/Context';
const Network = () => {
    const { user} = useContext(AuthContext);
    return (
        <div style={
            {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'black',
                color: 'white'
            }
        }>
            <h1>{user?.user?.username}</h1>
            <h1>{user?.user?.profile_name}</h1>
            <h1>{user?.user?.status_network}</h1>
        </div>
    )
}

export default Network
