import { useEffect } from "react";
import style from "./Multi.module.css"
import ava from "/img/ava.jpeg";
import twst from "/img/fraind.jpeg";


const LocalTourne = () => {
    return(
        <div className={style.localTo}>
            <p>TOURNEWA LOCAL</p>

            <div className={style.inp}>
			<input type="text" placeholder="User 1" />
			<input type="text" placeholder="User 2" />
			<input type="text" placeholder="User 3" />
			<input type="text" placeholder="User 4" />
			</div>

            <button>START GAME</button>

        </div>
    )


}


const RemoutTourne = () => {
    return(
        <div className={style.RemoutTo}>
            <p>TOURNEWA RMOUT</p>

            <div className={style.inp}>

                <div className={style.fraind}>
                <img src={twst} alt="" />
                <button disabled > Myusername </button>
                </div>
                <div className={style.fraind}>
                <img src={ava} alt="" />
                <button> INV FRAIND </button>
                </div>
                <div className={style.fraind}>
                <img src={ava} alt="" />
                <button> INV FRAIND </button>
                </div>
                <div className={style.fraind}>
                <img src={ava} alt="" />
                <button> INV FRAIND </button>
                </div>
			</div>

            <button>START GAME</button>

        </div>
    )


}
const VS = () => {
    return(
        <div className={style.vs}>
            <p>2 VS 2</p>

            <div className={style.inp}>

                <div className={style.my_tym}>

                <img src={twst} alt="" />

                <div className={style.add_frai}>
                    <img src={ava} alt="" />
                    <button>ADD FRAIND </button>
                </div>


                </div>


                <div className={style.adver}>
                    <img src={ava} alt="" />
                    <button>ADD FRAIND </button>
                </div>

                <div className={style.adver}>
                    <img src={ava} alt="" />
                    <button>ADD FRAIND </button>
                </div>


			</div>

            <button>START GAME</button>

        </div>
    )


}



const Multi = () => {

	useEffect(() => {
		document.title = "MULTIUSER"
	})



		return (
			<div className={style.multi}>
				<h1>MULTIUSER</h1>
				<div className={style.all}>

							< LocalTourne />  
                            < VS />
							< RemoutTourne />  

	

				</div>
			</div>
		);

};

export default Multi;