import React from 'react'
import styl from './Statistics.module.css'
import winsIcon from '../../assets/wins.svg'
import loseIcon from '../../assets/lose.svg'
import gamesIcon from '../../assets/games.svg'
import userImage from '../../assets/nouahidi.png'
import CirclePercentage from '../Circle/circle'

const Statistics = () => {
	const userName = "NOUAHIDI";
	const ratio = 40;
  return (
	<div className={styl.statistics}>

		<div className={styl.user}  >
			<img src={userImage} />
			<p id={styl.inf}>
				<p id={styl.userName}> {userName}</p>
				<div className={styl.condition}>
					<div className={styl.circl}></div>
					<p>online</p>
				</div>
			</p>
		</div>

		<div className={styl.res}>
			<div id={styl.W_L_G}>
				<img src={winsIcon} />
				<p>WINS</p>
				<p>10</p>
			</div>
			<div id={styl.W_L_G}>
				<img src={loseIcon} />
				<p>LOSE</p>
				<p>10</p>
			</div>
			<div id={styl.W_L_G}>
				<img src={gamesIcon} />
				<p>GAMES</p>
				<p>10</p>
			</div>
		</div>

		<div className={styl.circleWrapper}>
			<CirclePercentage percentage={ratio} width={250} height={250}/>
		</div>

	</div>
  )
}

export default Statistics
