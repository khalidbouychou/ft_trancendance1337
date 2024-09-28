// import styl from "./Profile.module.css";
// import History from "./component/History/History";
// import User_Data from "./component/UserData/UserData";

import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <>
      <h1>Profile</h1>
      <Link to="/chat">chat</Link>
      <br />
      <Link to="/game">game</Link>
      <br />
      <Link to="/profil">profil</Link>
      <br />
      <Link to="/setting">setting</Link>
      <br />
      <Link to="/otp">otp</Link>
    </>
);

  // return (
  //   <div className={styl.prophil}>
  //     <User_Data />

  //     <History />
  //   </div>
  // );
};

export default Profile;
