import React from 'react'
import styl from './History.module.css'
import Data from '../../Data'
import Matche from '../Match/Match'
import ListFriend from '../ListFriend/ListFriend'
import OptionCards from '../OptionCards/OptionCards'
import ListBlocked from '../ListBlocked/ListBlocked'

const isMyProfile = 1;

const History = () => {
	
	const datafk = Data.map((data)=> {
	return(
		<Matche key={data.key} Data={data}/>
	)});

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
