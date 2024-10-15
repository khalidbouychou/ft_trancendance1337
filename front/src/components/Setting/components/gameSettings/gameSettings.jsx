import styl from './GameSettings.module.css';
import React, { useEffect, useState, useRef } from 'react';
import userImage from '../../assets/nouahidi.jpeg';
import camera from '../../assets/camera.svg';
import pencil from '../../assets/pencil.svg';
import { HexColorPicker } from 'react-colorful';
import axios from 'axios';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const GameSettings = ({ user }) => {
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [racketColor, setRacketColor] = useState('white');
  const [tableColor, setTableColor] = useState('white');
  const [ballColor, setBallColor] = useState('white');
  const [openColorsT, setOpenColorsT] = useState('none');
  const [openColorsR, setOpenColorsR] = useState('none');
  const [openColorsB, setOpenColorsB] = useState('none');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user.user.username)
  const [newAvatar, setNewAvatar] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const colorPickerRefT = useRef(null);
  const colorPickerRefR = useRef(null);
  const colorPickerRefB = useRef(null);

  const toggleColorDisplayT = () => {
    setOpenColorsT(openColorsT === 'none' ? 'flex' : 'none');
  };
  const toggleColorDisplayR = () => {
    setOpenColorsR(openColorsR === 'none' ? 'flex' : 'none');
  };
  const toggleColorDisplayB = () => {
    setOpenColorsB(openColorsB === 'none' ? 'flex' : 'none');
  };

  const handlePencilClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
  
      try {
        const response = await fetch(`http://10.13.6.2:8000/api/getuser/${username}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserData(data);
        console.log('Fetched data:', data);
      } catch (error) {
        setError(error.message);
      }
    };
  
    fetchData();
  }, [username]);

  useEffect(() => {
    if (userData) {
      console.log('Updated userData:', userData);
    }
  }, [userData]);


  const handleUpdateNameClick = async () => {
    try {
      setLoading(true);
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post(
        'http://10.13.6.2:8000/api/set_profile_name/',
        { username: username, new_name: newName },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
      setIsEditing(false);
      setNewName('');
      setMessage('Profile name updated successfully!');
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleUploadAvatar = async () => {
    if (!newAvatar) return;

    const formData = new FormData();
    formData.append('avatar', newAvatar);
    formData.append('username', username);

    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post(
        'http://10.13.6.2:8000/api/set_user_image/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
      setMessage('Profile picture updated successfully!');
      setNewAvatar(null);
      setUserData((prev) => ({ ...prev, avatar: URL.createObjectURL(newAvatar) }));
    } catch (error) {
      setError(error.response?.data || error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (colorPickerRefT.current && !colorPickerRefT.current.contains(event.target)) {
      setOpenColorsT('none');
    }
    if (colorPickerRefR.current && !colorPickerRefR.current.contains(event.target)) {
      setOpenColorsR('none');
    }
    if (colorPickerRefB.current && !colorPickerRefB.current.contains(event.target)) {
      setOpenColorsB('none');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styl.first}>
      <div className={styl.change}>
        <div className={styl.Image}>
          <div className={styl.image}>
            <img src={selectedImage ? selectedImage : (userData ? userData.avatar : '')} alt="User" />
            <div className={styl.icon}>
              <button onClick={handleUploadAvatar}>
                <img src={camera} alt="Camera" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  // id="imageUpload"
                />
              </button>
            </div>
          </div>
        </div>
        <div className={styl.Name}>
          {!isEditing ? (
            <div className={styl.displayMode}>
              <span>{userData ? userData.profile_name : 'Loading...'}</span>
              <button onClick={handlePencilClick}>
                <img src={pencil} alt="Edit" />
              </button>
            </div>
          ) : (
            <div className={styl.editMode}>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
          )}
          <button onClick={handleUpdateNameClick} className={styl.Button} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
          {message && <p className={styl.message}>{message}</p>}
        </div>
      </div>
      <div className={styl.settingGame}>
          <div className={styl.disTable}>
            <div className={styl.table} style={{backgroundColor: tableColor}}>
              <hr />
              <div className={styl.Racket} style={{left: '-1px', top: '15px', backgroundColor: racketColor}} ></div>
              <div className={styl.Racket} style={{right: '-1px', bottom: '15px', backgroundColor: racketColor}}></div>
              <div className={styl.Ball} style={{backgroundColor: ballColor}}></div>
            </div>
            <div className={styl.disColors}>
              <div className={styl.tableCol} ref={colorPickerRefT}>
                <button className={styl.Table} onClick={toggleColorDisplayT} style={{backgroundColor: tableColor}}></button>
                <div className={styl.colors} style={{display: openColorsT}}>
                  <HexColorPicker color={tableColor} onChange={setTableColor}/>
                </div>
              </div>
              <div className={styl.tableCol} ref={colorPickerRefB}>
                <button className={styl.ball} onClick={toggleColorDisplayB} style={{backgroundColor: ballColor}}></button>
                <div className={styl.colors} style={{display: openColorsB}}>
                  <HexColorPicker color={ballColor} onChange={setBallColor}/>
                </div>
              </div>
              <div className={styl.tableCol} ref={colorPickerRefR}>
                <button className={styl.racket} onClick={toggleColorDisplayR} style={{backgroundColor: racketColor}}></button>
                  <div className={styl.colors} style={{display: openColorsR}}>
                    <HexColorPicker color={racketColor} onChange={setRacketColor}/>
                  </div>
              </div>
            </div>
          </div>
          <button className={styl.changeBt}><p >Change</p></button>
        </div>
    </div>
  );
};

export default GameSettings;
