import { useContext, React } from "react";
import styles from "./TournamentBoard.module.css";
import { useGlobalContext } from "../context/TournamentContext.jsx";
import { AuthContext } from "../../../UserContext/Context";

const TournamentBoard = () => {
  const { t } = useContext(AuthContext);
  const {
    player1Name,
    player2Name,
    player3Name,
    player4Name,
    player5Name,
    player5Avatar,
    player6Name,
    player6Avatar,
    player7Name,
    player7Avatar,
  } = useGlobalContext();

  return (
    <div className={styles.first}>
      <div className={styles.etaps}>
        <div className={styles.gameCard}>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div
                  className={styles.intImg}
                  style={{ width: "50px", height: "55px" }}
                >
                  <img src="/assets/battlebeast.png" />
                </div>
              </div>
            </div>
            <div className={styles.userName}>
              <p> {player1Name} </p>
            </div>
          </div>
          <div className={styles.vs}>
            <p>{t("VS")}</p>
          </div>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div
                  className={styles.intImg}
                  style={{ width: "50px", height: "55px" }}
                >
                  <img src="/assets/homelander.png" />
                </div>
              </div>
            </div>
            <div className={styles.userName}>
              <p> {player2Name} </p>
            </div>
          </div>
        </div>
        <div className={styles.gameCard}>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div
                  className={styles.intImg}
                  style={{ width: "50px", height: "55px" }}
                >
                  <img src="/assets/superman.png" />
                </div>
              </div>
            </div>
            <div className={styles.userName}>
              <p> {player3Name} </p>
            </div>
          </div>
          <div className={styles.vs}>
            <p>{t("VS")}</p>
          </div>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div
                  className={styles.intImg}
                  style={{ width: "50px", height: "55px" }}
                >
                  <img src="/assets/superior.png" />
                </div>
              </div>
            </div>
            <div className={styles.userName}>
              <p> {player4Name} </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.etaps}>
        <div className={styles.gameCard}>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div
                  className={styles.intImg}
                  style={{ width: "50px", height: "55px" }}
                >
                  <img src={player5Avatar} />
                </div>
              </div>
            </div>
            <div className={styles.userName}>
              <p> {player5Name} </p>
            </div>
          </div>
          <div className={styles.vs}>
            <p>{t("VS")}</p>
          </div>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div
                  className={styles.intImg}
                  style={{ width: "50px", height: "55px" }}
                >
                  <img src={player6Avatar} />
                </div>
              </div>
            </div>
            <div className={styles.userName}>
              <p> {player6Name} </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.etaps}>
        <div className={styles.winPlayer}>
          <div className={styles.userImage}>
            <div className={styles.intImg}>
              <div
                className={styles.intImg}
                style={{ width: "50px", height: "55px" }}
              >
                <img src={player7Avatar} />
              </div>
            </div>
          </div>
          <div className={styles.userName}>
            <p> {player7Name} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBoard;
