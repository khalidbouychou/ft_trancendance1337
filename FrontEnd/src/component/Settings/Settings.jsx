// import React, { Component } from 'react'
import { useEffect, useState } from "react";
import styles from  "./Settings.module.css";



const ToggleSwitch = () => {
	return (
	<label className={styles.toggle_switch}>
		<input type="checkbox" />
		<div className={styles.toggle_switch_background}>
		<div className={styles.toggle_switch_handle}></div>
		</div>
	</label>
	);
  };





const Settings = () => {
	

	useEffect(() => {
		document.title = "Settings"
	})


	const [backg, setBackg] = useState({
		file: null,
		urlbag: "./img/bag.png",
	});


	const handlbaground = (e) => {
		if (e.target.files[0]) {
			console.log(e.target.files[0])
			setBackg({
				file: e.target.files[0],
				urlbag: URL.createObjectURL(e.target.files[0]),
			});
		}
	};
	
	
	
	const [avatar, setAvatar] = useState({
		file: null,
		url: "./img/avatar.jpeg",
	});

	const handlavatar = (e) => {
		if (e.target.files[0]) {
		setAvatar({
		file: e.target.files[0],
		url: URL.createObjectURL(e.target.files[0]),
		});
	}
	};




	return (


	<div className={styles.Settings}>
			<h1>SETTINGS</h1>

			<div className={styles.centre}>
			<img id={styles.bag} src={backg.urlbag} alt="" />

					<div className={styles.allcon}>



						<div className={styles.set}>
							

							<div className={styles.avatar}>
							<img id={styles.avatar} src={avatar.url} alt="" />
							<label htmlFor="file">
								<img id={styles.icon} src="./icons/profil.png" alt="" />
								<input
								onChange={handlavatar}
								type="file"
								id="file"
								style={{ display: "none" }}
								/>
							</label>

								</div>


							<div className={styles.inpu}>
								<input type="text" placeholder="Username" />
								<button>Update</button>
							</div>

						</div>

							<label htmlFor="back">
								<img id={styles.iconbag} src="./icons/ca.png" alt="" />
								<input
								onChange={handlbaground}
								type="file"
								id="back"
								style={{ display: "none" }}
								/>
							</label>
					</div>
		</div>

		<div className={styles.bouttom}>
		
			<h1>Two-factor authentication is not enabled yet.</h1>

			<h3>Two-factor authentication adds an additional layer of security to your account 
				by requiring more than just a password to sign in.</h3>

			<ToggleSwitch />


		</div>
	</div>
	);
};

export default Settings;
