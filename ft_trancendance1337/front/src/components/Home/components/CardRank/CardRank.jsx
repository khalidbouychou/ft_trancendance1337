import React, { useEffect, useState } from 'react'
import styl from './CardRank.module.css'
import userImage from '../../assets/nouahidi.jpeg'
import { Navigate, useNavigate } from 'react-router-dom';

const CardRank = ({data, index}) => {
    // if (data.ping_data && data.ping_data.length > 0)
    const [name, setName] = useState('');
    const [wins, setWins] = useState('');
    const [lvl, setLvl] = useState('');
    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState(null);
    const Navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setName(data.profile_name);
            if (data.ping_data && data.ping_data.length > 0) {
                setWins(data.ping_data[0].wins);
                setAvatar(data.avatar);
                setLvl(data.ping_data[0].exp_game / 100)
                setUsername(data.username);
                console.log('exxxx==>data-->', lvl)
            }
            // setLvl(data.losses);
        }
    }, [data]);

    const handelclick = () => {
        Navigate(`/profile/${username}`);
    }

  return (
    <button className={styl.cardRank} onClick={handelclick}>
        <div className={styl.ranking}>
            <p >{index + 1}</p>
        </div>
        <hr />
        <div className={styl.user}>
            <img src={avatar}/>
            <p >{name}</p>
        </div>
        <div className={styl.wins}>
            <p >{wins}</p>
        </div>
        <div className={styl.lvl}>
            <p >{lvl}</p>
        </div>
    </button>
  )
}

export default CardRank

