import styl from "./Profile.module.css"
import UserData from "./components/userData/userData"
import History from "./components/History/History";

const Profile = () => {
  return (
    <div className={styl.profile}>
      <div className={styl.content}>
        {/* head */}
        <div className={styl.head}>PROFILE</div>

        <UserData />

        <History />

      </div>
    </div>
  );
};

export default Profile;
