import styl from './LeaderboardAndFriends.module.css'
import CardRank from '../CardRank/CardRank.jsx'
import laurel from '../../assets/wreath-laurel.svg'
import FriendsIm from '../../assets/Friends.svg'
import CardFriend from '../CardFriend/CardFriend.jsx'

const LeaderboardAndFriends = () => {
	return (
		<div className={styl.container}>
			<div className={styl.Leaderboard}>
				<div className={styl.head}>
					<p >Leaderboard</p>
					<img src={laurel} />
				</div>
				<div className={styl.Rank}>
					<div className={styl.ScrollContainer} style={{flexDirection: 'column'}}>
						<CardRank />
						{/* <CardRank />
						<CardRank />
						<CardRank />
						<CardRank />
						<CardRank />
						<CardRank /> */}
					</div>
				</div>
			</div>
			{/* <div className={styl.Friends}>
				<div className={styl.head} style={{height: '10%'}}>
						<p >Friends</p>
						<img src={FriendsIm} />
				</div>
				<div className={styl.CardFriends}>
					<div className={styl.ScrollContainer}>
						< CardFriend />
						< CardFriend />
						< CardFriend />
						< CardFriend />
						< CardFriend />
						< CardFriend />
						< CardFriend />
						< CardFriend />
					</div>
				</div>
			</div> */}
		</div>
	);
}

export default LeaderboardAndFriends;