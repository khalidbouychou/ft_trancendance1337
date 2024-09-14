import styl from './OptionCards.module.css'
import Manette from '../../assets/manette.svg'
import AddFriend from '../../assets/AddFriend.svg'
import SMS from '../../assets/SMS.svg'
import Denied from '../../assets/Denied.svg'

const OptionCards = () => {
	return (
		<div className={styl.optionCards}>
			<div className={styl.BlankCard}>
				<img src={Manette} />
				<p >INVITE GAME</p>
			</div>
			<div className={styl.BlankCard}>
				<img src={AddFriend} />
				<p >ADD FRIEND</p>
				</div>
			<div className={styl.BlankCard}>
				<img src={SMS} />
				<p >CHAT</p>
			</div>
			<div className={styl.BlankCard}>
				<img src={Denied} />
				<p >BLOCK USER</p>
			</div>
		</div>
	)
}

export default OptionCards;