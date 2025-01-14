import React, { useState, useContext } from 'react';
import styles from './TournamentMainboard.module.css'
import { useGlobalContext } from '../context/TournamentContext.jsx';
import Match from './Match.jsx';
import { AuthContext } from "../../../UserContext/Context"; 

const TournamentMainboard = () => {
    const {t} = useContext(AuthContext);
    const { player1Name, player2Name, player3Name, player4Name, player5Name, player6Name, player7Name, gameStatus, setGameStatus, player5Avatar, player6Avatar, player7Avatar} = useGlobalContext();

    const [matchType, setMatchType] = useState('');

    const startgameleft = () => {
        setMatchType('left');
        setGameStatus(true);
    };
    
    const startgameright = () => {
        setMatchType('right');
        setGameStatus(true);
    };

    const startgamefinal = () => {
        setMatchType('final');
        setGameStatus(true);
    };

  return (
    <div className={styles.last}>
        <div className={styles.play}>
            {gameStatus && <Match type={matchType}/>}
            {player5Name === "Unknown" || player6Name === "Unknown" ? (
                <div className={styles.matchBegin}>
                    <div className={styles.startCard}>
                        <div className={styles.gameCard}>
                            <div className={styles.player}>
                            <div className={styles.userImage}>
                                <img src="/assets/battlebeast.png"/>
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
                                <img src="/assets/homelander.png"/>
                            </div>
                            <div className={styles.userName}>
                                <p > {player2Name} </p>
                            </div>
                        </div>
                        </div>
                        {player5Name === "Unknown" ? (
                            <div className={styles.startButton}>
                                <button onClick={startgameleft}>{t("Start Match")}</button>
                            </div>
                        ) : (
                            <div className={styles.youWin}>
                                <div className={styles.str}>
                                    <p>{t("WIN")}</p>
                                </div>
                                <div className={styles.userWin}>
                                    <div className={styles.userImage}>
                                        <img src={player5Avatar}/>
                                    </div>
                                    <div className={styles.userName}>
                                        <p>{player5Name}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.startCard}>
                        <div className={styles.gameCard}>
                            <div className={styles.player}>
                                <div className={styles.userImage}>
                                    <img src="/assets/superman.png"/>
                                </div>
                                <div className={styles.userName}>
                                    <p > {player3Name} </p>
                                </div>
                            </div>
                            <div className={styles.vs}>
                                <p>{t("VS")}</p>
                            </div>
                            <div className={styles.player}>
                                <div className={styles.userImage}>
                                    <img src="/assets/superior.png"/>
                                </div>
                                <div className={styles.userName}>
                                    <p > {player4Name} </p>
                                </div>
                            </div>
                        </div>
                        {player6Name === "Unknown" ? (
                            <div className={styles.startButton}>
                                <button onClick={startgameright}>{t("Start Match")}</button>
                            </div>
                        ) : (
                            <div className={styles.youWin}>
                                <div className={styles.str}>
                                    <p>{t(WIN)}</p>
                                </div>
                                <div className={styles.userWin}>
                                    <div className={styles.userImage}>
                                        <img src={player6Avatar}/>
                                    </div>
                                    <div className={styles.userName}>
                                        <p>{player6Name}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) :
            <div className={styles.matchFinal}>
                <div className={styles.finalCard}>
                    <h1 >{t("FINAL MATCH")}</h1>
                    <div className={styles.gameCard}>
                        <div className={styles.player}>
                            <div className={styles.userImage}>
                                <img src={player5Avatar}/>
                            </div>
                            <div className={styles.userName}>
                                <p > {player5Name} </p>
                            </div>
                        </div>
                        <div className={styles.vs}>
                            <p>{t("VS")}</p>
                        </div>
                        <div className={styles.player}>
                            <div className={styles.userImage}>
                                <img src={player6Avatar}/>
                            </div>
                            <div className={styles.userName}>
                                <p > {player6Name} </p>
                            </div>
                        </div>
                    </div>
                    {player7Name === "Unknown" ? (
                    <div className={styles.startButton}>
                        <button onClick={startgamefinal} >{t("Start Match")}</button>
                    </div>):
                    <div className={styles.winer}>
                        <h2 >{t("Winner")}</h2>
                        <div className={styles.player}>
                            <div className={styles.userImage}>
                                <img src={player7Avatar}/>
                            </div>
                            <div className={styles.userName}>
                                <p > {player7Name} </p>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>}
        </div>
</div>
  )
}

export default TournamentMainboard
