import React, { useRef, useEffect, useState, useContext } from 'react';
import styles from './MainTournamentPong.module.css';
import { AuthContext } from '../../../UserContext/Context';
import { useGlobalContext } from '../context/TournamentContext.jsx';

const MainTournamentPong = () => {
    const { user } = useContext(AuthContext);
    const { setTournamentStart , setRoomName} = useGlobalContext();
    const [tournaments, setTournaments] = useState([]);
    const socket = useRef(null);
    const safeTournaments = tournaments || [];

    useEffect(() => {
        if (tournaments)
            console.log("now tournament is:", tournaments);
    }, [tournaments]);

    useEffect(() => {
        socket.current = new WebSocket(`ws://e3r1p9.1337.ma:8000/ws/tournament-game/`);

        socket.current.onopen = () => {
            console.log("name:", user.user.username);
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
            // console.log('WebSocket message received:', event);
            const data = JSON.parse(event.data);

            if (data.message === 'tournament_page') {
                // console.log('data:', data);
                // console.log('data.data:', data.data);
                setTournaments(data.data);
                console.log("tournament current", tournaments);
            } else if (data.message === 'tournament_created') {
                // console.log('tournament_created:', data);
                // console.log('tournament:', data.tournament);
                setTournaments(data.tournament);
                console.log("we are in tournament_created");
            } else if (data.message === 'join_tournament') {
                // console.log('tournament_joined:', data);
                // console.log('tournament:', data.tournament);
                setTournaments(data.tournament);
                console.log("we are in tournament_joined");
            } else if (data.message === 'leave_tournament') {
                setTournaments(data.tournament);
                console.log("we are in leave_tournament");
            } else if (data.message === 'cancel_tournament') {
                setTournaments(data.tournament);
                console.log("we are in cancel_tournament");
            }
            else if (data.message === 'tournament_about_to_start') {
                console.log('a tournament about to start');
                console.log("data:", data);
                console.log("room name:", data.RoomName);
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
        // console.log('createTournament clicked', socket.current);
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const message = {
                action: 'create_tournament',
                name: user.user.username,
            };
            socket.current.send(JSON.stringify(message));
            console.log('Message sent to create tournament');
        }
    };

    const joinTournament = (index) => {
        console.log("room im trying to join its name is:", tournaments[index].name);
        console.log("im:", user.user.username); 
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
                <button className={styles.create_button} onClick={createTournament}>Create Tournament</button>
                <div className={styles.tournament_list}>
                    {safeTournaments.length === 0 ? (
                        <div className={styles.no_tournaments}>There are no tournaments now.</div>
                    ) : (
                        Object.entries(tournaments).map(([tournamentName, tournament], index) => (
                            <div key={index} className={styles.tournament_card}>
                                <h3>{tournament.name}</h3>
                                <h3>{tournament.players}/4 players</h3>
                                <button onClick={() => joinTournament(tournamentName)}>Join</button>
                                <button onClick={() => cancelTournament(tournamentName)}>Cancel</button>
                                <button onClick={() => leaveTournament(tournamentName)}>Leave</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default MainTournamentPong;
