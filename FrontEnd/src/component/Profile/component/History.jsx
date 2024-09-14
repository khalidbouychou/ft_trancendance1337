import React from 'react'
import styl from './History.module.css'
import FR1Image from '../assets/prf.svg'
import Manette from '../assets/manette.svg'
import AddFriend from '../assets/AddFriend.svg'
import SMS from '../assets/SMS.svg'
import Denied from '../assets/Denied.svg'
import FR2Image from '../assets/prf1.svg'
import FR3Image from '../assets/prf2.svg'
import Data from './Data'
import Card from './Card'
import Matche from './Matche'
import ListFriend from './ListFriend'
// import OptionCards from './optionCards'
import ListBlocked from './ListBlocked'

const isMyProfile = 1;

const History = () => {
	const friendData = [
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 3,
			Name: "AZARDA",
			Image: FR3Image,
		},
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 3,
			Name: "AZARDA",
			Image: FR3Image,
		},
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 3,
			Name: "AZARDA",
			Image: FR3Image,
		},
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 3,
			Name: "AZARDA",
			Image: FR3Image,
		},
	];

	const friendBLData = [
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
	];

	const datafk = Data.map((data)=> {
	return(
		<Matche key={data.key} username={data.Name} img={data.Image} score={data.score}/>
	)});

	const friendList = friendData.map((data) => {
		return (
			<Card key={data.key} width={'45%'}>
				<img src={data.Image} alt={`${data.Name}`} />
				<p id={styl.friendName}>{data.Name}</p>
			</Card>
		);
	});

	const friendBLList = friendBLData.map((data) => {
		return (
			<Card key={data.key} width={'65%'}>
				<div className={styl.Img}>
					<img src={data.Image} alt={`${data.Name}`} />
				</div>
				<div className={styl.FrName}>
					<p id={styl.friendName}>{data.Name}</p>
				</div>
				<button className={styl.RdButton}><p style={{color: 'red'}}>unblock</p></button>
			</Card>
		);
	});

  return (
	<div className={styl.History}>
		<div className={styl.matchHistory}>
			<p id={styl.Text}>MATCH HISTORY</p>
			<div className={styl.Matches}>
				{datafk}
			</div>
 		</div>
		{ isMyProfile ? <>< ListFriend /> < ListBlocked /></> : <>< OptionCards /> < ListFriend /></> }
	</div>
  )
}

export default History
