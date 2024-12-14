import React, { createContext, useState, useContext } from 'react';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const ContextProvider = ({ children }) => {
  const [PlayerAliasName, setPlayerAliasName] = useState('');
  const [RoomName, setRoomName] = useState('');

  const [player1Name, setPlayer1Name] = useState('Unknown');
  const [player2Name, setPlayer2Name] = useState('Unknown');
  const [player3Name, setPlayer3Name] = useState('Unknown');
  const [player4Name, setPlayer4Name] = useState('Unknown');
  const [player5Name, setPlayer5Name] = useState('Unknown');
  const [player1Avatar, setPlayer1Avatar] = useState('/assets/unknown.png');
  const [player2Avatar, setPlayer2Avatar] = useState('/assets/unknown.png');
  const [player3Avatar, setPlayer3Avatar] = useState('/assets/unknown.png');
  const [player4Avatar, setPlayer4Avatar] = useState('/assets/unknown.png');
  const [player5Avatar, setPlayer5Avatar] = useState('/assets/unknown.png');
  const [player6Name, setPlayer6Name] = useState('Unknown');
  const [player6Avatar, setPlayer6Avatar] = useState('/assets/unknown.png');
  const [player7Name, setPlayer7Name] = useState('Unknown');
  const [player7Avatar, setPlayer7Avatar] = useState('/assets/unknown.png');

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [player3Score, setPlayer3Score] = useState(0);
  const [player4Score, setPlayer4Score] = useState(0);
  
  const [Aliasname, setAliasName] = useState(false);
  const [gameStatus, setGameStatus] = useState(false);
  const [TournamentStart, setTournamentStart] = useState('no');
  const [matchstart, setMatchStart] = useState(false);

  return (
    <AppContext.Provider // Fixed this part to use AppContext.Provider
      value={{
        PlayerAliasName,
        setPlayerAliasName,
        RoomName,
        setRoomName,
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
        player6Name,
        setPlayer6Name,
        player6Avatar,
        setPlayer6Avatar,
        player7Name,
        setPlayer7Name,
        player7Avatar,
        setPlayer7Avatar,
        player1Score,
        setPlayer1Score,
        player2Score,
        setPlayer2Score,
        player3Score,
        setPlayer3Score,
        player4Score,
        setPlayer4Score,
        TournamentStart,
        setTournamentStart,
        Aliasname,
        setAliasName,
        gameStatus,
        setGameStatus,
        matchstart,
        setMatchStart
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Optional helper hook to use the context more easily
export const useGlobalContext = () => {
  return useContext(AppContext);
};