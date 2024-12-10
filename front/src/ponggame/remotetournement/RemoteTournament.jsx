import React, { useContext } from 'react'
import StartTournament from './components/StartTournament.jsx'
import { ContextProvider } from './context/RemoteTournamentContext.jsx';

const Tournament = () => {

  return (
    <ContextProvider>
      <StartTournament/>
    </ContextProvider>
  );
};

export default Tournament
