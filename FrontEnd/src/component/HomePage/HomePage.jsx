import styl from "./HomePage.module.css";
import WelcomeMessageAndImage from "./Component/WelcomeMessageAndImage/WelcomeMessageAndImage.jsx";
import LeaderboardAndFriends from "./Component/LeaderboardAndFriends/LeaderboardAndFriends.jsx";
// import { useEffect } from "react";

const HomePage = () => {
  // useEffect(() => {
  //   if (data.token);
  //      data.setToken(data.token)
  // }, [data]);

  return (
    <div className={styl.homepage}>
      <WelcomeMessageAndImage />
      <LeaderboardAndFriends />
    </div>
  );
};

export default HomePage;
