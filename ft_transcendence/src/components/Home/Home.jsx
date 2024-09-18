import styl from './Home.module.css'
import logo from './assets/pinglo-removebg-preview.png'
import scale from './assets/scale.svg'
import CardRank from './components/CardRank/CardRank'
import { useNavigate } from 'react-router-dom';
import { FaSearchengin } from "react-icons/fa6";
import userImage from './assets/nouahidi.jpeg'
import { FaRankingStar } from "react-icons/fa6";
import { FaChartArea } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { height, width } from '@fortawesome/free-solid-svg-icons/fa0';


const Home = () => {

    const navigate = useNavigate();
    const percentage = 66;

    const handleClick = () => {
        navigate('/game');
    }

  return (
    <div className={styl.Home}>
        <div className={styl.cont}>
            <div className={styl.head}>
                <h1 >HOME</h1>
            </div>
            <div className={styl.search}>
                <div className={styl.extFrame}>
                    <div className={styl.innerFrame}>
                        <input type="text"
                            placeholder="search..."
                            name='search'
                        />
                    </div>
                    <button className={styl.serachBut}>
                        <FaSearchengin style={{width: '70%', height: '70%'}}/>
                    </button>
                </div>
            </div>
            <div className={styl.first}>
                <div className={styl.intro}>
                    <p className={styl.str}>
                        Challenge your friends to a match in
                        Ping Pong Legends and see who 
                        truly dominates the table
                    </p>
                </div>
                <div className={styl.play}>
                    <button >
                        <p >Play Now</p>
                    </button>
                </div>
            </div>
            <div className={styl.last}>
                <div className={styl.Head}>
                    <div className={styl.But} style={{width: '30%'}}>
                        <h2 >Leaderboard</h2>
                        <FaRankingStar className={styl.Icon}/>
                    </div>
                    <div className={styl.But} style={{width: '70%'}}>
                        <h2 >Statistic</h2>
                        <FaChartArea className={styl.Icon}/>
                    </div>
                </div>
                <div className={styl.content}>
                    <div className={styl.leaderboard}>
                        <div className={styl.bar}>
                            <p style={{width: '20%', height: '100%'}}>RANK</p>
                            <p style={{width: '40%', height: '100%'}}>PLAYER</p>
                            <p style={{width: '20%', height: '100%'}}>WINS</p>
                            <p style={{width: '20%', height: '100%'}}>LVL</p>
                        </div>
                        <div className={styl.cards}>
                            <div className={styl.cardRank}>
                                <div className={styl.ranking}>
                                    <p >1</p>
                                </div>
                                <hr />
                                <div className={styl.user}>
                                    <img src={userImage}/>
                                    <p >NOUREDDINE</p>
                                </div>
                                <div className={styl.wins}>
                                    <p >20</p>
                                </div>
                                <div className={styl.lvl}>
                                    <p >20</p>
                                </div>
                            </div>
                            {/* <div className={styl.cardRank}>
                                <div className={styl.ranking}>
                                    <p >1</p>
                                </div>
                                <div className={styl.user}></div>
                                <div className={styl.wins}></div>
                                <div className={styl.lvl}></div>
                            </div> */}
                        </div>
                    </div>
                    <div className={styl.statistic}>
                    {/* <CircularProgressbar
                    style={{width: '200px', height: '200px'}}
                        value={percentage}
                        text={`${percentage}%`}
                        styles={buildStyles({
                          textSize: '16px',
                          pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                          textColor: '#f88',
                          trailColor: '#d6d6d6',
                          backgroundColor: '#3e98c7',
                        })}
                    /> */}
                    </div>
                </div>
            </div>
            {/* <div className={styl.first}>
                <div className={styl.Intro}>
                    <div className={styl.intro}>
                        <p className={styl.str}>Challenge your friends to a match in
                            Ping Pong Legends and see who 
                            truly dominates the table</p>
                    </div>
                    <div className={styl.Play}>
                        <button  onClick={handleClick}>
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
            </div> */}
        </div>
    </div>
  )
}

export default Home
