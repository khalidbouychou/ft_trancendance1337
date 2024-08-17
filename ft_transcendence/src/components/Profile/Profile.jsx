import styl from  './Profile.module.css'
import userImage from './assets/nouahidi.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CiMedal } from "react-icons/ci";
import { IoGameControllerOutline } from "react-icons/io5"
import { VscChromeClose } from "react-icons/vsc"
import { FaSearchengin } from "react-icons/fa6";

const Profile = () => {

  return (
		<div className={styl.profile} >
			<div className={styl.content}>

				{/* head */}

				<div className={styl.head}>
					<h1 >PROFILE</h1>
				</div>
				<div className={styl.first}>

					{/* search */}

					<div className={styl.search}>
						<div className={styl.ss}>
							<form >
								<input type='text' name="" placeholder='search...' className={styl.input}/>
								<button type='submit' className={styl.button}>
									<FaSearchengin className={styl.icon}/>
								</button>
							</form>
						</div>
					</div>
					<div className={styl.userData}>
						<div className={styl.user}>

							{/*userImage*/}

							<div className={styl.Image}>
								<img src={userImage}></img>
							</div>

							{/* userName */}

							<div className={styl.Name}>
								<p >NOUREDDINE</p>
								<div className={styl.onlign}>
									<div className={styl.rnd}></div>
									<p >online</p>
								</div>
							</div>
						</div>

						{/* statistic */}

						<div className={styl.statistic}>
							<div className={styl.sttcStyl}>
								<div className={styl.res}>
									<div className={styl.aspects}>
										<CiMedal />
									</div>
									<div className={styl.Name}>
										<p >WINS</p>
									</div>
									<div className={styl.aspects}>
										<p >10</p>
									</div>
								</div>
								<div className={styl.res}>
									<div className={styl.aspects}>
										<IoGameControllerOutline />
									</div>
									<div className={styl.Name}>
										<p >LOSE</p>
									</div>
									<div className={styl.aspects}>
										<p >10</p>
									</div>
								</div>
								<div className={styl.res}>
									<div className={styl.aspects}>
										<VscChromeClose />
									</div>
									<div className={styl.Name}>
										<p >GAMES</p>
									</div>
									<div className={styl.aspects}>
										<p >10</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={styl.level}>
						<div className={styl.externFrame}>
							<div className={styl.percentage} style={{width: "100%"}}></div>
						</div>
						<p >1 - 50%</p>
					</div>
				</div>
				<div className={styl.last}>
					<div className={styl.history}>
						<div className={styl.history}></div>
						<div className={styl.blockedFriend}></div>
						<div className={styl.friend}></div>
						{/* <div className={styl.cardName}>
							<p >MATCH HISTORY</p>
						</div> */}
						{/* <div className={styl.matches}>
							<div className={styl.cardMatch}>
								<div className={styl.userimg}>
									<img src={userImage}></img>
									<p >NOUREDDINE</p>
								</div>
								<div className={styl.scoreDate}>
									3 - 2
								</div>
								<div className={styl.userimg}>
									<img src={userImage}></img>
								</div>
								<div className={styl.scoreDate} style={{width:"30%", fontSize: "20px"}}>
									2024/08/08
								</div>
							</div>
							<div className={styl.cardMatch}></div>
						</div> */}
					</div>
					<div className={styl.expelledFriends}>
						<div className={styl.cardName}></div>
					</div>
					<div className={styl.friends}>
						<div className={styl.cardName}></div>
					</div>
				</div>

			</div>
		</div>
  )

}

export default Profile
