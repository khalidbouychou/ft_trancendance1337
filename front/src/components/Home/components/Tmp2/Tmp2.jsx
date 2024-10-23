import React, {useState} from 'react'
import CardRank from '../CardRank/CardRank'
import CurveChart from '../CurveChart/CurveChart'
import CurveLevel from '../CurveLevel/CurveLevel'
import styl from './Tmp2.module.css'
import { FaRankingStar } from "react-icons/fa6";
import { FaChartArea } from "react-icons/fa";


const Tmp2 = ({ Data, myData  }) => {
    const [selectedTab, setSelectedTab] = useState('leaderBoard');

    console.log('-->Data-->', myData.ping_data[0].wins)

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const total = 15 + 10;
    const winPercentage = (15 / total) * 100;
    const lossPercentage = (10 / total) * 100;
    const data = [
        { time: 'Jan', wins: 5, losses: 3 },
        { time: 'Feb', wins: 8, losses: 2 },
        { time: 'Mar', wins: 4, losses: 5 },
    ]

    const levelData = [
        { level: 1, time: 5 },
        { level: 2, time: 12 },
        { level: 3, time: 20 },
        { level: 4, time: 25 },
    ];

    return (
        <div className={styl.tmp2}>
            <div className={styl.Head}>
                <button style={{ width: selectedTab === 'leaderBoard' ? '60%' : '40%' }}
                    onClick={() => handleTabClick('leaderBoard')}
                >
                    <p >LeaderBoard</p>
                    <FaRankingStar className={styl.icon}/>
                </button>
                <button style={{ width: selectedTab === 'statistic' ? '60%' : '40%' }}
                    onClick={() => handleTabClick('statistic')}
                >
                    <p >Statistic</p>
                    <FaChartArea className={styl.icon}/>
                </button>
            </div>
            {selectedTab === 'leaderBoard' ? (
                <div className={styl.cardGn}>
                    <div className={styl.bar}>
                        <p className={styl.Nname}>RANK</p>
                        <p className={styl.Nname} style={{width: '40%'}}>PLAYER</p>
                        <p className={styl.Nname}>WINS</p>
                        <p className={styl.Nname}>LVL</p>
                    </div>
                    <div className={styl.cards}>
                    {Data.ping.map((item, index) => (
                        <CardRank index={index} key={index} data={item}/>
                    ))
                    }
                    </div>
                </div> 
                ) : (
                <div className={styl.statistic}>
                    <div className={styl.chart1}>
                        <div className={styl.circ}>
                            <div className={styl.chartCir} style={{
                                background: `conic-gradient(
                                #25233C ${winPercentage}%,  
                                #7667D9 0 ${lossPercentage + winPercentage}%
                                )`,
                            }}>
                            </div>
                            <div className={styl.chartText}>
                                <p>Wins: {myData.ping_data[0].wins}</p>
                                <p>Losses: {myData.ping_data[0].losses}</p>
                            </div>
                        </div>
                        <div className={styl.CurveChart}>
                            <CurveChart data={data} />
                        </div>
                    </div>
                    <div className={styl.chart2}>
                        <CurveLevel data={levelData}/>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Tmp2
