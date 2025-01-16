import React, { useRef, useEffect, useState, useContext } from 'react';
import styles from './MainTournamentPong.module.css';
import { AuthContext } from '../../../UserContext/Context';
import { useGlobalContext } from '../context/TournamentContext.jsx';

const MainTournamentPong = () => {
    const { user, t } = useContext(AuthContext);
    const { setTournamentStart , setRoomName} = useGlobalContext();
    const [tournaments, setTournaments] = useState([]);
    const socket = useRef(null);
    const safeTournaments = tournaments || [];

    useEffect(() => {
        // if (tournaments)
        //     console.log("now tournament is:", tournaments);
    }, [tournaments]);

    useEffect(() => {
        socket.current = new WebSocket(`wss://${import.meta.env.VITE_WSS_IP}/ws/tournament-game/`);

        socket.current.onopen = () => {
            if (socket.current.readyState === WebSocket.OPEN) {
                const message = {
                    action: 'fetch_tournaments',
                    name: user.user.username,
                };
                socket.current.send(JSON.stringify(message));
                console.log('tournaments socket.current is open now');
            } else {
                console.error('tournaments socket.current is not readyState:');
            }
        };

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.message === 'tournament_page') {
                setTournaments(data.data);
            } else if (data.message === 'tournament_created') {
                setTournaments(data.tournament);
            } else if (data.message === 'join_tournament') {
                setTournaments(data.tournament);
            } else if (data.message === 'leave_tournament') {
                setTournaments(data.tournament);
            } else if (data.message === 'cancel_tournament') {
                setTournaments(data.tournament);
            }
            else if (data.message === 'tournament_about_to_start') {
                setRoomName(data.RoomName);
                setTournamentStart('yes');
            }
        };

        socket.current.onclose = (reason) => {
            console.log('WebSocket connection closed:', reason);
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                socket.current.close();
            }
        };
    }, []);

    const createTournament = () => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const message = {
                action: 'create_tournament',
                name: user.user.username,
            };
            socket.current.send(JSON.stringify(message));
        }
    };

    const joinTournament = (index) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const message = {
                action: 'join_tournament',
                target: tournaments[index].name,
                name: user.user.username,
            };
            socket.current.send(JSON.stringify(message));
        }
    };

    const leaveTournament = (index) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const message = {
                action: 'leave_tournament',
                target: tournaments[index].name,
                name: user.user.username,
            };
            socket.current.send(JSON.stringify(message));
        }
    };

    const cancelTournament = (index) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const message = {
                action: 'cancel_tournament',
                target: tournaments[index].name,
                name: user.user.username,
            };
            socket.current.send(JSON.stringify(message));
        }
    };

    return (
        <>
      <div className={styles.top_container}>
        <button className={styles.create_button} onClick={createTournament}>
          {t("Create Tournament")}
        </button>
        <div className={styles.tournament_list}>
          {safeTournaments.length === 0 ? (
            <div className={styles.no_tournaments}>
              {t("There are no tournaments now.")}
            </div>
          ) : (
            Object.entries(tournaments).map(
              ([tournamentName, tournament], index) => (
                <div key={index} className={styles.tournament_card}>
                  <p>{tournament.name.toUpperCase()}</p>
                  <p>
                    {" "}
                    {t("players")}: {tournament.players}/4
                  </p>
                  <div className={styles.BUtton}>
                    <button onClick={() => joinTournament(tournamentName)}>
                      {t("Join")}
                    </button>
                    <button onClick={() => cancelTournament(tournamentName)}>
                      {t("Cancel")}
                    </button>
                    <button onClick={() => leaveTournament(tournamentName)}>
                      {t("Leave")}
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </>
    );
};

export default MainTournamentPong;
