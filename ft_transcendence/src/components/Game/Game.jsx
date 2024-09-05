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
            <div className={styl.cards}>
                <div className={styl.GameCard}>
                  <div className={styl.Head}>
                    <h3 >1 VS 1</h3>
                  </div>
                  <div className={styl.background}>
                    <img src={_1vs1}></img>
                  </div>
                </div>

                <div className={styl.GameCard}>
                  <div className={styl.Head}>
                    <h3 >Local Tournoi</h3>
                  </div>
                  <div className={styl.background}>
                    <img src={tournoi}></img>
                  </div>
                </div>

                <div className={styl.GameCard}>
                  <div className={styl.Head}>
                    <h3 >Team vs Team</h3>
                  </div>
                  <div className={styl.background}>
                    <img src={team}></img>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Game
