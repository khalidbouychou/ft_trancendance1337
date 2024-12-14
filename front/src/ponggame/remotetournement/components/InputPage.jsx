import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from './InputPage.module.css'
import { useGlobalContext } from '../context/TournamentContext.jsx';
import { AuthContext } from '../../../UserContext/Context';
import { use } from 'react';

const MainTournament = () => {
    const { user } = useContext(AuthContext);
    const socket = useRef(null);
    const pressedKeys = useRef(new Set());
    const [PlayerAliasName, setPlayerAliasName] = useState('');
    const { Aliasname, setAliasName } = useGlobalContext();
    const { RoomName, player1Name, setPlayer1Name, player2Name, setPlayer2Name, player3Name,
        setPlayer3Name, player4Name, setPlayer4Name, player5Name, setPlayer5Name,
        player6Name, setPlayer6Name, player7Name, setPlayer7Name,
        player1Avatar, setPlayer1Avatar, player2Avatar, setPlayer2Avatar, player3Avatar,
        setPlayer3Avatar, player4Avatar, setPlayer4Avatar, player5Avatar, setPlayer5Avatar,
        player6Avatar, setPlayer6Avatar, player7Avatar, setPlayer7Avatar , setMatchStart, matchstart} = useGlobalContext();
    const [start, setStart] = useState(true);
    const [condition, setCondition] = useState('N');
    const [leftplayer, setLeftPlayerName] = useState('');
    const [rightplayer, setRightPlayerName] = useState('');
    const [leftAvatar, setLeftPlayerAvatar] = useState('');
    const [rightAvatar, setRightPlayerAvatar] = useState('');
    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);
    const [MESSAGE, setMessage] = useState("message");

    useEffect(() => {
        const token = localStorage.getItem('token');
        socket.current = new WebSocket(`ws://localhost:8000/ws/tournament-game/?token=${token}`);

        socket.current.onopen = () => {
            console.log("name:", user.user.username);
            if (socket.current.readyState === WebSocket.OPEN) {
                const message = {
                    action: 'connected',
                    name: user.user.username,
                    avatar: user.user.avatar,
                    room: RoomName,
                };
                socket.current.send(JSON.stringify(message));
                console.log('tournaments socket.current is open now');
            } else {
                console.error('tournaments socket.current is not readyState:');
            }
        };

        socket.current.onclose = (reason) => {
            console.log('WebSocket connection closed:', reason);
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    },[]);

    useEffect(() => {
        console.log("we enter useeffect matchstart:", matchstart, "PlayerAliasName:", PlayerAliasName);
        console.log("text"*1000);
        const game_width = 800;
        const game_height = 500;
        let ballx = 0;
        let bally = 0;
        let ball_radius = 0;
        let racketHeight = 0;
        let racketWidth = 0;
        let leftRacketY = 0;
        let rightRacketY = 0;
        let player_id = 0;
        let myReq;
        let localcondition = 'N';

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message === 'update_players') {
                console.log('update_players:', data);
                    setPlayer1Name(data.player1_alias);
                    setPlayer1Avatar(data.player1_avatar);
                    setPlayer2Name(data.player2_alias);
                    setPlayer2Avatar(data.player2_avatar);
                    setPlayer3Name(data.player3_alias);
                    setPlayer3Avatar(data.player3_avatar);
                    setPlayer4Name(data.player4_alias);
                    setPlayer4Avatar(data.player4_avatar);
            }
            else if (data.message === 'alias_exists') {
                console.log('alias name is already taken');
                setAliasName(false);
            }
            else if (data.message === 'tournament_started'){
                setMatchStart(true);
                console.log("my client alias is:", PlayerAliasName);
                if (socket.current.readyState === WebSocket.OPEN) {
                    const message = {
                        action: 'startmygame',
                        aliasname: PlayerAliasName,
                        avatar: user.user.avatar,
                        room: RoomName,
                    };
                    socket.current.send(JSON.stringify(message));
                }
                console.log('send to server startmygame');
            }
            else if (data.message === 'match_result'){
                console.log("data:", data);
                console.log("PlayerAliasName:", PlayerAliasName);
                // wait for match screen 
                if (data.winner === PlayerAliasName){
                    console.log("u win");
                    localcondition = 'W';
                    setCondition('W');
                }
                else{
                    console.log("u lost");
                    localcondition = 'L';
                    setCondition('L');
                    socket.current.close();
                }
            }
            // else if (){
                // u win screen
            // }
            // else if (){
                // u lost screen
            // }
            // else if (){
                // someone disconnect so the tournament is over
            // }
            else if (data.message === 'game_data') {
                // console.log("data:", data);
                ballx = (data.ballx / game_width) * canvas.width
                // console.log("after update ballx:", ballx);
                bally = (data.bally / game_height) * canvas.height
                // console.log("after update bally:", bally);
                rightRacketY = (data.right_paddleY / game_height) * canvas.height
                leftRacketY = (data.left_paddleY / game_height) * canvas.height
                setRightScore(data.right_score)
                setLeftScore(data.left_score)
                racketHeight = data.racketHeight
                racketWidth = data.racketWidth
                ball_radius = ((canvas.height / game_width + canvas.width / game_height) / 2) * 15
            }
            else if (data.message === 'game_started') {
                console.log("we received game started message we begin the game");
                console.log("data:", data);
                console.log("my alias name:", PlayerAliasName);
                if (data.player_id1 === PlayerAliasName) {
                    console.log("player id 1");
                    player_id = 1;
                    // setPlayerId(1);
                    setLeftPlayerName(data.player_id1);
                    setRightPlayerName(data.player_id2);
                    setLeftPlayerAvatar(data.player1_avatar);
                    setRightPlayerAvatar(data.player2_avatar);
                }
                if (data.player_id2 === PlayerAliasName) {
                    console.log("player id 2");
                    player_id = 2;
                    // setPlayerId(2);

                    setLeftPlayerName(data.player_id1);
                    setRightPlayerName(data.player_id2);
                    setLeftPlayerAvatar(data.player1_avatar);
                    setRightPlayerAvatar(data.player2_avatar);
                }
                // setGameStarted(true);
            }
            // else if (data.message === 'disconnected') {
            //     setCondition('D');
            //     socket.close();
            //     setMessage("Opponent left the game");
            // }

        };

        if (matchstart){
            console.log("we enter matchstart:", matchstart);
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            const drawball = () => {
                // console.log("drawball");
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                ctx.fillStyle = 'white';
                // console.log("ballx:", ballx, "bally:", bally);
                ctx.arc(ballx, bally, ball_radius, 0, Math.PI * 2);
                ctx.fillRect(canvas.clientWidth / 2 - 3, 0, 6, canvas.height);
                ctx.fill();
            };
    
            const drawLeftRacket = () => {
                ctx.fillStyle = '#7667D9';
                racketWidth = (canvas.width * 2.5 / 100);
                racketHeight = (canvas.height * 20 / 100);
                ctx.fillRect(0, leftRacketY, racketWidth, racketHeight);
            }
    
            const drawRightRacket = () => {
                ctx.fillStyle = '#7667D9';
                racketWidth = (canvas.width * 2.5 / 100);
                racketHeight = (canvas.height * 20 / 100);
                ctx.fillRect(canvas.width - racketWidth, rightRacketY, racketWidth, racketHeight);
            }
    
            const draw = () => {
                // console.log("draw player_id:", player_id);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
    
                if (pressedKeys.current.has('w') && player_id === 1) {
                    console.log("im pressing w");
                    if (socket.current.readyState === WebSocket.OPEN) {
                        const message = {
                            action: 'w',
                        };
                        socket.current.send(JSON.stringify(message));
                        console.log("message was send");
                    }
                }
                else if (pressedKeys.current.has('s') && player_id === 1) {
                    console.log("im pressing s");
                    if (socket.current.readyState === WebSocket.OPEN) {
                        const message = {
                            action: 's',
                        };
                        socket.current.send(JSON.stringify(message));
                        console.log("message was send");
                    }
                }
                if (pressedKeys.current.has('ArrowUp') && player_id === 2) {
                    console.log("im pressing ArrowUp");
                    if (socket.current.readyState === WebSocket.OPEN) {
                        const message = {
                            action: 'ArrowUp',
                        };
                        socket.current.send(JSON.stringify(message));
                        console.log("message was send");
                    }
                }
                else if (pressedKeys.current.has('ArrowDown') && player_id === 2) {
                    console.log("im pressing ArrowDown");
                    if (socket.current.readyState === WebSocket.OPEN) {
                        const message = {
                            action: 'ArrowDown',
                        };
                        socket.current.send(JSON.stringify(message));
                        console.log("message was send");
                    }
                }
                drawball();
                drawLeftRacket();
                drawRightRacket();
                const currentPath = window.location.pathname;
                console.log("localcondition:", localcondition);
                if (currentPath === '/games/remotetournament' && localcondition === 'N'){
                    return requestAnimationFrame(draw);
                }
                else
                    return cancelAnimationFrame(myReq);
            };

            const handleKeyDown = (event) => {
                pressedKeys.current.add(event.key);
            };
    
            const handleKeyUp = (event) => {
                pressedKeys.current.delete(event.key);
            };
    
            myReq = requestAnimationFrame(draw);
    
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
                cancelAnimationFrame(myReq);
            };
        }
        
    }, [matchstart, PlayerAliasName]);

    useEffect(() => {  
        if(PlayerAliasName !== ''){{
            if (PlayerAliasName.length > 4 && PlayerAliasName.length <= 12 ){
                setStart(false);
            }
            else
                setStart(true);
            }
        }
        else{
            setStart(true);
        }
    },[PlayerAliasName]);

    const starttournament = () => {
        console.log('send my alias name:');
        setAliasName(true);
    };

    useEffect(() => {
        if (Aliasname) {
            if (socket.current.readyState === WebSocket.OPEN) {
                const message = {
                    action: 'update_alias',
                    name: user.user.username,
                    aliasname: PlayerAliasName,
                    avatar: user.user.avatar,
                    room: RoomName,
                };
                socket.current.send(JSON.stringify(message));
                console.log('i send my alias name');
            }
        }
    }, [Aliasname]);

    const handleExitClick = () => {
        navigate('/pingpong-games');
    };

    return (
        !matchstart ? (
        !Aliasname ? (
        <div className={styles.last}>
            <div className={styles.play}>
                <div className={styles.starting}>
                    <div className={styles.inp}>
                        <input type="text" placeholder="Alias Name" onChange={(e) => setPlayerAliasName(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className={styles.Button}>
            <button disabled={start} onClick={starttournament} style={{backgroundColor: start ? 'grey' : 'green'}}>Start</button>
            </div>
        </div>) : (
            <div className={styles.last}>
                <div className={styles.waiting}>
                    <h2>Waiting for other players...</h2>
                </div>
            </div>
        ) ) : (
            condition === 'N' ? (
            <div className={styles.gameContainer}>
                <div className={styles.topgame}>  
                    <div className={styles.side}>
                        <img src={leftAvatar} className={styles.Img} />
                        <p >{leftplayer}</p>
                    </div>
                    <div className={styles.side} style={{ justifyContent: 'end' }}>
                        <p >{rightplayer}</p>
                        <img src={rightAvatar} className={styles.Img} />
                    </div>
                    <div className={styles.score}>
                        <p >{leftScore}</p>
                        <p >:</p>
                        <p >{rightScore}</p>
                    </div>
                </div>
                <canvas id="canvas" className={styles.canvass}></canvas>
            </div> ) : (
                <div>
                    <h2>{MESSAGE}</h2>
                </div>
            )
        )
    )
}

export default MainTournament