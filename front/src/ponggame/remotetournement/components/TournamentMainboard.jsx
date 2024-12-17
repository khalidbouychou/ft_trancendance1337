import React, { useEffect, useState } from 'react';
import styles from './TournamentMainboard.module.css'
import { useGlobalContext } from '../context/TournamentContext.jsx';
import Match from './Match.jsx';
import TournamentBoard from './TournamentBoard.jsx'
import InputName from './InputPage.jsx'

const TournamentMainboard = () => {

  return (
    <>
        <TournamentBoard />
        <InputName/>
    </>
  )
}

export default TournamentMainboard
