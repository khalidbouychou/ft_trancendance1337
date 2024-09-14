import styl from  './Match.module.css'
import { faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Match = ({Data}) => {
	const isWinner = Data.score[0] > Data.score[1];
	const icon = isWinner ? faCheck : faTimes;
	const divColor = isWinner ? 'green' : 'red';
	const MatchCl = isWinner ? '#053a1493' : '#ff1e0061';
	const boxShadowColor = isWinner ? 'green' : 'red';
	return (
		<div className={styl.StlMatch}>
			<div className={styl.Match} style={{ backgroundColor: MatchCl , boxShadow: `0 0 10px ${boxShadowColor}`}} >
				<div className={styl.UserNameImage}>
					<img src={Data.Image} />
					<p>{Data.Name}</p>
				</div>
				<div className={styl.ScoreAndDate}>
					<p id={styl.Date}>{Data.Date}</p>
					<p>{Data.score[0]} - {Data.score[1]}</p>
				</div>
				<div className={styl.UserNameImage}>
					<img src={Data.OpponentImage} />
					<p>{Data.OpponentName}</p>
				</div>
			</div>
			<div className={styl.WL } style={{ backgroundColor: divColor }}>
				<FontAwesomeIcon icon={icon} className={styl.icon}/>
			</div>
		</div>
	)
}

export default Match
