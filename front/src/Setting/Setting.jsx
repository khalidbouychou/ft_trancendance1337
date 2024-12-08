// import React, { useEffect, useState } from 'react'
import styl from './Settings.module.css'
import Twofa from '../Login/2fa/twofa'
import { RxUpload } from "react-icons/rx";
import { useContext } from 'react';
import { AuthContext } from '../UserContext/Context';
const UserInfos = () => {
  const {user} = useContext(AuthContext); 
  return (
    <div className={styl.updateinfos}>
      {/* <div className={styl.upload_input}> */}
        <div className={styl.userinfos}>

            <div className={styl.profile}>
              <input type="text" placeholder="Profile Name" />
              <button>Update</button>
            </div>

            <div className={styl.imgcover}>
              <img src={user?.user?.avatar} alt={`user?.user?.username`} />
              <RxUpload className={styl.upload} />
            </div>

        </div>
        <div className={styl.separator}></div>
        <div className={styl.delete}>
          <div className={styl.data}>
            <button className={styl.anonymize}>Data Anonymization</button>
            <button className={styl.deletebtn}>Delete Account</button>
          </div>  
        </div>
      {/* </div> */} 
    </div>
  );
}

const Settings = () => {
  return (
    <div className={styl.Settings}>
      <div className={styl.content}>
        <div className={styl.head}><h1>SETTINGS</h1></div>
        <UserInfos />
        <div className={styl.last}><Twofa/></div>
      </div>
    </div>
  );
}

export default Settings;
