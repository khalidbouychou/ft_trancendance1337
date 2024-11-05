import React, { useContext, useEffect, useState } from 'react'
import styl from './CardRank.module.css'
import userImage from '../../assets/nouahidi.jpeg'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../../UserContext/Context";

const CardRank = ({data, index}) => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [wins, setWins] = useState('');
    const [lvl, setLvl] = useState('');
    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState(null);
    const [color, setColor] = useState('rgba(255, 255, 255, 0.3)')
    const [type, setType] = useState('')
    const Navigate = useNavigate();
    console.log('huwaaa', data)

    useEffect(() => {
        if (data) {
            setName(data.profile_name);
            if (data.data && data.data.length > 0) {
                setWins(data.data[0].wins);
                setAvatar(data.avatar);
                setLvl(Math.round(data.data[0].exp_game / 100))
                setUsername(data.username);
            }
        }
    }, [data]);
    
    const handelclick = () => {
        Navigate(`/profile/${username}`);
    }

    useEffect(() => {
        if (user && user.user.username === username) {
            setColor('rgba(65, 21, 160, 0.3)');
        }
        else 
            setColor('rgba(255, 255, 255, 0.3)');
    }, [user, username]);
  return (
    <button className={styl.cardRank} onClick={handelclick} style={{backgroundColor: color}}>
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

