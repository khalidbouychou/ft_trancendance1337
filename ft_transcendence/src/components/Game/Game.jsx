import styl from './Game.module.css'
import _1vs1 from './assets/1vs1.jpeg'
import tournoi from './assets/tournii.jpeg'
import team from './assets/tmvstm.jpeg'

const Game = () => {
  return (
    <div className={styl.Game}>
        <div className={styl.content}>
            <div className={styl.head}>
                <h1 >GAME</h1>
            </div>
            <div className={styl.cont}></div>
        </div>
    </div>
  )
}

export default Game
