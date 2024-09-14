import styl from "./Profile.module.css";
import History from "./component/History/History";
import User_Data from "./component/UserData/UserData";

const Profile = () => {
  return (
    <div className={styl.prophil}>
      <User_Data />

      <History />
    </div>
  );
};

export default Profile;
