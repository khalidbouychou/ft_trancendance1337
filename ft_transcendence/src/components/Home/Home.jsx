import styl from './Home.module.css'
import logo from './assets/pinglo-removebg-preview.png'
import scale from './assets/scale.svg'
import CardRank from './components/CardRank/CardRank'

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
                    <CardRank />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home
