import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../ponggame/auth/api';
import './styles.css';

var	XO = props => {
	const [socket, setSocket] = useState(null);
	const [state, setState] = useState(0);
	const [room_name, setRoom_name] = useState(0);
	const [message, setMessage] = useState(null);
	const [player1Score, setPlayer1Score] = useState(0);
	const [player2Score, setPlayer2Score] = useState(0);
	const [userName, setUserName] = useState("");
	const [oponentName, setOponentName] = useState("");
	const [players, setPlayers] = useState(1);
	const [role, setRole] = useState(null);
	const [obj, setObj] = useState(null);
	const [game_state, setGame_state] = useState(new Array);
	const [turn, setTurn] = useState(null);
	const [log, setLog] = useState(new Array);
	const roleRef = useRef(role);
	const stateRef = useRef(state);
	const turnRef = useRef(turn);
	const socketRef = useRef(socket);
	const locate = useLocation();
	const navigated_data = locate.state;
	const navigate = useNavigate();

	var	sleep = ms => {
		return	new Promise(r => setTimeout(r, ms));
	}

	var	fetchNames = async () => {
		try {
			const response = await api.get('/pingpong');
			if (!response || response.status !== 200) 
				return false;
			setUserName(response.data.user);
			send_update("names exchange", JSON.stringify({
				oponent_name: response.data.user,
			}), roleRef.current === "host" ? "guest" : "host", socketRef.current);

			return	true;
		}
		catch (error) {
			return false;
		}
	}

	var connect = n => {
		var token = localStorage.getItem('token');
		const ws = new WebSocket(`ws://192.168.0.102:8000/ws/${ props.invite ? "xo_invite" : "game" }/?token=${token}`);
		ws.onopen = () => {
			if (props.invite) {
				ws.send(JSON.stringify({
					message: "confirm",
					room_id: navigated_data.room_id,
					role: navigated_data.role,
				}))
				setUserName(navigated_data.name);
				setOponentName(navigated_data.other_name);
			}
			else	fetchNames();
		}
		ws.onmessage = e => {
			var	data = JSON.parse(e.data);
			if (data.msg_type === 'server update') {
				if (data.role)	setRole(data.role);
				if (data.message)	setMessage(data.message);
				if (data.room_name) setRoom_name(data.room_name);
				if (props.invite && data.message == "pair refuse") {
					ws.close();
					navigate("/chat");
				}
			}
			else if (data.msg_type === 'pair update') {
				if (data.obj && data.target === roleRef.current)
					setObj(data.obj);
			}
		}
		ws.onerror = e => {
			if (ws.readyState === WebSocket.OPEN)	ws.close();
			setMessage("WebSocket error");
		}

		ws.onclose = e => {
			setMessage("WebSocket closed");
		}
		setSocket(ws);
		return	ws;
	}

	var	reconnect = () => {
		setState(0);
		setPlayers(1);
		if (socket && socket !== undefined 
			&& socket.readyState === WebSocket.OPEN) socket.close();
		if (props.invite)
			navigate("/games");
		else	connect(0);
	}

	var	send_update = (msg, object, target, socket) => {
		if (!socket || socket === undefined
			|| socket.readyState !== 1 || !object) 
			return ;
		socket.send(JSON.stringify({
			obj: object,
			message: msg,
			target: target,
		}))
	}

	var refresh = s => {
		let message = "<span style='background:#fff;color:#000;padding:1px 15px'>" + roleRef.current;
		if (roleRef.current === turnRef.current) {
			setGame_state([]);
			message += ": game refresh! -1</span>";
		} else	message += ": attempted refresh! -1</span>";
		if (roleRef.current === 'host')	setPlayer1Score(player1Score - 1);
		else if (roleRef.current === 'guest')	setPlayer2Score(player2Score - 1);
		console.log("s: ", s.readyState);
		send_update("move", JSON.stringify({
			log: message,
		}), roleRef.current === 'host' ? 'guest' : 'host', s)
		let new_log = log;
		new_log.push(`<p>${message}</p>`);
		setLog(new_log);
	}

	useEffect(() => {
		if (props.invite && (navigated_data == undefined || navigated_data.room_id == undefined)) {
			setState(-1);
			return	() => {}
		}
		const ws = connect(0);
		return () => {
			if (ws.readyState === WebSocket.OPEN) 
				ws.close();
		}
	}, [])

	useEffect(() => {
		if (!socket || socket === undefined) return;
		if (message === 'pair disconnected') { 
			alert(message);
			reconnect();
		}
		else if (message === 'you just got a pair') {
			setState(1);
			setPlayers(2);
			setPlayer1Score(0);
			setPlayer2Score(0);
			setGame_state([]);
			if (roleRef.current === 'host') {
				setTurn('host');
				send_update("turn", JSON.stringify({
					turn: 'host',
				}), 'guest', socketRef.current);
			}
			if (!props.invite) {
				send_update("names exchange", JSON.stringify({
					oponent_name: userName,
				}), roleRef.current === "host" ? "guest" : "host", socketRef.current);
			}
		}
	}, [message])

	useEffect(() => {
		if (!obj)	return;
		var	data = JSON.parse(obj);
		if (data.state && stateRef.current != data.state)
			setState(data.state);
		if (data.game_state)
			setGame_state(data.game_state);
		if (data.turn)
			setTurn(data.turn);
		if (data.log) {
			var new_log = log;
			new_log.push(`<p>${data.log}</p>`);
			setLog(new_log);
		}
		if (data.player1Score && data.player1Score !== player1Score) 
			setPlayer1Score(data.player1Score);
		if (data.player2Score && data.player2Score !== player2Score)
			setPlayer2Score(data.player2Score);
		if (data.oponent_name) {
			setOponentName(data.oponent_name);
			console.log("just received: ", data.oponent_name);
		}
	}, [obj])

	var Btn = props => {
		const elem = useRef(null);

		useEffect(() => {
			elem.current = document.getElementById(props.id);
			elem.current.onclick = e => props.fun();
		} , [])

		return   <button id={props.id} style={{ display: props.display ? "flex" : "none" }} >{props.text}</button>
	}

	var	Loading = props => {
		var	index = useRef(0);
		const [elem, setElem] = useState(null);
		const elemRef = useRef(elem);
		useEffect(() => { elemRef.current = elem}, [elem]);

		var	interv = () => {
			if (index.current < 3) {
				setElem(elemRef.current + '.');
				index.current += 1;
				return ;
			}
			setElem(props.content);
			index.current = 0;
		}
		useEffect(() => {
			if (elem === null) {
				setElem(props.content);
				setInterval(interv, props.interval);
			}
			return	() => {
				clearInterval(interv);
			}
		}, [])
		return	props.tag === "h1" ? <h1>{elem}</h1>
			: <p>{elem}</p>;
	}

	var	Log = props => {
		var	elem = useRef(null);
		var	logRef = useRef(props.log);

		useEffect(() => {
			if (elem.current === null)	elem.current = document.getElementById("logs");
			return () => {
				for (let c of elem.current.children)
					elem.current.removeChild(c);
			}
		}, [])

		useEffect(() => {
			logRef.current = props.log;
			for (let i of logRef.current) 
				elem.current.innerHTML += i;
		}, [props.log])

		return	<div id="logs"></div>
	}

	var	Game = props => {
		var	elem = useRef(null);
		var	game = useRef(props.game_state);
		var	sign = (roleRef.current === 'host') ? "x" : "o";
		
		useEffect(() => {
			if (game.current.length === 0) {
				for (let i = 0; i < 25; i++) {
					game.current.push({
						"Id": `_game_div_${i}_`,
						"Attr": `x${(i % 5)+1}, y${Math.floor(i / 5)+1}`,
						"Class": "_",
						"C": ""
					})
				}
				props.setGame_state(game.current);
			}
			if (elem.current === null)	elem.current = document.getElementById("game");
			return () => {
				for (let i of elem.current.children) 
					elem.current.removeChild(i);
				game.current = new Array;
			}
		}, [])

		useEffect(() => {
			var checked = 0;
			game.current = props.game_state;
			if (!game.current || !game.current.length) return () => {};
			for (let i of game.current) {
				if (i.Class !== "_")	checked++;
				let new_elem = document.createElement("div");
				new_elem.classList.add(i.Class);
				new_elem.id = i.Id;
				new_elem.innerHTML = i.C;
				new_elem.onclick = e => {
					if (roleRef.current === turnRef.current && i.Class === "_") {
						i.Class = sign;
						i.C = `<h1>${sign}</h1>`;
						e.target.classList.replace("_", i.Class);
						e.target.innerHTML = i.C;
						let target = roleRef.current === 'host' ? 'guest' : 'host', logE = `${roleRef.current}: ${sign} on ${i.Attr}`, x = 0, y = 0, z = 0;
						for (let j = game.current.indexOf(i) - 5; j >= 0 && game.current[j] != undefined; j -= 5) // x - 1
						{ if (game.current[j].Class === i.Class) x++; else break; }
						for (let j = game.current.indexOf(i) + 5; j < game.current.length && game.current[j] != undefined; j += 5) // x + 1
						{ if (game.current[j].Class === i.Class) x++; else break; }
						if (x < 3) {
							for (let j = game.current.indexOf(i) - 1; j >= 0 && game.current[j] != undefined; j -= 1) // y - 1
							{ if (game.current[j].Class === i.Class && game.current[j].Attr.substring(5, 6) === i.Attr.substring(5, 6)) y++; else break; }
							for (let j = game.current.indexOf(i) + 1; j >= 0 && game.current[j] != undefined; j += 1) // y + 1
							{ if (game.current[j].Class === i.Class && game.current[j].Attr.substring(5, 6) === i.Attr.substring(5, 6)) y++; else break; }
							if (y < 3) {
								for (let j = game.current.indexOf(i) - 6; j >= 0 && game.current[j] !== undefined; j -= 6) // x - 1, y - 1
								{ if (game.current[j].Class === i.Class) z++; else break; }
								for (let j = game.current.indexOf(i) + 6; j < game.current.length && game.current[j] !== undefined; j += 6) // x + 1, y + 1
								{ if (game.current[j].Class === i.Class) z++; else break; }
								if (z < 3) {
									z = 0;
									for (let j = game.current.indexOf(i) + 4; j < game.current.length && game.current[j] !== undefined; j += 4) // x - 1, y + 1
									{ if (game.current[j].Class === i.Class && game.current[j].Attr.substring(5, 6) !== i.Attr.substring(5, 6))	z++; else break; }
									for (let j = game.current.indexOf(i) - 4; j >= 0 && game.current[j] !== undefined; j -= 4) // x + 1, y - 1
									{ if (game.current[j].Class === i.Class && game.current[j].Attr.substring(5, 6) !== i.Attr.substring(5, 6))	z++; else break; }
								}
							}
						}
						if (x === 3 || y === 3 || z >= 3) {
							logE += `<br/><span style="color:#000;background:#fff;padding:1px 15px">${roleRef.current} (${sign}) WINS! +1</span>`;
							game.current = [];
							if (roleRef.current === 'host') setPlayer1Score(player1Score + 1);
							else	setPlayer2Score(player2Score + 1);
							if (socketRef.current
								&& socketRef.current.readyState === 1) {
								socketRef.current.send(JSON.stringify({
									message: "result",
									winner: userName, 
									loser: oponentName,
									win_score: roleRef.current === 'host' ? (player1Score + 1) : (player2Score + 1),
									lose_score: roleRef.current === 'guest' ? player2Score : player1Score,
								}));
							}
							checked = 0;
						}
						send_update("move", JSON.stringify({
							log: logE,
							game_state: game.current,
							turn: target,
						}), target, socketRef.current);
						setTurn(target);
						let new_log = log;
						new_log.push(`<p>${logE}</p>`);
						setLog(new_log)
					}
				}
				new_elem.onmouseenter = e => {
					if (roleRef.current === turnRef.current && e.target.classList.contains("_")) {
						new_elem.style.border = "1px solid #fff";
						new_elem.style.transform = "scale(1.1)";
						new_elem.innerHTML = `<h1 id="temp_h1">${sign}</h1>`;
					}
					else	new_elem.style.cursor = "no-drop";
				}
				new_elem.onmouseleave = e => {
					if (e.target.classList.contains("_") && roleRef.current === turnRef.current) {
						new_elem.style.border = "1px solid #A9A9A9";
						new_elem.style.transform = "scale(1)";
						new_elem.innerHTML = "";
					}
				}
				elem.current.appendChild(new_elem);
			}
			if (checked === 25) {
				let	draw = "<span style='color:#000;background:#fff;padding:1px 15px'>draw !</span>"
				props.setGame_state([]);
				send_update("move", JSON.stringify({
					log: draw,
				}), roleRef.current === 'host' ? 'guest' : 'host', socketRef.current);
				let	new_log = log;
				new_log.push(`<p>${draw}</p>`);
				setLog(new_log);
			}
		}, [props.game_state])

		return	<div id="game"></div>
	}

	useEffect(() => { roleRef.current = role }, [role])
	useEffect(() => { turnRef.current = turn }, [turn])
	useEffect(() => { socketRef.current = socket }, [socket])
	useEffect(() => { send_update("score", JSON.stringify({player1Score: player1Score}), roleRef.current === 'host' ? 'guest' : 'host', socketRef.current)}, [player1Score])
	useEffect(() => { send_update("score", JSON.stringify({player2Score: player2Score}), roleRef.current === 'host' ? 'guest' : 'host', socketRef.current)}, [player2Score])
	useEffect(() => {
		stateRef.current = state;
		if (stateRef.current === 2)
			send_update("state update", JSON.stringify({
				state: stateRef.current,
			}), roleRef.current === 'host' ? 'guest' : 'host', socket);
	}, [state])

	return state == -1 ? (<div id="XOApp"><h1>you got no room in here try the game tap in the navbar</h1></div>)
		: (
		<div id="XOApp">
			{
				state === 0 ?
					<div id="looking_up" >
					<div>
						<Loading content={ props.invite ? "waiting for your friend" : "looking for an opponent"} tag="h1" interval={1000} />
						{
							!props.invite ?
								<p>this matchmaking system is random<br/>and you are now just waiting<br/>
									for anyone to just access this same page
								</p>
							:	<p>game request have been communicated to both parties<br/>
									and it looks like they both approve<br/>
									just waiting for them to join
								</p>
						}
					</div>
					</div>
				: state === 1 ?
					<div id="found">
					<div>
						<h1>you just found an oppenent({role === 'guest' ? 'host' : 'guest'})</h1>
						{
							role === 'host' ? <Btn text="start" fun={() => {setState(2)}} id="start_btn" display={true} />
							: role === 'guest' ? <Loading content="waiting for him to start" tag="p" interval={1000} />
							: []
						}
						<Btn text="rematch" fun={() => reconnect()} id="rematch_btn" display={true} />
					</div>
					</div>
				: state === 2 ? <Game game_state={game_state} setGame_state={setGame_state} />
				: <h1>something went wrong</h1>
			}
			<div id="control">
				<Btn text="quit" fun={() => reconnect()} id="quit_btn" display={state === 2} />
				<Btn text="clear/restart" fun={() => refresh(socketRef.current)} id="restart_btn" display={state === 2} />
			</div>
			<div id="stats">
				<p><span>X</span> {state === 2 ? player1Score : ''}</p>
				<p><span>O</span> {state === 2 ? player2Score : ''}</p>
			</div>
			<div id="console">
				<p>turn: {turn === role ? "you" : "not you"} - {role === 'host' ? "x" : "o"}</p>
				<p>player: {userName}</p>
				<p>oponent: {oponentName}</p>
				<p>role: {role}</p>
				<p>room: {room_name}</p>
				<p>state: {state === 0 ? "waiting for second connection"
						: state === 1 ? "waiting for peer approval"
						: state === 2 ? "good" : "not good"}</p>
				<p>players: {players}</p>
				<p>player1-score: {player1Score}</p>
				<p>player2-score: {player2Score}</p>
				<p>server-message: {message}</p>
				<p id="console_obj">server-object: {obj}</p>
			</div>
			<Log log={log} />
		</div>
	)
}

export default XO
