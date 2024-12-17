import React from 'react'
import styles from './StartTournament.module.css'
import StartingPage from './MainTournamentPong.jsx'
import AfterStart from './TournamentMainboard.jsx'
import { useGlobalContext } from '../context/TournamentContext.jsx';

const StartTournament = () => {
  const { TournamentStart } = useGlobalContext();
  return (
    <div className={styles.tournament}>
      <div className={styles.content}>
        {TournamentStart === 'no' ? <StartingPage /> : <AfterStart />}
      </div>
    </div>
  )
}

export default StartTournament