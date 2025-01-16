import React, { useRef, useEffect, useState, useContext } from 'react';
import * as styles from './FriendGame.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../UserContext/Context";
import axios from 'axios';

export default function FriendGame() {

    const {t} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { game_key } = location.state || {};

    const pressedKeys = useRef(new Set());
    const [rightScore, setRightScore] = useState(0);
    const [leftplayername, setLeftPlayerName] = useState("left player");
    const [rightplayername, setRightPlayerName] = useState("right player");
    const [leftplayeravatar, setLeftPlayerAvatar] = useState('');
    const [rightplayeravatar, setRightPlayerAvatar] = useState("/assets/unknown0.png");
    const [leftScore, setLeftScore] = useState(0);
    const [gamestarted, setGameStarted] = useState(false);
    const [condition, setCondition] = useState('N');
    const [MESSAGE, setMessage] = useState("message");
    const [profile_name, setProfileName] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [level, setLevel] = useState(0);
    const [player_idx, setPlayerId] = useState(0);
    const hasFetchedData = useRef(false);
    const [FetchedData, setFetchedData] = useState(false);
    let socket = null;

    const leftup = () => {
        if (player_idx === 1 && socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                action: 'w',
                value: 10,
            };
            socket.send(JSON.stringify(message));
        }
    };

    const leftdown = () => {
        if (player_idx === 1 && socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                action: 's',
                value: 10,
            };
            socket.send(JSON.stringify(message));
        } 
    };

    const rightup = () => {
        if (player_idx === 2 && socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                action: 'ArrowUp',
                value: 10,
            };
            socket.send(JSON.stringify(message));
        } 
    };

    const rightdown = () => {
        if (player_idx === 2 && socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                action: 'ArrowDown',
                value: 10,
            };
            socket.send(JSON.stringify(message));
        } 
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios(`${import.meta.env.VITE_BACKEND_IP}/api/pong_data/`,{
                withCredentials: true,
            });
            if (response.status === 200) {
                setProfileName(response.data.profile_name);
                setUsername(response.data.username);
                setLeftPlayerAvatar(response.data.avatar);
                setLeftPlayerName(response.data.profile_name);
                setAvatar(response.data.avatar);
                setLevel(response.data.exp_game);
            } else {
                console.log("error:", response.status);
            }
        };

        if (!hasFetchedData.current) {
            fetchData();
            setFetchedData(true);
        }
    }, []);

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
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
        if (FetchedData)
            socket = new WebSocket(`wss://${import.meta.env.VITE_WSS_IP}/ws/play-friend/`);

        if (socket) {
            socket.onopen = () => {
                if (socket.readyState === WebSocket.OPEN) {
                  
                    const message = {
                        action: 'connect',
                        username: username,
                        profile_name: profile_name,
                        avatar: avatar,
                        level: level,
                        game_id: game_key,
                    };
                    socket.send(JSON.stringify(message));
            
                }
            };

            window.leftup = leftup;
            window.leftdown = leftdown;
            window.rightup = rightup;
            window.rightdown = rightdown;
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.message) {
                    if (data.message === 'game_data') {
                        ballx = (data.ballx / game_width) * canvas.width
                        bally = (data.bally / game_height) * canvas.height
                        rightRacketY = (data.right_paddleY / game_height) * canvas.height
                        leftRacketY = (data.left_paddleY / game_height) * canvas.height
                        setRightScore(data.right_score)
                        setLeftScore(data.left_score)
                        racketHeight = data.racketHeight
                        racketWidth = data.racketWidth
                        ball_radius = ((canvas.height / game_width + canvas.width / game_height) / 2) * 15
                    }
                }
                if (data.message) {
                    if (data.message === 'game_started') {
                        if (data.player_id1 === profile_name) {
                            player_id = 1;
                            setPlayerId(1);
                            setLeftPlayerName(data.player_id1);
                            setRightPlayerName(data.player_id2);
                            setLeftPlayerAvatar(data.player_1_avatar);
                            setRightPlayerAvatar(data.player_2_avatar);
                        }
                        else if (data.player_id2 === profile_name) {
                            player_id = 2;
                            setPlayerId(2);
                            setLeftPlayerName(data.player_id1);
                            setRightPlayerName(data.player_id2);
                            setLeftPlayerAvatar(data.player_1_avatar);
                            setRightPlayerAvatar(data.player_2_avatar);
                        }
                        setGameStarted(true);
                    }
                    else if (data.message === 'disconnected') {
                        setCondition('D');
                        socket.close();
                        setMessage("Opponent left the game");
                    }
                    else if (data.message === 'Leave') {
                        navigate('/');
                    }
                }
                if (data.hasOwnProperty('winner')) {
                    if (data.winner == player_id) {
                        setCondition('W');
                        setMessage("You won the game");
                    }
                }
                if (data.hasOwnProperty('loser')) {
                    if (data.loser == player_id) {
                        setCondition('L');
                        setMessage("You lost the game");
                    }
                }
            };

            socket.onclose = () => {
                socket.close();
            };

        }

        const drawball = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx.fillStyle = 'white';

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
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (pressedKeys.current.has('w') && player_id === 1) {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const message = {
                        action: 'w',
                        value: 10,
                    };
                    socket.send(JSON.stringify(message));
                }
            }
            else if (pressedKeys.current.has('s') && player_id === 1) {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const message = {
                        action: 's',
                        value: 10,
                    };
                    socket.send(JSON.stringify(message));
                }
            }
            if (pressedKeys.current.has('ArrowUp') && player_id === 2) {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const message = {
                        action: 'ArrowUp',
                        value: 10,
                    };
                    socket.send(JSON.stringify(message));
                }
            }
            else if (pressedKeys.current.has('ArrowDown') && player_id === 2) {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const message = {
                        action: 'ArrowDown',
                        value: 10,
                    };
                    socket.send(JSON.stringify(message));
                }
            }
            drawball();
            drawLeftRacket();
            drawRightRacket();
            const currentPath = window.location.pathname;
            if (currentPath === '/friendgame' && condition === 'N')
                return requestAnimationFrame(draw);
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

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [profile_name]);

    useEffect(() => {
        if (gamestarted) {
            document.getElementById('matchmaking').style.display = "none";
            document.getElementById('result').style.display = "none";
        }
        if (condition != 'N') {
            document.getElementById('result').style.display = "block";
        }
    }, [gamestarted, condition]);

    const handleExitClick = () => {
        navigate('/games');
    };

    return (
        <>
            <div id="matchmaking" className={styles.matchmaking}>
                <div className={styles.centered}>
                    <div className={styles.holderx}>
                        <div className={styles.leftplayer}>
                            <img src={leftplayeravatar} className={styles.userImg} />
                            <h4>{leftplayername}</h4>
                        </div>
                        <div className={styles.vs}>
                            <img src="/assets/loading.gif" className={styles.loadingGif} />
                            <p>{t("VS")}</p>
                        </div>
                        <div className={styles.leftplayer}>
                            <img src={rightplayeravatar} className={styles.userImg} />
                            <h4>{t("Unknown")}</h4>
                        </div>
                    </div>
                    <div className={styles.buttoncontainer}>
                        <div className={styles.Button}>
                            <button onClick={handleExitClick}>{t("Exit")}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="result" className={styles.result}>
                <div className={styles.centered}>
                    <div className={styles.holderx} style={{ height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div className={styles.message}>
                            <h4>{t(MESSAGE)}</h4>
                            {condition !== 'D' && (
                                <>
                                    <img src={avatar} />
                                    <h3>{profile_name}</h3>
                                </>
                            )}
                        </div>
                        <div className={styles.buttoncontainer}>
                            <div className={styles.Button}>
                                <button onClick={handleExitClick}>{t("Exit")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.gameContainer}>
                <div className={styles.topgame}>
                    <div className={styles.side}>
                        <img src={leftplayeravatar} className={styles.Img} />
                        <p >{leftplayername}</p>
                    </div>
                    <div className={styles.side} style={{ justifyContent: 'end' }}>
                        <p >{rightplayername}</p>
                        <img src={rightplayeravatar} className={styles.Img} />
                    </div>
                    <div className={styles.score}>
                        <p >{leftScore}</p>
                        <p >:</p>
                        <p >{rightScore}</p>
                    </div>
                </div>
                <canvas id="canvas" className={styles.canvass}></canvas>
            <div style={{
                color : "yellow",
                marginTop:"50px"
            }
            }>
                <h1>{t("Manual")} : (W/S  | UP/DOWN)</h1>
            </div>
            </div>
        </>
    );
}
