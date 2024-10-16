import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styl from "./Profile.module.css";
import UserData from "./components/userData/userData";
import { AuthContext } from '../../UserContext/Context';

const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
<<<<<<< HEAD
  const [error, setError] = useState(null);
  const [ismyprofil, setIsMyProfil] = useState(1);

  useEffect(() => {
    if (user && user.user.username === username) {
      setIsMyProfil(0);
=======
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [id, setId] = useState(1);

  const ismyprofil = 1
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://10.11.10.12:8000/api/users/${id}/`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
>>>>>>> 1d0199186d1ecb779155ee6d57f2ae8894a85d09
    }
  }, [user, username]);

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

      try {
        console.log('username ==>', username)
        const response = await fetch(`http://10.13.6.2:8000/api/getuser/${username}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserData(data);

        if (data.profile_name === user?.user?.profile_name) {
          setIsMyProfil(0);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [username, user]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styl.profile}>
      <div className={styl.content}>
        <div className={styl.head}>
          <h1>PROFILE</h1>
        </div>
        <UserData userData={userData} ismyprofil={ismyprofil} />
      </div>
    </div>
  );
};

export default Profile;
