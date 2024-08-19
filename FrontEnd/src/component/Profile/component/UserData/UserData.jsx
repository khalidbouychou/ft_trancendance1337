import React from 'react'
import styl from './UserData.module.css'
import Statistics from '../Statistics/Statistics'

const User_Data = () => {
	const userName = "NOUAHIDI";
	const ratio = 40;
	const per = 90;
	let level = 5;
	const lvl = level + (per / 100);
  return (
	<div className={styl.container}>
		<h1>Profile</h1>
		<input 
			type="text" 
			placeholder="Search..."
			className={styl.searchInput}
		/>

		< Statistics />

		<div className={styl.LVL}>
			<div className={styl.levelBar} style={{ width: `${per}%`}}>
				<div className={styl.levelCreate}>
					<p>level</p> {level} - {per}%
				</div>
			</div>
		</div>
	</div>
  )
}

export default User_Data
