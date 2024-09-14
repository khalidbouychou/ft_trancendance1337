import style from "./info.module.css"

const Info = () => {

    return (

        <div className={style.info}>
            
            <img src="./img/azarda.png" alt="" />

            <div className={style.bout}>

            <img src="./icons/profil.png" alt="" />
            <button>View Profile</button>
            </div>


            <div className={style.bout}>
            <img src="./icons/game.png" alt="" />
            <button>Invite Match</button>
            </div>


            <div className={style.bout_block}>
            <img src="./icons/block.png" alt="" />
            <button > Block User</button>
            </div>


        </div>

    )


}


export default Info



