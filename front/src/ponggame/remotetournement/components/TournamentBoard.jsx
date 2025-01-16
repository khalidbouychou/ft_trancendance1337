import React, { useEffect, useRef, useContext } from "react";
import styles from "./TournamentBoard.module.css";
import { AuthContext } from "../../../UserContext/Context";
import { useGlobalContext } from "../context/TournamentContext.jsx";

const TournamentBoard = () => {
  const socket = useRef(null);
  const { user } = useContext(AuthContext);
  const {
    RoomName,
    player1Name,
    setPlayer1Name,
    player2Name,
    setPlayer2Name,
    player3Name,
    setPlayer3Name,
    player4Name,
    setPlayer4Name,
    player5Name,
    setPlayer5Name,
    player6Name,
    setPlayer6Name,
    player7Name,
    setPlayer7Name,
    player1Avatar,
    setPlayer1Avatar,
    player2Avatar,
    setPlayer2Avatar,
    player3Avatar,
    setPlayer3Avatar,
    player4Avatar,
    setPlayer4Avatar,
    player5Avatar,
    setPlayer5Avatar,
    player6Avatar,
    setPlayer6Avatar,
    player7Avatar,
    setPlayer7Avatar,
  } = useGlobalContext();

  return (
    <div className={styles.first}>
      <div className={styles.etaps}>
        <div className={styles.gameCard}>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div className={styles.intImg}>
                  <img src={player1Avatar} />
                </div>
              </div>
            </div>
            <div className={styles.userName}>
              <p> {player1Name} </p>
            </div>
          </div>
          <div className={styles.vs}>
            <p>VS</p>
          </div>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div className={styles.intImg}>
                  <img src={player2Avatar} />
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
                <div className={styles.intImg}>
                  <img src={player3Avatar} />
                </div>
              </div>
            </div>
            <div className={styles.userName}>
              <p> {player3Name} </p>
            </div>
          </div>
          <div className={styles.vs}>
            <p>VS</p>
          </div>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div className={styles.intImg}>
                  <img src={player4Avatar} />
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
                <div className={styles.intImg}>
                  <img src={player5Avatar} />
                </div>
              </div>
            </div>
            <div className={styles.userName}>
              <p> {player5Name} </p>
            </div>
          </div>
          <div className={styles.vs}>
            <p>VS</p>
          </div>
          <div className={styles.player}>
            <div className={styles.userImage}>
              <div className={styles.intImg}>
                <div className={styles.intImg}>
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
              <div className={styles.intImg}>
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
