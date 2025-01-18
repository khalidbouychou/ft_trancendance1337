import React, { useEffect, useState, useContext } from 'react';
import styles from './InputPage.module.css'
import { useGlobalContext } from '../context/TournamentContext.jsx';
import { AuthContext } from "../../../UserContext/Context";

const MainTournament = () => {
    const { setPlayer1Name, setPlayer2Name, setPlayer3Name, setPlayer4Name, setTournamentStart } = useGlobalContext();
    const {t} = useContext(AuthContext);
    const [player1Input, setPlayer1Input] = useState('');
    const [player2Input, setPlayer2Input] = useState('');
    const [player3Input, setPlayer3Input] = useState('');
    const [player4Input, setPlayer4Input] = useState('');
    const [start, setStart] = useState(true);

    useEffect(() => {  
        if(player1Input !== '' && player2Input !== '' && player3Input !== '' && player4Input !== ''){
            if (player1Input !== player2Input && player1Input !== player3Input && player1Input !== player4Input 
                && player2Input !== player3Input && player2Input !== player4Input && player3Input !== player4Input){
                if (player1Input.length > 4 && player1Input.length <= 12 && player2Input.length > 4 && player2Input.length <= 12 && player3Input.length > 4 && player3Input.length <= 12 && player4Input.length > 4 && player4Input.length <= 12){
                    setStart(false);
                }
                else
                    setStart(true);
            }
            else
                setStart(true);
        }
        else{
            setStart(true);
        }
    },[player1Input, player2Input, player3Input, player4Input]);

    const starttournament = () => {
        setTournamentStart('yes');
        setPlayer1Name(player1Input);
        setPlayer2Name(player2Input);
        setPlayer3Name(player3Input);
        setPlayer4Name(player4Input);
      };

      return (
        <div className={styles.last}>
            <div className={styles.play}>
                <div className={styles.starting}>
                    <div className={styles.cnt}>
                        <div className={styles.inp}>
                            <input type="text" placeholder={t("Player 1")} onChange={(e) => setPlayer1Input(e.target.value)}/>
                        </div>
                        <div className={styles.inp}>
                            <input type="text" placeholder={t("Player 2")} onChange={(e) => setPlayer2Input(e.target.value)}/>
                        </div>
                    </div>
                    <div className={styles.cnt}>
                        <div className={styles.inp}>
                            <input type="text" placeholder={t("Player 3")} onChange={(e) => setPlayer3Input(e.target.value)}/>
                        </div>
                        <div className={styles.inp}>
                            <input type="text" placeholder={t("Player 4")} onChange={(e) => setPlayer4Input(e.target.value)}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.Button}>
                <button disabled={start} onClick={starttournament} style={{backgroundColor: start ? 'rgb(67, 4, 14)' : 'green'}}>{t("Start")}</button>
            </div>
        </div>
    )
}

export default MainTournament