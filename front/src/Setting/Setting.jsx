import React, { useEffect, useState } from 'react'
import styl from './Settings.module.css'
import Twofa from '../Login/2fa/twofa'

const UserInfos = () => {
  return (
    <div className={styl.updateinfos}>
      {/* <div className={styl.upload_input}> */}
        <div className={styl.userinfos}>
          <div className={styl.imgcover}>
            <input type="file" src="" alt="" />
          </div>
          <div className={styl.displayname}>

          </div>
        </div>
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
        <div className={styl.last}>
        <Twofa/>
        </div>
      </div>
    </div>
  );
}

export default Settings;
