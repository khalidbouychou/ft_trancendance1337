import { useState } from "react"
import "./list.css"



const List = () => {

    const [freidndsList, setFreindList] = useState([
        { 
            profile_picture: "./img/azarda.png",
            full_name: "azarda",
            info: "last msg",
        },
        { 
            profile_picture: "./img/khbouych.jpeg",
            full_name: "khbouych",
            info: "last msg",
        },
        { 
            profile_picture: "./img/azarda.png",
            full_name: "azarda",
            info: "last msg",
        },
        { 
            profile_picture: "./img/nouahidi.png",
            full_name: "nouahidi",
            info: "last msg",
        },
        { 
            profile_picture: "./img/azarda.png",
            full_name: "azarda",
            info: "last msg",
        },
        { 
            profile_picture: "./img/khbouych.jpeg",
            full_name: "khbouych",
            info: "last msg",
        },

        { 
            profile_picture: "./img/azarda.png",
            full_name: "azarda",
            info: "last msg",
        },
        { 
            profile_picture: "./img/khbouych.jpeg",
            full_name: "khbouych",
            info: "last msg",
        },
        { 
            profile_picture: "./img/nouahidi.png",
            full_name: "nouahidi",
            info: "last msg",
        },
        { 
            profile_picture: "./img/khbouych.jpeg",
            full_name: "khbouych",
            info: "last msg",
        }

    ]);

    const [input , setInput] = useState("");



    const filtrList = freidndsList.filter( (c) =>
    c.full_name.toLowerCase().includes(input.toLowerCase())) 


    return(
        <div className="list">

            <div className="search">
                <img src="./icons/searchuser.png" alt="" />
                <input type="text" placeholder="Search ... " onChange={ (e) => setInput(e.target.value)} />
            </div>





            <div className="cent"></div>


            <div className="listfrind">
            {filtrList.map((friend) => 
            <div className="friends" key={friend   /*khasha id */ }  > 
                <img src={friend.profile_picture} alt="" />
                    <div className="texts">
                        <span>{friend.full_name}</span>
                        <p>{friend.info}</p>
                    </div>
            </div>)}



            </div>


        </div>
    )


}

export default List
