import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../../UserContext/Context";
import styles from "./Anonymize.module.css";
import { useNavigate } from "react-router-dom";

const Anonymize = ({ user, option , t}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        {
            option === "blocked" ?
            
            <>
            <div className={styles.intImg}>
            <div
              className={styles.intImg}
              style={{ width: "130px", height: "160px" }}
            >
              <img src={user?.avatar} />
            </div>
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.heading}>{t("This user has blocked you")}</p>
          </div>
          </>
            : 
            <>
            <div className={styles.intImg}>
            <div
              className={styles.intImg}
              style={{ width: "130px", height: "160px" }}
            >
              <img src={user?.avatar} />
            </div>
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.heading}>{user?.profile_name}</h2>
          </div>
          </>
        }
        <button className={styles.backButton} onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Anonymize;
