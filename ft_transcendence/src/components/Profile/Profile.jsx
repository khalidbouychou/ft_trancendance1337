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
					PROFILE
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
									<p id={styl.online}>online</p>
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
							<div className={styl.percentage} style={{width: "80%"}}></div>
						</div>
						<p >1 - 50%</p>
					</div>
				</div>

				{/* last */}

				<div className={styl.last}>
					<div className={styl.big}>
						<div className={styl.history}>
							<div className={styl.cardName}>
								MATCH HISTORY
							</div>
							<div className={styl.matches}>
								<div className={styl.cardMatch}>
									<div className={styl.player}>
										<img src={userImage}></img>
									</div>
									<div className={styl.scoreDate}></div>
									<div className={styl.player}></div>
								</div>
							</div>
						</div>
						<div className={styl.friends}>
							<div className={styl.cardName}></div>
						</div>
						<div className={styl.blocked}>
							<div className={styl.cardName}></div>
						</div>
					</div>
					<div className={styl.small}></div>
				</div>

			</div>
		</div>
  )

}
83.6626.toFixed.apply
export default Profile
