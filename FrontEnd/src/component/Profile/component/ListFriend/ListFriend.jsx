import styl from './ListFriend.module.css'
import Card from '../Card/Card'
import FR1Image from '../../assets/prf.svg'
import FR2Image from '../../assets/prf1.svg'
import FR3Image from '../../assets/prf2.svg'

const ListFriend = () => {

	const friendData = [
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 3,
			Name: "AZARDA",
			Image: FR3Image,
		},
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 3,
			Name: "AZARDA",
			Image: FR3Image,
		},
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 3,
			Name: "AZARDA",
			Image: FR3Image,
		},
		{
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
		{
			key: 3,
			Name: "AZARDA",
			Image: FR3Image,
		},
	];

	const friendList = friendData.map((data) => {
		return (
			<Card key={data.key} width={'50%'} id={styl.Cardd}>
				<div className={styl.Img}>
					<img src={data.Image} alt={`${data.Name}`} />
				</div>
				<div className={styl.FrName}>
					<p id={styl.friendName}>{data.Name}</p>
				</div>
			</Card>
		);
	});

	return (
		<div className={styl.listFriend}>
			<p id={styl.Text}>LIST FRIENDS</p>
			<div className={styl.ScrollBar}>
				<div className={styl.List}>
					{friendList}
				</div>
			</div>
		</div>
	)
}

export default ListFriend;