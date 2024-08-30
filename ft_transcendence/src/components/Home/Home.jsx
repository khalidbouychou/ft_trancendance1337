import styl from './Home.module.css'
import logo from './assets/logo.webp'
import scale from './assets/scale.svg'
import userImage from './assets/nouahidi.jpeg'
import Circle from './components/Circle/circle'

const Home = () => {
  return (
    <div className={styl.Home}>
        <div className={styl.cont}>
            <div className={styl.head}>
                <h1 >HOME</h1>
            </div>
            <div className={styl.first}>
                <div className={styl.Intro}>
                    <div className={styl.intro}>
                        <p className={styl.str}>Challenge your friends to a match in
                            Ping Pong Legends and see who 
                            truly dominates the table</p>
                    </div>
                    <div className={styl.Play}>
                        <button >
                            <p >Play Now</p>
                        </button>
                    </div>
                </div>
                <div className={styl.logo}>
                    <img src={logo}></img>
                </div>
            </div>
            <div className={styl.last}>
                <div className={styl.Leaderboard} style={{justifyContent: 'start'}}>
                    <p >Leaderboard</p>
                    <img src={scale}></img>
                </div>
                <div className={styl.content}>
                    <div className={styl.CardRank}>
                        <div className={styl.rank}>
                            <p >Rank</p>
                            <p >#1</p>
                        </div>
                        <hr />
                        <div className={styl.user}>
                            <img src={userImage}></img>
                            <p >NOUREDDINE</p>
                        </div>
                        <div className={styl.Wins}>
                            <p >WINS</p>
                            <p >10</p>
                        </div>
                        <div className={styl.level}>
                            <div className={styl.circle}>
                                <Circle  percentage={10}/>
                                <div className={styl.Lvl}>
                                    <p >LVL</p>
                                    <p >1 - 10%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home
