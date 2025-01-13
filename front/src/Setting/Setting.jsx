import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RxUpload } from 'react-icons/rx';
import { AuthContext } from '../UserContext/Context';
import styl from './Settings.module.css';
import Twofa from '../Login/2fa/twofa';
import AnonymizeDelete from './AnonymizeDelete'; // Modal component
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { t,user, get_auth_user } = useContext(AuthContext);
  const [updated, setUpdated] = useState(false);
  const [NewProfileName, setNewProfileName] = useState(null);
  const navigate = useNavigate();
  const {setUser} = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionToPerform, setActionToPerform] = useState(null);
  const handleProfileNameUpdate = async () => {
    try {
      const response = await axios.put(
        `http://10.13.10.18:8000/api/update/`,
        { profile_name: NewProfileName },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": document.cookie
              .split("; ")
              .find((row) => row.startsWith("csrftoken="))
              .split("=")[1],
          },
        }
      );
      if (response.status == 200) {
        setUpdated(true);
        toast.success(t('Profile name updated successfully'), {
          style: {
            backgroundColor: 'rgb(0, 128, 0)',
            color: 'white',
          },
        });
      }
    } catch (err) {
      toast.error(t(err.response?.data?.error) || t('Profile name update failed'), {
        style: {
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'white',
        },
      });
    }
  };

  // Image Upload Handler
  const uploadImage = () => {
    const input = document.getElementById('uploadimg');
    if (input.files.length > 0) {
      const formData = new FormData();
      formData.append('avatar', input.files[0]);

      axios
        .put(`http://10.13.10.18:8000/api/update/`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            "X-CSRFToken": document.cookie
              .split("; ")
              .find((row) => row.startsWith("csrftoken="))
              .split("=")[1],
          },
        })
        .then((res) => {
          setUpdated(true);
          toast.success('Image uploaded successfully', {
            style: {
              backgroundColor: 'rgb(0, 128, 0)',
              color: 'white',
            },
          });
        })
        .catch((err) => {
          setUpdated(false);
          toast.error('Image upload failed. Please try again', {
            style: {
              backgroundColor: 'rgb(255, 0, 0)',
              color: 'white',
            },
          });
        });
    }
  };

  // File Upload Change Handler
  const Setupload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      uploadImage();
    } else {
      toast.error('Invalid image format', {
        style: {
          backgroundColor: 'rgb(255, 0, 0)',
          color: 'white',
        },
      });
    }
  };

  // Modal Handling
  const openModal = (action) => {
    setActionToPerform(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActionToPerform(null);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.get(`http://10.13.10.18:8000/api/${actionToPerform}/` , {
        withCredentials: true,
    });
      if (response.status === 200) {
        toast.success(t(`Account successfully ${actionToPerform}d.`), {
          style: {
            backgroundColor: 'rgb(0, 128, 0)',
            color: 'white',
          },
        });
        setUser(null);
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      // toast.error('An error occurred. Please try again.', {
      //   style: {
      //     backgroundColor: 'rgb(255, 0, 0)',
      //     color: 'white',
      //   },
      // });
    }
    closeModal();
  };

  useEffect(() => {
    get_auth_user();
    setUpdated(false);
  }, [updated]);

  return (
    <div className={styl.Settings}>
      <div className={styl.content}>
        {/* User Profile Section */}
        <div className={styl.updateinfos}>
          <div className={styl.userinfos}>
            <div className={styl.profile}>
              <input
                type="text"
                placeholder={user?.user?.profile_name}
                onChange={(e) => setNewProfileName(e.target.value || null)}
              />
              <button
                disabled={!NewProfileName}
                onClick={handleProfileNameUpdate}
              >
                {t("Update")}
              </button>
            </div>

            <div className={styl.imgcover}>
              <img id="image" src={user?.user?.avatar} alt={user?.user?.username} />
              <label htmlFor="uploadimg">
                <RxUpload className={styl.upload} />
              </label>
              <input
                onChange={Setupload}
                id="uploadimg"
                type="file"
                hidden
              />
            </div>
          </div>

          <div className={styl.separator}></div>
          <div className={styl.delete}>
            <div className={styl.data}>
              <button
                className={styl.anonymize}
                onClick={() => openModal("anonymize")}
              >
                {t("Data Anonymization")}
              </button>
              <button
                className={styl.deletebtn}
                onClick={() => openModal('delete')}
              >
                {t("Delete Account")}
                
              </button>

              {/* Modal for confirmation */}
              <AnonymizeDelete
                isOpen={isModalOpen}
                message={t(`Are you sure you want to ${actionToPerform} your account?`)}
                onConfirm={handleConfirm}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className={styl.last}>
          <Twofa />
        </div>
      </div>
    </div>
  );
};

export default Settings;
