import React from 'react'
import UserImage from '../../assets/prf.svg'
import EnvelopeDots from '../../assets/EnvelopeDots.svg'
import TableTennis from '../../assets/Table_t.svg'
import styl from './CardFriend.module.css'

const CardFriend = (color) => {
	return (
		<div className={styl.CardFriend}>
			<div className={styl.condition}>
				<div className={styl.Cr_Co}>
					<div className={styl.circl} styl={{backGroundColor: {color}}}></div>
					<p>ONLINE</p>
				</div>
				<img src={UserImage}></img>
			</div>
			<div className={styl.FriendName}>
				<p >KHBOUYCH</p>
				<div className={styl.Icons}>
					<button><img src={EnvelopeDots}></img></button>
					<button><img src={TableTennis}></img></button>
				</div>
			</div>
		</div>
	)
}

export default CardFriend
