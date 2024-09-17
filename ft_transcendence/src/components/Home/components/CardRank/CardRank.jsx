import styl from './cardRank.module.css'
import Circle from '../../components/Circle/circle'
import userImage from '../../assets/nouahidi.jpeg'
import React, {useEffect, useState} from 'react'

const CardRank = () => {

    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/users/top_users/')
                const data = await response.json()
                setTopUsers(data)
            }
            catch (error){
                console.error('Error fetching top users:', error)
            }
        }
        fetchTopUsers()
    },[])

    return (
        <>
        {topUsers.map((user, index) => (
        <div className={styl.CardRank}>
            <div className={styl.rank}>
                <p>Rank</p>
                <p>#{index + 1}</p>
            </div>
            <hr />
            <div className={styl.user}>
                <img src={'http://localhost:8000'+user.image} alt={`${user.name}`} />
                <p>{user.name.toUpperCase()}</p>
            </div>
            <div className={styl.Wins}>
                <p>WINS</p>
                <p>{user.wins}</p>
            </div>
            <div className={styl.level}>
                <div className={styl.circle}>
                    <Circle percentage={user.percentage} />
                    <div className={styl.Lvl}>
                        <p>LVL</p>
                        <p>{user.level} - {user.percentage}%</p>
                    </div>
                </div>
            </div>
        </div>
        ))}
        </>
    )
}

export default CardRank
