import styl from './WelcomeMessageAndImage.module.css'
import Img from '../../assets/cha.webp'

const WelcomeMessageAndImage = () => {
		return (
		<div className={styl.container}>
			<div className={styl.styling}>
				<div className={styl.welcomeMessage}>
					<p>
						Challenge your friends to a match<br /> in Ping
						Pong Legends and see who<br />truly dominates the table
					</p>
				</div>
				<div className={styl.playnow}>
						<button >
							<a href='http://localhost:3000/game'>Play Now</a>
						</button>
				</div>
			</div>
			<div className={styl.Img}>
				<img src={Img} />
			</div>
		</div>
	)
}

export default WelcomeMessageAndImage