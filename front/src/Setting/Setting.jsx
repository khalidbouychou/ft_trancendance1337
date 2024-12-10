// import React, { useEffect, useState } from 'react'
import styl from './Settings.module.css'
import Twofa from '../Login/2fa/twofa'
import { RxUpload } from "react-icons/rx";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../UserContext/Context';
import { use } from 'react';
import axios from 'axios';
const UserInfos = () => {
  const {user, get_auth_user} = useContext(AuthContext);
  const [updated, setUpdated] = useState(false);
  const [NewProfileName, setNewProfileName] = useState(null);

  useEffect(() => {
    console.log(user)
  }
  , [user])

  const uploadImage = () => { 
    const input = document.getElementById('uploadimg');
    if (input.files.length > 0) {
        const formData = new FormData();
        formData.append('avatar', input.files[0]);
            axios.put('http://localhost:8000/api/update/', 
              formData,
              {
              withCredentials : true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "X-CSRFToken": document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("csrftoken="))
                    .split("=")[1]
                }
            }).then((res) => {
                setUpdated(true);
            }
          ).catch((err) => {
              console.log(err);
              setUpdated(false);
          }
        );
    } 
};

const Setupload = (e) => {
  const file = e.target.files[0];
  if (file.type === 'image/jpeg' || file.type === 'image/png') {
    uploadImage();
  }else {
    alert('Please upload a valid image');
  }
}

useEffect(() => {
    get_auth_user();
    setUpdated(false);
}
, [updated])
  return (
    <div className={styl.updateinfos}> 
      {/* <div className={styl.upload_input}> */}
        <div className={styl.userinfos}>

            <div className={styl.profile}>
              <input type="text" placeholder={user?.user?.profile_name}
               onChange={(e) => {
                setNewProfileName(e.target.value? e.target.value : null);
              }}/>
              <button disabled={!NewProfileName && true} onClick={
                () => {
                  axios.put('http://localhost:8000/api/update/', 
                    {
                      profile_name: NewProfileName
                    },
                    {
                      withCredentials : true,
                      headers: {
                          'Content-Type': 'application/json',
                          "X-CSRFToken": document.cookie
                          .split("; ")
                          .find((row) => row.startsWith("csrftoken="))
                          .split("=")[1]
                      }
                  }).then((res) => {
                    console.log(res);
                    setUpdated(true);
                  }
                ).catch((err) => {
                    console.log(err);
                }
              );
              }
              }>Update</button>
            </div>

            <div className={styl.imgcover}>
              <img id="image" src={user?.user?.avatar} alt={`user?.user?.username`} />
              <label htmlFor='uploadimg'>
                <RxUpload  className={styl.upload} />
              </label>
              <input onChange={Setupload} id="uploadimg" type="file" hidden />
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
