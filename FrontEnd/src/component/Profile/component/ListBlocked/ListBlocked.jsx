import styl from './ListBlocked.module.css'
import Card from '../Card/Card'
import FR1Image from '../../assets/prf.svg'
import FR2Image from '../../assets/prf1.svg'

const ListBlocked = () => {

    const friendBLData = [
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
			key: 1,
			Name: "KHBOUYCH",
			Image: FR1Image,
		},
		{
			key: 2,
			Name: "ANJAIMI",
			Image: FR2Image,
		},
	];

    const friendBLList = friendBLData.map((data) => {
		return (
			<Card key={data.key} width={'65%'}>
				<div className={styl.Img}>
					<img src={data.Image} alt={`${data.Name}`} />
				</div>
				<div className={styl.FrName}>
					<p id={styl.friendName}>{data.Name}</p>
				</div>
				<div className={styl.RdButton}>
					<button ><p style={{color: 'red'}}>unblock</p></button>
				</div>
			</Card>
		);
	});

	return (
		<div className={styl.listBlocked}>
			<p id={styl.Text}>LIST BLOCKED</p>
			<div className={styl.ScrollBar}>
				<div className={styl.List}>
					{friendBLList}
				</div>
			</div>
		</div>
	)
}

export default ListBlocked;