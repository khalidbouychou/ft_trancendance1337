// import React, { useEffect, useState } from 'react'
import styl from './Settings.module.css'
import Twofa from '../Login/2fa/twofa'
import { RxUpload } from "react-icons/rx";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../UserContext/Context';
import { use } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const UserInfos = () => {
  const {user, get_auth_user} = useContext(AuthContext);
  const [updated, setUpdated] = useState(false);
  const [NewProfileName, setNewProfileName] = useState(null);

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
                toast.success('Image uploaded successfully', {
                    style: {
                      backgroundColor: 'rgb(0, 128, 0)',
                      color: 'white'
                    }
                  });
            }
          ).catch((err) => {
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
    toast.error('Invalid image format', {
      style: {
        backgroundColor: 'rgb(255, 0, 0)',
        color: 'white'
      }
    }
  );
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
                    toast.success('Profile name updated successfully', {
                        style: {
                          backgroundColor: 'rgb(0, 128, 0)',
                          color: 'white'
                        }
                      });
                    setUpdated(true);
                    setUpdated(true);
                  }
                ).catch((err) => {
                    toast.error(err.response.data.error || 'Profile name update failed', {
                      style: {
                        backgroundColor: 'rgb(255, 0, 0)',
                        color: 'white'
                      }
                    });
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
      {/* </div>  */}
    </div>
  );
}

const Settings = () => {
  return (
    <div className={styl.Settings}>
      <div className={styl.content}>
        {/* <div className={styl.head}><h2>SETTINGS</h2></div> */}
        <UserInfos />
      
        <div className={styl.last}>
          <Twofa/>
          </div>
      </div>
    </div>
  );
}

export default Settings;
