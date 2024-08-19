import { Routes, Route, Link } from "react-router-dom";
import style from "./Game.module.css";
import Solo from "./Solo/Solo";
import { useEffect } from "react";
import Invite from "../Invite/Invite";



const Game = () => {

	useEffect(() => {
		document.title = "Game"
	})
   
	return (
		<>
		<div className={style.game}>

			<h1>GAME</h1>
			<div className={style.all}>

						<Link  className={style.multi}  to="/game/multi"  >  MULTI USERS </Link>
						<Link  className={style._vs_1}  to="/game/solo" > 1 VS 1 </Link>


			</div>
			
						{/* <Routes>
							<Route path="/game/solo" element={<Solo />} />
						</Routes> */}
		</div>
		
	</>
	);
};

export default Game;



