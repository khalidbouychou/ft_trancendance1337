

import { createContext, useContext, useEffect, useState } from "react";
import style from "./Solo.module.css";
import tst from "/img/ava.jpeg";
import twst from "/img/fraind.jpeg";
import azar from "/img/azarda.png";
import nouah from "/img/nouahidi.png";
import Invite from "../../Invite/Invite";
import AppContext from "../../../AppContext";










const User = (val) => {
	
	const context = useContext(AppContext)


		return (

			<div  className={ val.val === "RANDOM" ?  (style.rand) : (style.User)}   > 
							
							<p>{val.val}</p>

							<div className={style.us}>



							<img src={val.val === "RANDOM" ? tst : twst}alt="" /> 

							{/* (  filtrList[0]?.urlImg  ? filtrList[0]?.urlImg  : twst) */}



							{(val.val !== "RANDOM") ? (<button 
								onClick={() => {context.setUser(true)} }
							
							> INV USER</button>) : <input placeholder="RANDOM" disabled ></input> }

							</div>
							<button> START GAME</button>

							</div>
							
		)
	}
	
	
	const Local = () => {
		return (
			
			<div className={style.local}>
				<p>LOCAL</p>
			
			<div className={style.inp}>
			<input type="text" placeholder="User 1" />
			<input type="text" placeholder="User 2" />
			</div>

			<button> START GAME</button>
		</div>

	)
}

const Solo = () => {

	const context = useContext(AppContext)

	
	useEffect(() => {
		document.title = "1 VS 1 "
	})
	

	return (
		<div className={style.solo}>
				<h1>1 VS 1</h1>
				<div className={style.all}>

							< User val={"RANDOM"} />
							< User val={"VS_FRIEND"} />
							< Local />


				</div>
				{ context.user && (<Invite />) }
			</div>
		);

};

export default Solo;















// 	const [data , setData]  = useState([
// 		{
// 			titel: "azard",
// 			urlImg: azar,
// 		},
// 		{
// 			titel: "azarda",
// 			urlImg: nouah,
// 		}
// ])

// const [input , setInput] = useState("");




// const filtrList = data.filter((item) =>
//   item.titel.toLowerCase().includes(input?.toLowerCase()));

// console.log(input)


// {message.senderId == currentUser?.id ? "message one" : "message"}

